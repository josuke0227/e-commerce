import React from "react";
import Button from "@material-ui/core/Button";
import { Grid, Paper, Dialog, DialogTitle } from "@material-ui/core";
import { isEqual } from "../util/isEqual";
import SelectForm from "./shared/SelectForm";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from "@material-ui/icons/AddCircleOutline";
import CancelIcon from "@material-ui/icons/Cancel";
import { getObjectKeysSet } from "../util/getObjectKeysSet";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import { variationsSchema } from "../schemas/productSchema";
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
  color: Joi.string(),
  size: Joi.number(),
  qty: Joi.number(),
});

const VariationEditor = ({
  currentVariants,
  variations,
  setVariations,
  selectedVariation,
  setSelectedVariation,
}) => {
  const classes = useStyles();

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: joiResolver(schema),
  });

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
        variations[i].qty = total;
        variation.qty = total;
        variations[i] = variation;
        return variations;
      }
    }

    return false;
  };

  const handleAdd = (data, e) => {
    e.stopPropagation();
    const { error } = schema.validate(data);

    if (error) {
      console.log(error);
      return;
    }

    const variationData = createVariation(data);

    const combinedVariations = combineSameVariation(variations, variationData);
    const index = selectedVariation.location;

    if (combinedVariations) {
      combinedVariations.splice(index, 1);
      setVariations(combinedVariations);
    } else {
      const currentVariations = [...variations];
      currentVariations[index] = variationData;
      setVariations(currentVariations);
    }

    setSelectedVariation("");
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

  const handleClose = () => {
    setSelectedVariation("");
  };

  return (
    <Dialog open={!!selectedVariation}>
      <DialogTitle>Edit product</DialogTitle>
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
            disabled={false}
            onClick={handleSubmit(handleAdd)}
            variant="outlined"
            color="primary"
            fullWidth
            classes={{ outlined: classes.button }}
          >
            Confirm
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default VariationEditor;
