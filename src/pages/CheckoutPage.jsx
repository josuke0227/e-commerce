import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getAddress } from "../services/userService";
import { Grid, Typography, makeStyles, Button, Paper } from "@material-ui/core";
import AddressCard from "../components/shared/AddressCard";

const useStyles = makeStyles((theme) => ({
  paper: { padding: theme.spacing(2) },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function Playground() {
  const classes = useStyles();
  const { user } = useSelector((state) => ({ ...state }));
  const [addresses, setAddresses] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState();

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await getAddress(user);
      setAddresses(data);
    };

    if (!user) return;
    loadUser();
  }, [user]);

  useEffect(() => {
    if (!addresses.length) return;

    const address = addresses.filter((a) => a.isDefault === true);
    setDefaultAddress(address[0]);
  }, [addresses]);

  if (!user || !defaultAddress) return <div className="">Loading</div>;
  return (
    <Paper className={classes.paper}>
      <Grid container>
        <Grid xs={1} item>
          <Typography variant="h6">1</Typography>
        </Grid>
        <Grid xs={11} item>
          <Grid container>
            <Grid item xs={4}>
              <Typography variant="h6">Delivery Address</Typography>
            </Grid>
            <Grid item xs={8}>
              <Grid container>
                <Grid item xs={8}>
                  <AddressCard address={defaultAddress} />
                </Grid>
                <Grid item xs={4} className={classes.buttonContainer}>
                  <Button variant="contained" color="secondary">
                    Change
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
