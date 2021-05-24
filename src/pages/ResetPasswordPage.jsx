import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import { passwordSchema, schemaSelector } from "../schemas/authSchema";
import { resetPassword } from "../services/resetPasswordServices";
import CenteredCardLayout from "../components/shared/CenteredCardLayout";
import ResetPasswordForm from "../components/ResetPasswordForm";

const ResetPasswordPage = ({ match, history }) => {
  const [data, setData] = useState({
    password: "",
    confirmingPassword: "",
  });
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState({
    password: "",
    confirmingPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [createUserError, setCreateUserError] = useState("");

  useEffect(() => {
    if (match.params.token) {
      const token = match.params.token;
      const { email } = jwt.decode(token);
      setEmail(email);
      setToken(token);
    }
  }, [match.params, email]);

  const handleInputChange = (e) => {
    e.preventDefault();
    const { id: path, value: password } = e.target;

    const updatedData = { ...data, [path]: password };
    const result = passwordSchema.validate(password);
    setData(updatedData);

    const updatedError = {
      ...error,
      [path]: getErrorMessage(updatedData, path, result),
    };
    setError(updatedError);
  };

  const getErrorMessage = (data, path, result) => {
    if (path === "password") return getPasswordErrorMessage(result);

    if (path === "confirmingPassword")
      return getConfirmingPasswordMessage(data);
  };

  const getPasswordErrorMessage = (result) => {
    if (!result.error) return false;

    const { error } = result;
    if (error.message.includes("[a-zA-Z0-9]")) {
      return "Please use 'a-z', 'A-Z' and '0-9";
    } else {
      return error.message;
    }
  };

  const getConfirmingPasswordMessage = (data) => {
    if (data.password !== data.confirmingPassword) {
      return "password and confirming password must be the same";
    }
    return false;
  };

  const handleSubmit = async () => {
    setLoading(true);
    const userCredential = {
      ...data,
      email,
      token,
    };
    const userSchema = schemaSelector([
      "email",
      "password",
      "confirmingPassword",
      "token",
    ]);

    const { error } = userSchema.validate(userCredential, {
      abortEarly: false,
    });

    if (error) {
      setCreateUserError(error.message);
      setLoading(false);
      return;
    }

    doSubmit(userCredential);
  };

  const doSubmit = async (data) => {
    try {
      // TODO: right place to set user credential to global state.
      await resetPassword(data);
      history.push("/signin");
      return setLoading(false);
    } catch (error) {
      const { data: message } = error.response;
      setCreateUserError(message);
      return setLoading(false);
    }
  };

  return (
    <CenteredCardLayout>
      <ResetPasswordForm
        createUserError={createUserError}
        data={data}
        email={email}
        error={error}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        loading={loading}
      />
    </CenteredCardLayout>
  );
};

export default ResetPasswordPage;
