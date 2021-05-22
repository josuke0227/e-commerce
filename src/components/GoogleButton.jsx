import { Button } from "@material-ui/core";
import React from "react";
import GoogleLogin from "react-google-login";
import { signupWithGoogle } from "../services/signupServices";
import { ReactComponent as GoogleIcon } from "../images/googleIcon.svg";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  inputform: theme.inputForm,
  formButton: {
    ...theme.formButton,
    width: "100%",
    marginBottom: "0.5rem",
    textTransform: "none",
  },
}));

const Google = ({ setMessage, setSeverity }) => {
  const classes = useStyles();
  const history = useHistory();

  const handleResponse = async (response) => {
    try {
      const { data } = await signupWithGoogle(response);
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
    <div className="pb-3">
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
            Signup with Google
          </Button>
        )}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
};

export default Google;
