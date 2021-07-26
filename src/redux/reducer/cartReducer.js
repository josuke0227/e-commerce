export const cartReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_CART":
      return [...state, action.payload];

    case "RESET_CART":
      return [];

    default:
      return state;
  }
};
