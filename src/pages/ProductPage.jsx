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
import { imageResizer } from "../util/imageResizer";
import { productSchema } from "../schemas/productSchema";
import { imageSchema } from "../schemas/imagesSchema";
import RichTextField from "../components/shared/RichTextField";
import { isEmptyObject } from "../util/isEmptyobject";
import ModalWithLoader from "../components/ModalWithLoader";

import { getProducts, deleteProduct } from "../services/productServices";

import ProductCardForEditing from "../components/ProductCardForEditing";

const useStyles = makeStyles({});

// const products = [
//   {
//     sold: 0,
//     _id: "60c768df93fe691d348a2276",
//     title: "Test",
//     price: 1,
//     category: {
//       _id: "60b820a07468c922cf38beb7",
//       name: "Books",
//       slug: "Books",
//       createdAt: "2021-06-03T00:21:52.278Z",
//       updatedAt: "2021-06-08T07:05:06.449Z",
//       __v: 0,
//     },
//     quantity: 10,
//     color: "white",
//     brand: "",
//     description: "<p>test</p>\n",
//     slug: "test",
//     ratings: [],
//     __v: 0,
//   },
// ];

const ProductPage = ({ location }) => {
  const [products, setProducts] = useState([]);

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

  const handleProductDelete = async (product) => {
    await deleteProduct(product, user);
  };

  return (
    <Layout location={location}>
      {products.map((p) => (
        <ProductCardForEditing
          product={p}
          user={user}
          handleProductDelete={handleProductDelete}
        />
      ))}
    </Layout>
  );
};

export default ProductPage;
