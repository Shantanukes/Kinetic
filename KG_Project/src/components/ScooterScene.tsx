import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { Stars, Sparkles } from '@react-three/drei';
import scooterImg from '../assets/Kinetic Flex.png';
import sphereLogo from '../assets/image-1768885682144.jpeg';

// Constants
const PATH_RADIUS = 4.2; // Slightly larger path to ensure it clears the logo well
const SCOOTER_SPEED = 0.6; // Rads per second - slightly slower for majesty
const SCOOTER_SCALE = 2.0; // Larger scooter for visibility

const CenterSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const texture = useLoader(TextureLoader, sphereLogo);

  useFrame((state, delta) => {
    // Slowly rotate the central sphere
    meshRef.current.rotation.y += delta * 0.1;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1.8, 64, 64]} /> {/* Slightly larger sphere */}
      <meshStandardMaterial 
        map={texture} 
        metalness={0.6} 
        roughness={0.2} 
        emissive="#10b981" 
        emissiveIntensity={0.2} 
      />
    </mesh>
  );
};

const DrivingScooter = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useLoader(TextureLoader, scooterImg);
  
  // Create a material that handles transparency
  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, [texture]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const theta = t * SCOOTER_SPEED;

    // Parametric Circle Equation (Ground Plane XZ)
    // Moving counter-clockwise
    const x = PATH_RADIUS * Math.cos(theta);
    const z = PATH_RADIUS * Math.sin(theta);

    // Update Position
    groupRef.current.position.set(x, 0, z);

    // Calculate Tangent (Derivative)
    // dx/dt = -r * sin(theta)
    // dz/dt = r * cos(theta)
    const dx = -PATH_RADIUS * Math.sin(theta);
    const dz = PATH_RADIUS * Math.cos(theta);

    // Calculate Yaw (Rotation around Y axis)
    // atan2(dx, dz) gives angle from North (Z).
    // We add Math.PI / 2 because the plane geometry faces +Z or we want side profile.
    // Assuming the image is a side view of the scooter facing right.
    groupRef.current.rotation.y = Math.atan2(dx, dz) + Math.PI / 2;

    // Add subtle banking or "driving" vibration
    groupRef.current.rotation.z = Math.sin(t * 12) * 0.05; // Banking/Vibration
    groupRef.current.position.y = 0.5 + Math.sin(t * 8) * 0.05; // Hover/Suspension bounce
  });

  return (
    <group ref={groupRef}>
      {/* Scooter Mesh (Billboard Plane) */}
      <mesh material={material}>
        {/* Adjust aspect ratio based on image, assuming roughly 3:2 */}
        <planeGeometry args={[1.5 * SCOOTER_SCALE, 1.0 * SCOOTER_SCALE]} />
      </mesh>
    </group>
  );
};

const CircularPath = () => {
  return (
    <group>
        {/* Glowing Path Ring */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
            <ringGeometry args={[PATH_RADIUS - 0.05, PATH_RADIUS + 0.05, 128]} />
            <meshBasicMaterial color="#4ade80" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
        {/* Faint Road Surface */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
            <ringGeometry args={[PATH_RADIUS - 0.5, PATH_RADIUS + 0.5, 128]} />
            <meshBasicMaterial color="#10b981" transparent opacity={0.1} side={THREE.DoubleSide} />
        </mesh>
    </group>
  );
};

const ScooterScene = () => {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <Canvas camera={{ position: [0, 5, 12], fov: 45 }}>
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={2.5} color="#ffffff" />
          <spotLight position={[0, 15, 0]} intensity={1.5} angle={0.6} penumbra={1} />
          <pointLight position={[-10, 5, -5]} intensity={1} color="#10b981" />
          
          {/* Scene Objects */}
          <group position={[0, -0.5, 0]}>
            <CenterSphere />
            <CircularPath />
            <DrivingScooter />
          </group>

          {/* Environment Effects */}
          <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
          <Sparkles count={80} scale={10} size={3} speed={0.4} opacity={0.6} color="#4ade80" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ScooterScene;
