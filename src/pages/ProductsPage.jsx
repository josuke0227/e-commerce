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

const ProductsPage = ({ location }) => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setShowDialog(true);
  };

  const handleCancel = () => {
    setShowDialog(false);
  };

  const handleConfirm = () => {
    setLoading(true);
    doProductDelete(product);
    setShowDialog(false);
  };

  const doProductDelete = async (product) => {
    try {
      await deleteProduct(product, user);
      let current = [...products];
      for (let i = 0; i < current.length; i++) {
        if (isEqual(product, current[i])) current.splice(i, 1);
      }
      setLoading(false);
      return setProducts(current);
    } catch (error) {
      setLoading(false);
      return console.log("product delete error", error);
    }
  };

  const message = "Are you sure to delete product?";

  return (
    <Layout location={location}>
      <ConfirmDialog
        message={message}
        handleCancel={handleCancel}
        handleConfirm={handleConfirm}
        showDialog={showDialog}
        loading={loading}
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
