import { useState } from "react";
import { emailSchema } from "../schemas/authSchema";
import { sendUserEmail } from "../services/signupServices";
import CenteredCardLayout from "../components/shared/CenteredCardLayout";
import SignupForm from "../components/SignupForm";

const SignupPage = ({ match }) => {
  const testEmail = "y.motosugi0227@gmail.com";
  const [email, setEmail] = useState(testEmail);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [loading, setLoading] = useState(false);

  const handleInputChange = ({ target }) => {
    const email = target.value;
    const { error } = emailSchema.validate(email);
    setError(error ? error.message : "");
    setMessage("");
    setSeverity("success");
    setEmail(target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = emailSchema.validate(email);
    if (error) {
      setLoading(false);
      setError(error.message);
      return;
    }

    try {
      const { data: successMessage } = await sendUserEmail(email);
      setMessage(successMessage);
    } catch (error) {
      const { data: errorMessage } = error.response;
      setMessage(errorMessage);
      setSeverity("error");
    }

    setLoading(false);
  };

  return (
    <CenteredCardLayout>
      <SignupForm
        email={email}
        error={error}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        loading={loading}
        message={message}
        severity={severity}
        setMessage={setMessage}
        setSeverity={setSeverity}
      />
    </CenteredCardLayout>
  );
};

export default SignupPage;
