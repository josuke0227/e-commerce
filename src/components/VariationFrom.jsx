import React from "react";
import Button from "@material-ui/core/Button";
import {
  Grid,
  Paper,
  TextField,
  Typography,
  Chip,
  Box,
} from "@material-ui/core";
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
import { getIndex } from "../util/getIndex";

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
  selectedVariation,
}) => {
  const classes = useStyles();

  const {
    register,
    handleSubmit,
    watch,
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

  const handleAdd = (data) => {
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

  return (
    <Grid
      className={classes.formGroup}
      container
      alignItems="center"
      component="form"
      spacing={2}
      onSubmit={handleSubmit(handleAdd)}
    >
      {currentVariants.map((v) => (
        <Grid item xs={currentVariants.length === 1 ? 12 : 6} key={v.name}>
          <TextField
            error={hasError(v.name)}
            helperText={hasError(v.name) && errors[v.name].message}
            id={v.name}
            name={v.name}
            label={v.name}
            variant="outlined"
            {...register(v.name)}
            defaultValue=""
            required
            fullWidth
            select
          >
            {v.instances.map((c, i) => (
              <MenuItem key={c.name} value={i} name={c.name}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      ))}
      <Grid item xs={6}>
        <TextField
          variant="outlined"
          id="qty"
          name="qty"
          label="Qty"
          type="number"
          fullWidth
          {...register("qty")}
          defaultValue=""
          required
        />
      </Grid>
      <Grid item xs={6}>
        <Button
          disabled={false}
          type="submit"
          variant="outlined"
          color="primary"
          fullWidth
          classes={{ outlined: classes.button }}
        >
          Add
        </Button>
      </Grid>
    </Grid>
  );
};

export default VariationForm;

// The code below goes to different component.
// TODO: create edit modal
// const another = (
//   <Paper>
//     {currentVariants.map((v) => {
//       const defaultValue = selectedVariation[v.name].index;
//       return (
//         <TextField
//           error={hasError(v.name)}
//           helperText={hasError(v.name) && errors[v.name].message}
//           id={v.name}
//           name={v.name}
//           label={v.name}
//           variant="outlined"
//           {...register(v.name)}
//           defaultValue={selectedVariation ? selectedVariation[v.name].index : ""}
//           required
//           fullWidth
//           select
//         >
//           {v.instances.map((c, i) => (
//             <MenuItem key={c.name} value={i} name={c.name}>
//               {c.name}
//             </MenuItem>
//           ))}
//         </TextField>
//       );
//     })}
//     <TextField
//       variant="outlined"
//       style={{ width: 100 }}
//       id="qty"
//       name="qty"
//       label="Qty"
//       type="number"
//       {...register("qty")}
//       defaultValue={selectedVariation.qty}
//       required
//     />
//     <Button disabled={false} type="submit" variant="outlined" color="primary">
//       Add
//     </Button>
//   </Paper>
// );
