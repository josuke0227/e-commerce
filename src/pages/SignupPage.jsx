import { useState, useEffect } from "react";
import { emailSchema } from "../schemas/authSchema";
import { sendUserEmail, forgotPassword } from "../services/signupServices";
import CenteredCardLayout from "../components/shared/CenteredCardLayout";
import SignupForm from "../components/SignupForm";
import Layout from "../components/Layout";

const SignupPage = ({ match, location }) => {
  const testEmail = "y.motosugi0227@gmail.com";
  const [email, setEmail] = useState(testEmail);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [loading, setLoading] = useState(false);
  const [path, setPath] = useState("");

  useEffect(() => {
    const path = match.path;
    setPath(path);
  }, [match.path, path]);

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
      const service = path === "/signup" ? sendUserEmail : forgotPassword;
      const { data: successMessage } = await service(email);
      setMessage(successMessage);
    } catch (error) {
      const { data: errorMessage } = error.response;
      setMessage(errorMessage);
      setSeverity("error");
    }

    setLoading(false);
  };

  return (
    <Layout location={location}>
      <CenteredCardLayout>
        <SignupForm
          email={email}
          error={error}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          loading={loading}
          message={message}
          path={path}
          setMessage={setMessage}
          setSeverity={setSeverity}
          severity={severity}
        />
      </CenteredCardLayout>
    </Layout>
  );
};

export default SignupPage;
