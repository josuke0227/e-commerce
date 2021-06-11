import Layout from "../components/Layout";
import React, { useState, useEffect } from "react";
import { getCategories } from "../services/categoryServices";
import { pickByParentId } from "../services/subCategoryServices";

import ImageSelector from "../components/ImageSelector";
import { createProduct, uploadImage } from "../services/productServices";

//
import { TextField, MenuItem, Typography, Container } from "@material-ui/core";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useSelector } from "react-redux";
import { imageResizer } from "../util/imageResizer";

const initialState = {
  title: "test",
  description: "<p>sugoi</p>",
  price: "1",
  category: "60c00dbf4cb336f57aff244b",
  subCategory: "60b85ba36fc3f936c09728b1",
  quantity: "1",
  images: [],
  colors: [
    { value: "white", label: "white" },
    { value: "black", label: "black" },
    { value: "gray", label: "gray" },
    { value: "brown", label: "brown" },
    { value: "baige", label: "baige" },
    { value: "green", label: "green" },
    { value: "blue", label: "blue" },
    { value: "purple", label: "purple" },
    { value: "yellow", label: "yellow" },
    { value: "pink", label: "pink" },
    { value: "red", label: "red" },
    { value: "orange", label: "orange" },
    { value: "silver", label: "silver" },
    { value: "gold", label: "gold" },
  ],
  color: "brown",
  brand: "toshiba",
};

const ProductPage = ({ location }) => {
  const [values, setValues] = useState(initialState);
  const [subOptions, setSubOptions] = useState([]);
  const [showSub, setShowSub] = useState(false);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (values.category.length) {
      loadSubcategories(values.category);
    }
  }, [values.category]);

  const loadCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(data);
    } catch (error) {
      console.log("category fetching error", error);
    }
  };

  const loadSubcategories = async (id) => {
    try {
      const { data } = await pickByParentId(id);
      setSubCategories(data);
    } catch (error) {
      console.log("category fetching error", error);
    }
  };

  const handleInputChange = (e) => {
    console.log(`e.target`, e.target);
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const toggleFormStatus = () => {
    if (!subCategories.length) {
      return { label: "No sub category registered.", disable: true };
    }

    return { label: "Sub category", disable: false };
  };

  const handleTextAreaChange = (inputValue) => {
    setValues({ ...values, description: inputValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const images = [...values.images];
    handleImageSubmit(images);

    const submittingData = { ...values };
    delete submittingData.images;
    delete submittingData.colors;

    try {
      await createProduct(submittingData, user);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageSubmit = (images) => {
    images.forEach(async (i) => {
      try {
        const resizedImageUri = await imageResizer(i);
        console.log(resizedImageUri);
        // await uploadImage(resizedImageUri, user);
      } catch (error) {
        return console.log("Image uploading error", error);
      }
    });
  };

  return (
    <Layout location={location}>
      <Container component="form" onSubmit={handleSubmit}>
        <ImageSelector
          values={values}
          setValues={setValues}
          setLoading={setLoading}
        />
        <TextField
          error={false}
          helperText="this is error message."
          id="title"
          name="title"
          label="Product name"
          onChange={handleInputChange}
          type="text"
          value={values.title}
          fullWidth
        />
        {/* Price** */}
        <TextField
          error={false}
          helperText="this is error message."
          id="price"
          name="price"
          label="Price"
          onChange={handleInputChange}
          type="number"
          value={values.price}
          fullWidth
        />
        {/* Quantitiy** */}
        <TextField
          error={false}
          helperText="this is error message."
          id="quantity"
          name="quantity"
          label="Quantity"
          onChange={handleInputChange}
          type="number"
          value={values.quantity}
          fullWidth
        />
        {/* Color */}
        <TextField
          select
          error={false}
          helperText="this is error message."
          id="color"
          name="color"
          label="Color"
          onChange={handleInputChange}
          value={values.color}
          fullWidth
          select
        >
          {values.colors.map((c) => (
            <MenuItem key={c.value} value={c.value}>
              {c.label}
            </MenuItem>
          ))}
        </TextField>
        {/* Parent category** */}
        <TextField
          select
          error={false}
          helperText="this is error message."
          id="category"
          name="category"
          label="Category"
          onChange={handleInputChange}
          value={values.category}
          fullWidth
          select
        >
          {categories.map((c) => (
            <MenuItem key={c._id} value={c._id} name={c.name}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>
        {/* Sub category** */}
        {!!values.category.length && (
          <TextField
            select
            disabled={toggleFormStatus().disable}
            error={false}
            helperText="this is error message."
            id="subCategory"
            name="subCategory"
            label={toggleFormStatus().label}
            onChange={handleInputChange}
            value={values.subCategory}
            fullWidth
            select
          >
            {subCategories.map((c) => (
              <MenuItem key={c._id} value={c._id} name={c.name}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
        )}
        {/* Brand */}
        <TextField
          error={false}
          helperText="this is error message."
          id="brand"
          name="brand"
          label="Brand name"
          onChange={handleInputChange}
          type="text"
          value={values.brand}
          fullWidth
        />
        {/* Description** */}
        <Typography>Product description</Typography>
        <ReactQuill
          value={values.description}
          onChange={handleTextAreaChange}
        />
        <button type="submit">submit</button>
      </Container>
    </Layout>
  );
};

export default ProductPage;
