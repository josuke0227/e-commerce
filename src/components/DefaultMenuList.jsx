import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CategoryAccordionFilter from "./CategoryAccordionFilter";
import SubCategoryAccordionFilter from "./SubCategoryAccordionFilter";
import BrandAccordionFilter from "./BrandAccordionFilter";
import VariantAccordionFilter from "./VariantAccordionFilter";
import RatingAccordionFilter from "./RatingAccordionFilter";
import PriceAccordionFilter from "./PriceAccordionFilter";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  accordionDetailsRoot: {
    display: "block",
    padding: "0 1rem 0.5rem 1rem",
  },
}));

const listItems = [
  { label: "Price", content: <PriceAccordionFilter /> },
  { label: "Categories", content: <CategoryAccordionFilter /> },
  { label: "Rating", content: <RatingAccordionFilter /> },
  { label: "Sub Categories", content: <SubCategoryAccordionFilter /> },
  { label: "Brands", content: <BrandAccordionFilter /> },
  { label: "Variations", content: <VariantAccordionFilter /> },
];

const DefaultMenuList = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {listItems.map(({ content }) => content)}
    </div>
  );
};

export default DefaultMenuList;
