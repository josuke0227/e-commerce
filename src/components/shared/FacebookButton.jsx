import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import FacebookIcon from "@material-ui/icons/Facebook";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { useHistory } from "react-router-dom";
import { signupWithFacebook } from "../../services/signupServices";
import { signinWithFacebook } from "../../services/signinServices";

const useStyles = makeStyles((theme) => ({
  faceBookIcon: {
    fontSize: "24px",
  },
}));

const SignupButton = withStyles((theme) => ({
  root: {
    color: "#fff",
    backgroundColor: "#4267B2",
    marginTop: "1rem",
    marginBottom: "0.5rem",
    "&:hover": {
      backgroundColor: "#375694",
    },
  },
  label: {
    textTransform: "none",
  },
}))(Button);

const FacebookButton = ({ setMessage, setSeverity, label = "Signup" }) => {
  const classes = useStyles();
  const history = useHistory();

  const toggleService = (label) => {
    if (label === "Signin") return signinWithFacebook;
    else return signupWithFacebook;
  };

  const handleResponse = async (response) => {
    try {
      const { data } = await toggleService(label)(response);
      console.log("data :>> ", data);
      // TODO: Add data to global status;
      history.push("/");
    } catch (error) {
      const message = error.response.data;
      setMessage(message);
      setSeverity && setSeverity("error");
    }
  };

  return (
    <FacebookLogin
      appId={process.env.REACT_APP_FACEBOOK_APP_ID}
      autoLoad={false}
      callback={handleResponse}
      render={(renderProps) => (
        <SignupButton
          onClick={renderProps.onClick}
          variant="contained"
          endIcon={<FacebookIcon className={classes.faceBookIcon} />}
        >
          {label} with Facebook
        </SignupButton>
      )}
    />
  );
};

export default FacebookButton;
