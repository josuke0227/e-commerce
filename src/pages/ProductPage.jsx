import Layout from "../components/Layout";
import React, { useState, useEffect } from "react";
import { getCategories } from "../services/categoryServices";

import ImageSelector from "../components/ImageSelector";

const initialState = {
  title: "",
  description: "",
  price: "",
  categories: [],
  category: "",
  subs: [],
  shipping: "",
  quantitiy: "",
  images: [],
  colors: [
    "white",
    "black",
    "gray",
    "brown",
    "baige",
    "green",
    "blue",
    "purple",
    "yellow",
    "pink",
    "red",
    "orange",
    "silver",
    "gold",
  ],
  color: "",
  brand: "",
};

const ProductPage = ({ location }) => {
  const [values, setValues] = useState(initialState);
  const [subOptions, setSubOptions] = useState([]);
  const [showSub, setShowSub] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data } = await getCategories();
      setValues({ ...values, categories: data });
    } catch (error) {
      console.log("category fetching error", error);
    }
  };

  return (
    <Layout location={location}>
      <ImageSelector
        values={values}
        setValues={setValues}
        setLoading={setLoading}
      />
    </Layout>
  );
};

export default ProductPage;
