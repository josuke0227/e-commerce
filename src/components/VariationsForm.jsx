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

import VariationForm from "./VariationFrom";

/**
 * input: array
 * variants = [
    {
      type: "color",
      variations: ["Red", "Blue", "Green", "Yellow"],
    },
    { type: "size", variations: ["S", "M", "L"] },
  ];

 * output: array
 * variations = [
  { color: "Red", qty: "1", size: "S" },
  { color: "Red", qty: "3", size: "L" },
  { color: "Blue", qty: "1", size: "S" },
  { color: "Blue", qty: "2", size: "M" },
]
 */

const useStyles = makeStyles((theme) => ({
  typography: {
    marginBottom: theme.spacing(1),
  },
}));

const VariationsForm = ({
  variants,
  variations,
  setVariations,
  variationTotalQty,
  totalQty,
  handleVariationSelect,
  currentVariants,
  selectedVariation,
  handleVariationDeSelect,
  setErrors,
}) => {
  const classes = useStyles();

  const [inputValues, setInputValues] = React.useState({});

  const handleAdd = (data) => {
    const newVariation = createVariation(data);
    const currentVariations = [...variations];

    const combinedVariations = combineSameVariation(
      currentVariations,
      newVariation
    );

    if (combinedVariations) {
      setVariations(combinedVariations);
    } else {
      setVariations([...variations, { ...newVariation }]);
    }
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

  const handleSelectInputChange = ({ target }) => {
    const { value, name } = target;
    const currentValue = { ...inputValues, [name]: value };
    setInputValues(currentValue);

    const variation = getInstance(name, value);
    setVariations({ ...variations, [name]: { ...variation } });
  };

  const getInstance = (name, index) => {
    let variation;
    currentVariants.forEach((v) => {
      if (v.name === name) variation = v;
    });

    return variation.instances[index];
  };

  const handleInputChange = ({ target }) => {
    const qty = parseInt(target.value) ? parseInt(target.value) : "";

    setVariations({ ...variations, qty });
  };

  const includes = (variationData) => {
    for (let data of currentVariants) {
      if (isEqual(data, variationData)) return true;
    }

    return false;
  };

  const disableButton = () => {
    if (
      !isSelectedVariationUsed() ||
      variationTotalQty >= parseInt(totalQty) ||
      !isValidQuantity()
    )
      return true;

    return false;
  };

  const isSelectedVariationUsed = () => {
    let count = 0;

    for (let data of currentVariants) {
      if (variations[data.name]) count++;
    }
    return count === currentVariants.length ? true : false;
  };

  const isValidQuantity = () => {
    if (!variations.qty) return false;
    else if (variations.qty < 1) return false;
    else if (variations.qty > totalQty) return false;
    return true;
  };

  const variationsLeft = totalQty - variationTotalQty;

  return (
    <>
      <Typography
        className={classes.typography}
        color={variationsLeft > 0 ? "textPrimary" : "error"}
      >{`You can add ${variationsLeft > 0 ? variationsLeft : "no"} more ${
        variationsLeft > 1 ? "variations" : "variation"
      }.`}</Typography>
      <Box>
        {variants.map(
          (v) =>
            !includes(v) && (
              <Chip
                key={v._id}
                style={{ marginRight: "0.5rem" }}
                label={`Add ${v.name}`}
                color="primary"
                onDelete={() => handleVariationSelect(v)}
                deleteIcon={<AddCircleIcon />}
                variant="outlined"
              />
            )
        )}
      </Box>
      <VariationForm
        currentVariants={currentVariants}
        variations={variations}
        setVariations={setVariations}
        selectedVariation={selectedVariation}
      />
    </>
  );
};

export default VariationsForm;
