import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import HeaderMenuLeft from "./HeaderMenuLeft";
import HeaderMenuRight from "./HeaderMenuRight";
import SearchBar from "./SearchBar";
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

const Header = ({ handleDrawerOpen }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));

  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const menuId = "primary-search-account-menu";
  const mobileMenuId = "primary-search-account-menu-mobile";

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleSignoutButtonClick = () => {
    handleMobileMenuClose();
    dispatch({
      type: "SIGN_OUT_SUCCESS",
    });
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar className={classes.menuContainer}>
          <HeaderMenuLeft handleDrawerOpen={handleDrawerOpen} />
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
      <PopupMenuMobile
        user={user}
        mobileMenuId={mobileMenuId}
        mobileMoreAnchorEl={mobileMoreAnchorEl}
        isMobileMenuOpen={isMobileMenuOpen}
        handleMobileMenuClose={handleMobileMenuClose}
        handleSignoutButtonClick={handleSignoutButtonClick}
      />
    </>
  );
};

export default Header;
