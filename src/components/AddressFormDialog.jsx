import { useDispatch, useSelector } from "react-redux";
import { Dialog, makeStyles, DialogTitle } from "@material-ui/core";
import AddressForm from "./AddressForm";

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    position: "relative",
    padding: theme.spacing(2),
  },
  root: {
    paddingTop: 0,
  },
}));

const AddressFormDialog = ({ dialogState }) => {
  const { open } = dialogState;
  const {
    address: { selected },
  } = useSelector((state) => ({ ...state }));
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch({ type: "CLOSE_DIALOG" });
    dispatch({ type: "RESET_SELECTED_ADDRESS" });
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <div className={classes.dialogContent}>
          <DialogTitle
            classes={{ root: classes.root }}
            id="address-dialog-title"
          >
            Register shipping address
          </DialogTitle>
          <AddressForm selectedAddress={selected} />
        </div>
      </Dialog>
    </>
  );
};

export default AddressFormDialog;
