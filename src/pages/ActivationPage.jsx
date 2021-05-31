import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import { passwordSchema, schemaSelector } from "../schemas/authSchema";
import { createUser } from "../services/activationServices";
import { resetPassword } from "../services/resetPasswordServices";
import CenteredCardLayout from "../components/shared/CenteredCardLayout";
import ActivationForm from "../components/ActivationForm";
import { useDispatch } from "react-redux";

const ActivationPage = ({ match, history }) => {
  const dispatch = useDispatch();

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
  const [isActivationPage, setIsActivationPage] = useState(false);

  useEffect(() => {
    const { path, params } = match;

    const getFirstEndpont = () => path.split("/")[1];

    try {
      const token = params.token;
      const { email } = jwt.decode(token);
      setIsActivationPage(getFirstEndpont() === "activate");
      setEmail(email);
      setToken(token);
    } catch (error) {
      console.log(error);
    }
  }, [match, email]);

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
    const service = isActivationPage ? createUser : resetPassword;

    try {
      const response = await service(data);
      const token = response.headers["x-auth-token"];
      const userData = { ...response.data, token };
      history.push("/");
      dispatch({
        type: "SIGN_IN_SUCCESS",
        payload: userData,
      });
      setLoading(false);
    } catch (error) {
      const { data: message } = error.response;
      setCreateUserError(message);
      setLoading(false);
    }
  };

  return (
    <CenteredCardLayout>
      <ActivationForm
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

export default ActivationPage;
