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

const VariationsForm = ({
  variationsData,
  variations,
  setVariations,
  variationTotalQty,
  totalQty,
  handleVariationSelect,
  selectedVariationsData,
  handleVariationDeSelect,
}) => {
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
        throw Error("variation name must be the same.");
    }

    let combinedQty = parseInt(data.qty);
    for (let i = 0; i < currentInstances.length; i++) {
      const currentVariation = { ...currentInstances[i] };

      const baseObject = { ...currentVariation };
      const comparingObject = { ...data };
      delete baseObject.qty;
      delete comparingObject.qty;

      if (isEqual(baseObject, comparingObject)) {
        combinedQty += parseInt(currentVariation.qty);
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

  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setVariations({ ...variations, [name]: value });
  };

  const selectDefinitions = selectedVariationsData.map((v) => ({
    variant: "outlined",
    inputLabel: v.name,
    labelId: `${v.name}-select-label`,
    name: `${v.name}`,
    value: variations[v.name],
    values: v.instances,
    onChange: handleInputChange,
  }));

  const includes = (variationData) => {
    for (let data of selectedVariationsData) {
      if (isEqual(data, variationData)) return true;
    }

    return false;
  };

  return (
    <>
      <Grid
        container
        alignItems="center"
        justify={selectDefinitions.length ? "space-between" : "flex-start"}
      >
        {variationsData.map(
          (v) =>
            !includes(v) && (
              <Chip
                style={{ marginRight: "0.5rem" }}
                label={`Add ${v.name}`}
                clickable
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
            alignItems="center"
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
                disabled={variationTotalQty >= parseInt(totalQty)}
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
