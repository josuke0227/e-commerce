import { makeStyles, Typography } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import { getAverage } from "../../util/getAverage";

const useStyles = makeStyles((theme) => ({
  ratingIndicator: {
    display: "flex",
    alignItems: "center",
  },
}));

const RatingIndicator = ({ ratings }) => {
  const classes = useStyles();
  if (!ratings.length)
    return <Typography color="textSecondary">No rating yet.</Typography>;
  return (
    <div className={classes.ratingIndicator}>
      <Rating
        size="large"
        name="read-only"
        value={parseInt(getAverage(ratings))}
        precision={0.5}
        readOnly
      />
      <span>{`(${ratings.length})`}</span>
    </div>
  );
};

export default RatingIndicator;
