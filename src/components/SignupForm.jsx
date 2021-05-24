import { makeStyles } from "@material-ui/core/styles";
import { Button, CircularProgress } from "@material-ui/core";
import GoogleButton from "./shared/GoogleButton";
import FaceBookButton from "./shared/FacebookButton";
import TextInputGenerator from "./shared/TextInputGenerator";
import AuthFormContents from "./shared/AuthFormContents";

const useStyles = makeStyles((theme) => ({
  formTitle: theme.formTitle,
  inputForm: theme.inputForm,
  formButton: theme.formButton,
  formAlert: theme.formAlert,
  formSubtitle: theme.formSubtitle,
}));

const SignupForm = ({
  email,
  error,
  handleInputChange,
  handleSubmit,
  loading,
  message,
  setMessage,
  setSeverity,
  severity,
}) => {
  const classes = useStyles();

  const getButtonContent = (message, loading) => {
    if (message && severity === "success") return "Resend";

    return loading ? <CircularProgress color="inherit" size={20} /> : "Signup";
  };

  const shouldDisable = () =>
    email === "" || !!error.length || severity === "error";

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
    title: "Signup with email",
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
    SNSButtons: (
      <>
        <GoogleButton setSeverity={setSeverity} setMessage={setMessage} />
        <FaceBookButton setSeverity={setSeverity} setMessage={setMessage} />
      </>
    ),
  };

  return <AuthFormContents contents={formContents} />;
};

export default SignupForm;
