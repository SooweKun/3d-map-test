import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { BuildingsView } from './buildings-view';
import { Controls } from './controll';

export type ProcessedBuilding = {
  id: string;
  width: number;
  length: number;
  centerX: number;
  centerZ: number;
};

type Resault = {
  [key: string]: ProcessedBuilding[];
};

function App() {
  const [buildings, setBuildings] = useState<ProcessedBuilding[]>([]);

  useEffect(() => {
    async function loadLocalOsm() {
      try {
        const response = await fetch('/map-massive.json');

        if (!response.ok) {
          throw new Error(`Ошибка загрузки: status ${response.status}`);
        }

        const data: Resault = await response.json();
        // const keys = Object.keys(data);
        // const chunkBuildings = Object.values(data['1_1']);
        const chunkBuildings = Object.values(data).flat();
        setBuildings(chunkBuildings);

        // const sortedkeys = keys.sort((a, b) => {
        //   const [ax, az] = a.split('_').map(Number);
        //   const [bx, bz] = b.split('_').map(Number);

        //   const distA = ax * ax + az * az;
        //   const distB = bx * bx + bz * bz;

        //   return distA - distB;
        // });

        // sortedkeys.map((key, index) => {
        //   setTimeout(() => {
        //     const chunk = data[key] || [];

        //     setBuildings((prevBuildings) => [...prevBuildings, ...chunk]);
        //   }, index * 80);
        // });
      } catch (error) {
        console.error('Ошибка:', error);
      }
    }

    loadLocalOsm();
  }, []);

  return (
    <div id='canvas-container' className='w-full h-screen relative'>
      <Canvas className='w-full h-full bg-black' camera={{ position: [0, 150, 200], fov: 60, far: 50000, near: 0.1 }}>
        <Controls />
        <ambientLight intensity={0.6} />
        <directionalLight position={[100, 300, 100]} intensity={1.2} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[50000, 50000]} />
          <meshStandardMaterial color={0xde9b38} />
        </mesh>
        <BuildingsView buildings={buildings} />
      </Canvas>
    </div>
  );
}

export default App;
