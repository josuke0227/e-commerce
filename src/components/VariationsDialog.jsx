import { useState, useEffect } from "react";
import VariationField from "../components/VariationField";
import { isEqual } from "../util/isEqual";
import { getVariations } from "../services/variationServices";
import ConfirmDialog from "../components/shared/ConfirmDialog";
import { Dialog, Chip, Box, Typography, Grid, Button } from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircleOutline";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

const INITIAL_DIALOG_STATE = {
  show: false,
  message: "",
};

const quantity = 10;

export default function VariationsDialog({
  showDialog,
  variations,
  setVariations,
  setShowVariationDialog,
  currentVariants,
  setCurrentVariants,
  otherErrors,
  setOtherErrors,
}) {
  const [variants, setVariants] = useState([]);
  const [slide, setSlide] = useState(false);

  useEffect(() => {
    loadVariants();
  }, []);

  const loadVariants = async () => {
    try {
      const { data } = await getVariations();
      setVariants(data);
    } catch (error) {
      console.log("fetching variations error", error);
    }
  };

  const handleConfirm = () => {
    setVariations([]);
    setCurrentVariants([]);
    setShowVariationDialog({
      show: false,
    });
  };

  const handleCancel = () => {
    setShowVariationDialog({
      show: false,
    });
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
      <ConfirmDialog
        showDialog={showDialog}
        handleConfirm={handleConfirm}
        handleCancel={handleCancel}
        result={{ message: "", success: null }}
      />
      <VariantsPicker
        variants={variants}
        currentVariants={currentVariants}
        handleVariationSelect={handleVariationSelect}
        handleVariationRemove={handleVariationRemove}
        setSlide={setSlide}
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
        />
      </Dialog>
    </>
  );
}

const VariantsPicker = ({
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
  );
};
