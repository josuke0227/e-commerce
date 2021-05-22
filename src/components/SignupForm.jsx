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
  inputform: theme.inputForm,
  formButton: theme.formButton,
  subtitle: {
    textAlign: "center",
  },
  title: {
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
      <Typography variant="h6" className={classes.title}>
        Signup with email
      </Typography>
      <TextField
        className={classes.inputform}
        error={!!error.length}
        helperText={error}
        id="email"
        label="email address"
        onChange={handleInputChange}
        value={email}
        autoFocus
      />
      {message && <Alert severity={severity}>{message}</Alert>}
      <Button
        className={classes.formButton}
        color="primary"
        disabled={shouldDisable()}
        onClick={handleSubmit}
        variant="contained"
      >
        {getButtonContent(message, loading)}
      </Button>
      <Typography variant="subtitle1" className={classes.subtitle}>
        OR
      </Typography>
      <GoogleButton setSeverity={setSeverity} setMessage={setMessage} />
      <FaceBookButton setSeverity={setSeverity} setMessage={setMessage} />
    </>
  );
};

export default SignupForm;
