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
  deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  },
};

export default Util;
