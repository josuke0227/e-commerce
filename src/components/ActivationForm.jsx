import { makeStyles } from "@material-ui/core/styles";
import { Button, CircularProgress } from "@material-ui/core";
import TextInputGenerator from "./shared/TextInputGenerator";
import AuthFormContents from "./shared/AuthFormContents";

const useStyles = makeStyles((theme) => ({
  formTitle: theme.formTitle,
  inputForm: theme.inputForm,
  formButton: theme.formButton,
  formAlert: theme.formAlert,
  formSubtitle: theme.formSubtitle,
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

  const shouldDisable = () =>
    error.password === "" ||
    error.confirmingPassword === "" ||
    error.password.length > 0 ||
    error.confirmingPassword.length > 0;

  const textInputDefinitions = [
    {
      disabled: true,
      id: "email",
      label: "your email address",
      value: email,
    },
    {
      autoFocus: true,
      error: !!error.password.length,
      helperText: !!error.password && error.password,
      id: "password",
      label: "enter password",
      onChange: handleInputChange,
      type: "password",
      value: data.password,
    },
    {
      error: !!error.confirmingPassword.length,
      helperText: !!error.confirmingPassword && error.confirmingPassword,
      id: "confirmingPassword",
      label: "confirm password",
      onChange: handleInputChange,
      type: "password",
      value: data.confirmingPassword,
    },
  ];

  const formContents = {
    title: "Please set your password to activate your account.",
    textInputs: <TextInputGenerator definitions={textInputDefinitions} />,
    alert: { message: createUserError, severity: "error" },
    submitButton: (
      <Button
        className={classes.formButton}
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={shouldDisable()}
      >
        {loading ? <CircularProgress color="inherit" size={20} /> : "Submit"}
      </Button>
    ),
  };

  return <AuthFormContents contents={formContents} />;
};

export default ActivationForm;
