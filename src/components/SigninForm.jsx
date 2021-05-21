import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, CircularProgress } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  inputForm: {
    width: "100%",
    marginBottom: "1rem",
  },
  registerButton: {
    marginTop: "1rem",
    textTransform: "uppercase",
    marginBottom: "1rem",
  },
}));

const SigninForm = ({
  authError,
  data,
  errors,
  handleInputChange,
  handleSubmit,
  loading,
}) => {
  const classes = useStyles();

  return (
    <>
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
      {authError && <Alert severity="error">{authError}</Alert>}
      <Button
        className={classes.registerButton}
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={false}
      >
        {loading ? <CircularProgress color="inherit" size={20} /> : "Submit"}
      </Button>
    </>
  );
};

export default SigninForm;
