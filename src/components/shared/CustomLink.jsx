import { Link, makeStyles } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

const useStyles = makeStyles({
  link: {
    cursor: "pointer",
  },
});

const CustomLink = ({ children, to, ...rest }) => {
  const classes = useStyles();

  return (
    <Link className={classes.link} component={RouterLink} to={to} {...rest}>
      {children}
    </Link>
  );
};

export default CustomLink;
