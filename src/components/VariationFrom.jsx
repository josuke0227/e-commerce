import React from "react";
import Button from "@material-ui/core/Button";
import { Grid, TextField } from "@material-ui/core";
import { isEqual } from "../util/isEqual";
import { makeStyles } from "@material-ui/core/styles";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import MenuItem from "@material-ui/core/MenuItem";
import VariantSelect from "../components/shared/VariantSelect";
import Input from "../components/shared/Input";

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

const VariationForm = ({
  currentVariants,
  variations,
  setVariations,
  totalQty,
  setShowVariationDialog,
}) => {
  const classes = useStyles();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({ resolver: joiResolver(schema) });

  const hasError = (name) => {
    if (Object.keys(errors).length) {
      return !!errors[name];
    }
    return false;
  };

  const combineSameVariation = (variations, variation) => {
    let total = variation.qty;
    for (let i = 0; i < variations.length; i++) {
      const baseObject = { ...variations[i] };
      const comparingObject = { ...variation };
      delete baseObject.qty;
      delete comparingObject.qty;

      if (isEqual(baseObject, comparingObject)) {
        total += variations[i].qty;
        variation.qty = total;
        variations[i] = variation;
        return variations;
      }
    }

    return false;
  };

  const handleAdd = (data, e) => {
    e.stopPropagation();
    const newVariation = createVariation(data);
    const currentVariations = [...variations];

    const combinedVariations = combineSameVariation(
      currentVariations,
      newVariation
    );

    if (combinedVariations) {
      return setVariations(combinedVariations);
    } else {
      currentVariations.push(newVariation);
      setVariations(currentVariations);
    }
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

  const disableButton = () => {
    if (isValidQuantity() === true) return false;
    return true;
  };

  const isValidQuantity = () => {
    if (getCurrentQty() < totalQty) return true;
    return false;
  };

  const getCurrentQty = () => {
    let count = 0;
    variations.forEach((v) => (count += v.qty));
    return count;
  };

  return (
    <Grid
      className={classes.formGroup}
      container
      alignItems="center"
      component="div"
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
      {currentVariants.length > 0 && (
        <>
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
              onClick={() => setShowVariationDialog(false)}
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
        </>
      )}
    </Grid>
  );
};

export default VariationForm;
