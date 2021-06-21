import Layout from "../components/Layout";
import React, { useState, useEffect } from "react";
import { getCategories } from "../services/categoryServices";
import { pickByParentId } from "../services/subCategoryServices";
import ImageSelector from "../components/ImageSelector";
import { createProduct, uploadImage } from "../services/productServices";
import {
  TextField,
  MenuItem,
  Container,
  makeStyles,
  Button,
  Grid,
} from "@material-ui/core";
import { useSelector } from "react-redux";

import { getProducts, deleteProduct } from "../services/productServices";

import ProductCardForEditing from "../components/ProductCardForEditing";
import { isEqual } from "../util/isEqual";
import ConfirmDialog from "../components/shared/ConfirmDialog";

const useStyles = makeStyles({});

const productsSample = [
  {
    sold: 0,
    _id: "60c768df93fe691d348a2278",
    title: "Test",
    price: 1,
    category: {
      _id: "60b820a07468c922cf38beb7",
      name: "Books",
      slug: "Books",
      createdAt: "2021-06-03T00:21:52.278Z",
      updatedAt: "2021-06-08T07:05:06.449Z",
      __v: 0,
    },
    quantity: 10,
    color: "white",
    brand: "",
    description: "<p>test</p>\n",
    slug: "test",
    ratings: [],
    __v: 0,
  },
  {
    sold: 0,
    _id: "60c768df93fe691d348a2276",
    title: "Test",
    price: 1,
    category: {
      _id: "60b820a07468c922cf38beb7",
      name: "Books",
      slug: "Books",
      createdAt: "2021-06-03T00:21:52.278Z",
      updatedAt: "2021-06-08T07:05:06.449Z",
      __v: 0,
    },
    quantity: 10,
    color: "white",
    brand: "",
    description: "<p>test</p>\n",
    slug: "test",
    ratings: [],
    __v: 0,
  },
];

const ProductPage = ({ location }) => {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const classes = useStyles();
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    const { data } = await getProducts();
    setProducts(data);
    console.log(data);
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
        />
      ))}
    </Layout>
  );
};

export default ProductPage;
