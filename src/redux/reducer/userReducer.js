export const userReducer = (state = null, action) => {
  switch (action.type) {
    case "SIGN_IN_SUCCESS":
      return { currentUser: action.payload };

    case "SIGN_OUT_SUCCESS":
      return { currentUser: action.payload };

    default:
      return state;
  }
};
