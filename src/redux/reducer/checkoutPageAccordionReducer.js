const INITIAL_STATE = { address: false, slide: false };
export const checkoutPageAccordionReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "EXPAND":
      return { ...INITIAL_STATE, [action.payload]: true };

    case "COLLAPSE":
      return { ...INITIAL_STATE, [action.payload]: false };

    default:
      return state;
  }
};
