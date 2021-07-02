import { useState, useEffect } from "react";
import VariationField from "../components/VariationField";
import { isEqual } from "../util/isEqual";
import { getVariations } from "../services/variationServices";
import ConfirmDialog from "../components/shared/ConfirmDialog";

const INITIAL_DIALOG_STATE = {
  show: false,
  message: "",
};

const quantity = 10;

export default function Variations() {
  const [variants, setVariants] = useState([]);
  const [currentVariants, setCurrentVariants] = useState([]);
  const [showVariations, setShowVariations] = useState(false);
  const [showVariationDialog, setShowVariationDialog] =
    useState(INITIAL_DIALOG_STATE);
  const [variations, setVariations] = useState([]);
  const [otherErrors, setOtherErrors] = useState({
    images: "",
    description: "",
    variations: "",
  });

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

  const handleCheckboxClick = () => {
    if (showVariations === true) setCurrentVariants([]);
    setShowVariations(!showVariations);
    if (showVariations && variations.length) {
      setShowVariationDialog({
        message: "All changes are lost. Are you sure to disable variations?",
        show: true,
      });
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
        showDialog={showVariationDialog}
        handleConfirm={handleConfirm}
        handleCancel={handleCancel}
        result={{ message: "", success: null }}
      />
      <VariationField
        showVariations={showVariations}
        handleCheckboxClick={handleCheckboxClick}
        setErrors={setOtherErrors}
        variations={variations}
        setVariations={setVariations}
        quantity={quantity}
        handleVariationSelect={handleVariationSelect}
        handleVariationDeSelect={handleVariationDeSelect}
        currentVariants={currentVariants}
        variants={variants}
        errors={otherErrors.variations}
        totalQty={quantity}
      />
    </>
  );
}
