// TODO: Add loading modal.
// TODO: Add color route.

import Layout from "../components/Layout";
import React, { useState, useEffect } from "react";
import { getCategories } from "../services/categoryServices";
import { pickByParentId } from "../services/subCategoryServices";
import ImageSelector from "../components/ImageSelector";
import { createProduct, uploadImage } from "../services/productServices";
import {
  TextField,
  MenuItem,
  Typography,
  Container,
  makeStyles,
  Button,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import { imageResizer } from "../util/imageResizer";
import { productSchema } from "../schemas/productSchema";
import { imageSchema } from "../schemas/imagesSchema";
import RichTextField from "../components/shared/RichTextField";
import CustomSnackBar from "../components/shared/CustomSnackBar";
import { isEmptyObject } from "../util/isEmptyobject";

const useStyles = makeStyles((theme) => ({
  descriptionPreview: {
    padding: "0 0.5rem",
    width: "100%",
    maxHeight: "30vh",
    overflowX: "scroll",
  },
  formParts: {
    marginTop: theme.spacing(3),
  },
}));

const initialState = {
  title: "test",
  price: 1,
  category: "60c00dbf4cb336f57aff244b",
  subCategory: "60b85ba36fc3f936c09728b1",
  quantity: 1,
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
  { value: "beige", label: "baige" },
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
  const [description, setDescription] = useState("");
  const [error, setError] = useState(objectSignature);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [images, setImages] = useState({});
  const [showSnackBar, setShowSnackBar] = useState({
    show: false,
    severity: "",
    message: "",
  });

  const { user } = useSelector((state) => ({ ...state }));
  const classes = useStyles();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submittingData = { ...values, description };

    const result = productSchema.validate(submittingData, {
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

    try {
      const { data } = await createProduct(submittingData, user);

      if (isEmptyObject(images)) return;
      const productId = data._id;
      [...images].forEach(async (i) => {
        try {
          await handleImageSubmit(i, productId);
          setValues(initialState);
          setDescription("");
          setImages({});
        } catch (error) {
          console.log(`error`, error);
          setShowSnackBar({
            message: "Product creation failed.",
            show: true,
            severity: "error",
          });
          // TODO: send delete requiest to delete product data.
        }
      });
    } catch (error) {
      console.log(`error`, error);
      setShowSnackBar({
        message: "Product creation failed.",
        show: true,
        severity: "error",
      });
    }
  };

  const handleImageSubmit = async (image, productId) => {
    const resizedImageUri = await imageResizer(image);
    const { error } = imageSchema.validate(resizedImageUri);
    if (error) throw new Error("Invalid image URI.");
    await uploadImage(resizedImageUri, productId, user);
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
      <CustomSnackBar
        showSnackBar={showSnackBar}
        setShowSnackBar={setShowSnackBar}
      />
      <Container component="form" onSubmit={handleSubmit}>
        <ImageSelector
          images={images}
          setValues={setImages}
          setLoading={setLoading}
          error={error.image}
        />
        <TextField
          className={classes.formParts}
          error={toggleStatus("title").error}
          helperText={toggleStatus("title").helperText}
          id="title"
          name="title"
          label="Product name"
          onChange={handleInputChange}
          type="text"
          value={values.title}
          fullWidth
          variant="outlined"
        />
        <TextField
          className={classes.formParts}
          error={toggleStatus("price").error}
          helperText={toggleStatus("price").helperText}
          id="price"
          name="price"
          label="Price"
          onChange={handleInputChange}
          type="number"
          value={values.price}
          variant="outlined"
          fullWidth
        />
        <TextField
          className={classes.formParts}
          error={toggleStatus("quantity").error}
          helperText={toggleStatus("quantity").helperText}
          id="quantity"
          name="quantity"
          label="Quantity"
          onChange={handleInputChange}
          type="number"
          value={values.quantity}
          variant="outlined"
          fullWidth
        />
        <TextField
          className={classes.formParts}
          error={toggleStatus("color").error}
          helperText={toggleStatus("color").helperText}
          id="color"
          name="color"
          label="Color"
          onChange={handleInputChange}
          value={values.color}
          variant="outlined"
          fullWidth
          select
        >
          {colors.map((c) => (
            <MenuItem key={c.value} value={c.value}>
              <div
                style={{
                  width: "1rem",
                  height: "1rem",
                  borderRadius: "50%",
                  border: `1px solid black ${c.value}`,
                  display: "inline",
                  marginRight: "1rem",
                  backgroundColor: c.value,
                }}
              />
              {c.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          className={classes.formParts}
          error={toggleStatus("category").error}
          helperText={toggleStatus("category").helperText}
          id="category"
          name="category"
          label="Category"
          onChange={handleInputChange}
          value={values.category}
          variant="outlined"
          fullWidth
          select
        >
          {categories.map((c) => (
            <MenuItem key={c._id} value={c._id} name={c.name}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>
        {!!values.category.length && (
          <TextField
            className={classes.formParts}
            disabled={toggleSubCategoryFormStatus().disable}
            error={toggleStatus().error}
            helperText={toggleStatus().helperText}
            id="subCategory"
            name="subCategory"
            label={toggleSubCategoryFormStatus().label}
            onChange={handleInputChange}
            value={values.subCategory}
            variant="outlined"
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
        <TextField
          className={classes.formParts}
          error={toggleStatus("brand").error}
          helperText={toggleStatus("brand").helperText}
          id="brand"
          name="brand"
          label="Brand name"
          onChange={handleInputChange}
          type="text"
          value={values.brand}
          variant="outlined"
          fullWidth
        />
        <Typography className={classes.formParts}>
          Product description
        </Typography>
        <RichTextField
          setValue={setDescription}
          characters={description}
          count={2000}
          loading={loading}
        />
        <Button variant="contained" type="submit" color="primary">
          Submit
        </Button>
      </Container>
    </Layout>
  );
};

export default ProductPage;
