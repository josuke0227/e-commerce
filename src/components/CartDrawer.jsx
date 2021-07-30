import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Drawer, Button, List, Paper, Typography } from "@material-ui/core";
import CartItem from "./CartItem";
import sampleImage from "../images/samplepicture.png";
import { getTotalPrice } from "../util/getTotalPrice";

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
  button: {
    ...theme.customButton,
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
                  contained: classes.button,
                  label: classes.buttonLabel,
                }}
                variant="contained"
              >
                Proceed to Checkout
              </Button>
            </div>
          </Paper>
          <List>
            {cart.map((p, i) => (
              <CartItem
                key={i}
                product={p}
                imageUrl={sampleImage}
                index={i}
                cart={cart}
              />
            ))}
          </List>
        </div>
      </Drawer>
    </div>
  );
};

export default CartDrawer;
