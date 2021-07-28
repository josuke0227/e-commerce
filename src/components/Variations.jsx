import { useState, useEffect } from "react";
import VariationsSwitch from "../components/VariationsSwitch";
import { getVariants } from "../services/variationServices";
import { isEqual } from "../util/isEqual";
import VariationsDialog from "../components/VariationsDialog";
import VariantsPicker from "../components/VariantsPicker";
import VariationEditDialog from "../components/VariationEditDialog";
import ConfirmDialog from "../components/shared/ConfirmDialog";
import LinearTable from "./shared/LinearTable";
import TwoDimensionalTable from "./shared/TwoDimensionalTable";
import { getObjectKeysSet } from "../util/getObjectKeysSet";
import { getVariationsQty } from "../util/getVariationsQty";

const INITIAL_DIALOG_STATE = {
  show: false,
  message: "",
};

const Variations = ({
  quantity,
  variations,
  setVariations,
  variants,
  setVariants,
  error,
  setErrors,
  enableVariations,
  setEnableVariations,
}) => {
  const [showVariationDialog, setShowVariationDialog] = useState(false);
  const [currentVariation, setCurrentVariation] = useState("");
  const [showVariationResetDialog, setShowVariationResetDialog] =
    useState(INITIAL_DIALOG_STATE);
  const [currentVariants, setCurrentVariants] = useState([]);

  useEffect(() => {
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

    if (!currentVariants.length && variations.length) applyVariants();
  }, [currentVariants, variations, variants]);

  useEffect(() => {
    const loadVariants = async () => {
      try {
        const { data } = await getVariants();
        setVariants(data);
      } catch (error) {
        console.log("fetching variations error", error);
      }
    };

    loadVariants();
  }, [setVariants]);

  const handleSwitch = () => {
    if (enableVariations && variations.length) {
      return setShowVariationResetDialog({
        message: "All changes are lost. Are you sure to disable variations?",
        show: true,
      });
    }
    setEnableVariations(!enableVariations);
    setCurrentVariants([]);
  };

  const handleConfirm = () => {
    setShowVariationResetDialog({ ...showVariationDialog, show: false });
    setVariations([]);
    setCurrentVariants([]);
    setEnableVariations(false);
  };

  const handleCancel = () => {
    setShowVariationResetDialog({ ...showVariationDialog, show: false });
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

  const renderVariationsTable = () => {
    if (!variations.length) return;

    const keys = Object.keys(variations[0]);
    if (keys.length === 3)
      return <TwoDimensionalTable variations={variations} />;
    else return <LinearTable variations={variations} />;
  };

  const currentQty = getVariationsQty(variations);

  return (
    <>
      <ConfirmDialog
        handleConfirm={handleConfirm}
        handleCancel={handleCancel}
        showDialog={showVariationResetDialog}
        result={{ success: null, message: "" }}
      />
      <VariationsDialog
        showDialog={showVariationDialog}
        setErrors={setErrors}
        variations={variations}
        setVariations={setVariations}
        handleVariationSelect={handleVariationSelect}
        handleVariationDeSelect={handleVariationDeSelect}
        currentVariants={currentVariants}
        currentVariation={currentVariation}
        setCurrentVariation={setCurrentVariation}
        variants={variants}
        qty={quantity}
        setShowVariationDialog={setShowVariationDialog}
        setCurrentVariants={setCurrentVariants}
        currentQty={currentQty}
      />
      <VariationEditDialog
        currentVariants={currentVariants}
        variations={variations}
        qty={quantity}
        setVariations={setVariations}
        currentVariation={currentVariation}
        setCurrentVariation={setCurrentVariation}
        currentQty={currentQty}
      />
      <VariationsSwitch
        enableVariations={enableVariations}
        handleSwitch={handleSwitch}
        error={error}
      />
      {enableVariations && (
        <VariantsPicker
          variations={variations}
          variants={variants}
          currentVariants={currentVariants}
          handleVariationSelect={handleVariationSelect}
          handleVariationRemove={handleVariationRemove}
          enableVariations={enableVariations}
          setShowVariationDialog={setShowVariationDialog}
        />
      )}
      {renderVariationsTable()}
    </>
  );
};

export default Variations;
