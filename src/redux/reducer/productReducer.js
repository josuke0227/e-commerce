export const productReducer = (state = null, action) => {
  switch (action.type) {
    case "SELECT_PRODUCT":
      return action.payload;

    case "DESELECT_PRODUCT":
      return null;

    default:
      return state;
  }
};
