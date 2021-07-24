export const pageReducer = (state = 1, action) => {
  switch (action.type) {
    case "SET_PAGE":
      return action.payload;

    case "RESET_PAGE":
      return 1;

    default:
      return state;
  }
};
