import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

const ConfirmDialog = ({
  message,
  handleCancel,
  handleConfirm,
  showDialog,
  loading,
}) => {
  return (
    <Dialog
      open={showDialog}
      onClose={handleCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      disableBackdropClick={loading}
    >
      <DialogTitle id="alert-dialog-title">{message}</DialogTitle>
      <DialogActions>
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
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
