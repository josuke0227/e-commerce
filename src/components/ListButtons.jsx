import { makeStyles } from "@material-ui/core/styles";
import {
  ListItemSecondaryAction,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import {
  DeleteOutlineSharp as DeleteIcon,
  EditOutlined as EditICon,
  CheckCircleOutlined as DoneIcon,
  Undo as UndoIcon,
} from "@material-ui/icons/";

const useStyles = makeStyles((theme) => ({
  buttonIconRoot: {
    color: theme.palette.success.main,
  },
}));

const ListButtons = ({
  handleDeleteButtonClick,
  isEditing,
  onUndoButtonClick,
  handleDoneButtonClick,
  inputValue,
  itemName,
  error,
  listItemLoading,
  item,
  setIsEditing,
}) => {
  const classes = useStyles();

  const toggleEditButtons = () =>
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
          disabled={!!error || inputValue === itemName}
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

  const showLoader = () => {
    return listItemLoading[item.slug] === true;
  };

  return (
    <ListItemSecondaryAction>
      {showLoader() ? (
        <IconButton>
          <CircularProgress size={22} />
        </IconButton>
      ) : (
        <>
          {toggleEditButtons()}
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
  );
};
export default ListButtons;
