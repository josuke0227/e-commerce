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

import { Paper } from "@material-ui/core";
import Slide from "../components/Slide";

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

  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getCategories();
        setCategories(data);
      } catch (error) {
        console.log("category fetching error", error);
        return;
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubCategoryByParent = async () => {
      try {
        const { data } = await pickByParentId(category._id);
        setSubCategories(data);
      } catch (error) {
        console.log("sub category fetching error", error);
        return;
      }
    };

    if (category === null) return;
    fetchSubCategoryByParent();
  }, [category]);

  const handleCategorySelect = (selectedCategory) => {
    setInputValue("");
    setIsCategorySelected(true);
    setCategory(selectedCategory);
    setSlide(true);
  };

  const handleBack = () => {
    setIsCategorySelected(false);
    setSlide(false);
  };

  const handleCancel = () => {
    setInputValue("");
    setIsCategorySelected(false);
    setCategory(null);
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
      <TogglingInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        isCategorySelected={isCategorySelected}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
      <Paper elevation={3} style={{ margin: 16 }}>
        <Slide
          slide={slide}
          frameWidth="100%"
          frameHeight="70vh"
          defaultContent={
            <CategoryList
              categories={filteredCategories}
              variant="selector"
              handleSelect={handleCategorySelect}
              taller
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
            />
          }
        />
      </Paper>
      <CustomSnackBar
        showSnackBar={showSnackBar}
        setShowSnackBar={setShowSnackBar}
      />
    </Layout>
  );
};

export default SubCategoryPage;
