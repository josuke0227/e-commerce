import {
  Box,
  makeStyles,
  FormControlLabel,
  Radio,
  Button,
} from "@material-ui/core";
import AddressCard from "./shared/AddressCard";
import { indigo } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  cardContainer: {
    backgroundColor: indigo[50],
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(2),
  },
  button: {
    marginLeft: theme.spacing(5),
  },
  buttonLabel: {
    textTransform: "capitalize",
  },
}));

const AddressCardWithRadioButton = ({ address, buttonState, onChange }) => {
  const { _id } = address;
  const classes = useStyles();
  return (
    <Box
      className={classes.cardContainer}
      border={1}
      borderColor="primary.main"
      borderRadius="borderRadius"
    >
      <FormControlLabel
        name={_id}
        value={buttonState[_id]}
        checked={!!buttonState[_id]}
        onChange={onChange}
        control={<Radio />}
      />
      <AddressCard address={address} />
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        classes={{ label: classes.buttonLabel }}
      >
        Edit
      </Button>
    </Box>
  );
};

export default AddressCardWithRadioButton;
