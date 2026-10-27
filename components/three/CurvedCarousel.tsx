"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { sized, type Designer } from "@/lib/data";

const RADIUS = 7;
const PLANE_W = 3;
const PLANE_H = 4.1;

type Ctrl = { target: number; current: number; velocity: number };

const vertex = /* glsl */ `
uniform float uRadius;
varying vec2 vUv;
void main(){
  vUv = uv;
  vec3 p = position;
  // Bend the plane onto the cylinder so the wall reads as one continuous curve
  float a = p.x / uRadius;
  p.z += uRadius * (1.0 - cos(a));
  p.x = uRadius * sin(a);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const fragment = /* glsl */ `
uniform sampler2D uTex;
uniform vec2 uCover;
uniform float uFocus;
varying vec2 vUv;
void main(){
  vec2 uv = (vUv - 0.5) * uCover + 0.5;
  vec3 c = texture2D(uTex, uv).rgb;
  float lum = dot(c, vec3(0.299, 0.587, 0.114));
  vec3 warm = vec3(lum) * vec3(1.04, 0.98, 0.9);
  c = mix(warm * 0.75, c, uFocus);
  gl_FragColor = vec4(c, 1.0);
}
`;

function Panel({ url, index, count, ctrl }: { url: string; index: number; count: number; ctrl: React.RefObject<Ctrl> }) {
  const tex = useTexture(url);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const angle = (index / count) * Math.PI * 2;

  const uniforms = useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    const img = tex.image as HTMLImageElement;
    const ia = img.width / img.height;
    const pa = PLANE_W / PLANE_H;
    return {
      uTex: { value: tex },
      uRadius: { value: RADIUS },
      uFocus: { value: 0 },
      uCover: { value: new THREE.Vector2(pa < ia ? pa / ia : 1, pa < ia ? 1 : ia / pa) },
    };
  }, [tex]);

  useFrame(() => {
    if (!mat.current || !ctrl.current) return;
    // Distance of this panel from the front, in radians
    const rel = Math.atan2(Math.sin(angle + ctrl.current.current), Math.cos(angle + ctrl.current.current));
    const focus = 1 - Math.min(Math.abs(rel) / (Math.PI / 4), 1);
    mat.current.uniforms.uFocus.value += (focus - mat.current.uniforms.uFocus.value) * 0.1;
  });

  return (
    <group rotation={[0, angle, 0]}>
      <mesh position={[0, 0, -RADIUS]}>
        <planeGeometry args={[PLANE_W, PLANE_H, 24, 1]} />
        <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Ring({ designers, ctrl, onActive }: { designers: Designer[]; ctrl: React.RefObject<Ctrl>; onActive: (i: number) => void }) {
  const group = useRef<THREE.Group>(null);
  const last = useRef(-1);
  const urls = useMemo(() => designers.map((d) => sized(d.image, 900)), [designers]);

  useFrame((_, dt) => {
    const c = ctrl.current;
    if (!c || !group.current) return;
    c.target += c.velocity;
    c.velocity *= 0.92;
    c.current += (c.target - c.current) * Math.min(dt * 5, 1);
    group.current.rotation.y = c.current;
    const step = (Math.PI * 2) / designers.length;
    const i = ((Math.round(-c.current / step) % designers.length) + designers.length) % designers.length;
    if (i !== last.current) {
      last.current = i;
      onActive(i);
    }
  });

  return (
    <group ref={group}>
      {urls.map((u, i) => (
        <Panel key={u + i} url={u} index={i} count={designers.length} ctrl={ctrl} />
      ))}
    </group>
  );
}

export type CarouselApi = { go: (dir: 1 | -1) => void; to: (i: number) => void };

/**
 * Concave cylinder of designer images viewed from inside. Rotates with drag,
 * page scroll (via `scrollProgress`) and keyboard buttons (in the parent).
 */
export default function CurvedCarousel({
  designers,
  onActive,
  apiRef,
  scrollRef,
}: {
  designers: Designer[];
  onActive: (i: number) => void;
  apiRef: React.RefObject<CarouselApi | null>;
  scrollRef: React.RefObject<number>;
}) {
  const ctrl = useRef<Ctrl>({ target: 0, current: 0, velocity: 0 });
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const step = (Math.PI * 2) / designers.length;
  const lastScroll = useRef(0);

  useEffect(() => {
    apiRef.current = {
      go: (dir) => {
        ctrl.current.target = Math.round(ctrl.current.target / step) * step - dir * step;
      },
      to: (i) => {
        const cur = Math.round(-ctrl.current.target / step);
        const k = ((cur % designers.length) + designers.length) % designers.length;
        let diff = i - k;
        if (diff > designers.length / 2) diff -= designers.length;
        if (diff < -designers.length / 2) diff += designers.length;
        ctrl.current.target -= diff * step;
      },
    };
  }, [apiRef, step, designers.length]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let dragging = false;
    let lastX = 0;
    let snapTimer: ReturnType<typeof setTimeout>;
    const snap = () => {
      ctrl.current.target = Math.round(ctrl.current.target / step) * step;
    };
    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      ctrl.current.velocity = dx * 0.0016;
      ctrl.current.target += dx * 0.004;
    };
    const up = () => {
      dragging = false;
      clearTimeout(snapTimer);
      snapTimer = setTimeout(snap, 380);
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);

    // Page scroll nudges the ring
    let raf = 0;
    const tick = () => {
      const s = scrollRef.current ?? 0;
      const delta = s - lastScroll.current;
      lastScroll.current = s;
      if (Math.abs(delta) > 0.0001 && !dragging) {
        ctrl.current.target -= delta * Math.PI * 1.2;
        clearTimeout(snapTimer);
        snapTimer = setTimeout(snap, 260);
      }
      raf = requestAnimationFrame(tick);
    };
    lastScroll.current = scrollRef.current ?? 0;
    raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      cancelAnimationFrame(raf);
      clearTimeout(snapTimer);
      io.disconnect();
    };
  }, [step, scrollRef]);

  return (
    <div ref={wrap} className="absolute inset-0 touch-pan-y select-none" data-cursor="Drag">
      <Canvas
        dpr={[1, 1.75]}
        frameloop={visible ? "always" : "never"}
        camera={{ position: [0, 0, 2], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Ring designers={designers} ctrl={ctrl} onActive={onActive} />
      </Canvas>
    </div>
  );
}
