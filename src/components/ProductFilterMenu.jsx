import {
  List,
  ListItem,
  ListItemText,
  makeStyles,
  ListItemIcon,
} from "@material-ui/core";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

const useStyles = makeStyles({
  listItem: {
    height: "48px",
  },
  listItemIcon: {
    fontSize: "1rem",
  },
  listIconContainer: {
    justifyContent: "flex-end",
  },
});

const ProductFilterMenu = ({ categories, onClick }) => {
  const classes = useStyles();

  return (
    <List>
      <ListItem className={classes.listItem}>
        <ListItemText primary={""} />
      </ListItem>
      {categories.map((c) => (
        <ListItem button key={c._id} onClick={() => onClick(c)}>
          <ListItemText primary={c.name} />
          <ListItemIcon className={classes.listIconContainer}>
            <ArrowForwardIosIcon className={classes.listItemIcon} />
          </ListItemIcon>
        </ListItem>
      ))}
    </List>
  );
};

export default ProductFilterMenu;
