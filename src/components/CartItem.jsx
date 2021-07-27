import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import {
  makeStyles,
  ListItem,
  Grid,
  MenuItem,
  InputLabel,
  FormControl,
  Link,
  Typography,
  Box,
} from "@material-ui/core";
import Select from "../components/shared/Select";
import { getImages, getProduct } from "../services/productServices";
import { createNumArray } from "../util/createNumArray";
import { validatePickingQty } from "../util/validatePickingQty";

const useStyles = makeStyles((theme) => ({
  fullList: {
    width: "auto",
  },
  productImage: {
    width: "100%",
    objectFit: "cover",
  },
  price: {
    alignSelf: "center",
    paddingLeft: theme.spacing(1),
  },
  listItem: {
    display: "block",
    "&:hover": {
      backgroundColor: "#fff",
    },
    backgroundColor: ({ show, error }) => (show || error) && "#fff",
  },
  box: {
    padding: theme.spacing(1),
  },
}));

const CartItem = ({ product, index, cart }) => {
  const dispatch = useDispatch();
  const { control, watch } = useForm();
  const [show, setShow] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const classes = useStyles({ show, error });

  const qty = watch("qty");
  useEffect(() => {
    if (!qty || qty === product.variations[0].qty) return;
    applyNewQty();
  }, [qty]);

  const applyNewQty = async () => {
    const currentProduct = { ...product };
    currentProduct.variations[0].qty = qty;
    try {
      const { data: originalProductData } = await getProduct(
        currentProduct.slug
      );
      const { isValid, validQty } = validatePickingQty(
        currentProduct.variations[0],
        originalProductData.variations
      );
      if (!isValid) {
        setError(
          `Sorry, only ${validQty} ${
            validQty === 1 ? "product" : "products"
          } are available.`
        );
        setShow(true);
        return;
      }
      setError("");
      dispatch({ type: "UPDATE_CART", payload: currentProduct, index });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!product) return;
    loadImages();
  }, [product]);
  const loadImages = async () => {
    const { data } = await getImages(product._id);
    const url = data.length ? data[0].url : "";
    setImageUrl(url);
  };

  const handleMouseLeave = () => {
    if (error) return;
    setShow(false);
  };

  return (
    <ListItem
      className={classes.listItem}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={handleMouseLeave}
    >
      {error && (
        <Box className={classes.box} border={1} borderColor="grey.300">
          <Typography variant="caption">{error}</Typography>
        </Box>
      )}
      <Grid container>
        <Grid item xs={show ? 4 : 6}>
          <img src={imageUrl} alt="" className={classes.productImage} />
        </Grid>
        <Grid item xs={show ? 8 : 6} className={classes.price}>
          <div>AUD {product.price}</div>
          {show && <Link>{product.title}</Link>}
        </Grid>
      </Grid>
      {show && (
        <Grid container spacing={1}>
          <Grid item>
            <Select control={control} name="qty" defaultValue={1}>
              {createNumArray(product.quantity).map((q) => (
                <MenuItem key={q} value={q}>
                  {q}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item className={classes.price}>
            <Link>Delete</Link> | <Link>Add to wishlist</Link>
          </Grid>
        </Grid>
      )}
    </ListItem>
  );
};

export default CartItem;
