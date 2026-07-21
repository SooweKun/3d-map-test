export type Objects = {
  id: string;
  angle: [lon: number, lat: number][];
};

export function parseOSMXmlString(xmlContent: string): Objects[] {
  const nodes = new Map<string, [number, number]>();

  const nodeRegex = /<node\s+([^>]+)>/g;
  let match;

  while ((match = nodeRegex.exec(xmlContent)) !== null) {
    const attrs = match[1];
    const idMatch = attrs.match(/id="(\d+)"/);
    const latMatch = attrs.match(/lat="([\d.-]+)"/);
    const lonMatch = attrs.match(/lon="([\d.-]+)"/);

    if (idMatch && latMatch && lonMatch) {
      nodes.set(idMatch[1], [parseFloat(lonMatch[1]), parseFloat(latMatch[1])]);
    }
  }

  const objects: Objects[] = [];
  const wayRegex = /<way\s+([^>]+)>([\s\S]*?)<\/way>/g;

  while ((match = wayRegex.exec(xmlContent)) !== null) {
    const attrs = match[1];
    const body = match[2];

    const idMatch = attrs.match(/id="(\d+)"/);

    if (idMatch && body.includes('k="highway"')) {
      const angle: [number, number][] = [];
      const ndRegex = /<nd\s+ref="(\d+)"/g;
      let ndMatch;

      while ((ndMatch = ndRegex.exec(body)) !== null) {
        const nodeId = ndMatch[1];
        const coords = nodes.get(nodeId);
        if (coords) {
          angle.push(coords);
        }
      }

      if (angle.length > 0) {
        objects.push({
          id: `way/${idMatch[1]}`,
          angle,
        });
      }
    }
  }

  return objects;
}
