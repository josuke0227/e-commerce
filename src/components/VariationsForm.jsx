import React from "react";
import { Typography, Chip, Box } from "@material-ui/core";
import { isEqual } from "../util/isEqual";
import { makeStyles } from "@material-ui/core/styles";
import AddCircleIcon from "@material-ui/icons/AddCircleOutline";
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
}) => {
  const classes = useStyles();

  const includes = (variationData) => {
    for (let data of currentVariants) {
      if (isEqual(data, variationData)) return true;
    }

    return false;
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
        totalQty={totalQty}
      />
    </>
  );
};

export default VariationsForm;
