import Layout from "../components/Layout";
import React, { useState, useEffect } from "react";
import ImageSelector from "../components/ImageSelector";
import {
  getImages,
  uploadImage,
  updateProduct,
} from "../services/productServices";
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
import { getObjectKeysSet } from "../util/getObjectKeysSet";
import { getVariations } from "../services/variationServices";
import { isArray } from "../util/isArray";
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

const EditProductPage = ({ location }) => {
  const classes = useStyles();
  const { user, product } = useSelector((state) => ({ ...state }));

  const [loading, setLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showVariations, setShowVariations] = useState(false);
  const [defaultDescriptionValue, setDefaultDescriptionValue] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [selectedVariationsData, setSelectedVariationsData] = useState([]);
  const [variationsData, setVariationsData] = useState([]);
  const [errors, setErrors] = useState(INITIAL_ERROR_STATE);
  const [showVariationDialog, setShowVariationDialog] =
    useState(INITIAL_DIALOG_STATE);
  const [images, setImages] = useState({});
  const [values, setValues] = useState(null);
  const [variations, setVariations] = useState(INITIAL_VARIATIONS_STATE);
  const [result, setResult] = useState(INITIAL_RESULT_STATE);
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(
    INITIAL_VARIATIONS_STATE
  );
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

  useEffect(() => {
    if (product === null) return;

    const initialProduct = { ...product };
    fetchImages(product._id);

    const initialVariations = [...product.variations];
    setVariations({ ...variations, instances: initialVariations });

    delete initialProduct.variations;

    setValues(initialProduct);
  }, [product]);

  const fetchImages = async (id) => {
    try {
      const { data } = await getImages(id, user);
      setImages(data);
    } catch (error) {
      console.log("fetching variations error", error);
    }
  };

  useEffect(() => {
    if (values === null) return;

    const defaultData = values.description;
    setDefaultDescriptionValue(defaultData);

    if (
      variations.instances.length &&
      !showVariations &&
      variationsData.length
    ) {
      setShowVariations(true);
      setSelectedVariationsData(getInitialVariationsData());
    }
  }, [values, variationsData, variations]);

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

  const handleSubmit = (e) => {
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
      const { data } = await updateProduct(finalizedData, user);
      // images = empty object means no images is chosen.
      // images = array no additional images are chosen.
      if (isEmptyObject(images) || isArray(images)) {
        return endWithSuccess();
      }
      const productId = data._id;
      [...images].forEach(async (i) => {
        try {
          await handleImageSubmit(i, productId);
          setValues(data);
          setDescription("");
          setImages({});
          endWithSuccess();
        } catch (error) {
          console.log(error);
          return endWithFailure(error);
        }
      });
    } catch (error) {
      console.log(error);
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

  if (values === null) return <div className="">loading...</div>;

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
              setImages={setImages}
              errors={errors.images}
              user={user}
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
            <CategorySelector
              errors={errors}
              setCategory={setCategory}
              defaultValue={values.category}
            />
            {!!values.category && (
              <SubCategorySelector
                errors={errors}
                setSubCategory={setSubCategory}
                parent={values.category}
                defaultValue={values.subCategory}
                category={category}
              />
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
                success={result.success}
                setValue={setDescription}
                characters={description}
                count={2000}
                loading={loading}
                label="Description"
                error={errors.description}
                defaultValue={defaultDescriptionValue}
              />
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: defaultDescriptionValue }}
              />
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
