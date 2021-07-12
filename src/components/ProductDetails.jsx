import { Typography, Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Rating from "@material-ui/lab/Rating";
import ProductDetailTable from "./ProductDetailTable";
import ProductPageButtons from "./ProductPageButtons";

const useStyles = makeStyles((theme) => ({
  title: {
    backgroundColor: theme.palette.primary.light,
  },
  ratingIndicator: {
    display: "flex",
    alignItems: "center",
  },
  card: {
    padding: "0 8px",
  },
}));

const ProductDetails = ({ product }) => {
  const classes = useStyles();
  return (
    <>
      <Typography className={classes.title} component="h1" variant="h2">
        {product.title}
      </Typography>
      <div className={classes.ratingIndicator}>
        <Rating name="read-only" value={4} readOnly />
        <span>({product.ratings.length})</span>
      </div>
      <Card classes={{ root: classes.card }} elevation={0}>
        <ProductDetailTable product={product} />
        <ProductPageButtons />
      </Card>
      <div dangerouslySetInnerHTML={{ __html: product.description }}></div>
    </>
  );
};

export default ProductDetails;
