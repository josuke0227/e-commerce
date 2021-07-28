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
import { pickByParentId } from "../services/subCategoryServices";

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

const SubCategoryAccordionFilter = ({ category }) => {
  const dispatch = useDispatch();

  const [checkBoxState, setCheckBoxState] = useState(INITIAL_CHECKBOX_STATE);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const loadSubCategories = async () => {
      const { data } = await pickByParentId(category);
      setSubCategories(data);
    };

    if (!category) return;
    loadSubCategories();
  }, [category]);

  useEffect(() => {
    const loadFilteredProducts = async (name, data) => {
      if (Object.keys(checkBoxState).length && !data.length) {
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

    if (subCategories.length && Object.keys(checkBoxState).length) {
      const selectedSubCategories = [];
      subCategories.forEach((c) => {
        if (checkBoxState[c._id] === true) selectedSubCategories.push(c);
      });
      loadFilteredProducts("subCategory", selectedSubCategories);
    }
  }, [checkBoxState, subCategories, dispatch]);

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
