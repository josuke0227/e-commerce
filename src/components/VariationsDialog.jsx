import { useEffect } from "react";
import VariationsTable from "../components/shared/VariationsTable";
import VariationsForm from "./VariationsForm";
import { Dialog, DialogContent } from "@material-ui/core";
import { getObjectKeysSet } from "../util/getObjectKeysSet";

export default function VariationsDialog({
  showDialog,
  variations,
  setVariations,
  setShowVariationDialog,
  currentVariants,
  setCurrentVariants,
  setOtherErrors,
  qty,
  variants,
  handleVariationSelect,
  handleVariationDeSelect,
  currentVariation,
  setCurrentVariation,
  currentQty,
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

  const handleEditClick = (variation, i) => {
    const variantNames = Object.keys(variation).filter((k) => k !== "qty");

    const variationData = createVariationDataWithIndex(variantNames, variation);
    variationData.location = i;

    setCurrentVariation(variationData);
  };

  const createVariationDataWithIndex = (variantNames, variation) => {
    let data = {};
    for (let i = 0; i < variantNames.length; i++) {
      const name = variantNames[i];
      const index = getIndexOfInstance(name, variation[name]);
      data = { ...data, [name]: { index } };
    }
    data.qty = variation.qty;
    return data;
  };

  const getIndexOfInstance = (variantName, variationData) => {
    let index;
    const instances = currentVariants.filter((v) => v.name === variantName)[0]
      .instances;
    instances.forEach((i, idx) => {
      if (i.name === variationData.name) index = idx;
    });
    return index;
  };

  const handleDeleteClick = (index) => {
    const current = [...variations];
    current.splice(index, 1);
    setVariations(current);
  };

  return (
    <Dialog open={showDialog} style={{ width: "100vw" }}>
      <DialogContent>
        <VariationsForm
          variants={variants}
          currentVariation={currentVariation}
          variations={variations}
          setVariations={setVariations}
          currentQty={currentQty}
          qty={qty}
          handleVariationSelect={handleVariationSelect}
          currentVariants={currentVariants}
          handleVariationDeSelect={handleVariationDeSelect}
          setErrors={setOtherErrors}
          setShowVariationDialog={setShowVariationDialog}
        />
        <VariationsTable
          variations={variations}
          handleEditClick={handleEditClick}
          handleDeleteClick={handleDeleteClick}
          qty={qty}
          currentQty={currentQty}
        />
      </DialogContent>
    </Dialog>
  );
}
