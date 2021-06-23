import Layout from "../components/Layout";
import React, { useState, useEffect } from "react";
import { getCategories } from "../services/categoryServices";
import { pickByParentId } from "../services/subCategoryServices";
import ImageSelector from "../components/ImageSelector";
import {
  createProduct,
  getImages,
  uploadImage,
} from "../services/productServices";
import {
  TextField,
  MenuItem,
  Container,
  makeStyles,
  Button,
  Grid,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import { resizeImage } from "../util/resizeImage";
import {
  productSchema,
  productSchemas,
  variationSchema,
} from "../schemas/productSchema";
import { imageSchema } from "../schemas/imagesSchema";
import RichTextField from "../components/shared/RichTextField";
import { isEmptyObject } from "../util/isEmptyObject";
import ModalWithLoader from "../components/ModalWithLoader";
import VariationField from "../components/VariationField";
import { isEqual } from "../util/isEqual";
import ConfirmDialog from "../components/shared/ConfirmDialog";
import { deleteProduct } from "../services/productServices";
import { getObjectKeysSet } from "../util/getObjectKeysSet";
import { getVariations } from "../services/variationServices";

const useStyles = makeStyles((theme) => ({
  formParts: {
    marginTop: theme.spacing(3),
  },
  slideButton: {
    marginBottom: theme.spacing(1),
  },
}));

const initialState = {
  title: "test",
  price: 1,
  quantity: 1,
  variations: [],
  // category: "60c00dbf4cb336f57aff244b",
  category: {
    _id: { $oid: "60c00dbf4cb336f57aff244b" },
    name: "Stationary",
    slug: "Stationary",
    createdAt: { $date: "2021-06-03T00:21:52.278Z" },
    updatedAt: { $date: "2021-06-08T07:05:06.449Z" },
    __v: 0,
  },
  subCategory: "60b85ba36fc3f936c09728b1",
  brand: "toshiba",
};

const INITIAL_ERROR_STATE = {
  images: "",
  title: "",
  price: "",
  quantity: "",
  variations: "",
  category: "",
  subCategory: "",
  brand: "",
  description: "",
};

const INITIAL_VARIATIONS_STATE = {
  instances: [],
};

const EditProductPage = ({ location }) => {
  const classes = useStyles();
  const { user, product } = useSelector((state) => ({ ...state }));

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showVariations, setShowVariations] = useState(false);
  const [success, setSuccess] = useState(null);
  const [defaultValue, setDefaultValue] = useState("");
  const [description, setDescription] = useState("");
  const [submittingError, setSubmittingError] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedVariationsData, setSelectedVariationsData] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [variationsData, setVariationsData] = useState([]);
  const [errors, setErrors] = useState(INITIAL_ERROR_STATE);
  const [images, setImages] = useState({});
  const [values, setValues] = useState(null);
  const [variations, setVariations] = useState(INITIAL_VARIATIONS_STATE);

  useEffect(() => {
    fetchVariations();
  }, []);

  const fetchVariations = async () => {
    try {
      const { data } = await getVariations();
      setVariationsData(data);
    } catch (error) {
      console.log("fetching variations error", error);
    }
  };

  useEffect(() => {
    loadCategories();

    if (product) {
      const initialProduct = { ...product };
      const initialVariations = [...product.variations];
      delete initialProduct.variations;

      setValues(initialProduct);
      setVariations({ ...variations, instances: initialVariations });
      fetchImages(product._id);
    }
  }, [product]);

  const fetchImages = async (id) => {
    try {
      const { data } = await getImages(id, user);
      setImages(data);
      console.log(data);
    } catch (error) {
      console.log("fetching variations error", error);
    }
  };

  useEffect(() => {
    if (
      variations.instances.length &&
      !showVariations &&
      variationsData.length
    ) {
      setShowVariations(true);
      setSelectedVariationsData(getInitialVariationsData());
    }
  }, [values, variationsData, variations]);

  useEffect(() => {
    const id = switchValue("category");
    loadSubcategories(id);

    if (values) {
      const defaultData = values.description;
      setDefaultValue(defaultData);
    }
  }, [values]);

  const getInitialVariationsData = () => {
    const keys = getObjectKeysSet(variations.instances);
    keys.splice(keys.indexOf("qty"), 1);

    const initialVariationsData = [];
    variationsData.forEach((vD) =>
      keys.forEach((k) => {
        if (vD.name === k) initialVariationsData.push(vD);
      })
    );
    return initialVariationsData;
  };

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
    setErrors(INITIAL_ERROR_STATE);
    const { name, value } = e.target;
    const { error } = productSchemas[name].validate(value);
    if (error) setErrors({ ...errors, [name]: error.message });

    if (name === "price" || name === "quantity") {
      const int = parseInt(value);
      return setValues({ ...values, [name]: int });
    }

    setValues({ ...values, [name]: value });
  };

  const handleVariationSelect = (variation) => {
    const currentData = [...selectedVariationsData];
    for (let data of currentData) {
      if (isEqual(data, variation)) return;
    }

    setSelectedVariationsData([...selectedVariationsData, variation]);
  };

  const handleVariationDeSelect = (name, index) => {
    const currentData = [...selectedVariationsData];
    currentData.splice(index, 1);
    setSelectedVariationsData(currentData);

    const currentVariations = { ...variations };
    delete currentVariations[name];
    setVariations(currentVariations);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOpen(true);

    const { instances } = variations;

    if (instances.length) {
      const result = variationSchema.validate(instances);
    }

    const submittingData = {
      ...values,
      description,
      variations: instances,
    };

    const result = productSchema.validate(submittingData, {
      abortEarly: false,
    });

    if (result.error) {
      let updatedError = { ...errors };
      result.error.details.forEach((e) => {
        const { path, message } = e;
        updatedError = { ...updatedError, [path[0]]: message };
      });
      return setErrors(updatedError);
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
          try {
            await deleteProduct(data, user);
          } catch (error) {
            endWithFailure(error);
          }
          endWithFailure(error);
        }
      });
    } catch (error) {
      endWithFailure(error);
    }
  };

  const endWithFailure = (error) => {
    setSuccess(false);
    setLoading(false);
    setSubmittingError(error.message || "Product creation failed.");
  };

  const handleImageSubmit = async (image, productId) => {
    const resizedImageUri = await resizeImage(image);
    const { error } = imageSchema.validate(resizedImageUri);
    if (error) throw new Error("Invalid image URI.");
    await uploadImage(resizedImageUri, productId, user);
  };

  const handleCheckboxClick = () => {
    setShowVariations(!showVariations);
    if (showVariations && variations.instances.length) {
      setShowDialog(true);
    }
  };

  const handleConfirm = () => {
    setShowDialog(false);
    setVariations(INITIAL_VARIATIONS_STATE);
    setShowVariations(false);
    setSelectedVariationsData([]);
  };

  const handleCancel = () => {
    setShowDialog(false);
    setShowVariations(false);
  };

  const toggleSubCategoryFormStatus = () => {
    if (!subCategories.length) {
      return { label: "No sub category registered.", disable: true };
    }

    return { label: "Sub category", disable: false };
  };

  const toggleStatus = (path) => {
    if (errors[path]) return { error: true, helperText: errors[path] };

    return { error: false, helperText: "" };
  };

  const switchValue = (path) => {
    if (values === null) return;
    if (typeof values[path] === "object") return values[path]._id;
    return values[path];
  };

  const dialogMessage =
    "All changes are lost. Are you sure to disable variations?";

  if (values === null) return <div className="">loading...</div>;

  return (
    <Layout location={location}>
      <ModalWithLoader
        loading={loading}
        success={success}
        open={open}
        setOpen={setOpen}
        submittingError={submittingError}
      />
      <ConfirmDialog
        handleConfirm={handleConfirm}
        handleCancel={handleCancel}
        showDialog={showDialog}
        message={dialogMessage}
      />
      <Container component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <ImageSelector
              images={images}
              setImages={setImages}
              setLoading={setLoading}
              error={errors.images}
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
            <VariationField
              showVariations={showVariations}
              handleCheckboxClick={handleCheckboxClick}
              errors={errors}
              setErrors={setErrors}
              variations={variations}
              setVariations={setVariations}
              values={values}
              handleVariationSelect={handleVariationSelect}
              handleVariationDeSelect={handleVariationDeSelect}
              selectedVariationsData={selectedVariationsData}
              variationsData={variationsData}
            />
            <TextField
              className={classes.formParts}
              error={toggleStatus("category").error}
              helperText={toggleStatus("category").helperText}
              id="category"
              name="category"
              label="Category"
              onChange={handleInputChange}
              value={switchValue("category")}
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
            {!!values.category && (
              <TextField
                className={classes.formParts}
                disabled={toggleSubCategoryFormStatus().disable}
                error={toggleStatus().error}
                helperText={toggleStatus().helperText}
                id="subCategory"
                name="subCategory"
                label={toggleSubCategoryFormStatus().label}
                onChange={handleInputChange}
                value={switchValue("subCategory")}
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
            {!showEditor && (
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setShowEditor(true)}
              >
                Edit description
              </Button>
            )}

            {showEditor ? (
              <RichTextField
                success={success}
                setValue={setDescription}
                characters={description}
                count={2000}
                loading={loading}
                label="Description"
                error={errors.description}
                defaultValue={defaultValue}
              />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: defaultValue }} />
            )}
            <Button fullWidth variant="contained" type="submit" color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Layout>
  );
};

export default EditProductPage;
