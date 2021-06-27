import React from "react";
import Button from "@material-ui/core/Button";
import { Grid, Paper, TextField, Typography, Chip } from "@material-ui/core";
import { isEqual } from "../util/isEqual";
import SelectForm from "./shared/SelectForm";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from "@material-ui/icons/AddCircleOutline";
import CancelIcon from "@material-ui/icons/Cancel";
import { getObjectKeysSet } from "../util/getObjectKeysSet";

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
  variationsData,
  variations,
  setVariations,
  variationTotalQty,
  totalQty,
  handleVariationSelect,
  selectedVariationsData,
  handleVariationDeSelect,
  setErrors,
  errors,
}) => {
  const classes = useStyles();

  const [inputValues, setInputValues] = React.useState({});

  const handleAdd = () => {
    const data = { ...variations };
    let currentInstances = data.instances;
    delete data.instances;

    if (!currentInstances.length)
      return setVariations({
        ...data,
        qty: 0,
        instances: [...currentInstances, data],
      });

    const keys = Object.keys(data);
    for (let key of keys) {
      if (!getObjectKeysSet(currentInstances).includes(key))
        return setErrors({
          ...errors,
          variations: "Please choose the same variation pattern.",
        });
    }

    let combinedQty = data.qty;
    for (let i = 0; i < currentInstances.length; i++) {
      const currentVariation = { ...currentInstances[i] };

      const baseObject = { ...currentVariation };
      const comparingObject = { ...data };
      delete baseObject.qty;
      delete comparingObject.qty;

      if (isEqual(baseObject, comparingObject)) {
        combinedQty += currentVariation.qty;
        data.qty = combinedQty;
        currentInstances[i] = data;
        return setVariations({
          ...data,
          qty: 0,
          instances: [...currentInstances],
        });
      }
    }
    return setVariations({
      ...data,
      qty: 0,
      instances: [...currentInstances, data],
    });
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
    selectedVariationsData.forEach((v) => {
      if (v.name === name) variation = v;
    });

    return variation.instances[index];
  };

  const handleInputChange = ({ target }) => {
    const qty = parseInt(target.value) ? parseInt(target.value) : "";

    setVariations({ ...variations, qty });
  };

  const selectDefinitions = selectedVariationsData.map((v) => ({
    variant: "outlined",
    inputLabel: v.name,
    labelId: `${v.name}-select-label`,
    name: `${v.name}`,
    value: inputValues[v.name] || "",
    values: v.instances,
    onChange: handleSelectInputChange,
  }));

  const includes = (variationData) => {
    for (let data of selectedVariationsData) {
      if (isEqual(data, variationData)) return true;
    }

    return false;
  };

  const disableAddButton = () => {
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

    for (let data of selectedVariationsData) {
      if (variations[data.name]) count++;
    }
    return count === selectedVariationsData.length ? true : false;
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
      <Grid container alignItems="center" spacing={2}>
        {variationsData.map(
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
        {selectDefinitions.map((d, i) => (
          <Grid
            item
            key={`autoGeneratedSelectForms${i}`}
            style={{ display: "flex" }}
          >
            <SelectForm {...d} />
            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => handleVariationDeSelect(d.name, i)}
            >
              <CancelIcon fontSize="inherit" />
            </IconButton>
          </Grid>
        ))}
        {selectDefinitions.length > 0 && (
          <>
            <Grid item>
              <TextField
                variant="outlined"
                style={{ width: 100 }}
                id="qty"
                name="qty"
                label="qty"
                type="number"
                value={variations.qty}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item>
              <Button
                disabled={disableAddButton()}
                variant="outlined"
                color="primary"
                onClick={handleAdd}
              >
                Add
              </Button>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default VariationsForm;
