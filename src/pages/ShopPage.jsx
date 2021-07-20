import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Container, Grid } from "@material-ui/core";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import { filterByAttribute, getProducts } from "../services/productServices";

const ShopPage = ({ location }) => {
  const { query } = useSelector((state) => ({ ...state }));
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!query.length) {
      loadWholeProducts();
      return;
    }
    loadFilteredProducts(query);
  }, [query]);
  const loadWholeProducts = async () => {
    const { data } = await getProducts();
    setProducts(data);
  };
  const loadFilteredProducts = async () => {
    const { data } = await filterByAttribute(query);
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
