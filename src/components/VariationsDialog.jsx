import { useState, useEffect } from "react";
import VariationField from "../components/VariationField";
import { isEqual } from "../util/isEqual";
import ConfirmDialog from "../components/shared/ConfirmDialog";
import { Dialog, Chip, Box, Typography } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircleOutline";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { getObjectKeysSet } from "../util/getObjectKeysSet";

export default function VariationsDialog({
  showDialog,
  variations,
  setVariations,
  setShowVariationDialog,
  currentVariants,
  setCurrentVariants,
  otherErrors,
  setOtherErrors,
  quantity,
  variants,
}) {
  useEffect(() => {
    if (!currentVariants.length && showDialog) applyVariants();
  }, [currentVariants, showDialog]);

  const applyVariants = () => {
    const keys = getObjectKeysSet(variations);
    keys.splice(keys.indexOf("qty"), 1);

    const result = [];
    keys.forEach((k) => {
      variants.forEach((v) => {
        if (v.name === k) result.push(v);
      });
    });

    setCurrentVariants(result);
  };

  const handleVariationSelect = (variation) => {
    const currentData = [...currentVariants];
    for (let data of currentData) {
      if (isEqual(data, variation)) return;
    }

    setCurrentVariants([...currentVariants, variation]);
  };

  const handleVariationRemove = (index) => {
    const currentData = [...currentVariants];
    currentData.splice(index, 1);
    setCurrentVariants(currentData);
  };

  const handleVariationDeSelect = (name, index) => {
    const currentData = [...currentVariants];
    currentData.splice(index, 1);
    setCurrentVariants(currentData);

    const currentVariations = { ...variations };
    delete currentVariations[name];
    setVariations(currentVariations);
  };

  return (
    <>
      <VariantsPicker
        variants={variants}
        currentVariants={currentVariants}
        handleVariationSelect={handleVariationSelect}
        handleVariationRemove={handleVariationRemove}
        variations={variations}
      />
      <Dialog open={showDialog} style={{ width: "100vw" }}>
        <VariationField
          showDialog={showDialog}
          setErrors={setOtherErrors}
          errors={otherErrors.variations}
          variations={variations}
          setVariations={setVariations}
          handleVariationSelect={handleVariationSelect}
          handleVariationDeSelect={handleVariationDeSelect}
          currentVariants={currentVariants}
          variants={variants}
          totalQty={quantity}
          showDialog={showDialog}
          setShowVariationDialog={setShowVariationDialog}
          setCurrentVariants={setCurrentVariants}
        />
      </Dialog>
    </>
  );
}

const VariantsPicker = ({
  variations,
  variants,
  currentVariants,
  handleVariationSelect,
  handleVariationRemove,
}) => {
  const includes = (variationData) => {
    for (let data of currentVariants) {
      if (isEqual(data, variationData)) return true;
    }

    return false;
  };

  return (
    <Box>
      {!variations.length && (
        <>
          <Typography>Please choose variants</Typography>
          <Box>
            {variants.map((v, i) =>
              !includes(v) ? (
                <Chip
                  key={v._id}
                  style={{ marginRight: "0.5rem" }}
                  label={`Add ${v.name}`}
                  color="primary"
                  onDelete={() => handleVariationSelect(v)}
                  deleteIcon={<AddCircleIcon />}
                  variant="outlined"
                />
              ) : (
                <Chip
                  key={v._id}
                  style={{ marginRight: "0.5rem" }}
                  label={`Remove ${v.name}`}
                  color="secondary"
                  onDelete={() => handleVariationRemove(i)}
                  deleteIcon={<HighlightOffIcon />}
                  variant="outlined"
                />
              )
            )}
          </Box>
        </>
      )}
    </Box>
  );
};
