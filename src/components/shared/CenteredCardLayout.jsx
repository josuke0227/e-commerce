import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    minWidth: "-webkit-fill-available",
    minHeight: "-webkit-fill-available",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    [theme.breakpoints.up("sm")]: {
      minWidth: "100vw",
      minHeight: "100vh",
    },
  },

  paper: {
    padding: "1rem",
    width: "18rem",
    display: "flex",
    flexDirection: "column",
  },
}));

const CenteredCardLayout = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Paper className={classes.paper} elevation={3}>
        {children}
      </Paper>
    </div>
  );
};

export default CenteredCardLayout;
