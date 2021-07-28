import { useState } from "react";
import { useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import { Typography, Container } from "@material-ui/core";

import CustomSnackBar from "../components/shared/CustomSnackBar";
import ConfirmDialog from "../components/shared/ConfirmDialog";
import CreateCategory from "../components/CreateCategory";
import EditCategory from "../components/EditCategory";
import Layout from "../components/Layout";

import {
  updateCategory,
  createCategory,
  deleteCategory,
} from "../services/categoryServices";
import { getSearchResult } from "../util/getSearchResult";
import useCategory from "../hooks/useCategory";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: "2rem",
  },
  typographyRoot: {
    marginBottom: "1rem",
    [theme.breakpoints.up("sm")]: {
      marginBottom: "3rem",
    },
  },
  uiContainer: {
    [theme.breakpoints.up("sm")]: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gridGap: "2rem",
    },
    [theme.breakpoints.up("md")]: {
      gridGap: "5rem",
    },
  },
}));

const INITIAL_DIALOG_STATE = {
  show: false,
  message: "",
};

const INITIAL_RESULT_STATE = { success: null, message: "" };

const CategoryPage = ({ location }) => {
  const classes = useStyles();
  const { user } = useSelector((state) => state);

  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listItemLoading, setListItemLoading] = useState({});
  const [showDialog, setShowDialog] = useState(INITIAL_DIALOG_STATE);
  const [result, setResult] = useState(INITIAL_RESULT_STATE);
  const [showSnackBar, setShowSnackBar] = useState({
    show: false,
    severity: "",
    message: "",
  });
  const [categories, listLoading, setCategories] = useCategory();

  const doCategoryCreate = async (categoryName) => {
    setSubmitting(true);
    try {
      const { data } = await createCategory(categoryName, user);
      const updatedCategory = [...categories, data];
      setCategories(updatedCategory);
      setSubmitting(false);
      setShowSnackBar({
        editing: false,
        show: true,
        severity: "success",
        message: `New category "${categoryName}" was created successfully.`,
      });
    } catch (error) {
      setShowSnackBar({
        editing: false,
        show: true,
        severity: "error",
        message: error.response.data,
      });
      setSubmitting(false);
    }
  };

  const doCategoryUpdate = async (category) => {
    setListItemLoading({ [category.slug]: true });
    try {
      const { data } = await updateCategory(category, user);
      const updatedCategory = categories.map((c) =>
        c._id === data._id ? data : c
      );
      setCategories(updatedCategory);
      setListItemLoading({ [category.slug]: false });
      setShowSnackBar({
        editing: true,
        show: true,
        severity: "success",
        message: "Updated successfully.",
      });
    } catch (error) {
      console.log(`category update error`, error);
      setListItemLoading({ [category.slug]: false });
      setShowSnackBar({
        editing: true,
        show: true,
        severity: "error",
        message: "Update failed. Please try again later.",
      });
    }
  };

  const doCategoryDelete = async (category) => {
    setLoading(true);

    try {
      const { data } = await deleteCategory(category, user);
      const updatedCategory = categories.filter((c) => c.slug !== data.slug);
      setCategories(updatedCategory);
      setSelectedCategory(null);
      setLoading(false);
      setResult({ success: true, message: "" });
    } catch (error) {
      setLoading(false);
      setResult({ success: false, message: error.message });
    }
  };

  const handleConfirm = () => {
    doCategoryDelete(selectedCategory);
  };

  const handleCancel = () => {
    setShowDialog({ show: false, message: "" });
    setResult({ message: "", success: null });
  };

  const filteredCategories = getSearchResult(categories, query);

  return (
    <Layout location={location}>
      <CustomSnackBar
        showSnackBar={showSnackBar}
        setShowSnackBar={setShowSnackBar}
      />
      <ConfirmDialog
        handleConfirm={handleConfirm}
        handleCancel={handleCancel}
        showDialog={showDialog}
        result={result}
        loading={loading}
      />
      <div className={classes.container}>
        <Typography
          classes={{ root: classes.typographyRoot }}
          variant="h5"
          component="h1"
        >
          Category Management
        </Typography>

        <Container className={classes.uiContainer}>
          <CreateCategory
            doCategoryCreate={doCategoryCreate}
            loading={submitting}
          />
          <EditCategory
            query={query}
            setQuery={setQuery}
            filteredCategories={filteredCategories}
            doCategoryUpdate={doCategoryUpdate}
            doCategoryDelete={doCategoryDelete}
            setShowDialog={setShowDialog}
            listItemLoading={listItemLoading}
            setListItemLoading={setListItemLoading}
            setSelectedCategory={setSelectedCategory}
            listLoading={listLoading}
          />
        </Container>
      </div>
    </Layout>
  );
};

export default CategoryPage;
