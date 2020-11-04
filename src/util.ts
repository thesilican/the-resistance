import { AnyAction } from "@reduxjs/toolkit";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const generateUniqueID = (() => {
  const modulo = 1000 * 60 * 60;
  const reset = 27;
  let lastDate = 0;
  let inc = reset;
  return () => {
    const date = Math.floor(new Date().getTime() / modulo);
    if (lastDate !== date) {
      lastDate = date;
      inc = reset;
    }
    return encodeAlphabet(date) + encodeAlphabet(inc++);
  };
})();

function encodeAlphabet(num: number): string {
  const radix = ALPHABET.length;
  let ret = "";
  while (num > 0) {
    num--;
    ret += ALPHABET[num % radix];
    num = (num - (num % radix)) / radix;
  }
  return ret;
}

export function actionFromServer(action: AnyAction) {
  return {
    ...action,
    meta: {
      ...action?.meta,
      server: true,
    },
  };
}
