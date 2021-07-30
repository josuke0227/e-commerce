export const getTotalPrice = (cart) => {
  if (!cart.length) return 0;
  if (cart.length === 1) return cart[0].price * cart[0].quantity;
  return cart.reduce((accum, curr) => accum.price + curr.price * curr.quantity);
};
