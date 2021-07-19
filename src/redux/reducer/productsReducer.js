export const productsReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return action.payload;

    case "RESET_PRODUCTS":
      return [];

    default:
      return state;
  }
};
