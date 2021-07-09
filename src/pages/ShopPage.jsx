import { Container, Grid } from "@material-ui/core";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productServices";

const ShopPage = ({ location }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data } = await getProducts();
    setProducts(data);
  };

  return (
    <Layout location={location}>
      <Grid container component={Container}>
        {products.map((p) => (
          <Grid item xs={12} sm={6} md={4}>
            <ProductCard key={p._id} product={p} />
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
};

export default ShopPage;
