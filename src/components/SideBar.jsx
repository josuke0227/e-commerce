import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Divider, Drawer, Typography } from "@material-ui/core/";
import { ChevronLeft as ChevronLeftIcon } from "@material-ui/icons/";

import DashboardMenuList from "./DashboardMenuList";
import DefaultMenuList from "./DefaultMenuList";

export const drawerWidth = 250;

const useStyles = makeStyles((theme) => {
  return {
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: "flex-end",
    },
    drawerPaper: {
      width: drawerWidth,
    },
  };
});

const SideBar = ({ handleDrawerClose, location, open }) => {
  const classes = useStyles();
  const isAdminPath = () => location.pathname.split("/")[1] === "admin";

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerHeader}>
        <Typography variant="h6" component="p">
          {isAdminPath() ? "Admin Menu" : "Additional Search"}
        </Typography>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      {isAdminPath() ? <DashboardMenuList /> : <DefaultMenuList />}
    </Drawer>
  );
};

export default SideBar;
