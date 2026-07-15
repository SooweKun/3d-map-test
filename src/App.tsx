// import { Canvas } from '@react-three/fiber';
// import { useEffect, useState } from 'react';
// import * as THREE from 'three';
// import { Controls } from './controll';
// import { MergedBuildings } from './MergedBuildings';
// import { parseOSMXmlString } from './parser'; // Импортируем ваш локальный парсер
// import { ObjectSize } from './test-massive'; // Импортируем вашу функцию расчета размеров

// interface VisualBuilding {
//   id: string;
//   width: number;
//   length: number;
//   height: number;
//   centerX: number;
//   centerZ: number;
// }

// function App() {
//   const [buildings, setBuildings] = useState<VisualBuilding[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     async function loadLocalOsm() {
//       try {
//         console.log('1. Пробуем загрузить файл /map.osm...');
//         const response = await fetch('/map.osm');

//         if (!response.ok) {
//           console.error(
//             `Ошибка загрузки файла! Код: ${response.status}. Проверьте, лежит ли файл прямо в папке public/ и называется ли он ровно map.osm`,
//           );
//           return;
//         }

//         const xmlContent = await response.text();
//         console.log(`2. Файл успешно загружен. Длина текста: ${xmlContent.length} символов.`);

//         // Пытаемся найти координаты границ (bounds) в самом файле, чтобы узнать, где центр карты
//         const boundsMatch = xmlContent.match(/<bounds\s+([^>]+)>/);
//         if (boundsMatch) {
//           const attrs = boundsMatch[1];
//           const minlat = parseFloat(attrs.match(/minlat="([\d.-]+)"/)?.[1] || '0');
//           const minlon = parseFloat(attrs.match(/minlon="([\d.-]+)"/)?.[1] || '0');
//           const maxlat = parseFloat(attrs.match(/maxlat="([\d.-]+)"/)?.[1] || '0');
//           const maxlon = parseFloat(attrs.match(/maxlon="([\d.-]+)"/)?.[1] || '0');
//           console.log(`👉 Координаты вашей карты из файла: Center Lat = ${(minlat + maxlat) / 2}, Center Lon = ${(minlon + maxlon) / 2}`);
//         }

//         const rawObjects = parseOSMXmlString(xmlContent);
//         console.log(`3. Парсер закончил работу. Найдено объектов: ${rawObjects.length}`);
//         if (rawObjects.length > 0) {
//           console.log('Пример первого сырого объекта:', rawObjects[0]);
//         } else {
//           console.warn(
//             '⚠️ Парсер не нашел объектов с тегом building! Возможно, в вашем файле нет строения с тегом k="building" или XML использует другие кавычки.',
//           );
//         }

//         const sizedObjects = ObjectSize(rawObjects);
//         console.log(`4. Функция ObjectSize рассчитала размеры. Количество: ${sizedObjects.length}`);
//         if (sizedObjects.length > 0) {
//           console.log('Координаты первого здания в 3D сцене (X, Z):', sizedObjects[0].centerX, sizedObjects[0].centerZ);
//         }

//         const mappedBuildings = sizedObjects.map((b) => ({
//           ...b,
//           height: 50, // фиксированная высота для теста
//         }));

//         setBuildings(mappedBuildings);
//       } catch (error) {
//         console.error('Ошибка в процессе загрузки/парсинга:', error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadLocalOsm();
//   }, []);

//   return (
//     <div id='canvas-container' className='w-full h-screen relative'>
//       {!loading && buildings.length > 0 && (
//         <div className='absolute top-4 left-4 z-10 bg-slate-800/80 backdrop-blur text-white py-2 px-3 rounded-lg text-xs font-mono border border-slate-700 pointer-events-none'>
//           Загружено зданий: {buildings.length}
//         </div>
//       )}

//       <Canvas className='w-full h-full bg-black' camera={{ position: [0, 50, 100], fov: 60, far: 50000, near: 0.1 }}>
//         <Controls />
//         <ambientLight intensity={0.6} />
//         <directionalLight position={[50, 100, 50]} intensity={1.2} />
//         <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
//           <planeGeometry args={[100000, 100000]} />
//           <meshStandardMaterial color={0x4b5a78} side={THREE.DoubleSide} />
//         </mesh>
//         {buildings.map((building) => (
//           <MergedBuildings buildings={buildings} />
//         ))}
//       </Canvas>
//     </div>
//   );
// }

// export default App;

import { Canvas } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { Controls } from './controll';
import { MergedBuildings } from './MergedBuildings';
import { parseOSMXmlString, type Objects } from './parser';

function App() {
  // 2. Меняем тип состояния на Objects[] (у которого есть свойство 'angle')
  const [buildings, setBuildings] = useState<Objects[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadLocalOsm() {
      try {
        setLoading(true);
        const response = await fetch('/map.osm');

        if (!response.ok) {
          throw new Error(`Ошибка загрузки: status ${response.status}`);
        }

        const xmlContent = await response.text();

        // 3. Получаем оригинальные объекты с гео-координатами 'angle'
        const rawObjects = parseOSMXmlString(xmlContent);

        // Для плавных тестов можно ограничить количество, например, до 15 000
        const slicedObjects = rawObjects;

        // 4. Записываем их напрямую, без вызова ObjectSize!
        setBuildings(slicedObjects);
      } catch (error) {
        console.error('Ошибка:', error);
      } finally {
        setLoading(false);
      }
    }

    loadLocalOsm();
  }, []);

  return (
    <div id='canvas-container' className='w-full h-screen relative'>
      {loading && (
        <div className='absolute inset-0 flex items-center justify-center bg-black/50 text-white text-lg font-semibold z-10'>
          Построение карты...
        </div>
      )}

      <Canvas className='w-full h-full bg-black' camera={{ position: [0, 150, 200], fov: 60, far: 50000 }}>
        <Controls />
        <ambientLight intensity={0.6} />
        <directionalLight position={[100, 200, 100]} intensity={1.2} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
          <planeGeometry args={[18000, 18000]} />
          <meshStandardMaterial color={0x4b5a78} />
        </mesh>

        {/* Теперь типы сходятся идеально */}
        <MergedBuildings buildings={buildings} />
      </Canvas>
    </div>
  );
}

export default App;
