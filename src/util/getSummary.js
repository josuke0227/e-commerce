/**
 * input: [
    {
      color: {
        index: 0,
        name: "red",
      },
      size: {
        index: 1,
        name: "s",
      },
      qty: "1",
    },
    ...
  ]
  * output: JSX
 */

export function getSummary(variations) {
  const trimmedColor = getObjectSet(getColumn(variations, "color"));
  const trimmedSize = getObjectSet(getColumn(variations, "size"));

  trimmedSize.sort((a, b) => a.index - b.index);

  const mappedQty = [];

  for (let i = 0; i < trimmedColor.length; i++) {
    const color = trimmedColor[i].name;
    mappedQty[i] = [];
    for (let j = 0; j < variations.length; j++) {
      const instance = variations[j];
      if (instance.color.name === color) mappedQty[i].push(instance.qty);
    }
  }

  for (let i = 0; i < mappedQty.length; i++) {
    const fixedQty = [];
    if (mappedQty[i].length < trimmedSize.length) {
      const color = trimmedColor[i].name;
      const cluster = variations.filter((i) => i.color.name === color);

      for (let i = 0; i < cluster.length; i++) {
        const currentSize = cluster[i].size.name;
        fixedQty[indexOfArrayObj(trimmedSize, { name: currentSize })] =
          cluster[i].qty;
      }
      mappedQty[i] = fixedQty;
    }
  }

  return {
    color: trimmedColor,
    size: trimmedSize,
    qty: mappedQty,
  };
}

function indexOfArrayObj(arr, targetObj) {
  const key = Object.keys(targetObj)[0];
  for (let i = 0; i < arr.length; i++) {
    const current = arr[i];
    if (current[key] === targetObj[key]) return i;
  }
}

function getColumn(arr, key) {
  return arr.map((item) => item[key]);
}

function getObjectSet(arr) {
  let index = getDuplicatedItemIdx(arr);
  while (true) {
    if (index !== -1) {
      arr.splice(index, 1);
      index = getDuplicatedItemIdx(arr);
    } else {
      return arr;
    }
  }
}

function getDuplicatedItemIdx(arr) {
  const map = {};
  for (let i = 0; i < arr.length; i++) {
    if (map[arr[i].name]) return i;
    map[arr[i].name] = true;
  }
  return -1;
}
