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
  setErrors,
  variations,
  setVariations,
  handleVariationSelect,
  handleVariationDeSelect,
  currentVariants,
  variants,
  quantity,
  errors,
  totalQty,
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
          {errors}
        </FormHelperText>
      </FormControl>
      {showVariations && (
        <ControlPanel
          showVariations={showVariations}
          variations={variations}
          setVariations={setVariations}
          totalQty={quantity}
          handleVariationSelect={handleVariationSelect}
          handleVariationDeSelect={handleVariationDeSelect}
          currentVariants={currentVariants}
          setErrors={setErrors}
          variants={variants}
          totalQty={totalQty}
        />
      )}
    </Box>
  );
};

export default VariationField;
