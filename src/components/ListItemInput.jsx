import { makeStyles } from "@material-ui/core/styles";
import { TextField, Tooltip } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
  },
}));

const ListItemInput = ({
  inputValue,
  handleInputChange,
  error,
  showTooltip,
}) => {
  const tooltipStyle = useStyle();

  return (
    <Tooltip
      placement="top"
      classes={tooltipStyle}
      arrow
      title={error}
      open={showTooltip}
    >
      <TextField autoFocus value={inputValue} onChange={handleInputChange} />
    </Tooltip>
  );
};

export default ListItemInput;
