import { makeStyles } from "@material-ui/core/styles";
import SmallLoader from "./SmallLoader";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formButton: theme.formButton,
}));

const ButtonWithLoader = ({
  label,
  handleSubmit,
  loading,
  disabled = false,
}) => {
  const classes = useStyles();
  return (
    <Button
      className={classes.formButton}
      variant="contained"
      color="primary"
      onClick={handleSubmit}
      disabled={disabled}
    >
      {loading ? <SmallLoader /> : label}
    </Button>
  );
};

export default ButtonWithLoader;
