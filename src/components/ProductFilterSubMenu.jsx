import {
  List,
  ListItem,
  ListItemText,
  makeStyles,
  ListItemIcon,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import SubCategoryAccordionFilter from "./SubCategoryAccordionFilter";
import BrandAccordionFilter from "./BrandAccordionFilter";
import RatingAccordionFilter from "./RatingAccordionFilter";
import PriceAccordionFilter from "./PriceAccordionFilter";

const useStyles = makeStyles({
  listItemIcon: {
    fontSize: "1rem",
  },
});

const ProductFilterSubMenu = ({ category, setSlide }) => {
  const classes = useStyles();

  return (
    <List>
      <ListItem button onClick={() => setSlide(false)}>
        <ListItemIcon>
          <ArrowBackIcon className={classes.listItemIcon} />
        </ListItemIcon>
        <ListItemText primary={"Main menu"} />
      </ListItem>
      <ListItem>
        <SubCategoryAccordionFilter category={category} />
      </ListItem>
      <ListItem>
        <BrandAccordionFilter />
      </ListItem>
      <ListItem>
        <RatingAccordionFilter />
      </ListItem>
      <ListItem>
        <PriceAccordionFilter />
      </ListItem>
    </List>
  );
};

export default ProductFilterSubMenu;
