export type Vertex3D = [number, number, number];
export type Edge = [number, number];

const GOLDEN_RATIO = (1.0 + Math.sqrt(5.0)) / 2.0;

export const createIcosahedronVertices = (size: number): Vertex3D[] => {
  const t = GOLDEN_RATIO;
  const s = size;

  return [
    [0, s, t * s],
    [0, s, -t * s],
    [0, -s, t * s],
    [0, -s, -t * s],
    [s, t * s, 0],
    [s, -t * s, 0],
    [-s, t * s, 0],
    [-s, -t * s, 0],
    [t * s, 0, s],
    [t * s, 0, -s],
    [-t * s, 0, s],
    [-t * s, 0, -s],
  ];
};

export const createHeartVertices = (size: number): Vertex3D[] => {
  const vertices: Vertex3D[] = [];
  const layers = 10;
  const pointsPerLayer = 16;

  for (let layer = 0; layer < layers; layer++) {
    const v = layer / (layers - 1);
    const widthScale = Math.pow(1 - v * 0.6, 1.2);
    const topIndent = v < 0.25 ? Math.sin((v * Math.PI) / 0.25) * 0.25 : 0;
    const y = size * (1 - v * 2) - topIndent * size * 0.2;

    for (let i = 0; i < pointsPerLayer; i++) {
      const angle = (i / pointsPerLayer) * Math.PI * 2;

      let x: number;
      let z: number;

      if (v < 0.35) {
        const heartX = 16 * Math.pow(Math.sin(angle), 3);
        const heartY = -(
          13 * Math.cos(angle) -
          5 * Math.cos(2 * angle) -
          2 * Math.cos(3 * angle) -
          Math.cos(4 * angle)
        );
        const scale = 0.7 + v * 0.3;
        x = (heartX / 16) * size * widthScale * scale;
        z = (heartY / 13) * size * widthScale * 0.85 * scale;
      } else if (v < 0.7) {
        const transition = (v - 0.35) / 0.35;
        const heartX = 16 * Math.pow(Math.sin(angle), 3);
        const heartY = -(
          13 * Math.cos(angle) -
          5 * Math.cos(2 * angle) -
          2 * Math.cos(3 * angle) -
          Math.cos(4 * angle)
        );
        const circleX = Math.cos(angle);
        const circleZ = Math.sin(angle);

        x = ((heartX / 16) * (1 - transition) + circleX * transition) * size * widthScale;
        z = ((heartY / 13) * (1 - transition) + circleZ * transition) * size * widthScale * 0.8;
      } else {
        const lowerProgress = (v - 0.7) / 0.3;
        const radius = widthScale * size * (1 - lowerProgress * 0.9);
        x = Math.cos(angle) * radius;
        z = Math.sin(angle) * radius * 0.7;
      }

      vertices.push([x, y, z]);
    }
  }

  vertices.push([0, -size * 1.6, 0]);

  return vertices;
};

export const ICOSAHEDRON_EDGES: Edge[] = [
  [0, 8],
  [0, 10],
  [0, 4],
  [0, 6],
  [1, 9],
  [1, 11],
  [1, 4],
  [1, 6],
  [2, 8],
  [2, 10],
  [2, 5],
  [2, 7],
  [3, 9],
  [3, 11],
  [3, 5],
  [3, 7],
  [4, 8],
  [4, 9],
  [5, 8],
  [5, 9],
  [6, 10],
  [6, 11],
  [7, 10],
  [7, 11],
  [4, 6],
  [5, 7],
  [8, 10],
  [9, 11],
];

export const createHeartEdges = (layers: number, pointsPerLayer: number): Edge[] => {
  const edges: Edge[] = [];
  const totalPoints = layers * pointsPerLayer;

  for (let layer = 0; layer < layers; layer++) {
    const startIdx = layer * pointsPerLayer;
    for (let i = 0; i < pointsPerLayer; i++) {
      const current = startIdx + i;
      const next = startIdx + ((i + 1) % pointsPerLayer);
      edges.push([current, next]);
    }
  }

  for (let layer = 0; layer < layers - 1; layer++) {
    const currentStart = layer * pointsPerLayer;
    const nextStart = (layer + 1) * pointsPerLayer;

    for (let i = 0; i < pointsPerLayer; i++) {
      const current = currentStart + i;
      const next = nextStart + i;
      edges.push([current, next]);

      const nextDiag = nextStart + ((i + 1) % pointsPerLayer);
      edges.push([current, nextDiag]);
    }
  }

  const bottomLayerStart = (layers - 1) * pointsPerLayer;
  for (let i = 0; i < pointsPerLayer; i++) {
    edges.push([bottomLayerStart + i, totalPoints]);
  }

  return edges;
};

export const calculateIcosahedronViewBoxSize = (size: number): number => {
  const maxCoord = Math.max(size, size * GOLDEN_RATIO);
  return maxCoord * 2.5;
};

export const calculateHeartViewBoxSize = (size: number): number => {
  return size * 3.5;
};

const rotateX = (vertex: Vertex3D, angle: number): Vertex3D => {
  const [x, y, z] = vertex;
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return [x, y * cos - z * sin, y * sin + z * cos];
};

const rotateY = (vertex: Vertex3D, angle: number): Vertex3D => {
  const [x, y, z] = vertex;
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return [x * cos + z * sin, y, -x * sin + z * cos];
};

const rotateZ = (vertex: Vertex3D, angle: number): Vertex3D => {
  const [x, y, z] = vertex;
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return [x * cos - y * sin, x * sin + y * cos, z];
};

export const rotateVertex3D = (
  vertex: Vertex3D,
  angles: { rotateX: number; rotateY: number; rotateZ: number },
): Vertex3D => {
  let rotated = vertex;
  rotated = rotateZ(rotated, angles.rotateZ);
  rotated = rotateY(rotated, angles.rotateY);
  rotated = rotateX(rotated, angles.rotateX);
  return rotated;
};

export const project3DTo2D = (
  vertex: Vertex3D,
  centerOffset: number,
  perspectiveFactor = 0.3,
): { x: number; y: number } => {
  const [x, y, z] = vertex;
  return {
    x: x + centerOffset,
    y: y + z * perspectiveFactor + centerOffset,
  };
};


