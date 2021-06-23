import VariationsForm from "./VariationsForm";
import VariationsTable from "./shared/VariationsTable";

const ControlPanel = ({
  variations,
  setVariations,
  totalQty,
  handleVariationSelect,
  selectedVariationsData,
  handleVariationDeSelect,
  setErrors,
  errors,
  variationsData,
}) => {
  const handleEditClick = (index) => {
    const current = { ...variations };
    const target = current.instances[index];
    const newVariations = { ...variations, ...target };
    newVariations.instances.splice(index, 1);
    setVariations(newVariations);
  };

  const handleDeleteClick = (index) => {
    const current = { ...variations };
    current.instances.splice(index, 1);
    setVariations(current);
  };

  const getCount = (arr) => {
    let count = 0;
    arr.forEach((v) => (count += parseInt(v.qty)));
    return count;
  };

  return (
    <>
      <VariationsForm
        variationsData={variationsData}
        variations={variations}
        setVariations={setVariations}
        variationTotalQty={getCount(variations.instances)}
        totalQty={totalQty}
        handleVariationSelect={handleVariationSelect}
        selectedVariationsData={selectedVariationsData}
        handleVariationDeSelect={handleVariationDeSelect}
        setErrors={setErrors}
        errors={errors}
      />
      <VariationsTable
        variations={variations.instances}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
      />
    </>
  );
};

export default ControlPanel;
