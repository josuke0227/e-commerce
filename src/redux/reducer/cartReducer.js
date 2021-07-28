export const cartReducer = (state = [], action) => {
  const currentCart = [...state];
  switch (action.type) {
    case "SET_CART":
      return [...state, action.payload];

    case "UPDATE_CART":
      const { payload, index } = action;
      currentCart[index] = payload;
      return currentCart;

    case "DELETE_CART_ITEM":
      if (state.length === 1) return [];
      const newCart = currentCart.filter((p) => p._id !== action.payload._id);
      return newCart;

    case "RESET_CART":
      return [];

    default:
      return state;
  }
};
