"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { snoise } from "./glsl";
import GoldParticles from "./GoldParticles";

const vertex = /* glsl */ `
uniform float uTime;
uniform float uScroll;
uniform vec2 uMouse;
varying vec3 vNormal;
varying vec3 vViewPos;
varying float vFold;
varying vec2 vUv;
${snoise}

float silk(vec2 p){
  float t = uTime * 0.12;
  // Long, slow folds + finer ripples, with a gentle billow toward the cursor.
  float h = snoise(vec3(p.x * 0.35, p.y * 0.55 - t, t * 0.6)) * 0.55;
  h += snoise(vec3(p.x * 0.9 + t, p.y * 1.1, t)) * 0.18;
  h += sin(p.x * 1.4 + p.y * 0.6 + uTime * 0.35) * 0.12;
  float d = distance(p, uMouse * vec2(3.2, 1.8));
  h += smoothstep(2.2, 0.0, d) * 0.28;
  h += uScroll * sin(p.y * 1.2 + uTime * 0.5) * 0.35;
  return h;
}

void main(){
  vUv = uv;
  vec3 pos = position;
  float e = 0.04;
  float h  = silk(pos.xy);
  float hx = silk(pos.xy + vec2(e, 0.0));
  float hy = silk(pos.xy + vec2(0.0, e));
  pos.z += h;
  vec3 n = normalize(vec3(-(hx - h) / e, -(hy - h) / e, 1.0));
  vNormal = normalize(normalMatrix * n);
  vFold = h;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vViewPos = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

const fragment = /* glsl */ `
uniform vec3 uIvory;
uniform vec3 uPearl;
uniform vec3 uBlush;
uniform vec3 uGold;
varying vec3 vNormal;
varying vec3 vViewPos;
varying float vFold;
varying vec2 vUv;

void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPos);
  vec3 L = normalize(vec3(-0.4, 0.7, 0.9));
  vec3 H = normalize(L + V);

  float diff = clamp(dot(N, L) * 0.5 + 0.5, 0.0, 1.0);
  // Satin: broad soft sheen plus a tight highlight
  float sheen = pow(clamp(dot(N, H), 0.0, 1.0), 18.0);
  float spec  = pow(clamp(dot(N, H), 0.0, 1.0), 90.0);
  float fres  = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.5);

  vec3 base = mix(uPearl, uIvory, smoothstep(-0.4, 0.5, vFold));
  base = mix(base, uBlush, smoothstep(0.55, 1.0, vUv.x) * 0.35 * (1.0 - diff));
  vec3 col = base * (0.78 + 0.28 * diff);
  col += vec3(1.0, 0.98, 0.94) * sheen * 0.22;
  col += uGold * spec * 0.25;
  col += uPearl * fres * 0.15;
  gl_FragColor = vec4(col, 1.0);
}
`;

function Silk({ scrollRef, mouseRef }: { scrollRef: React.RefObject<number>; mouseRef: React.RefObject<THREE.Vector2> }) {
  const { viewport } = useThree();
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uIvory: { value: new THREE.Color("#fbf8f2") },
      uPearl: { value: new THREE.Color("#e6ddcf") },
      uBlush: { value: new THREE.Color("#e8d5cf") },
      uGold: { value: new THREE.Color("#c9a96e") },
    }),
    [],
  );

  useFrame((_, dt) => {
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value += Math.min(dt, 0.05);
    u.uScroll.value += ((scrollRef.current ?? 0) - u.uScroll.value) * 0.06;
    u.uMouse.value.lerp(mouseRef.current!, 0.04);
  });

  return (
    <mesh rotation={[-0.55, 0, 0.12]} position={[0, -0.2, 0]} scale={[viewport.width * 0.32, viewport.height * 0.5, 1]}>
      <planeGeometry args={[6, 6, 160, 160]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} />
    </mesh>
  );
}

/**
 * Full-screen flowing silk + rising gold dust. Pauses rendering when the hero
 * is off screen. Loaded via next/dynamic with ssr:false.
 */
export default function SilkHero({ onReady }: { onReady?: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const mouseRef = useRef(new THREE.Vector2());
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouseRef.current.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    const onScroll = () => {
      scrollRef.current = Math.min(window.scrollY / window.innerHeight, 1.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0 });
    if (wrap.current) io.observe(wrap.current);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        dpr={[1, 1.75]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor("#f7f3ec");
          onReady?.();
        }}
      >
        <Silk scrollRef={scrollRef} mouseRef={mouseRef} />
        <GoldParticles count={260} />
      </Canvas>
    </div>
  );
}
