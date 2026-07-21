type Objects = {
  id: string;
  angle: [lon: number, lat: number][];
};

type Resault = {
  [T: string]: {
    id: string;
    width: number;
    length: number;
    centerX: number;
    centerZ: number;
  }[];
};

export const ObjectSize = (massive: Objects[]): Resault => {
  const cLat = 51.7666;
  const cLon = 55.1004;
  const size = 500;
  const latRad = (cLat * Math.PI) / 180;
  const mLat = 111132;
  const mLon = (40075000 * Math.cos(latRad)) / 360;
  const resault: Resault = {};

  massive.map((item) => {
    const xCords = item.angle.map(([lon]) => (lon - cLon) * mLon);
    const zCords = item.angle.map(([, lat]) => -(lat - cLat) * mLat);

    const minX = Math.min(...xCords);
    const maxX = Math.max(...xCords);
    const minZ = Math.min(...zCords);
    const maxZ = Math.max(...zCords);

    const width = maxX - minX;
    const length = maxZ - minZ;

    const centerX = (minX + maxX) / 2;
    const centerZ = (minZ + maxZ) / 2;

    const cellX = Math.floor(centerX / size);
    const cellZ = Math.floor(centerZ / size);
    const cellKey = `${cellX}_${cellZ}`;

    if (!resault[cellKey]) {
      resault[cellKey] = [];
    }

    resault[cellKey].push({
      id: item.id,
      width,
      length,
      centerX,
      centerZ,
    });
  });

  return resault;
};
