/* eslint-disable react-hooks/purity */
// MergedBuildings.tsx
import { useMemo } from 'react';
import * as THREE from 'three';
// Импортируем утилиту для слияния геометрий
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

interface MergedBuildingsProps {
  buildings: { id: string; angle: [lon: number, lat: number][] }[];
}

const cLat = 51.7666;
const cLon = 55.1004;
const latRad = (cLat * Math.PI) / 180;
const mLat = 111132;
const mLon = (40075000 * Math.cos(latRad)) / 360;

export function MergedBuildings({ buildings }: MergedBuildingsProps) {
  const mergedGeometry = useMemo(() => {
    if (buildings.length === 0) return null;

    const geometries: THREE.BufferGeometry[] = [];

    // Проходим по каждому зданию в памяти, не создавая React-компоненты
    for (const building of buildings) {
      const angle = building.angle;
      if (angle.length < 3) continue;

      const s = new THREE.Shape();
      const startX = (angle[0][0] - cLon) * mLon;
      const startY = (angle[0][1] - cLat) * mLat;
      s.moveTo(startX, startY);

      for (let i = 1; i < angle.length; i++) {
        const x = (angle[i][0] - cLon) * mLon;
        const y = (angle[i][1] - cLat) * mLat;
        s.lineTo(x, y);
      }
      s.lineTo(startX, startY);

      const height = Math.random() * 12 + 4;

      // Генерируем временную геометрию
      const geom = new THREE.ExtrudeGeometry(s, {
        depth: height,
        bevelEnabled: false,
      });

      // Поворачиваем её в памяти, чтобы положить на землю
      geom.rotateX(-Math.PI / 2);

      geometries.push(geom);
    }

    if (geometries.length === 0) return null;

    console.log('Сливаем геометрии...');
    // Магия: объединяем сотни тысяч мелких геометрий в ОДНУ большую
    const merged = mergeGeometries(geometries);
    console.log('Слияние завершено!');

    // Обязательно освобождаем память временных геометрий, чтобы не было утечек
    geometries.forEach((g) => g.dispose());

    return merged;
  }, [buildings]);

  if (!mergedGeometry) return null;

  return (
    // Рендерим всего ОДИН mesh вместо 500 000!
    <mesh geometry={mergedGeometry}>
      <meshStandardMaterial color={0xfff7c6} roughness={0.7} />
    </mesh>
  );
}
