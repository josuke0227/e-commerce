import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Container, Grid } from "@material-ui/core";
import Layout from "../components/Layout";
import { makeStyles } from "@material-ui/core";
import ProductCard from "../components/ProductCard";
import Pagination from "@material-ui/lab/Pagination";
import { getProductsList } from "../services/productServices";

const useStyles = makeStyles({
  pagination: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
});

const ShopPage = ({ location }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { query, products, page } = useSelector((state) => ({ ...state }));
  const [count, setCount] = useState(1);

  useEffect(() => {
    loadProducts();
  }, [query, page]);

  const loadProducts = async () => {
    let response;
    if (!query.length) {
      response = await getProductsList("createdAt", "desc", page, 2);
      applyData(response);
      return;
    }
    response = await getProductsList("createdAt", "desc", page, 2, query);
    applyData(response);
  };

  const applyData = (response) => {
    const { data } = response;
    setCount(data.count);
    dispatch({
      type: "SET_PRODUCTS",
      payload: data.products,
    });
  };

  const handleChange = (event, value) => {
    dispatch({
      type: "SET_PAGE",
      payload: value,
    });
  };

  const pageLength = Math.ceil(count / 2);
  return (
    <Layout location={location}>
      <Grid container component={Container}>
        {products.map((p) => (
          <Grid item xs={12} sm={6} md={4}>
            <ProductCard key={p._id} product={p} />
          </Grid>
        ))}
        <footer className={classes.pagination}>
          <Pagination count={pageLength} page={page} onChange={handleChange} />
        </footer>
      </Grid>
    </Layout>
  );
};

export default ShopPage;
