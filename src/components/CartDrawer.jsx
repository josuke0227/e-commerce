import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  makeStyles,
  Drawer,
  Button,
  List,
  Paper,
  Typography,
} from "@material-ui/core";
import CartItem from "./CartItem";
import sampleImage from "../images/samplepicture.png";

const useStyles = makeStyles((theme) => ({
  list: {
    width: 250,
  },
  totalPrice: {
    marginBottom: theme.spacing(1),
  },
  buttonLabel: {
    textTransform: "none",
  },
  drawer: {
    backgroundColor: theme.palette.grey[50],
  },
  buttonContainer: {
    textAlign: "center",
  },
  checkoutButton: {
    background: "linear-gradient(to bottom,#f7dfa5,#f0c14b)",
    border: "1px solid #171717",
  },
  paper: {
    padding: "1rem",
  },
}));

const CartDrawer = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { cart, cartDrawer: open } = useSelector((state) => ({ ...state }));
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const currentTotalPrice = getTotalPrice(cart);
    setTotalPrice(currentTotalPrice);
  }, [cart]);

  const handleClose = () => {
    dispatch({
      type: "SET_SHOW_DRAWER",
      payload: false,
    });
  };

  const getTotalPrice = (cart) => {
    if (!cart.length) return 0;
    if (cart.length === 1) return cart[0].price;
    return cart.reduce((accum, curr) => accum.price + curr.price);
  };

  return (
    <div>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleClose}
        classes={{ paper: classes.drawer }}
      >
        <div
          className={classes.list}
          role="presentation"
          onKeyDown={handleClose}
        >
          <Paper className={classes.paper} square>
            <Typography
              color="error"
              align="center"
              className={classes.totalPrice}
            >
              Subtotal: AUD {totalPrice}
            </Typography>
            <div className={classes.buttonContainer}>
              <Button
                classes={{
                  contained: classes.checkoutButton,
                  label: classes.buttonLabel,
                }}
                variant="contained"
              >
                Proceed to Checkout
              </Button>
            </div>
          </Paper>
          <List>
            {cart.map((p) => (
              <CartItem key={p._id} product={p} imageUrl={sampleImage} />
            ))}
          </List>
        </div>
      </Drawer>
    </div>
  );
};

export default CartDrawer;
