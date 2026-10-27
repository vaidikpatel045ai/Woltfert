"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";

const vertex = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragment = /* glsl */ `
uniform sampler2D uTex;
uniform float uTime;
uniform float uHover;
uniform vec2 uMouse;
uniform vec2 uCover;   // scale for object-fit: cover
varying vec2 vUv;

void main(){
  vec2 uv = (vUv - 0.5) * uCover + 0.5;
  float d = distance(vUv, uMouse);
  // Liquid ripple radiating from the cursor
  float ripple = sin(d * 28.0 - uTime * 4.0) * exp(-d * 4.5);
  vec2 dir = normalize(vUv - uMouse + 1e-4);
  vec2 offset = dir * ripple * 0.022 * uHover;
  offset += vec2(sin(vUv.y * 9.0 + uTime * 1.6), cos(vUv.x * 7.0 + uTime * 1.3)) * 0.006 * uHover;
  // Zoom in slightly on hover
  uv = (uv - 0.5) * (1.0 - 0.06 * uHover) + 0.5;
  float r = texture2D(uTex, uv + offset * 1.25).r;
  float g = texture2D(uTex, uv + offset).g;
  float b = texture2D(uTex, uv + offset * 0.8).b;
  gl_FragColor = vec4(r, g, b, 1.0);
}
`;

type State = { hover: number; mouse: THREE.Vector2 };

function Plane({ src, state }: { src: string; state: React.RefObject<State> }) {
  const tex = useTexture(src);
  const { size } = useThree();
  const mat = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    return {
      uTex: { value: tex },
      uTime: { value: 0 },
      uHover: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uCover: { value: new THREE.Vector2(1, 1) },
    };
  }, [tex]);

  useEffect(() => {
    const img = tex.image as HTMLImageElement;
    const ia = img.width / img.height;
    const pa = size.width / size.height;
    uniforms.uCover.value.set(pa < ia ? pa / ia : 1, pa < ia ? 1 : ia / pa);
  }, [size, tex, uniforms]);

  useFrame((_, dt) => {
    const u = mat.current?.uniforms;
    if (!u || !state.current) return;
    u.uTime.value += dt;
    u.uHover.value = state.current.hover;
    u.uMouse.value.lerp(state.current.mouse, 0.12);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} toneMapped={false} />
    </mesh>
  );
}

/**
 * Overlay canvas with a ripple/RGB-split shader, mounted on first hover by
 * the parent tile. frameloop is "demand" at rest and "always" only while the
 * effect is animating.
 */
export default function DistortImage({ src, hostRef }: { src: string; hostRef: React.RefObject<HTMLElement | null> }) {
  const state = useRef<State>({ hover: 0, mouse: new THREE.Vector2(0.5, 0.5) });
  const [active, setActive] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const s = state.current;
    const enter = () => {
      setActive(true);
      gsap.to(s, { hover: 1, duration: 0.9, ease: "power3.out", overwrite: true });
    };
    const leave = () =>
      gsap.to(s, { hover: 0, duration: 1.1, ease: "power3.out", overwrite: true, onComplete: () => setActive(false) });
    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      s.mouse.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
    };
    host.addEventListener("pointerenter", enter);
    host.addEventListener("pointerleave", leave);
    host.addEventListener("pointermove", move);
    host.addEventListener("focusin", enter);
    host.addEventListener("focusout", leave);
    if (host.matches(":hover")) enter();
    return () => {
      host.removeEventListener("pointerenter", enter);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("focusin", enter);
      host.removeEventListener("focusout", leave);
    };
  }, [hostRef]);

  return (
    <div className="pointer-events-none absolute inset-0 transition-opacity duration-500" style={{ opacity: ready ? 1 : 0 }} aria-hidden="true">
      <Canvas
        dpr={[1, 1.75]}
        frameloop={active ? "always" : "demand"}
        gl={{ antialias: false, alpha: false }}
        onCreated={() => requestAnimationFrame(() => setReady(true))}
      >
        <Plane src={src} state={state} />
      </Canvas>
    </div>
  );
}
