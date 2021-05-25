import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import DashboardIcon from "@material-ui/icons/Dashboard";
import SettingsIcon from "@material-ui/icons/Settings";

const useStyles = makeStyles((theme) => ({
  menuText: theme.menuText,
  iconWrapper: {
    display: "flex",
  },
  headerItem: theme.headerItem,
}));

const PopupMenu = ({ anchorEl, menuId, isMenuOpen, handleMenuClose }) => {
  const classes = useStyles();

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {/* TODO: first menu should deffer upon the role of user. */}
      {/* TODO: admin: dashboard / subscriber: My account */}
      <MenuItem onClick={handleMenuClose}>
        <IconButton
          aria-label="show 4 new mails"
          color="inherit"
          className={classes.iconWrapper}
        >
          <DashboardIcon className={classes.headerItem} />
          <Typography className={classes.menuText} variant="subscript2">
            Dashboard
          </Typography>
        </IconButton>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <SettingsIcon className={classes.headerItem} />
          <Typography className={classes.menuText} variant="subscript2">
            My account
          </Typography>
        </IconButton>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <ExitToAppIcon className={classes.headerItem} />
          <Typography className={classes.menuText} variant="subscript2">
            Logout
          </Typography>
        </IconButton>
      </MenuItem>
    </Menu>
  );
};

export default PopupMenu;
