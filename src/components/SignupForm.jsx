import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import GoogleButton from "./GoogleButton";
import FaceBookButton from "./FacebookButton";

const useStyles = makeStyles((theme) => ({
  formTitle: theme.formTitle,
  inputForm: theme.inputForm,
  formButton: theme.formButton,
  formAlert: theme.formAlert,
  formSubtitle: theme.formSubtitle,
}));

const SignupForm = ({
  email,
  error,
  handleInputChange,
  handleSubmit,
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
      <Typography variant="h6" className={classes.formTitle}>
        Signup with email
      </Typography>
      <TextField
        className={classes.inputForm}
        error={!!error.length}
        helperText={error}
        id="email"
        label="email address"
        onChange={handleInputChange}
        value={email}
        autoFocus
      />
      {message && (
        <Alert className={classes.formAlert} severity={severity}>
          {message}
        </Alert>
      )}
      <Button
        className={classes.formButton}
        color="primary"
        disabled={shouldDisable()}
        onClick={handleSubmit}
        variant="contained"
      >
        {getButtonContent(message, loading)}
      </Button>
      <Typography variant="subtitle1" className={classes.formSubtitle}>
        OR
      </Typography>
      <GoogleButton setSeverity={setSeverity} setMessage={setMessage} />
      <FaceBookButton setSeverity={setSeverity} setMessage={setMessage} />
    </>
  );
};

export default SignupForm;
