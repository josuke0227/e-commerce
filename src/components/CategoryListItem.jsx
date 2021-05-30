import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  CircularProgress,
} from "@material-ui/core";
import {
  DeleteOutlineSharp as DeleteIcon,
  EditOutlined as EditICon,
  CheckCircleOutlined as DoneIcon,
  Undo as UndoIcon,
} from "@material-ui/icons/";
import ListItemInput from "./ListItemInput";

import { categorySchema } from "../schemas/categorySchema";

const useStyles = makeStyles((theme) => ({
  typographyRoot: {
    marginBottom: "1rem",
  },
  createCategoryForm: {
    marginBottom: "1rem",
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  list: {
    overflowY: "scroll",
    maxHeight: "250px",
  },
  listPadding: {
    padding: 0,
  },
  buttonIconRoot: {
    color: theme.palette.success.main,
  },
  listItemText: {
    maxWidth: "200px",
    overflow: "hidden",
    overflowX: "scroll",
  },
}));

const CategoryListItem = ({
  category,
  doCategoryUpdate,
  setSelectedCategory,
  listLoading,
  setDialogOpen,
}) => {
  const { name: categoryName } = category;

  const classes = useStyles();

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
    setDialogOpen(true);
    setSelectedCategory(category);
  };

  const toggleEditIcon = () =>
    isEditing ? (
      <>
        <IconButton
          edge="end"
          color="default"
          aria-label="edit"
          onClick={onUndoButtonClick}
        >
          <UndoIcon />
        </IconButton>
        <IconButton
          classes={{ root: classes.buttonIconRoot }}
          edge="end"
          aria-label="edit"
          onClick={handleDoneButtonClick}
          disabled={!!error || name === categoryName}
        >
          <DoneIcon />
        </IconButton>
      </>
    ) : (
      <IconButton
        edge="end"
        color="primary"
        aria-label="edit"
        onClick={() => setIsEditing(true)}
      >
        <EditICon />
      </IconButton>
    );

  const toggleListHeader = () =>
    isEditing ? (
      <ListItemInput
        defaultValue={categoryName}
        name={name}
        handleInputChange={handleInputChange}
        error={error}
        showTooltip={showTooltip}
      />
    ) : (
      <ListItemText className={classes.listItemText} primary={name} />
    );

  const showLoader = () => {
    return listLoading[category.slug] === true;
  };

  return (
    <>
      <ListItem key={categoryName}>
        {toggleListHeader()}
        <ListItemSecondaryAction>
          {showLoader() ? (
            <IconButton>
              <CircularProgress size={22} />
            </IconButton>
          ) : (
            <>
              {toggleEditIcon()}
              <IconButton
                edge="end"
                color="secondary"
                aria-label="delete"
                onClick={handleDeleteButtonClick}
              >
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </ListItemSecondaryAction>
      </ListItem>
      <Divider />
    </>
  );
};

export default CategoryListItem;
