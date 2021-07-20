import Rating from "@material-ui/lab/Rating";
import { useDispatch } from "react-redux";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  makeStyles,
} from "@material-ui/core/";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { filterByAttribute } from "../services/productServices";

const useStyles = makeStyles(() => ({
  accordionDetails: {
    flexDirection: "column",
  },
  starsWrapper: {
    width: "fit-content",
    "&:hover": {
      cursor: "pointer",
    },
  },
}));

const RatingAccordionFilter = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleClick = (value) => {
    dispatch({
      type: "SET_QUERY",
      payload: { name: "ratings", data: [{ value }] },
    });
  };

  const renderStars = () => {
    const elements = [];

    for (let i = 1; i <= 4; i++) {
      elements.push(
        <div className={classes.starsWrapper} onClick={() => handleClick(i)}>
          <Rating name="read-only" value={i} readOnly />
        </div>
      );
    }
    return elements;
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Rating</Typography>
      </AccordionSummary>
      <AccordionDetails classes={{ root: classes.accordionDetails }}>
        {renderStars()}
      </AccordionDetails>
    </Accordion>
  );
};

export default RatingAccordionFilter;
