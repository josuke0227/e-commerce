import Rating from "@material-ui/lab/Rating";
import { getAverage } from "../../util/getAverage";

const RatingIndicator = ({ ratings }) => {
  if (!ratings.length) return <div className="">No rating yet.</div>;
  return (
    <>
      <Rating
        size="large"
        name="read-only"
        value={parseInt(getAverage(ratings))}
        precision={0.5}
        readOnly
      />
      <span>{ratings.length}</span>
    </>
  );
};

export default RatingIndicator;
