import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const listItems = [
  { label: "Price", content: <div>Here comes cool UI!</div> },
  { label: "Categories", content: <div>Here comes cool UI!</div> },
  { label: "Rating", content: <div>Here comes cool UI!</div> },
  { label: "Sub Categories", content: <div>Here comes cool UI!</div> },
  { label: "Brands", content: <div>Here comes cool UI!</div> },
  { label: "Colors", content: <div>Here comes cool UI!</div> },
];

const DefaultMenuList = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography>Search Options</Typography>

      {listItems.map(({ label, content }, index) => (
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index}a-content`}
            id={`panel${index}a-header`}
          >
            <Typography className={classes.heading}>{label}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{content}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default DefaultMenuList;
