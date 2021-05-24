import AuthFormContents from "./shared/AuthFormContents";
import FaceBookButton from "./shared/FacebookButton";
import GoogleButton from "./shared/GoogleButton";
import MultipleStateButton from "./shared/MultipleStateButton";
import TextInputGenerator from "./shared/TextInputGenerator";

const SignupForm = ({
  email,
  error,
  handleInputChange,
  handleSubmit,
  loading,
  message,
  path,
  setMessage,
  setSeverity,
  severity,
}) => {
  const isSignupPage = () => path === "/signup";

  const setTitle = () =>
    isSignupPage() ? "Signup with email" : "Forgot Password";

  const setSNSButtons = () =>
    isSignupPage() && (
      <>
        <GoogleButton setSeverity={setSeverity} setMessage={setMessage} />
        <FaceBookButton setSeverity={setSeverity} setMessage={setMessage} />
      </>
    );

  const getDefaultLabel = () => (isSignupPage() ? "Signup" : "Submit");

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
    title: setTitle(),
    textInputs: <TextInputGenerator definitions={textInputDefinitions} />,
    alert: { message, severity },
    submitButton: (
      <MultipleStateButton
        defaultLabel={getDefaultLabel()}
        email={email}
        error={error}
        handleSubmit={handleSubmit}
        loading={loading}
        message={message}
        severity={severity}
      />
    ),
    SNSButtons: setSNSButtons(),
  };

  return <AuthFormContents contents={formContents} />;
};

export default SignupForm;
