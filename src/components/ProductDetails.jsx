import { useDispatch } from "react-redux";
import { Typography, Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import ProductDetailTable from "./ProductDetailTable";
import ProductPageButtons from "./ProductPageButtons";
import RatingIndicator from "../components/shared/RatingIndicator";

const useStyles = makeStyles((theme) => ({
  title: {
    backgroundColor: theme.palette.primary.light,
  },
  card: {
    padding: "0 8px",
  },
}));

const ProductDetails = ({ product, setShowDialog }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleStarButtonClick = () => {
    setShowDialog(true);
  };

  const handleCartButtonClick = () => {
    dispatch({
      type: "SET_CART",
      payload: product,
    });
    dispatch({
      type: "SET_SHOW_DRAWER",
      payload: true,
    });
  };
  return (
    <>
      <Typography className={classes.title} component="h1" variant="h2">
        {product.title}
      </Typography>
      <RatingIndicator ratings={product.ratings} />
      <Card classes={{ root: classes.card }} elevation={0}>
        <ProductDetailTable product={product} />
        <ProductPageButtons
          handleStarButtonClick={handleStarButtonClick}
          handleCartButtonClick={handleCartButtonClick}
        />
      </Card>
      <div dangerouslySetInnerHTML={{ __html: product.description }}></div>
    </>
  );
};

export default ProductDetails;
