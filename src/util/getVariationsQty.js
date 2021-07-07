export const getVariationsQty = (arr) => {
  if (!arr.length) return 0;

  let count = 0;
  arr.forEach((v) => (count += parseInt(v.qty)));
  return count;
};
