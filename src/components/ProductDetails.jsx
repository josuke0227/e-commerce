import { Typography, Card } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import ProductDetailTable from "./ProductDetailTable";
import ProductPageButtons from "./ProductPageButtons";
import RatingIndicator from "../components/shared/RatingIndicator";
import VariationPicker from "../components/VariationPicker";

const useStyles = makeStyles((theme) => ({
  title: {
    backgroundColor: theme.palette.primary.light,
  },
  card: {
    padding: "0 8px",
  },
}));

const ProductDetails = ({ product, setShowDialog }) => {
  const { title, ratings, description } = product;
  const classes = useStyles();

  const handleStarButtonClick = () => {
    setShowDialog(true);
  };

  return (
    <>
      <Typography className={classes.title} component="h1" variant="h2">
        {title}
      </Typography>
      <RatingIndicator ratings={ratings} />
      <Card classes={{ root: classes.card }} elevation={0}>
        <ProductDetailTable product={product} />
        <VariationPicker product={product} />
        <ProductPageButtons handleStarButtonClick={handleStarButtonClick} />
      </Card>
      <div dangerouslySetInnerHTML={{ __html: description }}></div>
    </>
  );
};

export default ProductDetails;
