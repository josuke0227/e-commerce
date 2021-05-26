import Badge from "@material-ui/core/Badge";
import MenuIcon from "@material-ui/icons/Menu";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"; // cart
import StorefrontIcon from "@material-ui/icons/Storefront";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  headerMenuLeft: {
    gridArea: "icons",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "block",
      marginRight: "1rem",
    },
  },
  headerItem: theme.headerItem,
  menuText: theme.menuText,
}));

const HeaderMenuLeft = ({}) => {
  const classes = useStyles();

  return (
    <div className={classes.headerMenuLeft}>
      {/* TODO: Let Menu Icon be a toggler for sidebar. */}
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="open drawer"
      >
        <MenuIcon />
      </IconButton>

      <Typography className={classes.title} variant="h6" noWrap>
        E-commerce site
      </Typography>

      <IconButton aria-label="back to shop" color="inherit">
        <StorefrontIcon className={classes.headerItem} />
        <Typography className={classes.menuText}>Shop</Typography>
      </IconButton>

      <IconButton aria-label="go to cart" color="inherit">
        <Badge
          badgeContent={4}
          color="secondary"
          className={classes.iconWrapper}
        >
          <ShoppingCartIcon className={classes.headerItem} />
          <Typography className={classes.menuText}>Cart</Typography>
        </Badge>
      </IconButton>
    </div>
  );
};

export default HeaderMenuLeft;
