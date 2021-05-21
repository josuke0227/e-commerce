import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, CircularProgress } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  inputform: theme.inputForm,
  formButton: theme.formButton,
}));

const ActivationForm = ({
  createUserError,
  data,
  email,
  error,
  handleInputChange,
  handleSubmit,
  loading,
}) => {
  const classes = useStyles();

  const isDisabled = () =>
    error.password === "" ||
    error.confirmingPassword === "" ||
    error.password.length > 0 ||
    error.confirmingPassword.length > 0;

  return (
    <>
      <TextField
        className={classes.inputForm}
        id="email"
        label="your email address"
        value={email}
        disabled
      />
      <TextField
        autoFocus
        type="password"
        className={classes.inputForm}
        id="password"
        label="enter password"
        value={data.password}
        helperText={!!error.password && error.password}
        onChange={handleInputChange}
        error={error.password.length > 0}
      />
      <TextField
        type="password"
        className={classes.inputForm}
        id="confirmingPassword"
        label="confirm password"
        value={data.confirmingPassword}
        helperText={!!error.confirmingPassword && error.confirmingPassword}
        onChange={handleInputChange}
        error={error.confirmingPassword.length > 0}
      />
      {createUserError && <Alert severity="error">{createUserError}</Alert>}
      <Button
        className={classes.formButton}
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={isDisabled()}
      >
        {loading ? <CircularProgress color="inherit" size={20} /> : "Submit"}
      </Button>
    </>
  );
};

export default ActivationForm;
