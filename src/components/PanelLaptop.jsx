import { Grid } from "@material-ui/core";

import SubCategoryList from "../components/SubCategoryList";
import CategoryList from "../components/CategoryList";

import { Paper } from "@material-ui/core";

const PanelLaptop = ({
  filteredCategories,
  handleCategorySelect,
  listLoading,
  subCategories,
  doSubCategoryUpdate,
  setSubCategory,
  listItemLoading,
  setShowDialog,
  subCategoryListLoading,
  category,
}) => {
  return (
    <Grid container spacing={3}>
      <Grid item sm={6}>
        <Paper>
          <CategoryList
            categories={filteredCategories}
            variant="selector"
            handleSelect={handleCategorySelect}
            loading={listLoading}
            taller
          />
        </Paper>
      </Grid>
      <Grid item sm={6}>
        <Paper>
          <SubCategoryList
            subCategories={subCategories}
            doSubCategoryUpdate={doSubCategoryUpdate}
            setSubCategory={setSubCategory}
            listItemLoading={listItemLoading}
            setShowDialog={setShowDialog}
            loading={subCategoryListLoading}
            category={category}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PanelLaptop;
