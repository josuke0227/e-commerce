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
import { getSubCategories } from "../services/subCategoryServices";
import { filterByAttribute, getProducts } from "../services/productServices";

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

const SubCategoryAccordionFilter = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [checkBoxState, setCheckBoxState] = useState(INITIAL_CHECKBOX_STATE);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    loadSubCategories();
  }, []);
  const loadSubCategories = async () => {
    const { data } = await getSubCategories();
    setSubCategories(data);
  };

  useEffect(() => {
    if (!subCategories.length) return;

    let checkBoxState = {};
    subCategories.forEach(
      (c) => (checkBoxState = { ...checkBoxState, [c._id]: false })
    );
    setCheckBoxState(checkBoxState);
  }, [subCategories]);

  useEffect(() => {
    const selectedCategory = [];
    subCategories.forEach((c) => {
      if (checkBoxState[c._id] === true) selectedCategory.push(c);
    });
    if (selectedCategory.length)
      loadFilteredProducts("subCategory", selectedCategory);
    else loadWholeProducts();
  }, [checkBoxState]);
  const loadFilteredProducts = async (name, data) => {
    dispatch({
      type: "SET_QUERY",
      payload: { name, data: [...data] },
    });
  };
  const loadWholeProducts = async () => {
    const { data } = await getProducts();
    dispatch({
      type: "SET_PRODUCTS",
      payload: data,
    });
  };

  const handleChange = (event) => {
    setCheckBoxState({
      ...checkBoxState,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <FilterOptions
      label="Sub category"
      options={subCategories}
      value={checkBoxState}
      handleChange={handleChange}
    />
  );
};

export default SubCategoryAccordionFilter;

const FilterOptions = ({ options, value, handleChange, label }) => {
  const classes = useStyles();
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} id="categorySelector">
        <Typography className={classes.heading}>{label}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormGroup row>
          {options.length > 0 &&
            options.map((o) => (
              <FormControlLabel
                key={o._id}
                control={
                  <Checkbox
                    checked={value[o.name]}
                    onChange={handleChange}
                    name={o._id}
                    color="primary"
                  />
                }
                label={o.name}
              />
            ))}
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  );
};
