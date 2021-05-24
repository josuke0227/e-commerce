import { makeStyles } from "@material-ui/core/styles";
import { Button, CircularProgress } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formButton: theme.formButton,
}));

const MultipleStateButton = ({
  defaultLabel,
  email,
  error,
  handleSubmit,
  loading,
  message,
  severity,
}) => {
  const classes = useStyles();

  const shouldDisable = () =>
    email === "" || !!error.length || severity === "error";

  const getButtonContent = (message, loading) => {
    if (message && severity === "success") return "Resend";

    return loading ? (
      <CircularProgress color="inherit" size={20} />
    ) : (
      defaultLabel
    );
  };

  return (
    <Button
      className={classes.formButton}
      color="primary"
      disabled={shouldDisable()}
      onClick={handleSubmit}
      variant="contained"
    >
      {getButtonContent(message, loading)}
    </Button>
  );
};

export default MultipleStateButton;
