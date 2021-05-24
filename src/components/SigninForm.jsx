import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Link,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import GoogleButton from "./shared/GoogleButton";
import FaceBookButton from "./shared/FacebookButton";

const useStyles = makeStyles((theme) => ({
  formTitle: theme.formTitle,
  inputForm: theme.inputForm,
  formButton: theme.formButton,
  formAlert: theme.formAlert,
  formSubtitle: theme.formSubtitle,
  formLink: {
    marginBottom: "0.5rem",
  },
}));

const SigninForm = ({
  message,
  data,
  errors,
  handleInputChange,
  handleSubmit,
  loading,
  setMessage,
}) => {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h6" className={classes.formTitle}>
        Signin with email
      </Typography>
      <TextField
        className={classes.inputForm}
        type="email"
        id="email"
        label="email address"
        value={data.email}
        helperText={errors.email}
        onChange={handleInputChange}
        error={!!errors.email && errors.email.length > 0}
      />
      <TextField
        className={classes.inputForm}
        type="password"
        id="password"
        label="password"
        value={data.password}
        helperText={errors.password}
        onChange={handleInputChange}
        error={!!errors.password && errors.password.length > 0}
      />
      {message && (
        <Alert className={classes.formAlert} severity="error">
          {message}
        </Alert>
      )}
      <Link className={classes.formLink} href="/forgotpassword">
        <Typography variant="subtitle2">Forgot password?</Typography>
      </Link>
      <Button
        className={classes.formButton}
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={false}
      >
        {loading ? <CircularProgress color="inherit" size={20} /> : "Submit"}
      </Button>
      <Typography variant="subtitle1" className={classes.formSubtitle}>
        OR
      </Typography>
      <GoogleButton setMessage={setMessage} label="Signin" />
      <FaceBookButton setMessage={setMessage} label="Signin" />
    </>
  );
};

export default SigninForm;
