/**
 * input: [
    { color: "Red", qty: "1", size: "S" },
    { color: "Red", qty: "2", size: "M" },
    { color: "Red", qty: "3", size: "L" },
    { color: "Blue", qty: "1", size: "S" },
    { color: "Blue", qty: "2", size: "M" },
    { color: "Blue", qty: "3", size: "L" },
    ...
  ];
 * output: [
    {
      color: [ red, blue, green, yellow ]
    }, 
    {
      size: [ S, M, L ]
    }, 
    {
      qty: [
        [ 1, 2, 3 ],
        [ 1, 2, 3 ], 
        [ 1, 2, 3 ], 
        [ 1, 2 ]
      ]
    }
  ]  
 */
export function getSummary(variations) {
  const color = variations.map((i) => i.color);
  const size = variations.map((i) => i.size);

  const trimmedColor = [...new Set(color)];
  const trimmedSize = [...new Set(size)];

  const mappedQty = [];

  for (let i = 0; i < trimmedColor.length; i++) {
    const color = trimmedColor[i];
    mappedQty[i] = [];
    for (let j = 0; j < variations.length; j++) {
      const instance = variations[j];
      if (instance.color === color) mappedQty[i].push(instance.qty);
    }
  }

  for (let i = 0; i < mappedQty.length; i++) {
    const fixedQty = [];
    if (mappedQty[i].length < trimmedSize.length) {
      const color = trimmedColor[i];
      const cruster = variations.filter((i) => i.color === color);

      for (let i = 0; i < cruster.length; i++) {
        const currentSize = cruster[i].size;
        fixedQty[trimmedSize.indexOf(currentSize)] = cruster[i].qty;
      }
      console.log(fixedQty);
      mappedQty[i] = fixedQty;
    }
  }

  return {
    color: [...new Set(color)],
    size: [...new Set(size)],
    qty: mappedQty,
  };
}
