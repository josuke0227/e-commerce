import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

import ImageSelector from "./ImageSelector";
import Input from "./shared/Input";
import Variations from "./Variations";
import ConfirmDialog from "./shared/ConfirmDialog";
import MultiPurposeAutoCompleteForm from "./shared/MultiPurposeAutoCompleteForm";
import RichTextField from "./shared/RichTextField";

import { imageSchema } from "../schemas/imagesSchema";

import { getRawInputData } from "../util/getRawInputData";
import { isEmptyObject } from "../util/isEmptyObject";
import { resizeImage } from "../util/resizeImage";
import { validateVariationsQty } from "../util/validateVariationsQty";
import { getHelperText } from "../util/getHelperText";

import {
  createProduct,
  deleteProduct,
  uploadImage,
} from "../services/productServices";
import { getBrands } from "../services/brandsService";
import { getCategories } from "../services/categoryServices";
import { getVariants } from "../services/variationServices";
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

const CreateProductForm = () => {
  const classes = useStyles();
  const { user } = useSelector((state) => ({ ...state }));
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState();
  const [subCategories, setSubCategories] = useState([]);
  const [subCategory, setSubCategory] = useState();
  const [brands, setBrands] = useState([]);
  const [brand, setBrand] = useState();
  const [images, setImages] = useState([]);
  const [variations, setVariations] = useState([]);
  const [variants, setVariants] = useState([]);
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
    loadBrands();
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
  const loadBrands = async () => {
    try {
      const { data } = await getBrands();
      setBrands(data);
    } catch (error) {
      console.log("fetching brands error", error);
    }
  };

  useEffect(() => {
    if (!category) return;
    setSubCategory();
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

    const rawInputData = getRawInputData(description);
    const { error } = descriptionSchema.validate(rawInputData);
    if (error)
      return setOtherErrors({ ...otherErrors, description: error.message });

    const submittingData = {
      ...data,
      category: category ? category._id : "",
      subCategory: subCategory ? subCategory._id : "",
      brand: brand ? brand._id : "",
      description,
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
      const { data } = await createProduct(finalizedData, user);

      if (isEmptyObject(images)) {
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
    const message = error.response.data || "Operation failed.";
    setResult({ message, success: false });
    setLoading(false);
  };

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
          className={classes.formParts}
          images={images}
          setImages={setImages}
          errors={otherErrors.images}
          user={user}
        />
        <Input
          className={classes.firstFormParts}
          errors={errors}
          type="text"
          name="title"
          control={control}
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
          variant="outlined"
          label="Qty"
          required
          fullWidth
        />
        {categories.length > 0 && (
          <MultiPurposeAutoCompleteForm
            options={categories}
            value={category}
            setValue={setCategory}
            setOptions={setCategories}
            label="Category"
            name="category"
            error={otherErrors.category}
          />
        )}
        {category && (
          <MultiPurposeAutoCompleteForm
            options={subCategories}
            value={subCategory}
            setValue={setSubCategory}
            setOptions={setSubCategories}
            dependency={category}
            label="Sub category"
            name="subCategory"
            error={otherErrors.subCategory}
          />
        )}
        <MultiPurposeAutoCompleteForm
          options={brands}
          value={brand}
          setValue={setBrand}
          setOptions={setBrands}
          label="Brands"
          name="brand"
          error={otherErrors.brands}
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
        <RichTextField
          success={result.success}
          setValue={setDescription}
          characters={description}
          count={2000}
          loading={loading}
          label="Description"
          error={otherErrors.description}
        />
        <Button fullWidth variant="contained" type="submit" color="primary">
          Submit
        </Button>
      </form>
    </>
  );
};

export default CreateProductForm;
