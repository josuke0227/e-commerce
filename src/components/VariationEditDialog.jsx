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
  color: Joi.string(),
  size: Joi.number(),
  qty: Joi.number(),
});

const VariationEditModal = ({
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
    const combinedVariations = combineSameVariation(variations, variationData);
    const index = currentVariation.location;

    if (combinedVariations) {
      if (variations.length === 1) {
        return setVariations([{ ...variationData }]);
      }
      combinedVariations.splice(index, 1);
      setVariations(combinedVariations);
    } else {
      const currentVariations = [...variations];
      currentVariations[index] = variationData;
      setVariations(currentVariations);
    }

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

  const combineSameVariation = (variations, variation) => {
    const clone = [...variations];

    let total = variation.qty;
    for (let i = 0; i < clone.length; i++) {
      const baseObject = { ...clone[i] };
      const comparingObject = { ...variation };
      delete baseObject.qty;
      delete comparingObject.qty;

      if (isEqual(baseObject, comparingObject)) {
        total += variations[i].qty;
        clone[i].qty = total;
        return clone;
      }
    }

    return false;
  };

  const handleClose = () => {
    setCurrentVariation("");
  };

  const disableButton = () => {
    if (!isValidQuantity() || currentQty + parseInt(incomingQty) > qty)
      return true;
    return false;
  };

  const isValidQuantity = () => {
    if (getCurrentQty() < qty) return true;
    return false;
  };

  const getCurrentQty = () => {
    let count = 0;
    variations.forEach((v) => (count += v.qty));
    return count;
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
          {currentVariants.map((v) => (
            <Grid item xs={currentVariants.length === 1 ? 12 : 6} key={v.name}>
              <VariantSelect
                name={v.name}
                error={hasError(v.name)}
                helperText={hasError(v.name) && errors[v.name].message}
                control={control}
                label={v.name}
                list={v.instances}
                variant="outlined"
                defaultValue=""
                required
                fullWidth
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Input
              type="number"
              name="qty"
              control={control}
              defaultValue=""
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

export default VariationEditModal;
