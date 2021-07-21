import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  makeStyles,
  Slider,
} from "@material-ui/core/";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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

const PriceAccordionFilter = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const min = 0;
  const max = 2000;
  const [value, setValue] = useState([min, max]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleMouseup = async () => {
    dispatch({
      type: "SET_QUERY",
      payload: { name: "price", data: value },
    });
  };

  return (
    <Accordion classes={{ root: classes.root }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Price</Typography>
      </AccordionSummary>
      <AccordionDetails classes={{ root: classes.accordionDetails }}>
        <Slider
          value={value}
          onChange={handleChange}
          onChangeCommitted={handleMouseup}
          defaultValue={0}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={10}
          marks
          min={min}
          max={max}
        />
      </AccordionDetails>
    </Accordion>
  );
};

export default PriceAccordionFilter;
