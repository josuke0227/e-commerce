import { useState, useEffect } from "react";
import { Container, makeStyles, Paper } from "@material-ui/core";
import {
  getImages,
  getProduct,
  rateProduct,
} from "../services/productServices";
import ProductImageViewer from "../components/ProductImageViewer";
import ProductDetails from "../components/ProductDetails";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";
import RatingDialog from "../components/RatingDialog";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(3),
  },
}));

const ProductPage = ({ match, location }) => {
  const classes = useStyles();
  const { user } = useSelector((state) => ({ ...state }));

  const { params } = match;

  const [images, setImages] = useState([]);
  const [product, setProduct] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadProduct();
  }, []);
  const loadProduct = async () => {
    const { data } = await getProduct(params.slug);
    setProduct(data);
  };

  useEffect(() => {
    if (!product) return;

    loadImages();
  }, [product]);
  const loadImages = async () => {
    const { data } = await getImages(product._id);
    setImages(data);
  };

  const handleConfirm = async (value) => {
    if (!user) return setStatus("unauthorized");

    try {
      const { data } = await rateProduct(product, value, user);
      setStatus("success");
    } catch (error) {
      setStatus("failure");
    }
  };

  const handleCancel = () => {
    setShowDialog(false);

    // To stop blinking of dialog panel when button is pushed.
    setTimeout(() => setStatus(""), 1000);
  };

  return (
    <>
      <RatingDialog
        status={status}
        open={showDialog}
        handleConfirm={handleConfirm}
        handleCancel={handleCancel}
      />
      <Layout location={location}>
        {!product ? (
          <div className="">Loading...</div>
        ) : (
          <Container className={classes.container}>
            <Paper>
              <ProductImageViewer images={images} />
              <ProductDetails product={product} setShowDialog={setShowDialog} />
            </Paper>
          </Container>
        )}
      </Layout>
    </>
  );
};

export default ProductPage;
