import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

const CustomSnackBar = ({ showSnackBar, setShowSnackBar }) => {
  const { editing, show, severity, message } = showSnackBar;

  let anchorOigin = editing
    ? { vertical: "bottom", horizontal: "center" }
    : { vertical: "top", horizontal: "center" };

  return (
    <Snackbar
      open={show}
      anchorOrigin={anchorOigin}
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
