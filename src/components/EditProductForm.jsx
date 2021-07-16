import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { Button, makeStyles, Grid } from "@material-ui/core";

import ImageSelector from "./ImageSelector";
import Variations from "./Variations";
import ConfirmDialog from "./shared/ConfirmDialog";
import Input from "./shared/Input";
import MultiPurposeAutoCompleteForm from "./shared/MultiPurposeAutoCompleteForm";
import RichTextField from "./shared/RichTextField";

import { imageSchema } from "../schemas/imagesSchema";

import { getRawInputData } from "../util/getRawInputData";
import { isArray } from "../util/isArray";
import { isEmptyObject } from "../util/isEmptyObject";
import { resizeImage } from "../util/resizeImage";
import { validateVariationsQty } from "../util/validateVariationsQty";

import { getCategories } from "../services/categoryServices";
import { getVariants } from "../services/variationServices";
import {
  deleteProduct,
  getImages,
  updateProduct,
  uploadImage,
} from "../services/productServices";
import { pickByParentId } from "../services/subCategoryServices";
Joi.ObjectId = require("joi-objectid")(Joi);

const descriptionSchema = Joi.string().min(1).max(2000).label("Description");

const schema = Joi.object().keys({
  brand: Joi.string().min(0).label("Brand"),
  category: Joi.ObjectId().label("Category"),
  description: Joi.string().label("Description"),
  price: Joi.number().min(1).label("Price"),
  quantity: Joi.number().min(1).label("Quantity"),
  subCategory: Joi.ObjectId().label("Sub category"),
  title: Joi.string().min(1).max(255).label("Title"),
  variations: Joi.array().optional().label("Variations"),
});

const INITIAL_DIALOG_STATE = {
  show: false,
  message: "",
};

const useStyles = makeStyles((theme) => ({
  formParts: {
    marginBottom: theme.spacing(3),
  },
  firstFormParts: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
}));

