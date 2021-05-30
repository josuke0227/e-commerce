import { Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import GoogleLogin from "react-google-login";
import { useHistory } from "react-router-dom";
import { signupWithGoogle } from "../../services/signupServices";
import { signinWithGoogle } from "../../services/signinServices";
import { ReactComponent as GoogleIcon } from "../../images/googleIcon.svg";
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  formButton: {
    ...theme.formButton,
    width: "100%",
    marginBottom: "0.5rem",
    textTransform: "none",

    "& > span::first-letter": {
      textTransform: "uppercase",
    },
  },
}));

const GoogleButton = ({ setSeverity, setMessage, label = "Signup" }) => {
  const dispatch = useDispatch();

  const classes = useStyles();
  const history = useHistory();

  const toggleService = (label) => {
    if (label === "Signin") return signinWithGoogle;
    else return signupWithGoogle;
  };

  const handleResponse = async (response) => {
    try {
      const { data, headers } = await toggleService(label)(response);
      const token = headers["x-auth-token"];
      const userData = { ...data, token };
      history.push("/");
      dispatch({
        type: "SIGN_IN_SUCCESS",
        payload: userData,
      });
    } catch (error) {
      const message = error.response.data;
      setMessage(message);
      setSeverity && setSeverity("error");
    }
  };

  return (
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      onSuccess={handleResponse}
      onFailure={handleResponse}
      render={(renderProps) => (
        <Button
          className={classes.formButton}
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
          variant="contained"
          color="default"
          endIcon={<GoogleIcon />}
        >
          {label} with Google
        </Button>
      )}
      cookiePolicy={"single_host_origin"}
    />
  );
};

export default GoogleButton;
