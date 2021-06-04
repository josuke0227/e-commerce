import { makeStyles } from "@material-ui/core/styles";
import { ListItemText } from "@material-ui/core";
import ListItemInput from "./ListItemInput";

const useStyles = makeStyles((theme) => ({
  listItemText: {
    maxWidth: "200px",
    overflow: "hidden",
    overflowX: "scroll",
  },
}));

const ListHeader = ({
  isEditing,
  itemName,
  handleInputChange,
  error,
  showTooltip,
  inputValue,
}) => {
  const classes = useStyles();

  const toggleListHeader = () =>
    isEditing ? (
      <ListItemInput
        defaultValue={itemName}
        inputValue={inputValue}
        handleInputChange={handleInputChange}
        error={error}
        showTooltip={showTooltip}
      />
    ) : (
      <ListItemText className={classes.listItemText} primary={itemName} />
    );

  return toggleListHeader();
};

export default ListHeader;
