import { useState } from "react";
import ListHeader from "./ListHeader";
import ListButtons from "./ListButtons";
import { ListItem, Divider } from "@material-ui/core";

import { categorySchema } from "../schemas/categorySchema";

const CategoryListItem = ({
  category,
  doCategoryUpdate,
  setSelectedCategory,
  listLoading,
  setShowDialog,
}) => {
  const { name: categoryName } = category;

  const [name, setName] = useState(categoryName);
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
    if (name === categoryName) return setIsEditing(false);
    setName(categoryName);
    setIsEditing(false);
    setError("");
  };

  const handleDoneButtonClick = () => {
    const { error } = categorySchema.validate(name);
    if (error) return setError(error.message);
    setIsEditing(false);
    setError("");
    const updatedCategory = { ...category, name };
    doCategoryUpdate(updatedCategory);
  };

  const handleDeleteButtonClick = () => {
    setShowDialog(true);
    setSelectedCategory(category);
  };

  return (
    <>
      <ListItem key={categoryName}>
        <ListHeader
          isEditing={isEditing}
          categoryName={categoryName}
          handleInputChange={handleInputChange}
          error={error}
          showTooltip={showTooltip}
          name={name}
        />
        <ListButtons
          handleDeleteButtonClick={handleDeleteButtonClick}
          isEditing={isEditing}
          onUndoButtonClick={onUndoButtonClick}
          handleDoneButtonClick={handleDoneButtonClick}
          name={name}
          categoryName={categoryName}
          error={error}
          listLoading={listLoading}
          category={category}
          setIsEditing={setIsEditing}
        />
      </ListItem>
      <Divider />
    </>
  );
};

export default CategoryListItem;
