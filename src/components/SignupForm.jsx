import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, CircularProgress } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  registerForm: {
    width: "100%",
  },
  registerButton: {
    marginTop: "1rem",
    textTransform: "uppercase",
    marginBottom: "1rem",
  },
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
        className={classes.registerForm}
        id="email"
        label="email address"
        helperText={error}
        value={email}
        onChange={handleInputChange}
        error={!!error.length}
      />
      <Button
        className={classes.registerButton}
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={shouldDisableButton()}
      >
        {getButtonContent(message, loading)}
      </Button>
      {message && <Alert severity={severity}>{message}</Alert>}
    </>
  );
};

export default SignupForm;
