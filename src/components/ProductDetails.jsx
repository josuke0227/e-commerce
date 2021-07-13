import { Typography, Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import ProductDetailTable from "./ProductDetailTable";
import ProductPageButtons from "./ProductPageButtons";
import RatingIndicator from "../components/shared/RatingIndicator";

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

const ProductDetails = ({ product, setShowDialog }) => {
  const classes = useStyles();
  return (
    <>
      <Typography className={classes.title} component="h1" variant="h2">
        {product.title}
      </Typography>
      <div className={classes.ratingIndicator}>
        <RatingIndicator ratings={product.ratings} />
      </div>
      <Card classes={{ root: classes.card }} elevation={0}>
        <ProductDetailTable product={product} />
        <ProductPageButtons setShowDialog={setShowDialog} />
      </Card>
      <div dangerouslySetInnerHTML={{ __html: product.description }}></div>
    </>
  );
};

export default ProductDetails;
