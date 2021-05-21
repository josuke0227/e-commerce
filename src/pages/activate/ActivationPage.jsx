import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Paper, Button, CircularProgress } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import jwt from "jsonwebtoken";
import { passwordSchema, schemaSelector } from "../../schemas/authSchema";
import { createUser } from "../../services/activationService";

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
  inputForm: {
    width: "100%",
    marginBottom: "1rem",
  },
  registerButton: {
    marginTop: "1rem",
    textTransform: "uppercase",
    marginBottom: "1rem",
  },
  paper: {
    padding: "1rem",
    width: "18rem",
    display: "flex",
    flexDirection: "column",
  },
}));

const ActivationPage = ({ match, history }) => {
  const classes = useStyles();

  const [data, setData] = useState({
    password: "",
    confirmingPassword: "",
  });
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState({
    password: "",
    confirmingPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [createUserError, setCreateUserError] = useState("");

  useEffect(() => {
    if (match.params.token) {
      const token = match.params.token;
      const { email } = jwt.decode(token);
      setEmail(email);
      setToken(token);
    }
  }, [match.params, email]);

  const handleInputChange = (e) => {
    e.preventDefault();
    const { id: path, value: password } = e.target;

    const updatedData = { ...data, [path]: password };
    const result = passwordSchema.validate(password);
    setData(updatedData);

    const updatedError = {
      ...error,
      [path]: getErrorMessage(updatedData, path, result),
    };
    setError(updatedError);
  };

  const getErrorMessage = (data, path, result) => {
    if (path === "password") return getPasswordErrorMessage(result);

    if (path === "confirmingPassword")
      return getConfirmingPasswordMessage(data);
  };

  const getPasswordErrorMessage = (result) => {
    if (!result.error) return false;

    const { error } = result;
    if (error.message.includes("[a-zA-Z0-9]")) {
      return "Please use 'a-z', 'A-Z' and '0-9";
    } else {
      return error.message;
    }
  };

  const getConfirmingPasswordMessage = (data) => {
    if (data.password !== data.confirmingPassword) {
      return "password and confirming password must be the same";
    }
    return false;
  };

  const isDisabled = () =>
    error.password === "" ||
    error.confirmingPassword === "" ||
    error.password.length > 0 ||
    error.confirmingPassword.length > 0;

  const handleSubmit = async () => {
    setLoading(true);
    const userCredential = {
      ...data,
      email,
      token,
    };
    const userSchema = schemaSelector([
      "email",
      "password",
      "confirmingPassword",
      "token",
    ]);

    const { error } = userSchema.validate(userCredential, {
      abortEarly: false,
    });

    if (error) {
      setCreateUserError(error.message);
      setLoading(false);
      return;
    }

    doSubmit(userCredential);
  };

  const doSubmit = async (data) => {
    try {
      await createUser(data);
      history.push("/");
      return setLoading(false);
    } catch (error) {
      const { data: message } = error.response;
      setCreateUserError(message);
      return setLoading(false);
    }
  };

  return (
    <div className={classes.container}>
      <Paper className={classes.paper}>
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
          className={classes.registerButton}
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isDisabled()}
        >
          {loading ? <CircularProgress color="inherit" size={20} /> : "Submit"}
        </Button>
      </Paper>
    </div>
  );
};

export default ActivationPage;
