const Util = {
  genEllipseEqualSpaced(
    x: number,
    y: number,
    rX: number,
    rY: number,
    num: number
  ) {
    const SAMPLE_SIZE = 100;
    const factor = (2 * Math.PI) / SAMPLE_SIZE;
    // const rot = (Math.PI * 3) / 2;
    const rot = Math.PI;
    // const rot = Math.PI / 4;
    // let points: [number, number][] = [[0, -rY]];
    let points: [number, number][] = [[-rX, 0]];
    // let points: [number, number][] = [[rX * Math.SQRT1_2, rY * Math.SQRT1_2]];
    let distances: number[] = [];
    let totalDist = 0;
    let ang: number, dist: number;
    for (let i = 1; i < SAMPLE_SIZE; i++) {
      ang = factor * i + rot;
      points.push([Math.cos(ang) * rX, Math.sin(ang) * rY]);
      dist = Math.hypot(
        points[i][0] - points[i - 1][0],
        points[i][0] - points[i - 1][0]
      );
      distances.push(dist);
      totalDist += dist;
    }

    // const spritePos: [number, number][] = [[x, y - rY]];
    const spritePos: [number, number][] = [[x - rX, y]];
    // let spritePos: [number, number][] = [
    //   [x + rX * Math.SQRT1_2, y + rY * Math.SQRT1_2],
    // ];
    const targetDist = totalDist / num;
    let p = 0;
    dist = 0;
    for (let i = 1; i < num; i++) {
      while (dist < targetDist) {
        dist += distances[p];
        p += 1;
      }
      spritePos.push([points[p][0] + x, points[p][1] + y]);
      dist -= targetDist;
    }
    return spritePos;
  },
  rgbToHex(r: number, g: number, b: number) {
    return (
      "#" +
      Math.round(Math.max(0, Math.min(255, r)))
        .toString(16)
        .padStart(2, "0") +
      Math.round(Math.max(0, Math.min(255, g)))
        .toString(16)
        .padStart(2, "0") +
      Math.round(Math.max(0, Math.min(255, b)))
        .toString(16)
        .padStart(2, "0")
    );
  },
  normalizeRGB(
    norm: number,
    r: number,
    g: number,
    b: number
  ): [number, number, number] {
    let factor = norm / (r + g + b);
    r *= factor;
    g *= factor;
    b *= factor;
    return [r, g, b];
  },
  hslToRgb(h: number, s: number, l: number): [number, number, number] {
    var r, g, b;

    if (s == 0) {
      r = g = b = l; // achromatic
    } else {
      function hue2rgb(p: number, q: number, t: number) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
  },
  deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  },
};

export default Util;