const EditProductForm = () => {
  const classes = useStyles();
  const { user, product } = useSelector((state) => ({ ...state }));
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState();
  const [subCategories, setSubCategories] = useState([]);
  const [subCategory, setSubCategory] = useState();
  const [defaultDescriptionValue, setDefaultDescriptionValue] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [variations, setVariations] = useState([]);
  const [enableVariations, setEnableVariations] = useState(false);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSubmissionDialog, setShowSubmissionDialog] =
    useState(INITIAL_DIALOG_STATE);
  const [result, setResult] = useState({ success: null, message: "" });
  const [finalizedData, setFinalizedData] = useState(null);
  // For inputs are not using react-hook-form
  const [otherErrors, setOtherErrors] = useState({
    images: "",
    description: "",
    variations: "",
    category: "",
    subCategory: "",
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({ resolver: joiResolver(schema) });

  const quantity = watch("quantity");

  useEffect(() => {
    loadCategories();
    loadVariants();
  }, []);
  const loadCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(data);
    } catch (error) {
      console.log("category fetching error", error);
    }
  };

  const loadVariants = async () => {
    try {
      const { data } = await getVariants();

      setVariants(data);
    } catch (error) {
      console.log("fetching variations error", error);
    }
  };

  useEffect(() => {
    if (product === null) return;

    const initialProduct = { ...product };
    const {
      _id,
      variations,
      description,
      category: defaultCategory,
      subCategory,
    } = initialProduct;
    loadImages(_id);
    setDefaultDescriptionValue(description);
    setCategory(defaultCategory);
    setSubCategory(subCategory);

    if (variations.length > 0) setEnableVariations(true);

    const initialVariations = [...variations];
    setVariations(initialVariations);
  }, [product]);
  const loadImages = async (id) => {
    try {
      const { data } = await getImages(id, user);
      setImages(data);
    } catch (error) {
      console.log("fetching variations error", error);
    }
  };

  useEffect(() => {
    if (!category) return;
    if (subCategory) setSubCategory();
    loadSubCategories(category._id);
  }, [category]);
  const loadSubCategories = async (id) => {
    if (!id) return;

    try {
      const { data } = await pickByParentId(id);
      setSubCategories(data);
    } catch (error) {
      console.log("sub categories fetching error", error);
    }
  };

  const onSubmit = async (data, e) => {
    e.stopPropagation();

    if (enableVariations) {
      const variationsQuantityError = validateVariationsQty(
        variations,
        quantity
      );
      if (variationsQuantityError) {
        return setOtherErrors({
          ...otherErrors,
          variations: variationsQuantityError,
        });
      }
    }

    const finalDescriptionData = showEditor ? description : product.description;
    const rawInputData = getRawInputData(finalDescriptionData);
    const { error } = descriptionSchema.validate(rawInputData);
    if (error)
      return setOtherErrors({ ...otherErrors, description: error.message });

    const submittingData = {
      ...data,
      category: category ? category._id : "",
      subCategory: subCategory ? subCategory._id : "",
      description: finalDescriptionData,
      variations,
    };

    setFinalizedData(submittingData);
    setShowSubmissionDialog({
      show: true,
      message: "Are you sure to submit?",
    });
  };

  const handleSubmissionCancel = () => {
    setShowSubmissionDialog({ message: "", show: false });
    setResult({ message: "", success: null });
  };

  const handleSubmissionConfirm = () => {
    doSubmit();
  };

  const doSubmit = async () => {
    setLoading(true);
    try {
      finalizedData.slug = product.slug;
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
      console.log(error);
      endWithFailure(error);
    }
  };

  const handleImageSubmit = async (image, productId) => {
    const resizedImageUri = await resizeImage(image);
    const { error } = imageSchema.validate(resizedImageUri);
    if (error) throw new Error("Invalid image URI.");
    await uploadImage(resizedImageUri, productId, user);
  };

  const endWithSuccess = () => {
    setResult({ ...result, success: true });
    setLoading(false);
  };

  const endWithFailure = (error) => {
    setResult({ message: error.message, success: false });
    setLoading(false);
  };

  const hasError = (name) => {
    if (Object.keys(errors).length) {
      return !!errors[name];
    }
    return false;
  };

  if (product === null) return <div className="">Loading...</div>;
  return (
    <>
      <ConfirmDialog
        handleConfirm={handleSubmissionConfirm}
        handleCancel={handleSubmissionCancel}
        showDialog={showSubmissionDialog}
        result={result}
        loading={loading}
      />
      <form onSubmit={handleSubmit(onSubmit)} style={{ margin: "1rem" }}>
        <ImageSelector
          images={images}
          setImages={setImages}
          errors={errors.images}
          user={user}
        />
        <Input
          className={classes.firstFormParts}
          type="text"
          name="title"
          control={control}
          defaultValue={product.title}
          variant="outlined"
          label="Product name"
          helperText={hasError("title") && errors.title.message}
          error={hasError("title")}
          required
          fullWidth
        />
        <Input
          className={classes.formParts}
          type="number"
          name="price"
          control={control}
          defaultValue={product.price}
          variant="outlined"
          label="Price"
          helperText={hasError("price") && errors.price.message}
          error={hasError("price")}
          required
          fullWidth
        />
        <Input
          className={classes.formParts}
          type="number"
          name="quantity"
          control={control}
          defaultValue={product.quantity}
          variant="outlined"
          label="Qty"
          helperText={hasError("quantity") && errors.quantity.message}
          error={hasError("quantity")}
          required
          fullWidth
        />
        {categories.length > 0 && (
          <MultiPurposeAutoCompleteForm
            options={categories}
            value={category}
            setValue={setCategory}
            label="Category"
            error={otherErrors.category}
          />
        )}
        {category && (
          <MultiPurposeAutoCompleteForm
            options={subCategories}
            value={subCategory}
            setValue={setSubCategory}
            label="Sub category"
            error={otherErrors.subCategory}
          />
        )}
        <Input
          className={classes.formParts}
          type="text"
          name="brand"
          control={control}
          defaultValue={product.brand}
          variant="outlined"
          label="Brand name"
          helperText={hasError("brand") && errors.brand.message}
          error={hasError("brand")}
          required
          fullWidth
        />
        <Variations
          quantity={quantity}
          variations={variations}
          setVariations={setVariations}
          variants={variants}
          setVariants={setVariants}
          error={otherErrors.variations}
          setOtherErrors={setOtherErrors}
          enableVariations={enableVariations}
          setEnableVariations={setEnableVariations}
        />
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
              error={otherErrors.description}
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
      </form>
    </>
  );
};

export default EditProductForm;
