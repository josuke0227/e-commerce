import Badge from "@material-ui/core/Badge";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"; // cart
import StorefrontIcon from "@material-ui/icons/Storefront";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  headerMenuLeft: {
    gridArea: "icons",
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.up("md")]: {
      flex: 1,
    },
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
  menuLink: theme.menuLink,
}));

const HeaderMenuLeft = () => {
  const classes = useStyles();

  return (
    <div className={classes.headerMenuLeft}>
      <Link to="/" className={classes.menuLink}>
        <Typography className={classes.title} variant="h6" noWrap>
          E-commerce site
        </Typography>
      </Link>

      <Link to="/shop" className={classes.menuLink}>
        <IconButton color="inherit">
          <StorefrontIcon className={classes.headerItem} />
          <Typography className={classes.menuText}>Shop</Typography>
        </IconButton>
      </Link>

      {/* TODO: Implement another drawer for cart */}
      <IconButton color="inherit">
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
