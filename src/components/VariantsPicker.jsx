import { Button, Box, Typography, Chip } from "@material-ui/core";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import AddCircleIcon from "@material-ui/icons/AddCircleOutline";
import { isEqual } from "../util/isEqual";

const VariantsPicker = ({
  variations,
  variants,
  currentVariants,
  handleVariationSelect,
  handleVariationRemove,
  enableVariations,
  setShowVariationDialog,
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
      {enableVariations && currentVariants.length > 0 && (
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={() => setShowVariationDialog(true)}
        >
          Add variations
        </Button>
      )}
    </Box>
  );
};

export default VariantsPicker;
