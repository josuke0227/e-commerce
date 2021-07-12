import { useState, useEffect } from "react";
import { Container, makeStyles, Paper } from "@material-ui/core";
import { getImages, getProduct } from "../services/productServices";
import ProductImageViewer from "../components/ProductImageViewer";
import ProductDetails from "../components/ProductDetails";
import Layout from "../components/Layout";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(3),
  },
}));

const ProductPage = ({ match, location }) => {
  const classes = useStyles();

  const { params } = match;

  const [images, setImages] = useState([]);
  const [product, setProduct] = useState("");

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

  if (!product) return <div className="">Loading...</div>;
  return (
    <Layout location={location}>
      <Container className={classes.container}>
        <Paper>
          <ProductImageViewer images={images} />
          <ProductDetails product={product} />
        </Paper>
      </Container>
    </Layout>
  );
};

export default ProductPage;
