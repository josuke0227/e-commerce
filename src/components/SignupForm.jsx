import GoogleButton from "./shared/GoogleButton";
import FaceBookButton from "./shared/FacebookButton";
import TextInputGenerator from "./shared/TextInputGenerator";
import AuthFormContents from "./shared/AuthFormContents";
import MultipleStateButton from "./shared/MultipleStateButton";

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
  path,
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
        email={email}
        handleSubmit={handleSubmit}
        message={message}
        loading={loading}
        error={error}
        severity={severity}
        defaultLabel={getDefaultLabel()}
      />
    ),
    SNSButtons: setSNSButtons(),
  };

  return <AuthFormContents contents={formContents} />;
};

export default SignupForm;
