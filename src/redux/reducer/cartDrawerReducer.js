export const cartDrawerReducer = (state = false, action) => {
  switch (action.type) {
    case "SET_SHOW_DRAWER":
      return action.payload;

    default:
      return state;
  }
};
