import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Paper, Button, CircularProgress } from "@material-ui/core";
import jwt from "jsonwebtoken";
import { passwordSchema } from "./schema";

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
    width: "16rem",
    display: "flex",
    flexDirection: "column",
  },
}));

const ActivationPage = ({ match }) => {
  const classes = useStyles();

  const [data, setData] = useState({
    email: "",
    password: "",
    confirmingPassword: "",
    token: "",
  });
  const [error, setError] = useState({});

  useEffect(() => {
    if (match.params.token) {
      const token = match.params.token;
      const { email } = jwt.decode(token);
      setData({ ...data, email, token });
    }
  }, []);

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
    if (!result.error) return null;

    const { error } = result;
    if (error.message.includes("[a-zA-Z0-9]")) {
      return "Please use 'a-z', 'A-Z' and '0-9";
    } else {
      return error.message;
    }
  };

  const getConfirmingPasswordMessage = (data) => {
    if (data.password === data.confirmingPassword) {
      return null;
    }
    return "password and confirming password must be the same";
  };

  const handleSubmit = () => {
    // TODO: check the shape of submitting data.
    console.log(data);
  };

  return (
    <div className={classes.container}>
      <Paper className={classes.paper}>
        <TextField
          className={classes.inputForm}
          id="email"
          label="your email address"
          value={data.email}
          disabled
        />
        <TextField
          type="password"
          className={classes.inputForm}
          id="password"
          label="enter password"
          value={data.password}
          helperText={error && error.password}
          onChange={handleInputChange}
          error={error.password}
        />
        <TextField
          type="password"
          className={classes.inputForm}
          id="confirmingPassword"
          label="confirm password"
          value={data.confirmingPassword}
          helperText={error && error.confirmingPassword}
          onChange={handleInputChange}
          error={error.confirmingPassword}
        />
        <Button
          className={classes.registerButton}
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={false}
        >
          Submit
          {/* <CircularProgress color="inherit" size={20} /> */}
        </Button>
      </Paper>
    </div>
  );
};

export default ActivationPage;
