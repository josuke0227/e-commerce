import { getVariationsQty } from "./getVariationsQty";

export const validateVariationsQty = (variations, currentQty) => {
  const totalVariationsQty = getVariationsQty(variations);
  let int;

  if (typeof currentQty === "string") int = parseInt(currentQty);
  else int = currentQty;

  if (totalVariationsQty !== int)
    return "Total quantity and variations total quantity not matching.";

  return "";
};
