export const cartReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_CART":
      return [...state, action.payload];

    case "UPDATE_CART":
      const { payload, index } = action;
      const currentCart = [...state];
      currentCart[index] = payload;
      return currentCart;

    case "DELETE_CART_ITEM":
      if (state.length === 1) return [];
      return [...state, state.splice(action.index, 1)];

    case "RESET_CART":
      return [];

    default:
      return state;
  }
};
