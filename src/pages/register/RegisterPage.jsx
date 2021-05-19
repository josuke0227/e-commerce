import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Paper,
  Button,
  LinearProgress,
  Typography,
} from "@material-ui/core";
import { emailShcema } from "./schema";
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
    width: "16rem",
  },
}));

const RegisterPage = () => {
  const testEmail = "y.motosugi0227@gmail.com";
  const [email, setEmail] = useState(testEmail);
  const [error, setError] = useState({});
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);

  const classes = useStyles();

  const handleInputChange = ({ target }) => {
    const email = target.value;
    const result = emailShcema.validate(email);
    setError(result.error || null);
    setEmail(target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await sendUserEmail(email);
      setMessage(data.message);
    } catch (error) {
      setMessage(error.message);
    }

    setLoading(false);
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
          {message ? "Resend" : "Register Now"}
        </Button>
        {loading && <LinearProgress className={classes.progressBar} />}
        <Typography variant="subtitle1">{message}</Typography>
      </Paper>
    </div>
  );
};

export default RegisterPage;
