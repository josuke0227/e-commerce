import { useTheme } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const CustomSnackBar = ({ showSnackBar, setShowSnackBar }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));

  const { editing, show, severity, message } = showSnackBar;

  let anchorOigin = editing
    ? { vertical: "bottom", horizontal: "center" }
    : { vertical: "top", horizontal: "center" };

  let anchorOriginLaptop = editing
    ? { vertical: "top", horizontal: "right" }
    : { vertical: "top", horizontal: "left" };

  const setAnchorOrigin = () => {
    return matches ? anchorOriginLaptop : anchorOigin;
  };

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
