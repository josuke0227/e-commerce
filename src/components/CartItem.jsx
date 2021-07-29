import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import {
  makeStyles,
  ListItem,
  Grid,
  MenuItem,
  Link,
  Typography,
  Box,
} from "@material-ui/core";
import CustomLink from "../components/shared/CustomLink";
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

const CartItem = ({ product, index }) => {
  const dispatch = useDispatch();
  const { control, watch } = useForm();
  const [show, setShow] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [originalProduct, setOriginalProduct] = useState();
  const classes = useStyles({ show, error });

  useEffect(() => {
    const loadOriginalProduct = async () => {
      const { data } = await getProduct(product.slug);
      setOriginalProduct(data);
    };

    loadOriginalProduct();
  }, [product]);

  const qty = watch("qty");
  useEffect(() => {
    const applyNewQty = async () => {
      const currentProduct = { ...product };
      const newQty = qty;
      const validQty = originalProduct.quantity;

      if (!product.variations.length) {
        if (newQty > validQty) {
          setError(
            `You can add upto ${validQty} ${
              validQty === 1 ? "product" : "products"
            }.`
          );
          return;
        } else {
          currentProduct.quantity = newQty;
        }
      } else {
        const { isValid, validQty } = validatePickingQty(
          { ...currentProduct.variations[0], qty },
          originalProduct.variations
        );
        if (!isValid) {
          setError(
            `You can add upto ${validQty} ${
              validQty === 1 ? "product" : "products"
            }.`
          );
          return;
        } else {
          currentProduct.quantity = currentProduct.variations[0].qty = newQty;
        }
      }
      setError("");
      dispatch({ type: "UPDATE_CART", payload: currentProduct, index });
    };

    if (!qty || qty === product.quantity || !originalProduct) return;
    applyNewQty();
  }, [qty, originalProduct, dispatch, index, product]);

  useEffect(() => {
    const loadImages = async () => {
      const { data } = await getImages(product._id);
      const url = data.length ? data[0].url : "";
      setImageUrl(url);
    };

    if (!product) return;
    loadImages();
  }, [product]);

  const handleMouseLeave = () => {
    if (error) return;
    setShow(false);
  };

  const handleDelete = () => {
    dispatch({
      type: "DELETE_CART_ITEM",
      payload: product,
    });
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
          {show && <a href={`/shop/${product.slug}`}>{product.title}</a>}
        </Grid>
      </Grid>
      {show && (
        <Grid container spacing={1}>
          <Grid item>
            <Select
              control={control}
              name="qty"
              defaultValue={product.quantity}
            >
              {createNumArray(originalProduct.quantity).map((q) => (
                <MenuItem key={q} value={q}>
                  {q}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item className={classes.price}>
            <Link onClick={handleDelete}>Delete</Link> |{" "}
            <Link>Add to wishlist</Link>
          </Grid>
        </Grid>
      )}
    </ListItem>
  );
};

export default CartItem;
