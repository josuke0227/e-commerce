import {
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
  Grid,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import {
  createSubCategory,
  deleteSubCategory,
  pickByParentId,
  updateSubCategory,
} from "../services/subCategoryServices";
import { subCategorySchema } from "../schemas/subCategorySchema";
import CustomSnackBar from "../components/shared/CustomSnackBar";
import ConfirmDialog from "../components/shared/ConfirmDialog";

import { getSearchResult } from "../util/search.util";
import SubCategoryList from "../components/SubCategoryList";
import TogglingInput from "../components/TogglingInput";
import CategoryList from "../components/CategoryList";

import { Container, Paper } from "@material-ui/core";
import useCategory from "../hooks/useCategory";
import PanelMobile from "../components/PanelMobile";

const PanelLaptop = ({
  filteredCategories,
  handleCategorySelect,
  listLoading,
  handleBack,
  subCategories,
  doSubCategoryUpdate,
  setSubCategory,
  listItemLoading,
  setShowDialog,
  subCategoryListLoading,
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
            handleBack={handleBack}
            subCategories={subCategories}
            doSubCategoryUpdate={doSubCategoryUpdate}
            setSubCategory={setSubCategory}
            listItemLoading={listItemLoading}
            setShowDialog={setShowDialog}
            loading={subCategoryListLoading}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PanelLaptop;
