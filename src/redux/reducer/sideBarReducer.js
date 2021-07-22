export const sideBarReducer = (state = "", action) => {
  switch (action.type) {
    case "SET_STATE":
      return action.payload;

    case "RESET_STATE":
      return "";

    default:
      return state;
  }
};
