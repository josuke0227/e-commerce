import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Grid } from "@material-ui/core";

import ImageSelector from "./ImageSelector";
import Variations from "./Variations";
import ConfirmDialog from "./shared/ConfirmDialog";
import Input from "./shared/Input";
import RichTextField from "./shared/RichTextField";
import ProductAttributes from "./ProductAttributes";

import { imageSchema } from "../schemas/imagesSchema";

import { getRawInputData } from "../util/getRawInputData";
import { isArray } from "../util/isArray";
import { isEmptyObject } from "../util/isEmptyObject";
import { resizeImage } from "../util/resizeImage";
import { validateVariationsQty } from "../util/validateVariationsQty";
import { getHelperText } from "../util/getHelperText";

import {
  deleteProduct,
  getImages,
  updateProduct,
  uploadImage,
} from "../services/productServices";
import { getCategories } from "../services/categoryServices";
import { getVariants } from "../services/variationServices";
import { getBrands } from "../services/brandsService";
import { pickByParentId } from "../services/subCategoryServices";
Joi.ObjectId = require("joi-objectid")(Joi);

const descriptionSchema = Joi.string().min(1).max(2000).label("Description");

const schema = Joi.object().keys({
  category: Joi.ObjectId().label("Category"),
  brand: Joi.ObjectId().label("Brand"),
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
    brand: "",
  });

  const [value, setValue] = useState({
    category: "",
    subCategory: "",
    brand: "",
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({ resolver: joiResolver(schema) });

  const quantity = watch("quantity");

  useEffect(() => {
    loadVariants();
  }, []);
  const loadVariants = async () => {
    try {
      const { data } = await getVariants();

      setVariants(data);
    } catch (error) {
      console.log("fetching variations error", error);
    }
  };

  useEffect(() => {
    const loadImages = async (id) => {
      try {
        const { data } = await getImages(id, user);
        setImages(data);
      } catch (error) {
        console.log("fetching variations error", error);
      }
    };

    if (product === null || user === null) return;

    const initialProduct = { ...product };
    const { _id, variations, description } = initialProduct;
    loadImages(_id);
    setDefaultDescriptionValue(description);

    if (variations.length > 0) setEnableVariations(true);
    const initialVariations = [...variations];
    setVariations(initialVariations);
  }, [product, user]);

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

    const { category, subCategory, brand } = value;
    const submittingData = {
      ...data,
      category: category ? category._id : "",
      subCategory: subCategory ? subCategory._id : "",
      brand: brand ? brand._id : "",
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
          errors={errors}
          type="text"
          name="title"
          control={control}
          defaultValue={product.title}
          variant="outlined"
          label="Product name"
          required
          fullWidth
        />
        <Input
          className={classes.formParts}
          errors={errors}
          type="number"
          name="price"
          control={control}
          defaultValue={product.price}
          variant="outlined"
          label="Price"
          required
          fullWidth
        />
        <Input
          className={classes.formParts}
          errors={errors}
          type="number"
          name="quantity"
          control={control}
          defaultValue={product.quantity}
          variant="outlined"
          label="Qty"
          required
          fullWidth
        />
        <ProductAttributes
          product={product}
          value={value}
          setValue={setValue}
          errors={otherErrors}
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
