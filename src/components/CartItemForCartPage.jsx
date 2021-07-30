import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import {
  ListItem,
  Grid,
  MenuItem,
  Link,
  Typography,
  Box,
} from "@material-ui/core";
import Select from "../components/shared/Select";
import { getImages, getProduct } from "../services/productServices";
import { createNumArray } from "../util/createNumArray";
import { validatePickingQty } from "../util/validatePickingQty";
import CustomLink from "../components/shared/CustomLink";

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
    backgroundColor: "#fff",
    marginBottom: theme.spacing(1),
  },
  box: {
    padding: theme.spacing(1),
  },
  delete: {
    marginRight: theme.spacing(1),
    paddingRight: theme.spacing(1),
    borderRight: "1px solid",
    borderRightColor: theme.palette.grey[300],
  },
  variationText: {
    fontWeight: "bold",
  },
  footerContainer: {
    marginTop: theme.spacing(1),
  },
}));

const CartItemForCartPage = ({ product, index }) => {
  const dispatch = useDispatch();
  const { control, watch } = useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [originalProduct, setOriginalProduct] = useState();
  const classes = useStyles();

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

  const handleDelete = () => {
    dispatch({
      type: "DELETE_CART_ITEM",
      payload: product,
    });
  };

  if (!originalProduct || !product) return <div className="">loading...</div>;

  return (
    <ListItem className={classes.listItem}>
      <Grid container>
        <Grid item xs={4}>
          <CustomLink to={`/shop/${product.slug}`}>
            <img src={imageUrl} alt="" className={classes.productImage} />
          </CustomLink>
        </Grid>
        <Grid item xs={8} className={classes.price}>
          <CustomLink to={`/shop/${product.slug}`}>
            <Typography variant="h5">{product.title}</Typography>
          </CustomLink>
          <Typography variant="h6">AUD {product.price}</Typography>
          {product.variations.length > 0 &&
            Object.keys(product.variations[0]).map((k) => {
              return k !== "qty" ? (
                <Typography
                  className={classes.variationText}
                  variant="subTitle1"
                >{`${k}: ${product.variations[0][k]}`}</Typography>
              ) : (
                ""
              );
            })}
          <Grid container spacing={1} className={classes.footerContainer}>
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
              <Link onClick={handleDelete} className={classes.delete}>
                <Typography component="span" variant="subtitle1">
                  Delete
                </Typography>
              </Link>
              <Link onClick={handleDelete}>
                <Typography component="span" variant="subtitle1">
                  Add to wishlist
                </Typography>
              </Link>{" "}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {error && (
        <Box className={classes.box} border={1} borderColor="grey.300">
          <Typography variant="subtitle1">{error}</Typography>
        </Box>
      )}
    </ListItem>
  );
};

export default CartItemForCartPage;
