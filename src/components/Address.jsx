import { useState } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, Paper } from "@material-ui/core";
import CurrentAddress from "./CurrentAddress";
import EditAddress from "./EditAddress";

const useStyles = makeStyles((theme) => ({
  paper: { padding: theme.spacing(2) },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const Address = ({ address, state }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [showEdit, setShowEdit] = useState(false);

  const handleChangeButtonClick = () => {
    setShowEdit(true);
    const delay = () =>
      setTimeout(() => {
        dispatch({
          type: "EXPAND",
          payload: "address",
        });
      }, 100);

    delay();
  };

  const handleCloseButtonClick = () => {
    dispatch({
      type: "COLLAPSE",
      payload: "address",
    });
    const delay = () => {
      setTimeout(() => {
        setShowEdit(false);
      }, 350);
    };
    delay();
  };

  return (
    <Paper className={classes.paper}>
      {showEdit ? (
        <EditAddress expand={state.address} onClick={handleCloseButtonClick} />
      ) : (
        <CurrentAddress address={address} onClick={handleChangeButtonClick} />
      )}
    </Paper>
  );
};

export default Address;
