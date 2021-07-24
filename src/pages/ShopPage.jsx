import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Container, Grid } from "@material-ui/core";
import Layout from "../components/Layout";
import ProductCard from "../components/ProductCard";
import Pagination from "@material-ui/lab/Pagination";
import {
  filterByAttribute,
  getProducts,
  getProductsList,
  getProductsCount,
} from "../services/productServices";

const ShopPage = ({ location }) => {
  const { query } = useSelector((state) => ({ ...state }));
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(1);

  useEffect(() => {
    if (!query.length) {
      loadWholeProducts();
      return;
    }
    loadFilteredProducts(query);
  }, [query]);
  const loadWholeProducts = async () => {
    const { data } = await getProductsList("createdAt", "desc", page, 2);
    setProducts(data);
  };
  const loadFilteredProducts = async () => {
    const { data } = await filterByAttribute(query);
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, [page]);
  const loadProducts = async () => {
    try {
      const { data } = await getProductsList("createdAt", "desc", page, 2);
      setProducts(data);
    } catch (error) {
      console.log("product fetching error", error);
    }
  };

  useEffect(() => {
    loadCount();
  }, []);
  const loadCount = async () => {
    try {
      const { data } = await getProductsCount();
      console.log(data);
      setCount(data);
    } catch (error) {
      console.log("product count fetching error", error);
    }
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Layout location={location}>
      <Grid container component={Container}>
        {products.map((p) => (
          <Grid item xs={12} sm={6} md={4}>
            <ProductCard key={p._id} product={p} />
          </Grid>
        ))}
        <Pagination count={count / 2} page={page} onChange={handleChange} />
      </Grid>
    </Layout>
  );
};

export default ShopPage;
