import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Link from "@material-ui/core/Link";
import { Link as RouterLink } from "react-router-dom";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import CardActionArea from "@material-ui/core/CardActionArea";
import Skeleton from "@material-ui/lab/Skeleton";
import { getImages } from "../services/productServices";
import { CardContent } from "@material-ui/core";
import { useSelector } from "react-redux";
import Rating from "@material-ui/lab/Rating";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 345,
    margin: theme.spacing(2),
  },
  media: {
    height: 190,
  },
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  spacer: {
    paddingTop: "57%",
  },
}));

const ProductCard = ({ product }) => {
  const classes = useStyles();
  const [images, setImages] = useState([]);
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    if (!user) return;
    loadImages();
  }, [user]);

  const loadImages = async () => {
    const { data } = await getImages(product._id);
    setImages(data);
  };

  const renderImage = () => {
    const url = images.length ? images[0].url : "";
    return (
      <Link component={RouterLink} to={`shop/${product.slug}`}>
        {/* TODO: add meaningful title to images. */}
        <CardMedia className={classes.media} image={url} title="Paella dish" />
      </Link>
    );
  };

  const renderContent = () => (
    <>
      <Link
        component={RouterLink}
        to={`shop/${product.slug}`}
        color="textPrimary"
      >
        <Typography>{product.title}</Typography>
      </Link>
      {renderRating(product.ratings)}
      <Typography variant="subtitle1" color="secondary">
        AUD {product.price}
      </Typography>
    </>
  );

  const renderRating = (ratings) => {
    // TODO: here comes ave of rating number.
    if (ratings.length) return <Rating name="read-only" value={4} readOnly />;
    return <Typography color="textSecondary">No rating yet.</Typography>;
  };

  // TODO: add "在庫希少お早めに" notice

  const loadingImage = <Skeleton variant="rect" height={194} />;

  const loadingContent = (
    <>
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      <Skeleton variant="text" />
    </>
  );

  const isReady = () => images.length && product;

  const toggleCard = () => {
    const result = {};

    if (isReady()) {
      result.actionArea = renderImage();
      result.content = renderContent();
      return result;
    }

    result.actionArea = loadingImage;
    result.content = loadingContent;
    return result;
  };

  return (
    <Card className={classes.card}>
      <CardActionArea>{toggleCard().actionArea}</CardActionArea>
      <CardContent>{toggleCard().content}</CardContent>
    </Card>
  );
};

export default ProductCard;
