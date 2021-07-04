import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import {
  TextField,
  MenuItem,
  Button,
  makeStyles,
  FormControl,
  FormControlLabel,
  Switch,
  FormHelperText,
} from "@material-ui/core";
import { getCategories } from "../services/categoryServices";
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
  createProduct,
  deleteProduct,
} from "../services/productServices";
import { isEmptyObject } from "../util/isEmptyObject";
import { resizeImage } from "../util/resizeImage";
Joi.ObjectId = require("joi-objectid")(Joi);

const schema = Joi.object().keys({
  title: Joi.string().min(1).max(255).label("Title"),
  price: Joi.number().min(1).label("Price"),
  quantity: Joi.number().min(1).label("Quantity"),
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
}));

const ProductRegistrationForm = () => {
  const classes = useStyles();
  const { user, product } = useSelector((state) => ({ ...state }));

  const [categories, setCategories] = useState([]);

  const [subCategories, setSubCategories] = useState([]);

  const [images, setImages] = useState([]);

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
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: joiResolver(schema) });

  const category = watch("category");
  const quantity = watch("quantity");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(data);
    } catch (error) {
      console.log("category fetching error", error);
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

  const handleCheckboxClick = () => {
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
    setEnableVariations(false);
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
    e.stopPropagation();
    if (variations.length) {
      const { error } = variationSchema.validate(variations);
      if (error)
        return setOtherErrors({ ...otherErrors, variations: error.message });
    }

    const { error } = descriptionSchema.validate(description);
    if (error)
      return setOtherErrors({ ...otherErrors, description: error.message });

    const submittingData = {
      ...data,
      description,
      variations,
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

  return (
    <>
      <ConfirmDialog
        handleConfirm={handleConfirm}
        handleCancel={handleCancel}
        showDialog={showVariationResetDialog}
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
          className={classes.formParts}
          images={images}
          setImages={setImages}
          errors={otherErrors.images}
          user={user}
        />
        <TextField
          className={classes.formParts}
          error={hasError("title")}
          helperText={hasError("title") && errors.title.message}
          id="title"
          name="title"
          label="Product name"
          type="text"
          variant="outlined"
          {...register("title")}
          required
          fullWidth
        />
        <TextField
          className={classes.formParts}
          error={hasError("price")}
          helperText={hasError("price") && errors.price.message}
          id="price"
          name="price"
          label="Price"
          type="number"
          variant="outlined"
          {...register("price")}
          required
          fullWidth
        />
        <TextField
          className={classes.formParts}
          error={hasError("quantity")}
          helperText={hasError("quantity") && errors.price.message}
          id="quantity"
          name="quantity"
          label="Quantity"
          type="number"
          variant="outlined"
          {...register("quantity")}
          required
          fullWidth
        />
        <TextField
          className={classes.formParts}
          error={hasError("category")}
          helperText={hasError("category") && errors.category.message}
          id="category"
          name="category"
          label="Category"
          variant="outlined"
          {...register("category")}
          required
          fullWidth
          select
        >
          {categories.map((c) => (
            <MenuItem key={c._id} value={c._id} name={c.name}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>
        {category && (
          <TextField
            className={classes.formParts}
            error={hasError("subCategory")}
            helperText={hasError("subCategory") && errors.category.message}
            id="subCategory"
            name="subCategory"
            label="Sub Category"
            variant="outlined"
            {...register("subCategory")}
            required
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
          error={hasError("brand")}
          helperText={hasError("brand") && errors.brand.message}
          id="brand"
          name="brand"
          label="Brand name"
          type="text"
          variant="outlined"
          {...register("brand")}
          required
          fullWidth
        />
        <FormControl component="fieldset" className={classes.formParts}>
          <FormControlLabel
            label="Enable variations"
            control={
              <Switch
                checked={enableVariations}
                onChange={handleCheckboxClick}
                color="primary"
              />
            }
          />
          <FormHelperText error>{otherErrors.variations}</FormHelperText>
          {enableVariations && (
            <VariationsDialog
              quantity={quantity}
              showDialog={showVariationDialog}
              setShowVariationDialog={setShowVariationDialog}
              variations={variations}
              setVariations={setVariations}
              currentVariants={currentVariants}
              setCurrentVariants={setCurrentVariants}
              otherErrors={otherErrors}
              setOtherErrors={setOtherErrors}
            />
          )}
        </FormControl>
        {enableVariations && currentVariants.length > 0 && (
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={() => setShowVariationDialog(true)}
          >
            Add variations
          </Button>
        )}
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

export default ProductRegistrationForm;
