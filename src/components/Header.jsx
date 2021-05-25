import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import HeaderMenuLeft from "./HeaderMenuLeft";
import HeaderMenuRight from "./HeaderMenuRight";
import SearchBar from "./SearchBar";
import PopupMenu from "./PopupMenu";
import PopupMenuMobile from "./PopupMenuMobile";

const useStyles = makeStyles((theme) => ({
  menuContainer: {
    display: "grid",
    gridTemplateAreas: `
      "icons showMore"
      "search search"
    `,

    [theme.breakpoints.up("sm")]: {
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "initial",
    },
  },
}));

const Header = () => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const menuId = "primary-search-account-menu";
  const mobileMenuId = "primary-search-account-menu-mobile";

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar className={classes.menuContainer}>
          <HeaderMenuLeft />
          <SearchBar />
          <HeaderMenuRight
            menuId={menuId}
            handleProfileMenuOpen={handleProfileMenuOpen}
            mobileMenuId={mobileMenuId}
            handleMobileMenuOpen={handleMobileMenuOpen}
          />
        </Toolbar>
      </AppBar>
      <PopupMenu
        menuId={menuId}
        anchorEl={anchorEl}
        isMenuOpen={isMenuOpen}
        handleMenuClose={handleMenuClose}
      />
      <PopupMenuMobile
        mobileMenuId={mobileMenuId}
        mobileMoreAnchorEl={mobileMoreAnchorEl}
        isMobileMenuOpen={isMobileMenuOpen}
        handleMobileMenuClose={handleMobileMenuClose}
        handleProfileMenuOpen={handleProfileMenuOpen}
      />
    </>
  );
};

export default Header;
