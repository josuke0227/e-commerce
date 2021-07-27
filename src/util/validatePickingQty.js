export const validatePickingQty = (sampleValue, variations) => {
  const result = { isValid: false, validQty: 0 };
  let correspondingProps;

  variations.forEach((v) => {
    correspondingProps = [];
    const keys = Object.keys(sampleValue);
    keys.forEach((k) => {
      if (k !== "qty" && sampleValue[k] === v[k].name)
        correspondingProps.push(k);
    });
    if (correspondingProps.length === keys.length - 1) {
      result.isValid = v.qty >= sampleValue.qty;
      result.validQty = v.qty;
    }
  });

  return result;
};
