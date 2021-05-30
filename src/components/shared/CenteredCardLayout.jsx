import { makeStyles } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { headerHeight } from "../../styles/theme";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    marginTop: "3rem",

    [theme.breakpoints.up("sm")]: {
      marginTop: "0",
      alignItems: "center",
      minHeight: `calc(100vh - ${headerHeight}px)`,
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
