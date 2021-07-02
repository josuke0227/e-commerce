import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import VariationForm from "./VariationFrom";

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
  setShowVariationDialog,
}) => {
  const classes = useStyles();

  const variationsLeft = totalQty - variationTotalQty;

  if (!currentVariants.length) return null;
  else
    return (
      <>
        <Typography
          className={classes.typography}
          color={variationsLeft > 0 ? "textPrimary" : "error"}
        >{`You can add ${variationsLeft > 0 ? variationsLeft : "no"} more ${
          variationsLeft > 1 ? "variations" : "variation"
        }.`}</Typography>
        <VariationForm
          currentVariants={currentVariants}
          variations={variations}
          setVariations={setVariations}
          selectedVariation={selectedVariation}
          totalQty={totalQty}
          setShowVariationDialog={setShowVariationDialog}
        />
      </>
    );
};

export default VariationsForm;
