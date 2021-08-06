import { useState, useEffect } from "react";
import { Grid, Typography, makeStyles, Button, Paper } from "@material-ui/core";
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

const Address = ({ address }) => {
  const classes = useStyles();
  const [showEdit, setShowEdit] = useState(false);
  const [expand, setExpand] = useState(false);

  const handleChangeButtonClick = () => {
    setShowEdit(true);
    const delay = () =>
      setTimeout(() => {
        setExpand(true);
      }, 100);

    delay();
  };

  const handleCloseButtonClick = () => {
    setExpand(false);
    const delay = () =>
      setTimeout(() => {
        setShowEdit(false);
      }, 300);

    delay();
  };

  return (
    <Paper className={classes.paper}>
      {showEdit ? (
        <EditAddress expand={expand} onClick={handleCloseButtonClick} />
      ) : (
        <CurrentAddress address={address} onClick={handleChangeButtonClick} />
      )}
    </Paper>
  );
};

export default Address;
