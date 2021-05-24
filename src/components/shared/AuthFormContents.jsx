import { makeStyles } from "@material-ui/core/styles";
import { Typography, Link } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  formTitle: theme.formTitle,
  inputForm: theme.inputForm,
  formAlert: theme.formAlert,
  formSubtitle: theme.formSubtitle,
}));

const AuthFormContents = ({ contents, signin }) => {
  const classes = useStyles();
  const { title, textInputs, submitButton, SNSButtons, alert } = contents;

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
      {signin && (
        <Link className={classes.formLink} href="/forgotpassword">
          <Typography variant="subtitle2">Forgot password?</Typography>
        </Link>
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
    </>
  );
};

export default AuthFormContents;
