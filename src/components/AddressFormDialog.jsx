import { useDispatch } from "react-redux";
import { Dialog, makeStyles, DialogTitle } from "@material-ui/core";
import AddressForm from "./AddressForm";
import Addresses from "./Addresses";

import Slide from "./Slide";

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    position: "relative",
    padding: theme.spacing(2),
    overflow: (slide) => (slide ? "scroll" : "hidden"),
  },
  root: {
    paddingTop: 0,
  },
}));

const AddressFormDialog = ({ addresses, setAddresses, dialogState }) => {
  const { open, slide } = dialogState;
  const classes = useStyles(slide);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch({ type: "CLOSE_DIALOG" });
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <div className={classes.dialogContent}>
          <Slide
            slide={slide}
            frameWidth="100%"
            frameHeight="100%"
            defaultContent={
              <Addresses addresses={addresses} setAddresses={setAddresses} />
            }
            alternativeContent={
              <>
                <DialogTitle
                  classes={{ root: classes.root }}
                  id="address-dialog-title"
                >
                  Register shipping address
                </DialogTitle>
                <AddressForm />
              </>
            }
          />
        </div>
      </Dialog>
    </>
  );
};

export default AddressFormDialog;
