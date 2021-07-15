import { useState, useEffect } from "react";
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
import { filterByAttribute } from "../services/productServices";
import ProductCard from "../components/ProductCard";
import { getVariants } from "../services/variationServices";

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

export default function Playground() {
  const classes = useStyles();

  const [checkBoxState, setCheckBoxState] = useState(INITIAL_CHECKBOX_STATE);
  const [variants, setVariants] = useState([]);
  const [products, setProducts] = useState([]);

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

    if (selectedVariant.length) {
      // TODO: map variant name
      loadFilteredProduct("variations", selectedVariant);
    }
  }, [checkBoxState]);

  const loadFilteredProduct = async (name, data) => {
    const { data: response } = await filterByAttribute(name, data);
    setProducts(response);
  };

  const handleChange = (event) => {
    setCheckBoxState({
      ...checkBoxState,
      [event.target.name]: event.target.checked,
    });
  };

  return (
    <div className={classes.root}>
      <div className="">
        {variants.map((v) => (
          <FilterOptions
            key={v._id}
            label={v.name}
            options={v.instances}
            value={checkBoxState}
            handleChange={handleChange}
          />
        ))}
        {products.map((p) => (
          <ProductCard product={p} />
        ))}
      </div>
    </div>
  );
}

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
