import { Grid, Typography, Button, makeStyles } from "@material-ui/core";
import AddressCard from "./shared/AddressCard";

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}));

const CurrentAddress = ({ address, onClick }) => {
  const classes = useStyles();

  return (
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
                <AddressCard address={address} />
              </Grid>
              <Grid item xs={4} className={classes.buttonContainer}>
                <Button variant="contained" color="secondary" onClick={onClick}>
                  Change
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default CurrentAddress;
