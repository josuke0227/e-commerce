import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Divider, Drawer } from "@material-ui/core/";
import { ChevronLeft as ChevronLeftIcon } from "@material-ui/icons/";

import DashboardMenuList from "./DashboardMenuList";
import DefaultMenuList from "./DefaultMenuList";

export const drawerWidth = 150;

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
