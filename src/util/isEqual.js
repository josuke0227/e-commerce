export const isEqual = (baseObj, comparingObj) => {
  return JSON.stringify(baseObj) === JSON.stringify(comparingObj);
};
