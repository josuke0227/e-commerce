export const userReducer = (state = null, action) => {
  switch (action.type) {
    case "SIGN_IN_SUCCESS":
      return action.payload;

    case "SIGN_OUT_SUCCESS":
      return null;

    default:
      return state;
  }
};
