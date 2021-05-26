import { useState } from "react";
import { schemaSelector } from "../schemas/authSchema";
import { signin } from "../services/signinServices";
import CenteredCardLayout from "../components/shared/CenteredCardLayout";
import SigninForm from "../components/SigninForm";
import { useDispatch } from "react-redux";

const SigninPage = ({ history }) => {
  const dispatch = useDispatch();

  const [data, setData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    e.preventDefault();
    const { id: path, value } = e.target;
    setData({ ...data, [path]: value });
    setErrors({ ...errors, [path]: "" });
    setMessage("");
  };

  const handleSubmit = () => {
    setLoading(true);
    const schemas = schemaSelector(["email", "password"]);
    const result = schemas.validate(data, {
      abortEarly: false,
    });
    if (result.error) {
      const { details } = result.error;

      let updatedError = {};
      details.forEach((d) => {
        const { path, message } = d;
        updatedError = { ...updatedError, [path]: message };
      });
      setLoading(false);
      return setErrors(updatedError);
    }
    doSubmit(data);
  };

  const doSubmit = async (data) => {
    try {
      const response = await signin(data);
      const token = response.headers["x-auth-token"];
      const userData = { ...response.data, token };
      history.push("/");
      dispatch({
        type: "SIGN_IN_SUCCESS",
        payload: userData,
      });
    } catch (error) {
      setMessage(error.response.data);
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <CenteredCardLayout>
      <SigninForm
        data={data}
        errors={errors}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        loading={loading}
        message={message}
        setMessage={setMessage}
      />
    </CenteredCardLayout>
  );
};

export default SigninPage;
