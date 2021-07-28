import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import CustomLink from "./CustomLink";

const useStyles = makeStyles((theme) => ({
  formTitle: theme.formTitle,
  inputForm: theme.inputForm,
  formAlert: theme.formAlert,
  formSubtitle: theme.formSubtitle,
}));

const AuthCardLayout = ({ contents }) => {
  const classes = useStyles();
  const [path, setPath] = useState("");

  useEffect(() => {
    const pathName = window.location.pathname.split("/")[1];
    setPath(pathName);
  }, []);

  const { title, textInputs, submitButton, SNSButtons, alert } = contents;

  const authNavigation = {
    signin: {
      link: "/signup",
      text: "Do not have an account? Signup",
    },
    signup: {
      link: "/signin",
      text: "Do not have an account? Signin",
    },
  };

  return (
    <>
      <Typography variant="h6" className={classes.formTitle}>
        {title}
      </Typography>
      {textInputs}
      {alert.message && (
        <Alert className={classes.formAlert} severity={alert.severity}>
          {alert.message}
        </Alert>
      )}
      {path === "signin" && (
        <CustomLink to="/forgotpassword">
          <Typography variant="subtitle2">Forgot password?</Typography>
        </CustomLink>
      )}
      {submitButton}
      {SNSButtons && (
        <>
          <Typography variant="subtitle1" className={classes.formSubtitle}>
            OR
          </Typography>
          {SNSButtons}
        </>
      )}
      {(path === "signin" || path === "signup") && (
        <CustomLink to={authNavigation[path].link}>
          <Typography variant="subtitle2">
            {authNavigation[path].text}
          </Typography>
        </CustomLink>
      )}
    </>
  );
};

export default AuthCardLayout;
