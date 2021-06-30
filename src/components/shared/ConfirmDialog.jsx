import { green, red } from "@material-ui/core/colors";
import CheckIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import {
  Button,
  Zoom,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  CircularProgress,
  DialogContentText,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  iconSuccess: {
    fill: green[500],
    fontSize: "4rem",
  },
  iconFailure: {
    fontSize: "4rem",
    fill: red[500],
  },
}));

const ConfirmDialog = ({
  handleCancel,
  handleConfirm,
  showDialog,
  loading,
  result,
}) => {
  const classes = useStyles();
  const { message, success } = result;

  const renderSuccessState = () => {
    return (
      <>
        <Zoom in={success}>
          <CheckIcon className={classes.iconSuccess} />
        </Zoom>
        <DialogContentText align="center">
          {message || "Success!!"}
        </DialogContentText>
      </>
    );
  };

  const renderFailureState = () => {
    return (
      <>
        <Zoom in={success === false}>
          <CancelIcon className={classes.iconFailure} />
        </Zoom>
        <DialogContentText align="center">
          {message || "Failure..."}
        </DialogContentText>
      </>
    );
  };

  const renderResult = () => {
    const { success } = result;
    if (success === null) return;

    return success ? renderSuccessState() : renderFailureState();
  };

  const toggleButtons = () => {
    const defaultPattern = (
      <>
        <Button
          onClick={handleCancel}
          color="primary"
          disabled={loading}
          autoFocus
        >
          Cancel
        </Button>
        <Button onClick={handleConfirm} disabled={loading} color="primary">
          Confirm
        </Button>
      </>
    );

    const alternativePattern = (
      <>
        <Button
          onClick={handleCancel}
          color="primary"
          disabled={loading}
          autoFocus
        >
          OK
        </Button>
      </>
    );

    return (
      <DialogActions>
        {success === null ? defaultPattern : alternativePattern}
      </DialogActions>
    );
  };

  return (
    <Dialog
      open={showDialog.show || false}
      onClose={handleCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      disableBackdropClick={loading}
    >
      <DialogTitle id="alert-dialog-title">{showDialog.message}</DialogTitle>
      <DialogContent>
        <DialogContentText align="center">
          {loading && <CircularProgress size="3.5rem" />}
          {renderResult()}
        </DialogContentText>
      </DialogContent>
      {toggleButtons()}
    </Dialog>
  );
};

export default ConfirmDialog;
