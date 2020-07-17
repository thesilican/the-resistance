import { MersenneTwister } from "./MersenneTwister";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const random = new MersenneTwister();

export const Util = {
  generateUniqueID: (() => {
    // Regen id every hour
    // const modulo = 1000 * 60 * 60;
    // const reset = 0;
    // let lastDate = 0;
    // let inc = reset;
    // return () => {
    //   const date = Math.floor(new Date().getTime() / modulo);
    //   if (lastDate !== date) {
    //     lastDate = date;
    //     inc = reset;
    //   }
    //   return Util.encodeAlphabet(date) + Util.encodeAlphabet(inc++);
    // };

    // Simple
    let i = 0;
    return () => {
      return i++ + "";
    };
  })(),
  encodeAlphabet: (num: number): string => {
    const radix = ALPHABET.length;
    let ret = "";
    while (num > 0) {
      num--;
      ret += ALPHABET[num % radix];
      num = (num - (num % radix)) / radix;
    }
    return ret;
  },
  deepCopy: function <T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  },
  shuffle: function <T>(a: T[]) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Util.randInt(i);
      const temp = a[i];
      a[i] = a[j];
      a[j] = temp;
    }
  },
  joinGrammatically(arr: string[]) {
    arr = Util.deepCopy(arr);
    if (arr.length === 1) {
      return arr[0];
    }
    const last = arr.pop();
    return arr.join(", ") + " and " + last;
  },
  plural(n: number, obj: string, plural?: string) {
    if (n === 1) {
      return n + " " + obj;
    }
    if (plural) {
      return n + " " + plural;
    }
    return n + " " + obj + "s";
  },
  randInt(min: number, max?: number) {
    if (!max) {
      max = min;
      min = 0;
    }
    return min + Math.floor(random.random() * (max - min));
  },
};
