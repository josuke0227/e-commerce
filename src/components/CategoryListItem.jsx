import { useState } from "react";
import ListHeader from "./ListHeader";
import ListButtons from "./ListButtons";
import { ListItem, ListItemText, IconButton } from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";

import { categorySchema } from "../schemas/categorySchema";

const CategoryListItem = ({
  category,
  doCategoryUpdate,
  setSelectedCategory,
  listItemLoading,
  setShowDialog,
  variant,
  handleSelect,
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

  if (variant === "selector")
    return (
      <ListItem>
        <ListItemText primary={category.name} />
        <IconButton onClick={() => handleSelect(category)}>
          <MenuIcon />
        </IconButton>
      </ListItem>
    );

  return (
    <>
      <ListItem key={categoryName}>
        <ListHeader
          isEditing={isEditing}
          itemName={categoryName}
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
          itemName={categoryName}
          error={error}
          listItemLoading={listItemLoading}
          item={category}
          setIsEditing={setIsEditing}
        />
      </ListItem>
    </>
  );
};

export default CategoryListItem;
