/* eslint-disable @typescript-eslint/no-explicit-any */
import { animated, useSpring } from '@react-spring/three';
import { Canvas, useLoader } from '@react-three/fiber';
import { useState } from 'react';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import { Controls } from './controll';

function App() {
  const [state, setState] = useState(false);
  const texture = useLoader(TextureLoader, '/public/texttr.png');

  const { position }: any = useSpring({
    position: state ? [5, 0.1, 0] : [0, 0.1, 0],
    config: { mass: 1, tension: 170, friction: 26 },
  });

  const handleClick = () => {
    setState((prev) => !prev);
  };

  return (
    <div id='canvas-container' className='w-full h-screen'>
      <Canvas className='w-full h-full bg-black' camera={{ position: [0, 0, 5], fov: 75 }}>
        <Controls />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <animated.mesh position={position}>
          <boxGeometry args={[2, 2, 2]} />
          <meshStandardMaterial color='blue' />
        </animated.mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial side={THREE.DoubleSide} map={texture} />
        </mesh>
      </Canvas>
      <button onClick={handleClick}>transform</button>
    </div>
  );
}

export default App;
