import { extend, useThree, type ThreeElement } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

declare module '@react-three/fiber' {
  interface ThreeElements {
    orbitControls: ThreeElement<typeof OrbitControls>;
  }
}

extend({ OrbitControls });

export const Controls = () => {
  const { camera, gl } = useThree();

  return <orbitControls args={[camera, gl.domElement]} />;
};
