import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Paper, Button, CircularProgress } from "@material-ui/core";
import { schemaSelector } from "../../schemas/authSchema";
import { signin } from "../../services/signinServices";
import Alert from "@material-ui/lab/Alert";

// TODO: use common schema
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

const SigninPage = ({ history }) => {
  const classes = useStyles();
  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    e.preventDefault();
    const { id: path, value } = e.target;
    setData({ ...data, [path]: value });
    setErrors({ ...errors, [path]: "" });
    setAuthError("");
  };

  const handleSubmit = () => {
    setLoading(true);
    const schemas = schemaSelector(["email", "password"]);
    const result = schemas.validate(data, {
      abortEarly: false,
    });
    if (result.error) {
      const { details } = result.error;

      let updatedError = {};
      details.forEach((d) => {
        const { path, message } = d;
        updatedError = { ...updatedError, [path]: message };
      });
      setLoading(false);
      return setErrors(updatedError);
    }
    doSubmit(data);
  };

  const doSubmit = async (data) => {
    try {
      await signin(data);
      history.push("/");
      // TODO: set user credential to global state.
    } catch (error) {
      setAuthError(error.response.data);
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div className={classes.container}>
      <Paper className={classes.paper}>
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
      </Paper>
    </div>
  );
};

export default SigninPage;
