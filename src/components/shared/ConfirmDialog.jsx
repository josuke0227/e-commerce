import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

const ConfirmDialog = ({
  showDialog,
  setShowDialog,
  selectedCategory,
  doCategoryDelete,
}) => {
  const handleCancel = () => {
    setShowDialog(false);
  };

  const handleConfirm = () => {
    setShowDialog(false);
    doCategoryDelete(selectedCategory);
  };

  return (
    <Dialog
      open={showDialog}
      onClose={handleCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {`Are your sure to remove category "${
          selectedCategory && selectedCategory.name
        }"?`}
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleConfirm} color="primary">
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
