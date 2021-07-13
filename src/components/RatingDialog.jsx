import { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContentText from "@material-ui/core/DialogContentText";
import Rating from "@material-ui/lab/Rating";
import { Link } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

const RatingDialog = ({ open, handleCancel, handleConfirm, status }) => {
  const [value, setValue] = useState(0);

  const dialogMessages = {
    unauthorized: (
      <DialogContentText>
        Please{" "}
        <Link component={RouterLink} to="/signin" color="textPrimary">
          signin
        </Link>{" "}
        to leave rating.
      </DialogContentText>
    ),
    success: (
      <DialogContentText>
        Thank you for rating. Your review is going to be applied soon.
      </DialogContentText>
    ),

    failure: (
      <DialogContentText color="error">Rating Failed.</DialogContentText>
    ),
  };

  const defaultButtons = (
    <>
      <Button
        onClick={handleCancel}
        variant="contained"
        color="default"
        autoFocus
      >
        Cancel
      </Button>
      <Button
        onClick={() => handleConfirm(value)}
        variant="contained"
        color="primary"
      >
        OK
      </Button>
    </>
  );

  const closeButton = (
    <Button
      onClick={handleCancel}
      variant="contained"
      color="default"
      autoFocus
    >
      Close
    </Button>
  );

  const isOperationFinished = () =>
    status === "success" || status === "failure";

  return (
    <Dialog open={open} onClose={handleCancel} disableBackdropClick>
      <DialogTitle id="alert-dialog-title">Leave your rating</DialogTitle>
      <DialogContent>
        <Rating
          size="large"
          name="simple-controlled"
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          readOnly={isOperationFinished()}
        />
        {dialogMessages[status]}
      </DialogContent>
      <DialogActions>
        {isOperationFinished() ? closeButton : defaultButtons}
      </DialogActions>
    </Dialog>
  );
};

export default RatingDialog;
