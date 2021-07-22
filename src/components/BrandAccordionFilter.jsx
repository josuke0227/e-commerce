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
import { getBrands } from "../services/brandsService";

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
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    loadBrands();
  }, []);
  const loadBrands = async () => {
    const { data } = await getBrands();
    setBrands(data);
  };

  useEffect(() => {
    if (!brands.length) return;

    let checkBoxState = {};
    brands.forEach(
      (c) => (checkBoxState = { ...checkBoxState, [c._id]: false })
    );
    setCheckBoxState(checkBoxState);
  }, [brands]);

  useEffect(() => {
    if (brands.length && Object.keys(checkBoxState).length) {
      const selectedBrands = [];
      brands.forEach((b) => {
        if (checkBoxState[b._id] === true) selectedBrands.push(b);
      });
      loadFilteredProducts("brand", selectedBrands);
    }
  }, [checkBoxState, brands]);
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
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Brands</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup row>
            {brands.length > 0 &&
              brands.map((b) => (
                <FormControlLabel
                  key={b._id}
                  control={
                    <Checkbox
                      checked={checkBoxState[b.name]}
                      onChange={handleChange}
                      name={b._id}
                      color="primary"
                    />
                  }
                  label={b.name}
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
