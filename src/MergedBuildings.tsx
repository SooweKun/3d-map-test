import { Instance, Instances } from '@react-three/drei';
import type { ProcessedBuilding } from './App';

interface MergedBuildingsProps {
  buildings: ProcessedBuilding[];
}

export const MergedBuildings = ({ buildings }: MergedBuildingsProps) => {
  return (
    <Instances limit={buildings.length || 1000} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color='#8a9ba8' roughness={0.6} metalness={0.1} />

      {buildings.map((building, i) => {
        const height = 12 + (i % 6) * 4;

        return (
          <Instance
            key={building.id || i}
            position={[building.centerX, height / 2, building.centerZ]}
            scale={[building.width, height, building.length]}
          />
        );
      })}
    </Instances>
  );
};
