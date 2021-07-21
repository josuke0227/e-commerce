export const queryReducer = (state = [], action) => {
  const currentQuery = [...state];
  let index;

  switch (action.type) {
    case "SET_QUERY":
      index = getIndexOfExistingQueryName(currentQuery, action.payload.name);
      if (index >= 0) {
        currentQuery[index] = action.payload.name;
        currentQuery[index + 1] = action.payload.data;
        return currentQuery;
      }

      for (let key in action.payload) {
        const value = action.payload[key];
        currentQuery.push(value);
      }
      return currentQuery;

    case "RESET_QUERY":
      console.log(`currentQuery before`, currentQuery);
      const { name } = action.payload;
      index = getIndexOfExistingQueryName(currentQuery, name);
      currentQuery.splice(index, 2);
      return currentQuery;

    default:
      return state;
  }
};

function getIndexOfExistingQueryName(arr, comparingName) {
  let index;
  arr.forEach((q, i) => {
    if (i % 2 === 0) {
      if (comparingName === q) index = i;
    }
  });
  return index >= 0 ? index : -1;
}
