"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const vertex = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
uniform float uHeight;
attribute float aSeed;
attribute float aSize;
varying float vAlpha;

void main(){
  vec3 p = position;
  float speed = 0.06 + aSeed * 0.12;
  // drift upward and wrap
  p.y = mod(p.y + uTime * speed + uHeight * 0.5, uHeight) - uHeight * 0.5;
  p.x += sin(uTime * 0.3 + aSeed * 12.0) * 0.18;
  p.z += cos(uTime * 0.25 + aSeed * 9.0) * 0.12;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * uPixelRatio * (6.0 / -mv.z);
  float edge = 1.0 - smoothstep(0.3, 0.5, abs(p.y / uHeight));
  vAlpha = edge * (0.35 + 0.65 * abs(sin(uTime * 0.8 + aSeed * 20.0)));
}
`;

const fragment = /* glsl */ `
uniform vec3 uColor;
varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  a *= a;
  gl_FragColor = vec4(uColor, a * vAlpha * 0.9);
}
`;

/** Instanced-style gold dust (single draw call Points), additive blending, drifting upward. */
export default function GoldParticles({ count = 240 }: { count?: number }) {
  const { viewport, gl } = useThree();
  const mat = useRef<THREE.ShaderMaterial>(null);
  const height = viewport.height * 1.4;

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    const size = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * viewport.width * 1.3;
      pos[i * 3 + 1] = (Math.random() - 0.5) * height;
      pos[i * 3 + 2] = Math.random() * 1.8 - 0.4;
      seed[i] = Math.random();
      size[i] = 1.5 + Math.random() * 4.5;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    return g;
  }, [count, viewport.width, height]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 1.75) },
      uHeight: { value: height },
      uColor: { value: new THREE.Color("#c9a96e") },
    }),
    [gl, height],
  );

  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += Math.min(dt, 0.05);
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
