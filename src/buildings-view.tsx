import { Html, Instance, Instances } from '@react-three/drei';
import * as React from 'react';
import { useState } from 'react';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '../src/components/ui/drawer';
import type { ProcessedBuilding } from './App';

type MergedBuildingsProps = {
  buildings: ProcessedBuilding[];
};

export const BuildingsView = ({ buildings }: MergedBuildingsProps) => {
  const [open, setOpen] = React.useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<ProcessedBuilding | null>(null);

  const handleDoubleClick = (building: ProcessedBuilding) => {
    setSelectedBuilding(building);
    setOpen(true);
  };

  return (
    <>
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
              onDoubleClick={() => handleDoubleClick(building)}
            />
          );
        })}
      </Instances>
      <Html>
        <Drawer open={open} onOpenChange={setOpen} swipeDirection='right'>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Information</DrawerTitle>
              <DrawerDescription>
                {selectedBuilding ? (
                  <div>
                    <p>ID: {selectedBuilding.id}</p>
                    <p>Width: {selectedBuilding.width}</p>
                    <p>Length: {selectedBuilding.length}</p>
                    <p>Center X: {selectedBuilding.centerX}</p>
                    <p>Center Z: {selectedBuilding.centerZ}</p>
                  </div>
                ) : (
                  <p>No building selected</p>
                )}
              </DrawerDescription>
            </DrawerHeader>
            <div className='flex-1 scroll-fade overflow-y-auto p-4'></div>
            <DrawerFooter></DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Html>
    </>
  );
};
