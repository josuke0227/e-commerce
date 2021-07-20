export const queryReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_QUERY":
      const newQuery = [...state];

      const index = getIndexOfExistingQueryName(newQuery, action.payload.name);
      console.log(index);
      if (index >= 0) {
        newQuery[index] = action.payload.name;
        newQuery[index + 1] = action.payload.data;
        return newQuery;
      }

      for (let key in action.payload) {
        const value = action.payload[key];
        newQuery.push(value);
      }
      return newQuery;

    case "RESET_QUERY":
      return [];

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
