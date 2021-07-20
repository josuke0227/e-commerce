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
import { getVariants } from "../services/variationServices";
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

const VariantAccordionFilter = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [checkBoxState, setCheckBoxState] = useState(INITIAL_CHECKBOX_STATE);
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    loadVariations();
  }, []);
  const loadVariations = async () => {
    const { data } = await getVariants();
    setVariants(data);
  };

  useEffect(() => {
    if (!variants.length) return;

    let checkBoxState = {};
    variants.forEach((v) =>
      v.instances.forEach(
        (i) => (checkBoxState = { ...checkBoxState, [i.name]: false })
      )
    );
    setCheckBoxState(checkBoxState);
  }, [variants]);

  useEffect(() => {
    const selectedVariant = [];
    variants.forEach((v) =>
      v.instances.forEach((i) => {
        if (checkBoxState[i.name] === true) {
          const data = {
            name: v.name,
            data: { ...i },
          };
          selectedVariant.push(data);
        }
      })
    );

    if (selectedVariant.length)
      loadFilteredProducts("variations", selectedVariant);
    else loadWholeProducts();
  }, [checkBoxState]);
  const loadFilteredProducts = async (name, data) => {
    dispatch({
      type: "SET_QUERY",
      payload: { name, data: [...data] },
    });
  };

  // const loadFilteredProduct = async (name, data) => {
  //   const { data: products } = await filterByAttribute(name, data);
  //   dispatch({
  //     type: "SET_PRODUCTS",
  //     payload: products,
  //   });
  // };
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

  return variants.map((v) => (
    <FilterOptions
      key={v._id}
      label={v.name}
      options={v.instances}
      value={checkBoxState}
      handleChange={handleChange}
    />
  ));
};

export default VariantAccordionFilter;

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
            Object.keys(value).length > 0 &&
            options.map((o) => (
              <FormControlLabel
                key={o.name}
                control={
                  <Checkbox
                    checked={value[o.name]}
                    onChange={handleChange}
                    name={o.name}
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
