import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Paper, Button, CircularProgress } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { emailSchema } from "../../schemas/authSchema";
import { sendUserEmail } from "../../services/signupServices";

const useStyles = makeStyles((theme) => ({
  container: {
    minWidth: "-webkit-fill-available",
    minHeight: "-webkit-fill-available",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    [theme.breakpoints.up("sm")]: {
      minWidth: "100vw",
      minHeight: "100vh",
    },
  },
  registerForm: {
    width: "100%",
  },
  registerButton: {
    marginTop: "1rem",
    textTransform: "uppercase",
    marginBottom: "1rem",
  },
  paper: {
    padding: "1rem",
    width: "18rem",
  },
}));

const SignupPage = () => {
  const testEmail = "y.motosugi0227@gmail.com";
  const [email, setEmail] = useState(testEmail);
  const [error, setError] = useState({});
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState(null);

  const classes = useStyles();

  const handleInputChange = ({ target }) => {
    const email = target.value;
    const result = emailSchema.validate(email);
    setError(result.error || null);
    setEmail(target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = emailSchema.validate(email);
    if (error) {
      setLoading(false);
      setError(error);
      return;
    }

    try {
      const { data, status } = await sendUserEmail(email);
      setMessage(data);
      setResponseStatus(status);
    } catch (error) {
      const { data: errorMessage, status } = error.response;
      setMessage(errorMessage);
      setResponseStatus(status);
    }

    setLoading(false);
  };

  const getSeverity = (responseStatus) => {
    if (responseStatus > 199 && responseStatus < 300) return "success";
    if (responseStatus > 399 && responseStatus < 600) return "error";
  };

  const getButtonContent = (message, loading) => {
    if (message && !loading) return "Resend";

    if (loading) return <CircularProgress color="inherit" size={20} />;

    return "Signup";
  };

  return (
    <div className={classes.container}>
      <Paper className={classes.paper} elevation={3}>
        <TextField
          className={classes.registerForm}
          id="standard-basic"
          label="email address"
          helperText={error && error.message}
          value={email}
          onChange={handleInputChange}
          error={error && Object.keys(error).length > 0}
        />
        <Button
          className={classes.registerButton}
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={error !== null}
        >
          {getButtonContent(message, loading)}
        </Button>
        {message && (
          <Alert severity={getSeverity(responseStatus)}>{message}</Alert>
        )}
      </Paper>
    </div>
  );
};

export default SignupPage;
