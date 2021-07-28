import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

const CustomSnackBar = ({ showSnackBar, setShowSnackBar }) => {
  const { show, severity, message } = showSnackBar;
  return (
    <Snackbar
      open={show}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={6000}
      onClose={() => setShowSnackBar({ ...showSnackBar, show: false })}
    >
      <Alert
        onClose={() => setShowSnackBar({ ...showSnackBar, show: false })}
        severity={severity}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackBar;
