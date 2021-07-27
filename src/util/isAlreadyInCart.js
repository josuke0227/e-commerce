export const isAlreadyInCart = (product, cart) => {
  let result;
  cart.forEach((c) => c._id === product._id && (result = true));
  return !!result;
};
