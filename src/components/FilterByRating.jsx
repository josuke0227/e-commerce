import { makeStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  boxRoot: {
    margin: 0,
    padding: 0,
    border: 0,
  },
}));

const SimpleRating = () => {
  const classes = useStyles();

  const ratings = [5, 4, 3, 2, 1];

  return (
    <div>
      {ratings.map((r, i) => (
        <Box
          key={i}
          classes={{ root: classes.boxRoot }}
          component="fieldset"
          mb={r}
          borderColor="transparent"
        >
          <Rating name="read-only" value={r} readOnly />
        </Box>
      ))}
    </div>
  );
};

export default SimpleRating;
