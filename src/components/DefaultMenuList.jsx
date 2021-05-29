import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import FilterByPrice from "./FilterByPrice";
import FilterByCheckList from "./FilterByCheckList";
import FilterByRating from "./FilterByRating";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  accordionDetailsRoot: {
    display: "block",
    padding: "0 1rem 0.5rem 1rem",
  },
}));

const listItems = [
  { label: "Price", content: <FilterByPrice /> },
  { label: "Categories", content: <FilterByCheckList /> },
  { label: "Rating", content: <FilterByRating /> },
  { label: "Sub Categories", content: <FilterByCheckList /> },
  { label: "Brands", content: <FilterByCheckList /> },
  { label: "Colors", content: <FilterByCheckList /> },
];

const DefaultMenuList = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {listItems.map(({ label, content }, index) => (
        <Accordion key={index} expanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}a-content`}
            id={`panel${index}a-header`}
          >
            <Typography className={classes.heading}>{label}</Typography>
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.accordionDetailsRoot }}>
            <Typography>{content}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default DefaultMenuList;
