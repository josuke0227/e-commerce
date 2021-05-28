import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import PersonIcon from "@material-ui/icons/Person"; // signin
import PersonAddIcon from "@material-ui/icons/PersonAdd"; // signup
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import DashboardIcon from "@material-ui/icons/Dashboard";
import SettingsIcon from "@material-ui/icons/Settings";
import { useMuiButtonBaseStyle } from "../styles/theme";

const useStyles = makeStyles((theme) => ({
  menuText: theme.menuText,
  headerItem: theme.headerItem,
  menuLink: { ...theme.menuLink, color: "#333" },
}));

const PopupMenuMobile = ({
  handleSignoutButtonClick,
  mobileMoreAnchorEl,
  isMobileMenuOpen,
  handleMobileMenuClose,
  mobileMenuId,
  user,
}) => {
  const classes = useStyles();
  const buttonStyle = useMuiButtonBaseStyle();

  const toggleMenuItemByRole = (user) => {
    if (user.role === "admin")
      return (
        <Link to="/admin/dashboard" className={classes.menuLink}>
          <IconButton color="inherit" classes={buttonStyle}>
            <DashboardIcon className={classes.headerItem} />
            <Typography className={classes.menuText}>Dashboard</Typography>
          </IconButton>
        </Link>
      );
    if (user.role === "subscriber")
      return (
        <Link to="/mypage" className={classes.menuLink}>
          <IconButton color="inherit" classes={buttonStyle}>
            <SettingsIcon className={classes.headerItem} />
            <Typography className={classes.menuText}>My account</Typography>
          </IconButton>
        </Link>
      );
  };

  const toggleMenu = (user) => {
    if (user)
      return [
        <MenuItem key="userPageLink" onClick={handleMobileMenuClose}>
          {toggleMenuItemByRole(user)}
        </MenuItem>,
        <MenuItem key="signout" onClick={handleSignoutButtonClick}>
          <IconButton color="inherit" classes={buttonStyle}>
            <ExitToAppIcon className={classes.headerItem} />
            <Typography className={classes.menuText}>Signout</Typography>
          </IconButton>
        </MenuItem>,
      ];

    return [
      <MenuItem key="signup" onClick={handleMobileMenuClose}>
        <Link to="/signup" className={classes.menuLink}>
          <IconButton color="inherit" classes={buttonStyle}>
            <PersonAddIcon className={classes.headerItem} />
            <Typography className={classes.menuText}>Signup</Typography>
          </IconButton>
        </Link>
      </MenuItem>,
      <MenuItem key="signin" onClick={handleMobileMenuClose}>
        <Link to="/signin" className={classes.menuLink}>
          <IconButton color="inherit" classes={buttonStyle}>
            <PersonIcon className={classes.headerItem} />
            <Typography className={classes.menuText}>Signin</Typography>
          </IconButton>
        </Link>
      </MenuItem>,
    ];
  };

  return (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {toggleMenu(user)}
    </Menu>
  );
};

export default PopupMenuMobile;
