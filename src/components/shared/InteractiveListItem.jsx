import { useState } from "react";
import ListHeader from "../ListHeader";
import ListButtons from "../ListButtons";
import { ListItem, Divider } from "@material-ui/core";

import { categorySchema } from "../../schemas/categorySchema";

const InteractiveListItem = ({
  item,
  updateHandler,
  itemSetter,
  isLoading,
  notificationSetter,
}) => {
  const { name: itemName, _id } = item;

  const [inputValue, setInputValue] = useState(itemName);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleInputChange = (e) => {
    e.preventDefault();
    const { value } = e.target;
    const { error } = categorySchema.validate(value);
    setError(error ? error.message : "");
    setShowTooltip(!!error);
    setInputValue(value);
  };

  const onUndoButtonClick = () => {
    if (inputValue === itemName) return setIsEditing(false);
    setInputValue(itemName);
    setIsEditing(false);
    setError("");
  };

  const handleDoneButtonClick = () => {
    const { error } = categorySchema.validate(inputValue);
    if (error) return setError(error.message);
    setIsEditing(false);
    setError("");
    const updatedItem = { ...item, name: inputValue };
    updateHandler(updatedItem);
  };

  const handleDeleteButtonClick = () => {
    notificationSetter(true);
    itemSetter(item);
  };

  return (
    <>
      <ListItem key={_id}>
        <ListHeader
          isEditing={isEditing}
          itemName={itemName}
          handleInputChange={handleInputChange}
          error={error}
          showTooltip={showTooltip}
          inputValue={inputValue}
        />
        <ListButtons
          handleDeleteButtonClick={handleDeleteButtonClick}
          isEditing={isEditing}
          onUndoButtonClick={onUndoButtonClick}
          handleDoneButtonClick={handleDoneButtonClick}
          inputValue={inputValue}
          itemName={itemName}
          error={error}
          isLoading={isLoading}
          suCategory={item}
          setIsEditing={setIsEditing}
        />
      </ListItem>
      <Divider />
    </>
  );
};

export default InteractiveListItem;
