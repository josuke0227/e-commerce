import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import PopupMenuMobile from "./PopupMenuMobile";
import Header from "./Header";
import SideBar from "./SideBar";
import MainWindow from "./MainWindow";
import CartDrawer from "./CartDrawer";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
}));

const Layout = ({ children, location }) => {
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => ({ ...state }));

  const [open, setOpen] = useState(false);
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
    history.push("/");
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Header
        currentUser={currentUser}
        handleDrawerOpen={handleDrawerOpen}
        menuId={menuId}
        open={open}
        handleMobileMenuOpen={handleMobileMenuOpen}
        mobileMenuId={mobileMenuId}
        handleSignoutButtonClick={handleSignoutButtonClick}
      />
      <SideBar
        handleDrawerClose={handleDrawerClose}
        location={location}
        open={open}
      />
      <CartDrawer />
      <PopupMenuMobile
        user={user}
        mobileMenuId={mobileMenuId}
        mobileMoreAnchorEl={mobileMoreAnchorEl}
        isMobileMenuOpen={isMobileMenuOpen}
        handleMobileMenuClose={handleMobileMenuClose}
        handleSignoutButtonClick={handleSignoutButtonClick}
      />
      <MainWindow open={open}>{children}</MainWindow>
    </div>
  );
};

export default Layout;
