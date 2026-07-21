/* eslint-disable react-hooks/rules-of-hooks */
import { Line } from '@react-three/drei';
import { useEffect, useState } from 'react';
import type { Objects } from './parser';
import { parseOSMXmlString } from './parser';

const cLat = 51.7666;
const cLon = 55.1004;
const latRad = (cLat * Math.PI) / 180;
const mLat = 111132;
const mLon = (40075000 * Math.cos(latRad)) / 360;

export const Road = () => {
  const [roads, setRoads] = useState<Objects[]>([]);

  useEffect(() => {
    async function useRoad() {
      try {
        const response = await fetch('/map.osm');

        if (!response.ok) {
          throw new Error(`Ошибка загрузки: status ${response.status}`);
        }

        const xmlContent = await response.text();
        const rawObjects = parseOSMXmlString(xmlContent);

        setRoads(rawObjects);
      } catch (err) {
        console.error('Ошибка при загрузке или парсинге дорог:', err);
      }
    }

    useRoad();
  }, []);

  return (
    <group>
      {roads.map((road) => {
        if (road.angle.length < 2) return null;

        const points = road.angle.map(([lon, lat]) => {
          const x = (lon - cLon) * mLon;
          const z = -(lat - cLat) * mLat;

          return [x, 0.1, z] as [number, number, number];
        });

        return <Line key={road.id} points={points} color='#444444' lineWidth={1.5} toneMapped={false} />;
      })}
    </group>
  );
};
