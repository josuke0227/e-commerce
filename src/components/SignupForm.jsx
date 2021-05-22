import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, CircularProgress } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import GoogleButton from "./GoogleButton";

const useStyles = makeStyles((theme) => ({
  inputform: theme.inputForm,
  formButton: theme.formButton,
}));

const SignupForm = ({
  email,
  error,
  handleInputChange,
  handleSubmit,
  informParent,
  loading,
  message,
  setMessage,
  setSeverity,
  severity,
}) => {
  const classes = useStyles();

  const getButtonContent = (message, loading) => {
    if (message && severity === "success") return "Resend";

    return loading ? <CircularProgress color="inherit" size={20} /> : "Signup";
  };

  const shouldDisable = () =>
    email === "" || !!error.length || severity === "error";

  return (
    <>
      <TextField
        className={classes.inputform}
        error={!!error.length}
        helperText={error}
        id="email"
        label="email address"
        onChange={handleInputChange}
        value={email}
      />
      {message && <Alert severity={severity}>{message}</Alert>}
      <GoogleButton
        informParent={informParent}
        setSeverity={setSeverity}
        setMessage={setMessage}
      />
      <Button
        className={classes.formButton}
        color="primary"
        disabled={shouldDisable()}
        onClick={handleSubmit}
        variant="contained"
      >
        {getButtonContent(message, loading)}
      </Button>
    </>
  );
};

export default SignupForm;
