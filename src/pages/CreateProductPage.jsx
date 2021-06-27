import Layout from "../components/Layout";
import React, { useState, useEffect } from "react";
import ImageSelector from "../components/ImageSelector";
import { createProduct, uploadImage } from "../services/productServices";
import {
  TextField,
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
import VariationField from "../components/VariationField";
import { isEqual } from "../util/isEqual";
import ConfirmDialog from "../components/shared/ConfirmDialog";
import { deleteProduct } from "../services/productServices";
import { getVariations } from "../services/variationServices";
import CategorySelector from "../components/CategorySelector";
import SubCategorySelector from "../components/SubCategorySelector";

const useStyles = makeStyles((theme) => ({
  formParts: {
    marginTop: theme.spacing(3),
  },
  slideButton: {
    marginBottom: theme.spacing(1),
  },
}));

const INITIAL_STATE = {
  title: "test",
  price: 1,
  quantity: 1,
  variations: [],
  category: "60c00dbf4cb336f57aff244b",
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

const INITIAL_DIALOG_STATE = {
  show: false,
  message: "",
};

const INITIAL_RESULT_STATE = { success: null, message: "" };

const CreateProductPage = ({ location }) => {
  const classes = useStyles();
  const { user } = useSelector((state) => ({ ...state }));

  const [loading, setLoading] = useState(false);
  const [showVariations, setShowVariations] = useState(false);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [selectedVariationsData, setSelectedVariationsData] = useState([]);
  const [variationsData, setVariationsData] = useState([]);
  const [values, setValues] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState(INITIAL_ERROR_STATE);
  const [showVariationDialog, setShowVariationDialog] =
    useState(INITIAL_DIALOG_STATE);
  const [showSubmissionDialog, setShowSubmissionDialog] =
    useState(INITIAL_DIALOG_STATE);
  const [images, setImages] = useState({});
  const [result, setResult] = useState(INITIAL_RESULT_STATE);
  const [variations, setVariations] = useState(INITIAL_VARIATIONS_STATE);

  // To get the ref of submitting data when submitting dialog is confirmed.
  const [finalizedData, setFinalizedData] = useState(null);

  useEffect(() => {
    fetchVariationsData();
  }, []);

  const fetchVariationsData = async () => {
    try {
      const { data } = await getVariations();
      setVariationsData(data);
    } catch (error) {
      console.log("fetching variations error", error);
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

  const handleSubmissionConfirm = () => {
    doSubmit();
  };

  const handleSubmissionCancel = () => {
    setShowSubmissionDialog({ message: "", show: false });
    setResult({ message: "", success: null });
  };

  const doSubmit = async () => {
    setLoading(true);

    try {
      const { data } = await createProduct(finalizedData, user);

      if (isEmptyObject(images)) {
        return endWithSuccess();
      }
      const productId = data._id;
      [...images].forEach(async (i) => {
        try {
          await handleImageSubmit(i, productId);
          setValues(INITIAL_STATE);
          setDescription("");
          setImages({});
          endWithSuccess();
        } catch (error) {
          try {
            await deleteProduct(data, user);
            endWithFailure(error);
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

  const endWithSuccess = () => {
    setResult({ ...result, success: true });
    setLoading(false);
  };

  const endWithFailure = (error) => {
    setResult({ message: error.message, success: false });
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { instances } = variations;

    if (instances.length) {
      const { error } = variationSchema.validate(instances);
      if (error) return setErrors({ ...errors, variations: error.message });
    }

    const submittingData = {
      ...values,
      // Let Joi validator know if categories are empty or not.
      category: category ? category._id : "",
      subCategory: subCategory ? subCategory._id : "",
      description: description || values.description,
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

    setFinalizedData(submittingData);
    setShowSubmissionDialog({ show: true, message: "Are you sure to submit?" });
  };

  const handleImageSubmit = async (image, productId) => {
    const resizedImageUri = await resizeImage(image);
    const { error } = imageSchema.validate(resizedImageUri);
    if (error) throw new Error("Invalid image URI.");
    await uploadImage(resizedImageUri, productId, user);
  };

  const handleCheckboxClick = () => {
    setShowVariations(true);
    if (showVariations && variations.instances.length) {
      setShowVariationDialog({
        message: "All changes are lost. Are you sure to disable variations?",
        show: true,
      });
    }
  };

  const handleConfirm = () => {
    setShowVariationDialog({ ...showVariationDialog, show: false });
    setVariations(INITIAL_VARIATIONS_STATE);
    setShowVariations(false);
    setSelectedVariationsData([]);
  };

  const handleCancel = () => {
    setShowVariationDialog({ ...showVariationDialog, show: false });
  };

  const toggleStatus = (path) => {
    if (errors[path]) return { error: true, helperText: errors[path] };

    return { error: false, helperText: "" };
  };

  return (
    <Layout location={location}>
      <ConfirmDialog
        handleConfirm={handleConfirm}
        handleCancel={handleCancel}
        showDialog={showVariationDialog}
        result={result}
      />
      <ConfirmDialog
        handleConfirm={handleSubmissionConfirm}
        handleCancel={handleSubmissionCancel}
        showDialog={showSubmissionDialog}
        result={result}
        loading={loading}
      />
      <Container component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <ImageSelector
              images={images}
              setValues={setImages}
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
            <CategorySelector errors={errors} setCategory={setCategory} />
            <SubCategorySelector
              errors={errors}
              setSubCategory={setSubCategory}
              parent={values.category}
              category={category}
            />
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
              success={result.success}
              setValue={setDescription}
              characters={description}
              count={2000}
              loading={loading}
              label="Description"
              error={errors.description}
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
