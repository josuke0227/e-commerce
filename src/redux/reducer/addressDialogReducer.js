const INITIAL_STATE = { open: false, slide: false };
export const addressDialogReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "OPEN_DIALOG":
      return { ...INITIAL_STATE, open: true };

    case "CLOSE_DIALOG":
      return INITIAL_STATE;

    case "SLIDE":
      return { ...state, slide: true };

    case "SLIDE_BACK":
      return { ...state, slide: false };

    default:
      return state;
  }
};
