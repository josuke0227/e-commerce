import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import PersonIcon from "@material-ui/icons/Person"; // signin
import PersonAddIcon from "@material-ui/icons/PersonAdd"; // signup
import AccountCircle from "@material-ui/icons/AccountCircle";
import { useState } from "react";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import DashboardIcon from "@material-ui/icons/Dashboard";
import SettingsIcon from "@material-ui/icons/Settings";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const useStyles = makeStyles((theme) => ({
  menuText: theme.menuText,
  headerItem: theme.headerItem,
}));

const PopupMenuMobile = ({
  mobileMoreAnchorEl,
  isMobileMenuOpen,
  handleMobileMenuClose,
  mobileMenuId,
}) => {
  const classes = useStyles();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <>
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        {!showUserMenu && (
          <>
            <MenuItem onClick={handleMobileMenuClose}>
              <IconButton color="inherit">
                <PersonIcon />
                <Typography className={classes.menuText}>Signin</Typography>
              </IconButton>
            </MenuItem>
            <MenuItem onClick={handleMobileMenuClose}>
              {/* TODO: Toggle IconButton to menu element when user is logged in */}
              <IconButton color="inherit">
                <PersonAddIcon />
                <Typography className={classes.menuText}>Signup</Typography>
              </IconButton>
            </MenuItem>
            {/* TODO: This navigation should have right chevron
          and navigate to user menu when tapped.
                */}
            <MenuItem onClick={() => setShowUserMenu(true)}>
              <IconButton color="inherit">
                <AccountCircle className={classes.headerItem} />
                <Typography className={classes.menuText}>User name</Typography>
              </IconButton>
            </MenuItem>
          </>
        )}
        {showUserMenu && (
          <>
            <MenuItem onClick={() => setShowUserMenu(false)}>
              <IconButton color="inherit" className={classes.iconWrapper}>
                <ArrowBackIcon className={classes.headerItem} />
                <Typography className={classes.menuText}>Back</Typography>
              </IconButton>
            </MenuItem>
            <MenuItem onClick={handleMobileMenuClose}>
              <IconButton color="inherit" className={classes.iconWrapper}>
                <DashboardIcon className={classes.headerItem} />
                <Typography className={classes.menuText}>Dashboard</Typography>
              </IconButton>
            </MenuItem>
            <MenuItem onClick={handleMobileMenuClose}>
              <IconButton color="inherit">
                <SettingsIcon className={classes.headerItem} />
                <Typography className={classes.menuText}>My account</Typography>
              </IconButton>
            </MenuItem>
            <MenuItem onClick={handleMobileMenuClose}>
              <IconButton color="inherit">
                <ExitToAppIcon className={classes.headerItem} />
                <Typography className={classes.menuText}>Signout</Typography>
              </IconButton>
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
};

export default PopupMenuMobile;
