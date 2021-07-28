import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  MenuItem,
  Button,
  Box,
  makeStyles,
  Typography,
} from "@material-ui/core";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import Select from "../components/shared/Select";
import { createNumArray } from "../util/createNumArray";
import { validatePickingQty } from "../util/validatePickingQty";
import { isAlreadyInCart } from "../util/isAlreadyInCart";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  box: {
    padding: theme.spacing(1),
    marginTop: theme.spacing(1),
  },
  uiWrapper: {
    marginTop: theme.spacing(1),
    "& > *": {
      marginRight: theme.spacing(2),
    },
  },
}));

const VariationPicker = ({ product }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => ({ ...state }));
  const { control, handleSubmit } = useForm();
  const [error, setError] = useState("");
  const [options, setOptions] = useState();

  useEffect(() => {
    const applyOptions = (keys) => {
      const result = {};
      keys.forEach((k) => {
        k !== "qty" && (result[k] = []);
        product.variations.forEach((v) => {
          k !== "qty" && result[k].push(v[k].name);
        });
      });
      result.qty = createNumArray(product.quantity);

      Object.keys(result).forEach((k) => (result[k] = _.uniq(result[k])));
      setOptions(result);
    };

    if (!product) return;

    if (product.variations.length) {
      const variationData = product.variations[0];
      const keys = Object.keys(variationData);
      applyOptions(keys);
    } else {
      setOptions({ qty: createNumArray(product.quantity) });
    }
  }, [product]);

  const handleClick = (data) => {
    if (isAlreadyInCart(product, cart)) {
      setError("You have already added this product to cart.");
      return;
    }

    let productAdded;
    if (!product.variations.length) {
      const cartQty = data.qty;
      const validQty = product.qty;

      if (cartQty > validQty) {
        setError(
          `You can add upto ${validQty} ${
            validQty === 1 ? "product" : "products"
          }.`
        );
        return;
      }
      productAdded = { ...product, quantity: cartQty };
    } else {
      const { isValid, validQty } = validatePickingQty(
        data,
        product.variations
      );
      if (!isValid) {
        setError(
          `You can add upto ${validQty} ${
            validQty === 1 ? "product" : "products"
          }.`
        );
        return;
      }
      productAdded = {
        ...product,
        variations: [{ ...data }],
        quantity: data.qty,
      };
    }
    dispatch({
      type: "SET_CART",
      payload: productAdded,
    });
    dispatch({
      type: "SET_SHOW_DRAWER",
      payload: true,
    });
  };

  if (!options) return <div className="">Loading...</div>;
  return (
    <Box border={1} className={classes.box} borderColor="grey.300">
      <Typography align="center" color="error">
        {error}
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        className={classes.uiWrapper}
      >
        {product.variations.length > 0 &&
          Object.keys(product.variations[0]).map((k) =>
            k === "qty" ? (
              ""
            ) : (
              <Select
                key={`select-${k}`}
                control={control}
                name={k}
                defaultValue={options[k][0]}
              >
                {options[k].map((o) => (
                  <MenuItem key={`menu-item-${o}`} value={o}>
                    {o}
                  </MenuItem>
                ))}
              </Select>
            )
          )}
        <Select control={control} name="qty" defaultValue={1}>
          {options.qty.map((n) => (
            <MenuItem key={n} value={n}>
              {n}
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit(handleClick)}
          endIcon={<AddShoppingCartIcon />}
        >
          Add to cart
        </Button>
      </Box>
    </Box>
  );
};

export default VariationPicker;
