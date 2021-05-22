import React from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import FacebookIcon from "@material-ui/icons/Facebook";
import { signupWithFacebook } from "../services/signupServices";
import { useHistory } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  faceBookIcon: {
    fontSize: "24px",
  },
  formButton: {
    ...theme.formButton,
    width: "100%",
    marginBottom: "0.5rem",
    textTransform: "none",
  },
}));

const SignupButton = withStyles((theme) => ({
  root: {
    color: "#fff",
    backgroundColor: "#4267B2",
    "&:hover": {
      backgroundColor: "#375694",
    },
  },
}))(Button);

const FacebookButton = ({ setMessage, setSeverity }) => {
  const classes = useStyles();
  const history = useHistory();

  const handleResponse = async (response) => {
    try {
      const { data } = await signupWithFacebook(response);
      console.log("data :>> ", data);
      // TODO: Add data to global status;

      history.push("/");
    } catch (error) {
      const message = error.response.data;
      setMessage(message);
      setSeverity("error");
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
          className={classes.formButton}
          variant="contained"
          endIcon={<FacebookIcon className={classes.faceBookIcon} />}
        >
          Signup with Facebook
        </SignupButton>
      )}
    />
  );
};

export default FacebookButton;
