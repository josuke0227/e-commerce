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

  const textInputDefinitions = [
    {
      autoFocus: true,
      error: !!error.length,
      helperText: error,
      id: "email",
      label: "email address",
      onChange: handleInputChange,
      value: email,
    },
  ];

  const formContents = {
    title: "Forgot Password",
    textInputs: <TextInputGenerator definitions={textInputDefinitions} />,
    alert: { message, severity },
    submitButton: (
      <Button
        className={classes.formButton}
        color="primary"
        disabled={shouldDisable()}
        onClick={handleSubmit}
        variant="contained"
      >
        {getButtonContent(message, loading)}
      </Button>
    ),
  };

  function getButtonContent(message, loading) {
    if (message && severity === "success") return "Resend";

    return loading ? <CircularProgress color="inherit" size={20} /> : "Submit";
  }

  function shouldDisable() {
    return email === "" || !!error.length || severity === "error";
  }

  return <AuthFormContents contents={formContents} />;
};

export default ForgotPasswordForm;
