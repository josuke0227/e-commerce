import Button from "@material-ui/core/Button";
import { Grid, Dialog, DialogTitle, DialogContent } from "@material-ui/core";
import { isEqual } from "../util/isEqual";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import VariantSelect from "./shared/VariantSelect";
import Input from "./shared/Input";

const useStyles = makeStyles((theme) => ({
  formGroup: {
    padding: theme.spacing(1),
  },
  button: {
    padding: "15px",
  },
}));

const schema = Joi.object().keys({
  color: Joi.number(),
  size: Joi.number(),
  qty: Joi.number(),
});

const VariationEditDialog = ({
  currentVariants,
  variations,
  setVariations,
  currentVariation,
  setCurrentVariation,
  currentQty,
  qty,
}) => {
  const classes = useStyles();

  const {
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm({
    resolver: joiResolver(schema),
  });

  const incomingQty = watch("qty");

  const hasError = (name) => {
    if (Object.keys(errors).length) {
      return !!errors[name];
    }
    return false;
  };

  const handleAdd = (data, e) => {
    e.stopPropagation();

    const { error } = schema.validate(data);
    if (error) {
      return console.log(error);
    }

    const variationData = createVariation(data);
    const currentVariations = [...variations];

    const index = getIndexOfSameVariationType(variationData);
    if (index >= 0 && currentVariations.length > 1) {
      if (index === currentVariation.location)
        return insertVariation(currentVariations, variationData);
      return mergeVariation(currentVariations, variationData, index);
    }
    insertVariation(currentVariations, variationData);
  };

  const mergeVariation = (currentVariations, variationData, index) => {
    currentVariations[index].qty += variationData.qty;
    currentVariations.splice(currentVariation.location, 1);
    setVariations(currentVariations);
    setCurrentVariation("");
  };

  const insertVariation = (currentVariations, variationData) => {
    const index = currentVariation.location;
    currentVariations[index] = variationData;
    setVariations(currentVariations);
    setCurrentVariation("");
  };

  const createVariation = (data) => {
    const result = {};
    const variantNames = Object.keys(data);

    currentVariants.forEach((v) => {
      variantNames.forEach((n) => {
        if (n === "qty") result[n] = data[n];
        if (v.name === n) {
          result[n] = v.instances[data[n]];
        }
      });
    });

    return result;
  };

  const getIndexOfSameVariationType = (variation) => {
    for (let i = 0; i < variations.length; i++) {
      const baseObject = { ...variation };
      const comparingObject = { ...variations[i] };
      delete baseObject.qty;
      delete comparingObject.qty;

      if (isEqual(baseObject, comparingObject)) {
        return i;
      }
    }

    return -1;
  };

  const handleClose = () => {
    setCurrentVariation("");
  };

  const disableButton = () => {
    if (!isValidIncomingQuantity(currentVariation)) return true;
    return false;
  };

  const isValidIncomingQuantity = (currentVariation) => {
    if (!currentVariation) return currentQty + parseInt(incomingQty) > qty;

    return qty >= currentQty + parseInt(incomingQty) - currentVariation.qty;
  };

  return (
    <Dialog open={!!currentVariation}>
      <DialogTitle>Edit product</DialogTitle>
      <DialogContent>
        <Grid
          className={classes.formGroup}
          container
          alignItems="center"
          component="section"
          spacing={2}
        >
          {currentVariants.map((v) => {
            return (
              <Grid
                item
                xs={currentVariants.length === 1 ? 12 : 6}
                key={v.name}
              >
                <VariantSelect
                  name={v.name}
                  error={hasError(v.name)}
                  helperText={hasError(v.name) && errors[v.name].message}
                  control={control}
                  label={v.name}
                  list={v.instances}
                  variant="outlined"
                  defaultValue={
                    currentVariation[v.name]
                      ? currentVariation[v.name].index
                      : ""
                  }
                  required
                  fullWidth
                />
              </Grid>
            );
          })}
          <Grid item xs={12}>
            <Input
              type="number"
              name="qty"
              control={control}
              defaultValue={currentVariation.qty}
              variant="outlined"
              label="Qty"
              helperText={hasError("qty") && errors.qty.message}
              error={hasError("qty")}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <Button
              disabled={false}
              variant="outlined"
              color="default"
              fullWidth
              classes={{ outlined: classes.button }}
              onClick={handleClose}
            >
              Close
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              disabled={disableButton()}
              onClick={handleSubmit(handleAdd)}
              variant="outlined"
              color="primary"
              fullWidth
              classes={{ outlined: classes.button }}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default VariationEditDialog;
