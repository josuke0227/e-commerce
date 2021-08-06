import {
  Grid,
  Typography,
  makeStyles,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import Addresses from "./Addresses";

const useStyles = makeStyles({
  summaryRoot: {
    display: "none",
  },
  accordionRoot: {
    "&::before": {
      backgroundColor: "transparent",
    },
  },
});

const EditAddress = ({ expand, onClick }) => {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid xs={1} item>
        <Typography variant="h6">1</Typography>
      </Grid>
      <Grid xs={11} item>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">Choose a delivery address</Typography>
          <span onClick={onClick}>Close</span>
        </div>
        <Accordion
          expanded={expand}
          elevation={0}
          classes={{ root: classes.accordionRoot }}
        >
          <AccordionSummary
            classes={{ root: classes.summaryRoot }}
          ></AccordionSummary>
          <AccordionDetails>
            <Addresses />
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

export default EditAddress;
