import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Divider,
  Typography,
  makeStyles,
  Button,
} from "@material-ui/core";
import { indigo } from "@material-ui/core/colors";
import AddIcon from "@material-ui/icons/Add";
import AddressCardWithRadioButton from "./AddressCardWithRadioButton";
import { changeDefaultAddress, deleteAddress } from "../services/userService";

const useStyles = makeStyles((theme) => ({
  header: {
    margin: theme.spacing(2),
  },
  divider: {
    marginBottom: theme.spacing(3),
    width: "95%",
    marginLeft: "2.5%",
  },
  dividerRoot: {
    backgroundColor: theme.palette.grey[500],
  },
  boxBottom: {
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4,
    borderRight: 0,
    borderLeft: 0,
    borderBottom: 0,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.grey[100],
  },
  buttonDecide: {
    ...theme.customButton,
  },
  icon: {
    color: indigo[500],
  },
  addButtonContainer: {
    margin: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}));

export default function Addresses({ handleClose }) {
  const {
    user,
    address: { entity },
  } = useSelector((state) => ({ ...state }));
  const initialButtonState = useRef();
  const classes = useStyles();
  const dispatch = useDispatch();
  const [buttonState, setButtonState] = useState();

  useEffect(() => {
    if (!entity.length) return;

    let initialState = {};
    entity.forEach((a) => (initialState = { ...initialState, [a._id]: false }));
    initialButtonState.current = initialState;

    entity.forEach(
      (a) =>
        (initialState = {
          ...initialState,
          [a._id]: a.isDefault,
        })
    );
    setButtonState(initialState);
  }, [entity]);

  const handleInputChange = (e) => {
    const newState = {
      ...initialButtonState.current,
      [e.target.name]: !buttonState[e.target.name],
    };
    setButtonState(newState);
  };

  const handleDefaultAddressChange = () => {
    // TODO: this is where address data is updated.
    const newAddresses = entity.map((a) => ({
      ...a,
      isDefault: buttonState[a._id],
    }));
    dispatch({
      type: "SET_ADDRESSES",
      payload: newAddresses,
    });
    doSubmit(newAddresses);
  };

  const doSubmit = async (newAddresses) => {
    try {
      await changeDefaultAddress(newAddresses, user);
    } catch (error) {
      console.log("Changing default address error", error);
    }
    handleClose();
  };

  const handleAddButtonClick = () => {
    dispatch({ type: "SET_SELECTED_ADDRESS", payload: undefined });
    dispatch({ type: "OPEN_DIALOG" });
  };

  const handleEditButtonClick = (address) => {
    dispatch({ type: "SET_SELECTED_ADDRESS", payload: address });
    dispatch({ type: "OPEN_DIALOG" });
  };

  const handleDelete = async (address) => {
    try {
      const { data } = await deleteAddress(address, user);
      dispatch({ type: "SET_ADDRESSES", payload: data });
    } catch (error) {
      console.log("Deleting address error", error);
    }
  };

  return (
    <Box borderColor="grey.500" borderRadius="borderRadius" border={1}>
      <Typography className={classes.header} variant="h5">
        Your Addresses
      </Typography>
      <Divider
        className={classes.divider}
        classes={{ root: classes.dividerRoot }}
      />
      {buttonState &&
        entity.map((a) => (
          <AddressCardWithRadioButton
            key={a._id}
            address={a}
            buttonState={buttonState}
            onChange={handleInputChange}
            onClick={handleEditButtonClick}
            handleDelete={handleDelete}
          />
        ))}
      <div className={classes.addButtonContainer}>
        <Button
          variant="text"
          color="default"
          startIcon={<AddIcon className={classes.icon} />}
          classes={{ label: classes.buttonLabel }}
          onClick={handleAddButtonClick}
        >
          Add a new address
        </Button>
      </div>
      <Box borderColor="grey.500" border={1} className={classes.boxBottom}>
        <Button
          variant="contained"
          className={classes.buttonDecide}
          classes={{
            label: classes.buttonLabel,
          }}
          onClick={handleDefaultAddressChange}
        >
          Deliver to this address
        </Button>
      </Box>
    </Box>
  );
}
