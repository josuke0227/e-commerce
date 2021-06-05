import { useState } from "react";
import ListHeader from "./ListHeader";
import ListButtons from "./ListButtons";
import { ListItem, Divider } from "@material-ui/core";

import { categorySchema } from "../schemas/categorySchema";

const SubCategoryListItem = ({
  subCategory,
  doSubCategoryUpdate,
  setSubCategory,
  listLoading,
  setShowDialog,
}) => {
  const { name: subCategoryName } = subCategory;

  const [name, setName] = useState(subCategoryName);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleInputChange = (e) => {
    e.preventDefault();
    const { value } = e.target;
    const { error } = categorySchema.validate(value);
    setError(error ? error.message : "");
    setShowTooltip(!!error);
    setName(value);
  };

  const onUndoButtonClick = () => {
    if (name === subCategoryName) return setIsEditing(false);
    setName(subCategoryName);
    setIsEditing(false);
    setError("");
  };

  const handleDoneButtonClick = () => {
    const { error } = categorySchema.validate(name);
    if (error) return setError(error.message);
    setIsEditing(false);
    setError("");
    const updatedCategory = { ...subCategory, name };
    doSubCategoryUpdate(updatedCategory);
  };

  const handleDeleteButtonClick = () => {
    setShowDialog(true);
    setSubCategory(subCategory);
  };

  return (
    <>
      <ListItem key={subCategoryName}>
        <ListHeader
          isEditing={isEditing}
          itemName={subCategoryName}
          handleInputChange={handleInputChange}
          error={error}
          showTooltip={showTooltip}
          inputValue={name}
        />
        <ListButtons
          handleDeleteButtonClick={handleDeleteButtonClick}
          isEditing={isEditing}
          onUndoButtonClick={onUndoButtonClick}
          handleDoneButtonClick={handleDoneButtonClick}
          inputValue={name}
          itemName={subCategoryName}
          error={error}
          listLoading={listLoading}
          item={subCategory}
          setIsEditing={setIsEditing}
        />
      </ListItem>
    </>
  );
};

export default SubCategoryListItem;
