import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Accordion,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core/";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { getCategories } from "../services/categoryServices";

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

const CategoryAccordionFilter = () => {
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
    const selectedCategory = [];
    categories.forEach((c) => {
      if (checkBoxState[c._id] === true) selectedCategory.push(c);
    });
    loadFilteredProducts("category", selectedCategory);
  }, [checkBoxState]);
  const loadFilteredProducts = async (name, data) => {
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

  const handleChange = (event) => {
    setCheckBoxState({
      ...checkBoxState,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="categorySelector">
          <Typography className={classes.heading}>Category</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup row>
            {categories.length > 0 &&
              categories.map((c) => (
                <FormControlLabel
                  key={c._id}
                  control={
                    <Checkbox
                      checked={checkBoxState[c.name]}
                      onChange={handleChange}
                      name={c._id}
                      color="primary"
                    />
                  }
                  label={c.name}
                />
              ))}
            <div className=""></div>
          </FormGroup>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default CategoryAccordionFilter;
