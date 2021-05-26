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

const useStyles = makeStyles((theme) => ({
  menuText: theme.menuText,
  headerItem: theme.headerItem,
}));

const PopupMenuMobile = ({
  mobileMoreAnchorEl,
  isMobileMenuOpen,
  handleMobileMenuClose,
  mobileMenuId,
  user,
}) => {
  const classes = useStyles();

  const toggleMenuItemByRole = (user) => {
    if (user.role === "admin")
      return (
        <IconButton color="inherit" className={classes.iconWrapper}>
          <DashboardIcon className={classes.headerItem} />
          <Typography className={classes.menuText}>Dashboard</Typography>
        </IconButton>
      );
    if (user.role === "subscriber")
      return (
        <IconButton color="inherit">
          <SettingsIcon className={classes.headerItem} />
          <Typography className={classes.menuText}>My account</Typography>
        </IconButton>
      );
  };

  const toggleMenu = (user) => {
    if (user)
      return [
        <MenuItem key="userPageLink" onClick={handleMobileMenuClose}>
          {toggleMenuItemByRole(user)}
        </MenuItem>,
        <MenuItem key="signout" onClick={handleMobileMenuClose}>
          <IconButton color="inherit">
            <ExitToAppIcon className={classes.headerItem} />
            <Typography className={classes.menuText}>Signout</Typography>
          </IconButton>
        </MenuItem>,
      ];

    return [
      <MenuItem key="signup" onClick={handleMobileMenuClose}>
        <IconButton color="inherit">
          <PersonAddIcon />
          <Typography className={classes.menuText}>Signup</Typography>
        </IconButton>
      </MenuItem>,
      <MenuItem key="signin" onClick={handleMobileMenuClose}>
        <IconButton color="inherit">
          <PersonIcon />
          <Typography className={classes.menuText}>Signin</Typography>
        </IconButton>
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
