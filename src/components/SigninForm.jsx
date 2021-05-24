import AuthFormContents from "./shared/AuthFormContents";
import ButtonWithLoader from "./shared/ButtonWIthLoader";
import FaceBookButton from "./shared/FacebookButton";
import GoogleButton from "./shared/GoogleButton";
import TextInputGenerator from "./shared/TextInputGenerator";

const SigninForm = ({
  message,
  data,
  errors,
  handleInputChange,
  handleSubmit,
  loading,
  setMessage,
}) => {
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
      <ButtonWithLoader
        label="Submit"
        handleSubmit={handleSubmit}
        loading={loading}
      />
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
