import { makeStyles } from "@material-ui/core";
import SubCategoryList from "../components/SubCategoryList";
import CategoryList from "../components/CategoryList";

import { Paper } from "@material-ui/core";
import Slide from "../components/Slide";

const useStyles = makeStyles({
  caption: {
    marginTop: "1rem",
  },
  panel: {
    marginTop: "1rem",
  },
});

const PanelMobile = ({
  filteredCategories,
  handleCategorySelect,
  listLoading,
  subCategories,
  doSubCategoryUpdate,
  setSubCategory,
  listItemLoading,
  setShowDialog,
  subCategoryListLoading,
  slide,
  category,
}) => {
  const classes = useStyles();

  return (
    <Paper elevation={3} className={classes.panel}>
      <Slide
        slide={slide}
        frameWidth="100%"
        frameHeight="45vh"
        defaultContent={
          <CategoryList
            categories={filteredCategories}
            variant="selector"
            handleSelect={handleCategorySelect}
            loading={listLoading}
            taller
          />
        }
        alternativeContent={
          <SubCategoryList
            category={category}
            subCategories={subCategories}
            doSubCategoryUpdate={doSubCategoryUpdate}
            setSubCategory={setSubCategory}
            listItemLoading={listItemLoading}
            setShowDialog={setShowDialog}
            loading={subCategoryListLoading}
          />
        }
      />
    </Paper>
  );
};

export default PanelMobile;
