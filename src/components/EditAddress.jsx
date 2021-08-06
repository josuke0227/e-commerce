import {
  Grid,
  Typography,
  makeStyles,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@material-ui/core";
import Addresses from "./Addresses";
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";

const useStyles = makeStyles({
  summaryRoot: {
    display: "none",
  },
  accordionRoot: {
    "&::before": {
      backgroundColor: "transparent",
    },
  },
  label: {
    textTransform: "capitalize",
  },
  buttonRoot: {
    fontWeight: 400,
    "&:hover": {
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
          <Button
            classes={{ label: classes.label, root: classes.buttonRoot }}
            variant="text"
            endIcon={<CancelPresentationIcon />}
            disableRipple
            onClick={onClick}
          >
            close
          </Button>
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
            <Addresses handleClose={onClick} />
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

export default EditAddress;
