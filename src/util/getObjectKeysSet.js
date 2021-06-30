import { isEqual } from "./isEqual";

export const getObjectKeysSet = (arr) => {
  let result;
  for (let i = 0; i < arr.length; i++) {
    const keys = Object.keys(arr[i]).sort();
    if (!result) result = keys;
    if (isEqual(result, keys)) continue;
    else throw new Error();
  }

  return result;
};
