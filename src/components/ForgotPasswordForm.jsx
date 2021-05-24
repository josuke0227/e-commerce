import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  formTitle: theme.formTitle,
  inputForm: theme.inputForm,
  formButton: theme.formButton,
  formAlert: theme.formAlert,
  formSubtitle: theme.formSubtitle,
}));

const ForgotPasswordForm = ({
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

    return loading ? <CircularProgress color="inherit" size={20} /> : "Submit";
  };

  const shouldDisable = () =>
    email === "" || !!error.length || severity === "error";

  return (
    <>
      <Typography variant="h6" className={classes.formTitle}>
        Forgot Password
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
    </>
  );
};

export default ForgotPasswordForm;
