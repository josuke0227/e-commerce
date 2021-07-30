export const getTotalPrice = (cart) => {
  console.log(cart);
  if (!cart.length) return 0;
  if (cart.length === 1) return cart[0].price * cart[0].quantity;
  return cart.reduce(
    (accum, curr) => accum.price * accum.quantity + curr.price * curr.quantity
  );
};
