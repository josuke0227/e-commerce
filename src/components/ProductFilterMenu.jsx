import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core/";
import { getCategories } from "../services/categoryServices";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const INITIAL_CHECKBOX_STATE = {};

const CategoryAccordionFilter = ({ setSlide, setCategory }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [checkBoxState, setCheckBoxState] = useState(INITIAL_CHECKBOX_STATE);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);
  const loadCategories = async () => {
    const { data } = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    if (!categories.length) return;
    let checkBoxState = {};
    categories.forEach(
      (c) => (checkBoxState = { ...checkBoxState, [c._id]: false })
    );
    setCheckBoxState(checkBoxState);
  }, [categories]);

  useEffect(() => {
    console.log(checkBoxState);
    const selectedCategory = [];
    categories.forEach((c) => {
      if (checkBoxState[c._id] === true) selectedCategory.push(c);
    });
    if (!categories.length) return;
    loadFilteredProducts("category", selectedCategory);
  }, [checkBoxState]);
  const loadFilteredProducts = (name, data) => {
    if (!data.length) {
      dispatch({
        type: "RESET_QUERY",
        payload: { name },
      });
    } else if (data.length)
      dispatch({
        type: "SET_QUERY",
        payload: { name, data: [...data] },
      });
  };

  const handleClick = (category) => {
    setSlide(true);
    setCategory(category);
    setCheckBoxState({
      ...checkBoxState,
      [category._id]: true,
    });
  };

  return (
    <List>
      <ListItem className={classes.listItem}>
        <ListItemText primary={""} />
      </ListItem>
      {categories.map((c) => (
        <ListItem button key={c._id} onClick={() => handleClick(c)}>
          <ListItemText primary={c.name} />
          <ListItemIcon className={classes.listIconContainer}>
            <ArrowForwardIosIcon className={classes.listItemIcon} />
          </ListItemIcon>
        </ListItem>
      ))}
    </List>
  );
};

export default CategoryAccordionFilter;
