import {
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
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
import TogglingInput from "../components/TogglingInput";

import { Container } from "@material-ui/core";
import useCategory from "../hooks/useCategory";
import PanelMobile from "../components/PanelMobile";
import PanelLaptop from "../components/PanelLaptop";

const useStyles = makeStyles({
  caption: {
    marginTop: "1rem",
  },
  panel: {
    marginTop: "1rem",
  },
});

const INITIAL_DIALOG_STATE = {
  show: false,
  message: "",
};

const INITIAL_RESULT_STATE = { success: null, message: "" };

const SubCategoryPage = ({ location }) => {
  const [subCategories, setSubCategories] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [category, setCategory] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [listItemLoading, setListItemLoading] = useState({});
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(INITIAL_DIALOG_STATE);
  const [result, setResult] = useState(INITIAL_RESULT_STATE);
  const [showSnackBar, setShowSnackBar] = useState({
    show: false,
    severity: "",
    message: "",
  });
  const [slide, setSlide] = useState(false);
  const [subCategoryListLoading, setSubCategoryListLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, listLoading] = useCategory();

  const { user } = useSelector((state) => ({ ...state }));
  const classes = useStyles();
  const theme = useTheme();
  const match = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    const fetchSubCategoryByParent = async () => {
      setSubCategoryListLoading(true);
      try {
        const { data } = await pickByParentId(category._id);
        setSubCategories(data);
      } catch (error) {
        console.log("sub category fetching error", error);
      }
      setSubCategoryListLoading(false);
    };

    if (category === null) return;
    fetchSubCategoryByParent();
  }, [category]);

  const handleCategorySelect = (selectedCategory) => {
    const toggleRestStates = () => {
      setInputValue("");
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
      setShowSnackBar({
        editing: false,
        show: true,
        severity: "error",
        message: error.response.data || "Creating category failed.",
      });
    }
    setIsSubmitting(false);
  };

  const doSubCategoryUpdate = async (subCategory) => {
    setListItemLoading({ [subCategory.slug]: true });
    const { name, parent, slug } = subCategory;
    subCategory = { name, parent, slug };
    try {
      const { data } = await updateSubCategory(subCategory, user);
      const updatedCategory = subCategories.map((c) =>
        c._id === data._id ? data : c
      );
      setSubCategories(updatedCategory);
      setListItemLoading({ [subCategory.slug]: false });
      setShowSnackBar({
        editing: true,
        show: true,
        severity: "success",
        message: "Updated successfully.",
      });
    } catch (error) {
      console.log(`category update error`, error);
      setListItemLoading({ [subCategory.slug]: false });
      setShowSnackBar({
        editing: true,
        show: true,
        severity: "error",
        message: "Update failed. Please try again later.",
      });
    }
  };

  const doSubCategoryDelete = async (category) => {
    setLoading(true);
    try {
      const { data } = await deleteSubCategory(category, user);
      const updatedCategory = subCategories.filter((c) => c.slug !== data.slug);
      setSubCategories(updatedCategory);
      setSubCategory(null);
      setLoading(false);
      setResult({ success: true, message: "" });
    } catch (error) {
      setLoading(false);
      setResult({ success: false, message: "" });
    }
  };

  const handleConfirm = () => {
    doSubCategoryDelete(subCategory);
  };

  const handleCancel = () => {
    setInputValue("");
    setSubCategories([]);
    setCategory(null);
    setSlide(false);
    setShowDialog({ show: false, message: "" });
    setResult({ message: "", success: null });
  };

  const filteredCategories = !category
    ? getSearchResult(categories, inputValue)
    : categories;

  return (
    <Layout location={location}>
      <ConfirmDialog
        handleConfirm={handleConfirm}
        handleCancel={handleCancel}
        showDialog={showDialog}
        result={result}
        loading={loading}
      />
      <Container>
        {!category ? (
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
          category={category}
          handleSubmit={handleSubmit}
          handleCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
        {match ? (
          <PanelLaptop
            filteredCategories={filteredCategories}
            handleCategorySelect={handleCategorySelect}
            listLoading={listLoading}
            subCategories={subCategories}
            doSubCategoryUpdate={doSubCategoryUpdate}
            setSubCategory={setSubCategory}
            listItemLoading={listItemLoading}
            setShowDialog={setShowDialog}
            subCategoryListLoading={subCategoryListLoading}
            slide={slide}
            category={category}
          />
        ) : (
          <PanelMobile
            filteredCategories={filteredCategories}
            handleCategorySelect={handleCategorySelect}
            listLoading={listLoading}
            subCategories={subCategories}
            doSubCategoryUpdate={doSubCategoryUpdate}
            setSubCategory={setSubCategory}
            listItemLoading={listItemLoading}
            setShowDialog={setShowDialog}
            subCategoryListLoading={subCategoryListLoading}
            slide={slide}
            category={category}
          />
        )}
      </Container>
      <CustomSnackBar
        showSnackBar={showSnackBar}
        setShowSnackBar={setShowSnackBar}
      />
    </Layout>
  );
};

export default SubCategoryPage;
