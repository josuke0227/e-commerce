import { makeStyles } from "@material-ui/core/styles";
import { TextField, Tooltip } from "@material-ui/core";

const useStylesBootstrap = makeStyles((theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
  },
}));

const ListItemInput = ({ name, handleInputChange, error, showTooltip }) => {
  const tooltipStyle = useStylesBootstrap();

  return (
    <Tooltip
      placement="top"
      classes={tooltipStyle}
      arrow
      title={error}
      open={showTooltip}
    >
      <TextField autoFocus value={name} onChange={handleInputChange} />
    </Tooltip>
  );
};

export default ListItemInput;
