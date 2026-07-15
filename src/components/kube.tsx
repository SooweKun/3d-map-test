/* eslint-disable @typescript-eslint/no-explicit-any */
import { animated, useSpring } from '@react-spring/three';
import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import * as THREE from 'three';
import { Controls } from '../controll';

export const Kube = () => {
  const [state, setState] = useState(false);

  const { position }: any = useSpring({
    position: state ? [5, 0.1, 0] : [0, 0.1, 0],
    config: { mass: 1, tension: 170, friction: 26 },
  });

  const handleClick = () => {
    setState((prev) => !prev);
  };
  return (
    <div id='canvas-container' className='w-full h-screen relative'>
      <Canvas className='w-full h-full bg-black' camera={{ position: [0, 0, 5], fov: 75 }}>
        <Controls />
        <ambientLight intensity={0.3} color='#FFF7C6' position={[5, 5, 5]} />
        <pointLight position={[10, 10, 10]} />
        <directionalLight position={[5, 5, 5]} intensity={1} color='#ffffff' />
        <animated.mesh position={position}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color='blue' />
        </animated.mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial side={THREE.DoubleSide} color='white' />
        </mesh>
      </Canvas>
      <button className='absolute top-5 left-5 px-[20px] h-[30px] bg-[#3A3A3A] text-white rounded-[5px] cursor-pointer' onClick={handleClick}>
        transform
      </button>
    </div>
  );
};
