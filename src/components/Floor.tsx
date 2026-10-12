import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import { CanvasTexture, Color, RepeatWrapping, Vector4, type MeshStandardMaterial } from 'three'

import type { DoorReveal } from '../scene/entrance'
import type { DoorPlacement } from '../scene/layout'
import { FRAME_WIDTH, FRAME_THICKNESS } from './frameGeometry'

export function Floor({ placements, reveals }: { placements: DoorPlacement[]; reveals: DoorReveal[] }) {
  const spillReveals = useMemo(() => ({ value: placements.map(() => 0) }), [placements])
  useFrame(() => {
    for (let index = 0; index < reveals.length; index++) spillReveals.value[index] = reveals[index].current
  })
  // Evaluate every pool on the actual floor: no transparent decals or seams.
  const illuminateFloor = useMemo(() => (shader: Parameters<MeshStandardMaterial['onBeforeCompile']>[0]) => {
    shader.uniforms.spillReveals = spillReveals
    shader.uniforms.spillOrigins = { value: placements.map(p => new Vector4(p.position[0], p.position[2], Math.cos(p.rotationY), Math.sin(p.rotationY))) }
    shader.uniforms.spillColors = { value: placements.map(p => new Color(p.project.room.light).multiplyScalar(p.project.room.spill.opacity)) }
    shader.uniforms.spillShape = { value: placements.map(p => new Vector4(p.project.room.spill.width, p.project.room.spill.length, p.project.room.spill.falloff, 1)) }
    shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 floorWorld;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nfloorWorld = (modelMatrix * vec4(position, 1.0)).xyz;')
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `#include <common>
      varying vec3 floorWorld;
      uniform float spillReveals[6];
      uniform vec4 spillOrigins[6];
      uniform vec3 spillColors[6];
      uniform vec4 spillShape[6];
      float spillNoise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        f = f*f*(3.0-2.0*f);
        vec4 h = fract(sin(vec4(dot(i,vec2(127.1,311.7)), dot(i+vec2(1,0),vec2(127.1,311.7)), dot(i+vec2(0,1),vec2(127.1,311.7)), dot(i+vec2(1,1),vec2(127.1,311.7))))*43758.5453);
        return mix(mix(h.x,h.y,f.x),mix(h.z,h.w,f.x),f.y);
      }
    `).replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
      float grain = mix(0.68,1.0,spillNoise(floorWorld.xz*vec2(24.0,55.0)));
      float variation = mix(0.72,1.0,spillNoise(floorWorld.xz*vec2(2.8,8.0)));
      for (int i=0; i<6; i++) {
        vec2 offset = floorWorld.xz - spillOrigins[i].xy;
        float across = dot(offset, vec2(spillOrigins[i].z, -spillOrigins[i].w));
        float forward = dot(offset, spillOrigins[i].wz);
        float distanceOut = max(forward,0.0);
        float spread = 0.72 + distanceOut * 0.16 * spillShape[i].x;
        float lateral = exp(-pow(abs(across)/spread, 3.0));
        float reach = exp(-distanceOut * spillShape[i].z * 0.62);
        float endFade = 1.0-smoothstep(spillShape[i].y*0.65,spillShape[i].y,distanceOut);
        float behind = smoothstep(-0.35,0.02,forward);
        float contact = exp(-distanceOut*8.0) * exp(-pow(abs(across)/0.8,8.0));
        totalEmissiveRadiance += spillColors[i] * (lateral*reach*endFade*0.8 + contact*1.0) * behind * grain * variation * spillReveals[i];

      }
    `).replace('#include <opaque_fragment>', `
      // Local occlusion around the two actual post footprints. Apply after
      // lighting so the doorway spill cannot shine through the metal's base.
      float contactVisibility = 1.0;
      for (int i=0; i<6; i++) {
        vec2 offset = floorWorld.xz - spillOrigins[i].xy;
        float across = dot(offset, vec2(spillOrigins[i].z, -spillOrigins[i].w));
        float forward = dot(offset, spillOrigins[i].wz);
        vec2 foot = vec2(abs(across) - ${(FRAME_WIDTH - FRAME_THICKNESS) / 2}, forward);
        vec2 outsideFoot = max(abs(foot) - vec2(${FRAME_THICKNESS / 2}, 0.19), 0.0);
        float separation = length(outsideFoot);
        float tight = exp(-separation * separation / 0.0012);
        float soft = exp(-separation * separation / 0.012);
        float occlusion = (tight * 0.72 + soft * 0.22) * spillShape[i].w;
        contactVisibility *= 1.0 - occlusion;
      }
      outgoingLight *= contactVisibility;
      #include <opaque_fragment>
    `)
  }, [placements, spillReveals])

  const grain = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 256
    const context = canvas.getContext('2d')!
    const pixels = context.createImageData(256, 256)
    let seed = 37
    for (let i = 0; i < pixels.data.length; i += 4) {
      seed = (seed * 1664525 + 1013904223) >>> 0
      const value = 110 + (seed % 55)
      pixels.data.set([value, value, value, 255], i)
    }
    context.putImageData(pixels, 0, 0)
    const texture = new CanvasTexture(canvas)
    texture.wrapS = texture.wrapT = RepeatWrapping
    texture.repeat.set(28, 28)
    return texture
  }, [])
  useEffect(() => () => grain.dispose(), [grain])

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, -6]}>
        <planeGeometry args={[70, 80]} />
        <meshStandardMaterial key={placements[0].position[0]} color="#151619" roughness={0.7} metalness={0.15} bumpMap={grain} bumpScale={0.018} onBeforeCompile={illuminateFloor} />
      </mesh>
    </group>
  )
}
