import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import PersonIcon from "@material-ui/icons/Person"; // signin
import PersonAddIcon from "@material-ui/icons/PersonAdd"; // signup
import AccountCircle from "@material-ui/icons/AccountCircle";

const useStyles = makeStyles((theme) => ({
  menuText: theme.menuText,
  headerItem: theme.headerItem,
}));

const PopupMenuMobile = ({
  mobileMoreAnchorEl,
  isMobileMenuOpen,
  handleMobileMenuClose,
  handleProfileMenuOpen,
  mobileMenuId,
}) => {
  const classes = useStyles();

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
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <PersonIcon />
          <Typography className={classes.menuText} variant="subscript2">
            Signin
          </Typography>
        </IconButton>
      </MenuItem>
      <MenuItem>
        {/* TODO: Toggle IconButton to menu element when user is logged in */}
        <IconButton aria-label="show 17 new notifications" color="inherit">
          <PersonAddIcon />
          <Typography className={classes.menuText} variant="subscript2">
            Signup
          </Typography>
        </IconButton>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle className={classes.headerItem} />
          <Typography className={classes.menuText} variant="subscript2">
            User name
          </Typography>
        </IconButton>
      </MenuItem>
    </Menu>
  );
};

export default PopupMenuMobile;
