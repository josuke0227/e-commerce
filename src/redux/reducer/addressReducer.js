const INITIAL_STATE = { entity: [], current: "", selected: "" };
export const addressReducer = (state = INITIAL_STATE, action) => {
  const current = { ...state };
  switch (action.type) {
    case "SET_SELECTED_ADDRESS":
      current.selected = action.payload;
      return current;

    case "SET_ADDRESSES":
      current.entity = action.payload;
      return current;

    case "SET_ADDRESS":
      current.current = action.payload;
      return current;

    case "RESET_SELECTED_ADDRESS":
      current.selected = "";
      return current;

    case "RESET_ADDRESSES":
      current.entity = [];
      return current;

    case "RESET_ADDRESS":
      current.current = "";
      return current;

    default:
      return state;
  }
};
