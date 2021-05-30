import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

const ConfirmDialog = ({
  dialogOpen,
  setDialogOpen,
  selectedCategory,
  doCategoryDelete,
}) => {
  const handleCancel = () => {
    setDialogOpen(false);
  };

  const handleConfirm = () => {
    setDialogOpen(false);
    doCategoryDelete(selectedCategory);
  };

  return (
    <Dialog
      open={dialogOpen}
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
