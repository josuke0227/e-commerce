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
import { imageSchema, productSchema } from "../schemas/productSchema";

const initialState = {
  title: "test",
  description: "<p>sugoi</p>",
  price: 1,
  category: "60c00dbf4cb336f57aff244b",
  subCategory: "60b85ba36fc3f936c09728b1",
  quantity: 1,
  images: [],
  color: "brown",
  brand: "toshiba",
};

const objectSignature = {
  brand: "",
  category: "",
  color: "",
  description: "",
  images: [],
  image: "",
  price: 0,
  quantity: 0,
  subCategory: "",
  title: "",
};

const colors = [
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
];

const ProductPage = ({ location }) => {
  const [values, setValues] = useState(initialState);
  const [error, setError] = useState(objectSignature);
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

  const handleTextAreaChange = (inputValue) => {
    setValues({ ...values, description: inputValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = productSchema.validate(values, {
      abortEarly: false,
    });
    if (result.error) {
      let updatedError = { ...error };
      result.error.details.forEach((e) => {
        const { path, message } = e;
        updatedError = { ...updatedError, [path[0]]: message };
      });
      return setError(updatedError);
    }
    const images = [...values.images];

    const uploadedImageData = await Promise.all(
      images.map(async (i) => {
        try {
          return handleImageSubmit(i);
        } catch (error) {
          return null;
        }
      })
    );
    console.log(`uploadedImageData`, uploadedImageData);

    for (let obj of uploadedImageData) {
      if (!obj) return;
    }

    const submittingData = { ...values, images: uploadedImageData };

    try {
      await createProduct(submittingData, user);
      setValues(initialState);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageSubmit = async (image) => {
    const resizedImageUri = await imageResizer(image);
    const { error } = imageSchema.validate(resizedImageUri);
    if (error) {
      setError({ ...error, image: error });
      return;
    }
    const { data } = await uploadImage(resizedImageUri, user);
    return data;
  };

  const toggleSubCategoryFormStatus = () => {
    if (!subCategories.length) {
      return { label: "No sub category registered.", disable: true };
    }

    return { label: "Sub category", disable: false };
  };

  const toggleStatus = (path) => {
    if (error[path]) return { error: true, helperText: error[path] };

    return { error: false, helperText: "" };
  };

  return (
    <Layout location={location}>
      <Container component="form" onSubmit={handleSubmit}>
        <ImageSelector
          values={values}
          setValues={setValues}
          setLoading={setLoading}
          error={error.image}
        />
        <TextField
          error={toggleStatus("title").error}
          helperText={toggleStatus("title").helperText}
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
          error={toggleStatus("price").error}
          helperText={toggleStatus("price").helperText}
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
          error={toggleStatus("quantity").error}
          helperText={toggleStatus("quantity").helperText}
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
          error={toggleStatus("color").error}
          helperText={toggleStatus("color").helperText}
          id="color"
          name="color"
          label="Color"
          onChange={handleInputChange}
          value={values.color}
          fullWidth
          select
        >
          <MenuItem key="" value="">
            {" "}
          </MenuItem>
          {colors.map((c) => (
            <MenuItem key={c.value} value={c.value}>
              {c.label}
            </MenuItem>
          ))}
        </TextField>
        {/* Parent category** */}
        <TextField
          select
          error={toggleStatus("category").error}
          helperText={toggleStatus("category").helperText}
          id="category"
          name="category"
          label="Category"
          onChange={handleInputChange}
          value={values.category}
          fullWidth
          select
        >
          <MenuItem key="" value="">
            {" "}
          </MenuItem>
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
            disabled={toggleSubCategoryFormStatus().disable}
            error={false}
            helperText="this is error message."
            id="subCategory"
            name="subCategory"
            label={toggleSubCategoryFormStatus().label}
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
          error={toggleStatus("brand").error}
          helperText={toggleStatus("brand").helperText}
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
