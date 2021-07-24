import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@material-ui/core/";
import { getCategories } from "../services/categoryServices";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  dummy: {
    height: "48px",
  },
  listItemIcon: {
    fontSize: "1rem",
  },
  listIconContainer: {
    justifyContent: "flex-end",
  },
}));

const CategoryAccordionFilter = ({ setSlide, setCategory }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { sideBar } = useSelector((state) => ({ ...state }));
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);
  const loadCategories = async () => {
    const { data } = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    if (categories.length && sideBar) {
      const selectedCategory = [];
      categories.forEach((c) => {
        if (sideBar[c._id] === true) selectedCategory.push(c);
      });
      loadFilteredProducts("category", selectedCategory);
    }
  }, [sideBar, categories]);
  const loadFilteredProducts = (name, data) => {
    if (sideBar && !data.length) {
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
    setCategory(category._id);
    dispatch({
      type: "SET_STATE",
      payload: { [category._id]: true },
    });
    dispatch({
      type: "RESET_PAGE",
    });
  };

  return (
    <div className={classes.root}>
      <List>
        <ListItem className={classes.dummy}>
          <ListItemText primary={""} />
        </ListItem>
        {categories.map((c) => (
          <>
            <ListItem button key={c._id} onClick={() => handleClick(c)}>
              <ListItemText primary={c.name} />
              <ListItemIcon className={classes.listIconContainer}>
                <ArrowForwardIosIcon className={classes.listItemIcon} />
              </ListItemIcon>
            </ListItem>
          </>
        ))}
      </List>
    </div>
  );
};

export default CategoryAccordionFilter;
