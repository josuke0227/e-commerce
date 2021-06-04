import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

const ConfirmDialog = ({ showDialog, setShowDialog, item, handleConfirm }) => {
  const handleCancel = () => {
    setShowDialog(false);
  };

  const handleConfirmClick = () => {
    setShowDialog(false);
    handleConfirm(item);
  };

  return (
    <Dialog
      open={showDialog}
      onClose={handleCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {`Are your sure to remove category "${item && item.name}"?`}
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleConfirmClick} color="primary">
          Ok
        </Button>
        <Button onClick={handleCancel} color="primary" autoFocus>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
