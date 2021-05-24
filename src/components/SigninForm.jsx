import { makeStyles } from "@material-ui/core/styles";
import { Button, CircularProgress } from "@material-ui/core";
import GoogleButton from "./shared/GoogleButton";
import FaceBookButton from "./shared/FacebookButton";
import TextInputGenerator from "./shared/TextInputGenerator";
import AuthFormContents from "./shared/AuthFormContents";

const useStyles = makeStyles((theme) => ({
  formTitle: theme.formTitle,
  formButton: theme.formButton,
  formAlert: theme.formAlert,
  formSubtitle: theme.formSubtitle,
  formLink: {
    marginBottom: "0.5rem",
  },
}));

const SigninForm = ({
  message,
  data,
  errors,
  handleInputChange,
  handleSubmit,
  loading,
  setMessage,
}) => {
  const classes = useStyles();

  const textInputDefinitions = [
    {
      error: !!errors.email && !!errors.email.length,
      helperText: errors.email,
      id: "email",
      label: "email address",
      onChange: handleInputChange,
      type: "email",
      value: data.email,
    },
    {
      error: !!errors.password && !!errors.password.length,
      helperText: errors.password,
      id: "password",
      label: "password",
      onChange: handleInputChange,
      type: "password",
      value: data.password,
    },
  ];

  const formContents = {
    title: "Signin with email",
    textInputs: <TextInputGenerator definitions={textInputDefinitions} />,
    alert: { message, severity: "error" },
    submitButton: (
      <Button
        className={classes.formButton}
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={false}
      >
        {loading ? <CircularProgress color="inherit" size={20} /> : "Submit"}
      </Button>
    ),
    SNSButtons: (
      <>
        <GoogleButton setMessage={setMessage} label="Signin" />
        <FaceBookButton setMessage={setMessage} label="Signin" />
      </>
    ),
  };

  return <AuthFormContents contents={formContents} signin />;
};

export default SigninForm;
