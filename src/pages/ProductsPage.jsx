import Layout from "../components/Layout";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useSelector } from "react-redux";

import { getProducts, deleteProduct } from "../services/productServices";

import ProductCardForEditing from "../components/ProductCardForEditing";
import { isEqual } from "../util/isEqual";
import ConfirmDialog from "../components/shared/ConfirmDialog";

import { useDispatch } from "react-redux";

const useStyles = makeStyles({});

const INITIAL_RESULT_STATE = { success: null, message: "" };

const ProductsPage = ({ location }) => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(INITIAL_RESULT_STATE);

  const classes = useStyles();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    const { data } = await getProducts();
    setProducts(data);
    console.log(data);
  };

  const handleEditButtonClick = (product) => {
    dispatch({
      type: "SELECT_PRODUCT",
      payload: product,
    });
  };

  const handleDeleteButtonClick = (product) => {
    setProduct(product);
    setShowDialog({ message: "Are you sure to delete product?", show: true });
  };

  const handleCancel = () => {
    setShowDialog({ ...showDialog, show: false });
    setResult(INITIAL_RESULT_STATE);
  };

  const handleConfirm = () => {
    setLoading(true);
    doProductDelete(product);
    result.success && setShowDialog({ ...showDialog, show: false });
  };

  const doProductDelete = async (product) => {
    try {
      await deleteProduct(product, user);
      let current = [...products];
      for (let i = 0; i < current.length; i++) {
        if (isEqual(product, current[i])) current.splice(i, 1);
      }
      setResult({ success: true, message: "" });
      setLoading(false);
      return setProducts(current);
    } catch (error) {
      setResult({ success: false, message: "Failed to delete product." });
      setLoading(false);
      return console.log("product delete error", error);
    }
  };

  return (
    <Layout location={location}>
      <ConfirmDialog
        handleCancel={handleCancel}
        handleConfirm={handleConfirm}
        showDialog={showDialog}
        loading={loading}
        result={result}
      />
      {products.map((p) => (
        <ProductCardForEditing
          key={p._id}
          product={p}
          user={user}
          handleDeleteButtonClick={handleDeleteButtonClick}
          handleEditButtonClick={handleEditButtonClick}
        />
      ))}
    </Layout>
  );
};

export default ProductsPage;
