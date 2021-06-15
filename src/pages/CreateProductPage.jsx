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

const useStyles = makeStyles((theme) => ({
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

const signature = {
  brand: "",
  category: "",
  color: "",
  description: "",
  images: {},
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

const CreateProductPage = ({ location }) => {
  const [values, setValues] = useState(initialState);
  const [description, setDescription] = useState("");
  const [error, setError] = useState(signature);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [open, setOpen] = useState(false);
  const [submittingError, setSubmittingError] = useState("");

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [images, setImages] = useState({});

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
    setLoading(true);
    setOpen(true);

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

      if (isEmptyObject(images)) {
        setSuccess(true);
        setLoading(false);
        return;
      }
      const productId = data._id;
      [...images].forEach(async (i) => {
        try {
          await handleImageSubmit(i, productId);
          setValues(initialState);
          setDescription("");
          setImages({});
          setSuccess(true);
          setLoading(false);
        } catch (error) {
          console.log(`error`, error);
          // TODO: send delete requiest to delete product data.
          setSuccess(false);
          setLoading(false);
          setSubmittingError("Product creation failed.");
        }
      });
    } catch (error) {
      setSuccess(false);
      setLoading(false);
      setSubmittingError(error.response.data || "Failed to create product.");
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
      <ModalWithLoader
        loading={loading}
        success={success}
        open={open}
        setOpen={setOpen}
        submittingError={submittingError}
      />
      <Container component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
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
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
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
          </Grid>
          <Grid item xs={12} md={6}>
            <RichTextField
              success={success}
              setValue={setDescription}
              characters={description}
              count={2000}
              loading={loading}
              label="Description"
            />
            <Button fullWidth variant="contained" type="submit" color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default CreateProductPage;
