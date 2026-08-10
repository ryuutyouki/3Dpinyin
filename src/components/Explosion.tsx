import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '../store/gameStore';

const Explosion: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const petalsRef = useRef<THREE.Group>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const startAt = useRef<number>(Date.now());
  const { gl } = useThree();
  
  const effectLevel = useGameStore(s => s.effectLevel);
  const particleCount = effectLevel === 'fullscreen' ? 250 : 100;
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      const speed = 3 + Math.random() * (effectLevel === 'fullscreen' ? 6 : 3);
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.sin(phi) * Math.sin(theta);
      const z = Math.cos(phi);
      const color = effectLevel === 'fullscreen' 
        ? new THREE.Color().setHSL(Math.random(), 1, 0.6)
        : new THREE.Color().setHSL(Math.random(), 0.8, 0.6);
      temp.push({
        position: new THREE.Vector3(0, 0, 0),
        velocity: new THREE.Vector3(x, y, z).multiplyScalar(speed),
        color,
        scale: Math.random() * 0.3 + 0.1,
      });
    }
    return temp;
  }, [effectLevel, particleCount]);

  const petals = useMemo(() => {
    if (effectLevel === 'normal') return [];
    const temp = [];
    const count = effectLevel === 'fullscreen' ? 40 : 20;
    for (let i = 0; i < count; i++) {
      temp.push({
        startY: 4 + Math.random() * 4,
        offsetX: (Math.random() - 0.5) * 6,
        offsetZ: (Math.random() - 0.5) * 6,
        rotation: Math.random() * Math.PI,
        speed: 1 + Math.random() * 2,
        color: ['#FFB6C1', '#FFC0CB', '#FF69B4', '#FFA07A', '#FFD700'][Math.floor(Math.random() * 5)]
      });
    }
    return temp;
  }, [effectLevel]);

  useFrame((_, delta) => {
    const elapsed = (Date.now() - startAt.current) / 1000;

    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const p = particles[i];
        if (!p) return;
        child.position.add(p.velocity.clone().multiplyScalar(delta));
        p.velocity.y -= 0.5 * delta; // gravity
        const scale = Math.max(child.scale.x * 0.97, 0.01);
        child.scale.set(scale, scale, scale);
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        mat.opacity = Math.max(1 - elapsed / 1.5, 0);
      });
    }

    if (petalsRef.current && petals.length) {
      petalsRef.current.children.forEach((child, i) => {
        const pt = petals[i];
        if (!pt) return;
        child.position.x = pt.offsetX + Math.sin(elapsed * pt.speed + i) * 0.5;
        child.position.y = pt.startY - elapsed * pt.speed;
        child.position.z = pt.offsetZ + Math.cos(elapsed * pt.speed * 0.7 + i) * 0.3;
        child.rotation.x = elapsed * 2;
        child.rotation.z = pt.rotation + elapsed;
      });
    }

    if (haloRef.current) {
      const haloScale = 1 + elapsed * 6;
      haloRef.current.scale.set(haloScale, haloScale, haloScale);
      const mat = haloRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0.6 - elapsed / 1.2, 0);
    }

    // Fullscreen flash
    if (effectLevel === 'fullscreen' && elapsed < 0.3) {
      const alpha = 0.6 - (elapsed / 0.3) * 0.6;
      gl.domElement.style.boxShadow = `inset 0 0 200px 100px rgba(255, 255, 200, ${alpha})`;
    } else {
      gl.domElement.style.boxShadow = '';
    }
  });

  useEffect(() => {
    // Reset on mount
    startAt.current = Date.now();
    return () => {
      gl.domElement.style.boxShadow = '';
    };
  }, [gl]);

  return (
    <group>
      <group ref={groupRef}>
        {particles.map((p, i) => (
          <mesh key={i} position={p.position} scale={p.scale}>
            {i % 2 === 0 ? (
              <sphereGeometry args={[1, 8, 8]} />
            ) : (
              <octahedronGeometry args={[1, 0]} />
            )}
            <meshBasicMaterial color={p.color} transparent opacity={0.8} />
          </mesh>
        ))}
      </group>

      {effectLevel !== 'normal' && (
        <group ref={petalsRef}>
          {petals.map((pt, i) => (
            <mesh key={i} position={[pt.offsetX, pt.startY, pt.offsetZ]}>
              <circleGeometry args={[0.3, 6]} />
              <meshStandardMaterial color={pt.color} transparent opacity={0.9} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      )}

      {effectLevel !== 'normal' && (
        <mesh ref={haloRef} scale={1}>
          <torusGeometry args={[1.5, 0.1, 8, 64]} />
          <meshBasicMaterial transparent opacity={0.6} color={effectLevel === 'fullscreen' ? '#FFD700' : '#FF00FF'} />
        </mesh>
      )}
    </group>
  );
};

export default Explosion;
