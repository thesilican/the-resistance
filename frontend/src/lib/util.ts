import { Color } from "common-modules";

export type Vec2 = [number, number];

// Generate equally spaced spots around an ellipse
export function equalSpaceEllipse(
  numSprites: number,
  screenDim: Vec2,
  spriteDim: Vec2
) {
  // width = 1, height = ratio
  const screenRatio = screenDim[1] / screenDim[0];

  const SAMPLE_POINTS = 100;
  const ellipseDistances: Vec2[] = [];
  const ellipsePoints: Vec2[] = [];
  // Make a bunch of points on an ellipse
  for (let i = 0; i < SAMPLE_POINTS; i++) {
    // Start at 180 deg
    const ang = (i / SAMPLE_POINTS) * 2 * Math.PI + Math.PI;
    const x = Math.cos(ang);
    const y = Math.sin(ang) * screenRatio;
    ellipsePoints.push([x, y]);
    if (i !== 0) {
      const prev = ellipsePoints[i - 1];
      ellipseDistances.push([Math.abs(prev[0] - x), Math.abs(prev[1] - y)]);
    }
  }
  const totalDist = ellipseDistances.reduce((a, v) => a + Math.hypot(...v), 0);

  // Find sprite positions positions
  let spritePoints: Vec2[] = [ellipsePoints[0]];
  const threshold = totalDist / numSprites;
  let remaining = numSprites - 1;
  let dist = 0;
  for (let i = 1; i < SAMPLE_POINTS - 1; i++) {
    if (remaining === 0) break;
    dist += Math.hypot(...ellipseDistances[i - 1]);
    if (dist > threshold) {
      spritePoints.push(ellipsePoints[i]);
      dist -= threshold;
      remaining--;
    }
  }

  // Find space between every pair of sprites
  const spriteRatio = spriteDim[1] / spriteDim[0];
  let maxSpriteW = Infinity;
  for (let i = 0; i < numSprites; i++) {
    for (let j = 0; j < i; j++) {
      const sprite1 = spritePoints[i];
      const sprite2 = spritePoints[j];
      const distX = Math.abs(sprite2[0] - sprite1[0]);
      const distY = Math.abs(sprite2[1] - sprite1[1]);
      if (distX > distY / spriteRatio) {
        maxSpriteW = Math.min(maxSpriteW, distX);
      } else {
        maxSpriteW = Math.min(maxSpriteW, distY / spriteRatio);
      }
    }
  }

  const maxSpriteH = maxSpriteW * spriteRatio;

  // Find a ratio to scale everything by
  let scaleRatio: number;
  const unscaledWidth = 2 + maxSpriteW;
  const unscaledHeight = 2 * screenRatio + maxSpriteH;
  if (unscaledWidth / screenDim[0] > unscaledHeight / screenDim[1]) {
    scaleRatio = screenDim[0] / unscaledWidth;
  } else {
    scaleRatio = screenDim[1] / unscaledHeight;
  }

  // Scale points based on dimensions
  spritePoints = spritePoints.map(
    (p) =>
      [
        p[0] * scaleRatio + screenDim[0] / 2,
        p[1] * scaleRatio + screenDim[1] / 2,
      ] as Vec2
  );
  const newSpriteDim: Vec2 = [maxSpriteW * scaleRatio, maxSpriteH * scaleRatio];

  return { spritePoints, spriteDim: newSpriteDim, scaleRatio };
}

// const res = equalSpaceEllipse(5, [2, 2], [1, 1]);
// console.log(res.totalDist);

export const ColorValues: { [c in Color]: string } = {
  red: "#ea3818",
  orange: "#e58a00",
  yellow: "#dbbd0d",
  green: "#5ec90c",
  teal: "#00e07f",
  cyan: "#17dbdb",
  blue: "#70aaff",
  indigo: "#a899ff",
  purple: "#c45cff",
  pink: "#e617a0",
};
