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

import { getProducts } from "../services/productServices";

import Playground from "../Playground";

const useStyles = makeStyles({});

const ProductPage = ({ location }) => {
  const [products, setProducts] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    const { data } = getProducts();
    setProducts(data);
    console.log(data);
  }, []);

  return (
    <Layout location={location}>
      <Playground products={products} />
    </Layout>
  );
};

export default ProductPage;
