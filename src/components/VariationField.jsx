import React, { useState, useEffect } from "react";
import {
  makeStyles,
  FormControl,
  Switch,
  FormControlLabel,
  FormHelperText,
  Box,
} from "@material-ui/core";
import ControlPanel from "./ControlPanel";

const useStyles = makeStyles((theme) => ({
  formParts: {
    marginTop: theme.spacing(3),
  },
  slideButton: {
    marginBottom: theme.spacing(1),
  },
}));

const VariationField = ({
  showVariations,
  handleCheckboxClick,
  errors,
  setErrors,
  variations,
  setVariations,
  values,
  handleVariationSelect,
  handleVariationDeSelect,
  selectedVariationsData,
}) => {
  const classes = useStyles();

  return (
    <Box className={classes.slideButton}>
      <FormControl component="fieldset" className={classes.slideButton}>
        <FormControlLabel
          label="Enable variations"
          control={
            <Switch
              checked={showVariations}
              onChange={handleCheckboxClick}
              color="primary"
            />
          }
        />
        <FormHelperText className={classes.slideButton} error>
          {errors.variations}
        </FormHelperText>
      </FormControl>
      {showVariations && (
        <ControlPanel
          variations={variations}
          setVariations={setVariations}
          totalQty={values.quantity}
          handleVariationSelect={handleVariationSelect}
          handleVariationDeSelect={handleVariationDeSelect}
          selectedVariationsData={selectedVariationsData}
          setErrors={setErrors}
          errors={errors}
        />
      )}
    </Box>
  );
};

export default VariationField;
