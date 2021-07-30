import { useSelector } from "react-redux";
import { Grid, List, makeStyles, Typography, Button } from "@material-ui/core";
import CartItemForCartPage from "../components/CartItemForCartPage";
import Layout from "../components/Layout";
import { getTotalPrice } from "../util/getTotalPrice";

const useStyles = makeStyles((theme) => ({
  subTotal: {
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(1),
    padding: theme.spacing(2),
    height: "fit-content",
  },
  root: {
    marginTop: theme.spacing(1),
    flexWrap: "nowrap",
  },
  button: {
    ...theme.customButton,
  },
}));

const getTotalQty = (cart) => {
  if (!cart.length) return 0;
  if (cart.length === 1) return cart[0].quantity;
  return cart.reduce((accum, curr) => accum.quantity + curr.quantity);
};

const CartPage = ({ location }) => {
  const classes = useStyles();
  const { cart } = useSelector((state) => ({ ...state }));
  console.log(cart);
  console.log(getTotalPrice(cart));

  if (!cart) return <div className="">loading...</div>;
  return (
    <Layout location={location}>
      <Grid container classes={{ root: classes.root }}>
        <Grid item xs={8}>
          <List>
            {cart.map((p, i) => (
              <CartItemForCartPage product={p} index={i} />
            ))}
          </List>
        </Grid>
        <Grid item xs={4} className={classes.subTotal}>
          <div>
            <Typography variant="subtitle1" gutterBottom>
              Subtotal ({getTotalQty(cart)}) items: AUD {getTotalPrice(cart)}
            </Typography>
            <Button
              classes={{
                contained: classes.button,
                label: classes.buttonLabel,
              }}
              variant="contained"
            >
              Proceed to Checkout
            </Button>
          </div>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default CartPage;
