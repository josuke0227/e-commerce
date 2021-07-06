import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import {
  Button,
  makeStyles,
  FormControl,
  FormControlLabel,
  Switch,
  FormHelperText,
  Grid,
} from "@material-ui/core";
import { getCategories } from "../services/categoryServices";
import { getVariants } from "../services/variationServices";
import { pickByParentId } from "../services/subCategoryServices";
import ImageSelector from "../components/ImageSelector";
import RichTextField from "../components/shared/RichTextField";
import VariationsDialog from "../components/VariationsDialog";
import ConfirmDialog from "../components/shared/ConfirmDialog";
import { imageSchema } from "../schemas/imagesSchema";
import { descriptionSchema, variationSchema } from "../schemas/productSchema";
import {
  getImages,
  uploadImage,
  updateProduct,
  deleteProduct,
} from "../services/productServices";
import { isEmptyObject } from "../util/isEmptyObject";
import { resizeImage } from "../util/resizeImage";
import Input from "../components/shared/Input";
import Select from "../components/shared/Select";
import VariationsPreview from "../components/shared/VariationsPreviewer";
import { isArray } from "../util/isArray";
Joi.ObjectId = require("joi-objectid")(Joi);

const schema = Joi.object().keys({
  title: Joi.string().min(1).max(255).label("Title"),
  price: Joi.number().min(1).label("Price"),
  qty: Joi.number().min(1).label("Quantity"),
  category: Joi.ObjectId().label("Category"),
  subCategory: Joi.ObjectId().label("Sub category"),
  brand: Joi.string().min(0).label("Brand"),
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

const ProductRegistrationForm = () => {
  const classes = useStyles();
  const { user, product } = useSelector((state) => ({ ...state }));

  const [categories, setCategories] = useState([]);

  const [subCategories, setSubCategories] = useState([]);
  const [defaultDescriptionValue, setDefaultDescriptionValue] = useState("");
  const [showEditor, setShowEditor] = useState(false);

  const [images, setImages] = useState([]);

  const [variants, setVariants] = useState([]);
  const [variations, setVariations] = useState([]);
  const [currentVariants, setCurrentVariants] = useState([]);
  const [enableVariations, setEnableVariations] = useState(false);
  const [showVariationDialog, setShowVariationDialog] = useState(false);

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [showVariationResetDialog, setShowVariationResetDialog] =
    useState(INITIAL_DIALOG_STATE);
  const [showSubmissionDialog, setShowSubmissionDialog] =
    useState(INITIAL_DIALOG_STATE);
  const [result, setResult] = useState({ success: null, message: "" });
  const [finalizedData, setFinalizedData] = useState(null);
  const [values, setValues] = useState(null);
  // For inputs are not using react-hook-form
  const [otherErrors, setOtherErrors] = useState({
    images: "",
    description: "",
    variations: "",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({ resolver: joiResolver(schema) });

  const category = watch("category");
  const quantity = watch("qty");

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
    const { _id, variations, description } = initialProduct;
    loadImages(_id);
    setDefaultDescriptionValue(description);

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
    loadSubCategories(category);
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

  const onSwitch = () => {
    if (enableVariations && variations.length) {
      return setShowVariationResetDialog({
        message: "All changes are lost. Are you sure to disable variations?",
        show: true,
      });
    }
    setEnableVariations(!enableVariations);
    setCurrentVariants([]);
  };

  const handleConfirm = () => {
    setShowVariationResetDialog({ ...showVariationDialog, show: false });
    setVariations([]);
    setCurrentVariants([]);
  };

  const handleCancel = () => {
    setShowVariationResetDialog({ ...showVariationDialog, show: false });
  };

  const handleSubmissionConfirm = () => {
    doSubmit();
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

  const handleSubmissionCancel = () => {
    setShowSubmissionDialog({ message: "", show: false });
    setResult({ message: "", success: null });
  };

  const endWithSuccess = () => {
    setResult({ ...result, success: true });
    setLoading(false);
  };

  const endWithFailure = (error) => {
    setResult({ message: error.message, success: false });
    setLoading(false);
  };

  const onSubmit = async (data, e) => {
    if (variations.length) {
      const { error } = variationSchema.validate(variations);
      if (error)
        return setOtherErrors({ ...otherErrors, variations: error.message });
    }

    const { error } = descriptionSchema.validate(
      description || defaultDescriptionValue
    );
    if (error)
      return setOtherErrors({ ...otherErrors, description: error.message });

    const submittingData = {
      ...data,
      description,
      variations,
      slug: product.slug,
    };

    setFinalizedData(submittingData);
    setShowSubmissionDialog({
      show: true,
      message: "Are you sure to submit?",
    });
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
          name="qty"
          control={control}
          defaultValue={product.quantity}
          variant="outlined"
          label="Qty"
          helperText={hasError("qty") && errors.qty.message}
          error={hasError("qty")}
          required
          fullWidth
        />
        {categories && (
          <Select
            className={classes.formParts}
            name="category"
            control={control}
            defaultValue={product.category._id}
            variant="outlined"
            label="Category"
            helperText={hasError("category") && errors.category.message}
            error={hasError("category")}
            list={categories}
            required
            fullWidth
          />
        )}
        {category && (
          <Select
            className={classes.formParts}
            name="subCategory"
            control={control}
            defaultValue={product.subCategory._id}
            variant="outlined"
            label="Subcategory"
            helperText={hasError("subCategory") && errors.subCategory.message}
            error={hasError("subCategory")}
            list={subCategories}
            required
            fullWidth
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
        {variations.length > 0 && (
          <>
            <FormControl component="fieldset" className={classes.formParts}>
              <FormControlLabel
                label="Enable variations"
                control={
                  <Switch
                    checked={enableVariations}
                    onChange={onSwitch}
                    color="primary"
                  />
                }
              />
              <FormHelperText error>{otherErrors.variations}</FormHelperText>
            </FormControl>
            <VariationsPreview variations={variations} />
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={() => setShowVariationDialog(true)}
            >
              Edit variations
            </Button>
          </>
        )}
        {enableVariations && (
          <VariationsDialog
            quantity={quantity}
            showDialog={showVariationDialog}
            setShowVariationDialog={setShowVariationDialog}
            variations={variations}
            variants={variants}
            setVariations={setVariations}
            currentVariants={currentVariants}
            setCurrentVariants={setCurrentVariants}
            otherErrors={otherErrors}
            setOtherErrors={setOtherErrors}
          />
        )}
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
      </form>
    </>
  );
};

export default ProductRegistrationForm;
