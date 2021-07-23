import { useState } from "react";
import Rating from "@material-ui/lab/Rating";
import { useDispatch } from "react-redux";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  makeStyles,
  Link,
} from "@material-ui/core/";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CheckIcon from "@material-ui/icons/Check";

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
  root: {
    width: "100%",
  },
}));

const RatingAccordionFilter = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [current, setCurrent] = useState("");

  const handleClick = (value) => {
    setCurrent(value);
    dispatch({
      type: "SET_QUERY",
      payload: { name: "ratings", data: [{ value }] },
    });
  };

  const handleResetClick = (value) => {
    setCurrent(value);
    dispatch({
      type: "RESET_QUERY",
      payload: { name: "ratings" },
    });
  };
  const renderStars = () => {
    const elements = [];

    for (let i = 1; i <= 4; i++) {
      elements.push(
        <div
          key={i}
          className={classes.starsWrapper}
          onClick={() => handleClick(i)}
        >
          <Rating name="read-only" value={i} readOnly />
          {i === current && <CheckIcon />}
        </div>
      );
    }
    return elements;
  };

  return (
    <Accordion classes={{ root: classes.root }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Rating</Typography>
      </AccordionSummary>
      <AccordionDetails classes={{ root: classes.accordionDetails }}>
        <Link color="textPrimary">
          <Typography onClick={handleResetClick}>Show all items</Typography>
        </Link>
        {renderStars()}
      </AccordionDetails>
    </Accordion>
  );
};

export default RatingAccordionFilter;
