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
  categoryName,
  handleInputChange,
  error,
  showTooltip,
  name,
}) => {
  const classes = useStyles();

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

  return toggleListHeader();
};

export default ListHeader;
