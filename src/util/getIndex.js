import { isEqual } from "./isEqual";

export const getIndex = (arr, obj) => {
  let index;
  arr.forEach((item, i) => {
    if (isEqual(item, obj)) index = i;
  });

  return index >= 0 ? index : -1;
};
