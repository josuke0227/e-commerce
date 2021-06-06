import { makeStyles, Typography } from "@material-ui/core";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Layout from "../components/Layout";
import {
  createSubCategory,
  deleteSubCategory,
  pickByParentId,
  updateSubCategory,
} from "../services/subCategoryServices";
import { getCategories } from "../services/categoryServices";
import { subCategorySchema } from "../schemas/subCategorySchema";
import CustomSnackBar from "../components/shared/CustomSnackBar";
import ConfirmDialog from "../components/shared/ConfirmDialog";

import { getSearchResult } from "../util/search.util";
import SubCategoryList from "../components/SubCategoryList";
import TogglingInput from "../components/TogglingInput";
import CategoryList from "../components/CategoryList";

import { Container, Paper } from "@material-ui/core";
import Slide from "../components/Slide";

const useStyles = makeStyles({
  caption: {
    marginTop: "1rem",
  },
  panel: {
    marginTop: "1rem",
  },
});

const SubCategoryPage = ({ location }) => {
  const [isCategorySelected, setIsCategorySelected] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [listLoading, setListLoading] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState({
    show: false,
    severity: "",
    message: "",
  });
  const [slide, setSlide] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useSelector((state) => ({ ...state }));
  const classes = useStyles();

  useEffect(() => {
    setLoading(true);
    const fetchCategories = async () => {
      try {
        const { data } = await getCategories();
        setCategories(data);
      } catch (error) {
        console.log("category fetching error", error);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategoryByParent = async () => {
      setLoading(true);
      try {
        const { data } = await pickByParentId(category._id);
        setSubCategories(data);
      } catch (error) {
        console.log("sub category fetching error", error);
      }
      setLoading(false);
    };

    if (category === null) return;
    fetchSubCategoryByParent();
  }, [category]);

  const handleCategorySelect = (selectedCategory) => {
    const toggleRestStates = () => {
      setInputValue("");
      setIsCategorySelected(true);
      setSlide(true);
    };

    if (category === null) {
      setCategory(selectedCategory);
      toggleRestStates();
    } else if (selectedCategory.name === category.name) {
      toggleRestStates();
    } else {
      setCategory(selectedCategory);
      toggleRestStates();
    }
  };

  const handleBack = () => {
    setIsCategorySelected(false);
    setSlide(false);
  };

  const handleCancel = () => {
    setInputValue("");
    setIsCategorySelected(false);
    setSlide(false);
  };

  const handleSubmit = () => {
    const subCategory = {
      name: inputValue,
      parent: category._id,
    };
    const { error } = subCategorySchema.validate(subCategory);
    if (error) return alert("Invalid data.");
    doSubCategoryCreate(subCategory);
  };

  const doSubCategoryCreate = async (subCategory) => {
    setIsSubmitting(true);
    try {
      const { data } = await createSubCategory(subCategory, user);
      setSubCategories([...subCategories, data]);
      setShowSnackBar({
        editing: false,
        show: true,
        severity: "success",
        message: `New category "${data.name}" was created successfully.`,
      });
      setInputValue("");
    } catch (error) {
      console.log(error);
    }
    setIsSubmitting(false);
  };

  const doSubCategoryUpdate = async (subCategory) => {
    setListLoading({ [subCategory.slug]: true });
    const { name, parent, slug } = subCategory;
    subCategory = { name, parent, slug };
    try {
      const { data } = await updateSubCategory(subCategory, user);
      const updatedCategory = subCategories.map((c) =>
        c._id === data._id ? data : c
      );
      setSubCategories(updatedCategory);
      setListLoading({ [subCategory.slug]: false });
      setShowSnackBar({
        editing: true,
        show: true,
        severity: "success",
        message: "Updated successfully.",
      });
    } catch (error) {
      console.log(`category update error`, error);
      setListLoading({ [subCategory.slug]: false });
      setShowSnackBar({
        editing: true,
        show: true,
        severity: "error",
        message: "Update failed. Please try again later.",
      });
    }
  };

  const doSubCategoryDelete = async (category) => {
    setListLoading({ [category.slug]: true });
    try {
      const { data } = await deleteSubCategory(category, user);
      const updatedCategory = subCategories.filter((c) => c.slug !== data.slug);
      setSubCategories(updatedCategory);
      setListLoading({ [category.slug]: false });
      setSubCategory(null);
      setShowSnackBar({
        editing: true,
        show: true,
        severity: "success",
        message: "Deleted successfully.",
      });
    } catch (error) {
      setListLoading({ [category.slug]: false });
      setShowSnackBar({
        editing: true,
        show: true,
        severity: "error",
        message: "Deletion failed. Please try again later.",
      });
    }
  };

  const filteredCategories = getSearchResult(categories, inputValue);

  return (
    <Layout location={location}>
      <ConfirmDialog
        showDialog={showDialog}
        item={subCategory}
        handleConfirm={doSubCategoryDelete}
        setShowDialog={setShowDialog}
      />
      <Container>
        {!isCategorySelected ? (
          <Typography className={classes.caption} variant="subtitle1">
            Please select category to work with sub category.
          </Typography>
        ) : (
          <Typography className={classes.caption} variant="subtitle1">
            Selected category: {<strong>{category.name}</strong>}
          </Typography>
        )}
        <TogglingInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          isCategorySelected={isCategorySelected}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
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
                taller
                loading={loading}
              />
            }
            alternativeContent={
              <SubCategoryList
                handleBack={handleBack}
                subCategories={subCategories}
                doSubCategoryUpdate={doSubCategoryUpdate}
                setSubCategory={setSubCategory}
                listLoading={listLoading}
                setShowDialog={setShowDialog}
                loading={loading}
              />
            }
          />
        </Paper>
      </Container>
      <CustomSnackBar
        showSnackBar={showSnackBar}
        setShowSnackBar={setShowSnackBar}
      />
    </Layout>
  );
};

export default SubCategoryPage;
