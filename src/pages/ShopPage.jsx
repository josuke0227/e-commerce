import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Container, Grid } from "@material-ui/core";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productServices";

const ShopPage = ({ location }) => {
  const { products } = useSelector((state) => ({ ...state }));
  const [initialProducts, setInitialProducts] = useState([]);

  useEffect(() => {
    loadInitialProducts();
  }, []);

  const loadInitialProducts = async () => {
    const { data } = await getProducts();
    setInitialProducts(data);
  };

  return (
    <Layout location={location}>
      <Grid container component={Container}>
        {products.length
          ? products.map((p) => (
              <Grid item xs={12} sm={6} md={4}>
                <ProductCard key={p._id} product={p} />
              </Grid>
            ))
          : initialProducts.map((p) => (
              <Grid item xs={12} sm={6} md={4}>
                <ProductCard key={p._id} product={p} />
              </Grid>
            ))}
      </Grid>
    </Layout>
  );
};

export default ShopPage;
