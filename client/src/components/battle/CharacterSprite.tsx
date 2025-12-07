import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface CharacterSpriteProps {
  position: [number, number, number];
  color: string;
  name: string;
  hp: number;
  maxHp: number;
  isActive: boolean;
  isAlive: boolean;
  isEnemy?: boolean;
  onClick?: () => void;
}

export function CharacterSprite({
  position,
  color,
  name,
  hp,
  maxHp,
  isActive,
  isAlive,
  isEnemy = false,
  onClick
}: CharacterSpriteProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    if (isActive && isAlive) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    } else {
      meshRef.current.position.y = position[1];
    }
    
    if (glowRef.current && isActive) {
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 4) * 0.1);
    }
  });
  
  const hpPercent = hp / maxHp;
  const hpColor = hpPercent > 0.5 ? '#22c55e' : hpPercent > 0.25 ? '#eab308' : '#ef4444';
  
  if (!isAlive) {
    return (
      <group position={position} onClick={onClick}>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, -0.3, 0]}>
          <boxGeometry args={[0.8, 1.2, 0.4]} />
          <meshStandardMaterial color={color} opacity={0.4} transparent />
        </mesh>
        <Text
          position={[0, 1.2, 0]}
          fontSize={0.25}
          color="#666666"
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.2}
          color="#ff4444"
          anchorX="center"
          anchorY="middle"
        >
          KO
        </Text>
      </group>
    );
  }
  
  return (
    <group position={position} onClick={onClick}>
      {isActive && (
        <mesh ref={glowRef} position={[0, 0, -0.1]}>
          <planeGeometry args={[1.8, 2.2]} />
          <meshBasicMaterial color="#ffffff" opacity={0.2} transparent />
        </mesh>
      )}
      
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[0.8, 1.2, 0.4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      <mesh position={[0, 0.8, 0.25]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {name}
      </Text>
      
      <group position={[0, 1.2, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[1, 0.12]} />
          <meshBasicMaterial color="#333333" />
        </mesh>
        <mesh position={[(hpPercent - 1) * 0.5, 0, 0.01]}>
          <planeGeometry args={[hpPercent, 0.1]} />
          <meshBasicMaterial color={hpColor} />
        </mesh>
      </group>
      
      {isActive && (
        <mesh position={[isEnemy ? 1.2 : -1.2, 0.5, 0]}>
          <coneGeometry args={[0.15, 0.3, 3]} />
          <meshBasicMaterial color="#ffff00" />
        </mesh>
      )}
    </group>
  );
}
