import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Typography } from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd"; // signup
import PersonIcon from "@material-ui/icons/Person"; // signin
import ShowMoreButton from "../components/shared/ShowMoreButton";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import DashboardIcon from "@material-ui/icons/Dashboard";
import SettingsIcon from "@material-ui/icons/Settings";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  headerItem: theme.headerItem,
  container: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
      flex: 1,
      justifyContent: "flex-end",
    },
  },
  showMoreIconWrapper: {
    display: "block",
    gridArea: "showMore",
    justifySelf: "flex-end",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  menuText: theme.menuText,
  menuLink: {
    ...theme.menuLink,
    color: "white",
  },
}));

const HeaderMenuRight = ({
  handleMobileMenuOpen,
  mobileMenuId,
  currentUser,
  handleSignoutButtonClick,
}) => {
  const classes = useStyles();

  const defaultMenu = (
    <>
      <Link to="/signup" className={classes.menuLink}>
        <IconButton color="inherit">
          <PersonAddIcon className={classes.headerItem} />
          <Typography className={classes.menuText}>Signup</Typography>
        </IconButton>
      </Link>
      ,
      <Link to="/signin" className={classes.menuLink}>
        <IconButton color="inherit">
          <PersonIcon className={classes.headerItem} />
          <Typography className={classes.menuText}>Signin</Typography>
        </IconButton>
      </Link>
    </>
  );

  const renderUserMenu = (currentUser) => (
    <>
      {currentUser.role === "admin" ? (
        <Link to="/dashboard" className={classes.menuLink}>
          <IconButton color="inherit" className={classes.iconWrapper}>
            <DashboardIcon className={classes.headerItem} />
            <Typography className={classes.menuText}>Dashboard</Typography>
          </IconButton>
        </Link>
      ) : (
        <Link to="/mypage" className={classes.menuLink}>
          <IconButton color="inherit">
            <SettingsIcon className={classes.headerItem} />
            <Typography className={classes.menuText}>My account</Typography>
          </IconButton>
        </Link>
      )}
      <Link to="/mypage" className={classes.menuLink}>
        <IconButton color="inherit" onClick={handleSignoutButtonClick}>
          <ExitToAppIcon className={classes.headerItem} />
          <Typography className={classes.menuText}>Signout</Typography>
        </IconButton>
      </Link>
    </>
  );

  const toggleMenu = () =>
    currentUser ? renderUserMenu(currentUser) : defaultMenu;

  return (
    <>
      <div className={classes.container}>{toggleMenu()}</div>
      <div className={classes.showMoreIconWrapper}>
        <ShowMoreButton
          mobileMenuId={mobileMenuId}
          handleMobileMenuOpen={handleMobileMenuOpen}
        />
      </div>
    </>
  );
};

export default HeaderMenuRight;
