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
    const selectedBrand = [];
    brands.forEach((b) => {
      if (checkBoxState[b._id] === true) selectedBrand.push(b);
    });
    if (selectedBrand.length) loadFilteredProduct("brand", selectedBrand);
    else loadWholeProducts();
  }, [checkBoxState]);
  const loadFilteredProduct = async (name, data) => {
    const { data: products } = await filterByAttribute(name, data);
    dispatch({
      type: "SET_PRODUCTS",
      payload: products,
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
