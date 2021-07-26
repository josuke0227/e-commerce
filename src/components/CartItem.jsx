import { useState, useEffect } from "react";
import {
  makeStyles,
  ListItem,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Link,
} from "@material-ui/core";
import { getImages } from "../services/productServices";

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
  },
}));

const CartItem = ({ product }) => {
  const classes = useStyles();
  const [show, setShow] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!product) return;
    loadImages();
  }, [product]);

  const loadImages = async () => {
    const { data } = await getImages(product._id);
    const url = data.length ? data[0].url : "";
    setImageUrl(url);
  };

  return (
    <ListItem
      className={classes.listItem}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
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
            <FormControl variant="outlined">
              <InputLabel id="demo-simple-select-label">Qty</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
              >
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
              </Select>
            </FormControl>
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
