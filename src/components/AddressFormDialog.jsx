import { useState } from "react";
import { Dialog, makeStyles, DialogTitle } from "@material-ui/core";
import AddressForm from "./AddressForm";

const useStyles = makeStyles((theme) => ({
  dialog: {
    padding: theme.spacing(2),
  },
  root: {
    paddingTop: 0,
  },
}));

const AddressFormDialog = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <Dialog open={open} onClose={handleClose}>
        <div className={classes.dialog}>
          <DialogTitle
            classes={{ root: classes.root }}
            id="address-dialog-title"
          >
            Register shipping address
          </DialogTitle>
          <AddressForm />
        </div>
      </Dialog>
    </>
  );
};

export default AddressFormDialog;
