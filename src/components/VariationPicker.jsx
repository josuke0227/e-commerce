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
  const [value, setValue] = useState();
  const [error, setError] = useState("");
  const [options, setOptions] = useState();

  useEffect(() => {
    if (!product) return;
    const initialValue = {};
    const variationData = product.variations[0];
    const keys = Object.keys(variationData);
    keys.forEach(
      (k) => (initialValue[k] = k === "qty" ? 1 : variationData[k].name)
    );
    setValue(initialValue);

    applyOptions(keys);
  }, [product]);
  const applyOptions = (keys) => {
    const result = {};
    keys.forEach((k) => {
      k !== "qty" && (result[k] = []);
      product.variations.forEach((v) => {
        k !== "qty" && result[k].push(v[k].name);
      });
    });

    Object.keys(result).forEach((k) => (result[k] = _.uniq(result[k])));
    setOptions(result);
  };

  const handleClick = (data) => {
    console.log(product);
    const productAdded = { ...product, variations: [{ ...data }] };
    if (isAlreadyInCart(product, cart)) {
      setError("You have already added this product to cart.");
      return;
    }
    const { isValid, validQty } = validatePickingQty(value, product.variations);
    if (!isValid) {
      setError(
        `You can add upto ${validQty} ${
          validQty === 1 ? "product" : "products"
        }.`
      );
      return;
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

  const keys = product ? Object.keys(product.variations[0]) : [];

  if (value === undefined) return <div>loading</div>;
  return (
    <Box border={1} className={classes.box} borderColor="grey.300">
      <Typography align="left" color="textPrimary">
        Please choose variation
      </Typography>
      <Typography align="center" color="error">
        {error}
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        className={classes.uiWrapper}
      >
        {keys.map((k) =>
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
          {createNumArray(product.quantity).map((q) => (
            <MenuItem key={q} value={q}>
              {q}
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
