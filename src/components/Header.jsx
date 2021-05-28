import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Toolbar, AppBar } from "@material-ui/core/";
import { Menu as MenuIcon } from "@material-ui/icons/";

import HeaderMenuLeft from "./HeaderMenuLeft";
import HeaderMenuRight from "./HeaderMenuRight";
import SearchBar from "./SearchBar";
import { drawerWidth } from "./SideBar";

const useStyles = makeStyles((theme) => ({
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuContainer: {
    display: "grid",
    gridTemplateAreas: `
      "drawerOpener icons showMore"
      "search search search"
    `,

    [theme.breakpoints.up("sm")]: {
      display: "flex",
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    gridArea: "drawerOpener",
  },
  hide: {
    display: "none",
  },
}));

const Header = ({
  handleDrawerOpen,
  currentUser,
  menuId,
  handleMobileMenuOpen,
  mobileMenuId,
  handleSignoutButtonClick,
  open,
}) => {
  const classes = useStyles();

  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
      })}
    >
      <Toolbar className={classes.menuContainer}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          className={clsx(classes.menuButton, open && classes.hide)}
        >
          <MenuIcon />
        </IconButton>
        <HeaderMenuLeft />
        <SearchBar />
        <HeaderMenuRight
          currentUser={currentUser}
          menuId={menuId}
          handleMobileMenuOpen={handleMobileMenuOpen}
          mobileMenuId={mobileMenuId}
          handleSignoutButtonClick={handleSignoutButtonClick}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
