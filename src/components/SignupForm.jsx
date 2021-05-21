import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, CircularProgress } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  inputform: theme.inputForm,
  formButton: theme.formButton,
}));

const SignupForm = ({
  email,
  error,
  handleInputChange,
  handleSubmit,
  loading,
  message,
  severity,
}) => {
  const classes = useStyles();

  const getButtonContent = (message, loading) => {
    if (message && severity === "success") return "Resend";

    return loading ? <CircularProgress color="inherit" size={20} /> : "Signup";
  };

  const shouldDisableButton = () =>
    email === "" || !!error.length || severity === "error";

  return (
    <>
      <TextField
        className={classes.inputform}
        id="email"
        label="email address"
        helperText={error}
        value={email}
        onChange={handleInputChange}
        error={!!error.length}
      />
      {message && <Alert severity={severity}>{message}</Alert>}
      <Button
        className={classes.formButton}
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={shouldDisableButton()}
      >
        {getButtonContent(message, loading)}
      </Button>
    </>
  );
};

export default SignupForm;
