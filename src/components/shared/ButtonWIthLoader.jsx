import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import SmallLoader from "./SmallLoader";

const useStyles = makeStyles((theme) => ({
  formButton: theme.formButton,
}));

const ButtonWithLoader = ({
  label,
  handleSubmit,
  loading,
  disabled = false,
  fullWidth,
  loaderSize,
}) => {
  const classes = useStyles();
  return (
    <Button
      className={classes.formButton}
      color="primary"
      disabled={disabled}
      onClick={handleSubmit}
      variant="contained"
      fullWidth={fullWidth}
    >
      {loading ? <SmallLoader loaderSize={loaderSize} /> : label}
    </Button>
  );
};

export default ButtonWithLoader;
