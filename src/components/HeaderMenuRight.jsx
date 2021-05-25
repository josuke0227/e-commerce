import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Typography } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import PersonAddIcon from "@material-ui/icons/PersonAdd"; // signup
import PersonIcon from "@material-ui/icons/Person"; // signin
import ShowMoreButton from "../components/shared/ShowMoreButton";

const useStyles = makeStyles((theme) => ({
  headerItem: theme.headerItem,
  container: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
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
}));

const HeaderMenuRight = ({
  menuId,
  handleProfileMenuOpen,
  mobileMenuId,
  handleMobileMenuOpen,
}) => {
  const classes = useStyles();

  return (
    <>
      <div className={classes.container}>
        <IconButton color="inherit">
          <PersonIcon className={classes.headerItem} />
          <Typography className={classes.menuText}>Signin</Typography>
        </IconButton>
        {/* TODO: Toggle IconButton to menu element when user is logged in */}
        <IconButton color="inherit">
          <PersonAddIcon className={classes.headerItem} />
          <Typography className={classes.menuText}>Signup</Typography>
        </IconButton>
        <IconButton
          edge="end"
          aria-label="open user menu"
          aria-controls={menuId}
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          color="inherit"
        >
          <AccountCircle className={classes.headerItem} />
          <Typography className={classes.menuText}>User name</Typography>
        </IconButton>
      </div>
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
