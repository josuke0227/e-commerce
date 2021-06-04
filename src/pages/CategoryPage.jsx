import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { makeStyles } from "@material-ui/core/styles";
import { Typography, Container } from "@material-ui/core";

import CustomSnackBar from "../components/shared/CustomSnackBar";
import ConfirmDialog from "../components/shared/ConfirmDialog";
import CreateCategory from "../components/CreateCategory";
import EditCategory from "../components/EditCategory";
import Layout from "../components/Layout";

import {
  getCategories,
  updateCategory,
  createCategory,
  deleteCategory,
} from "../services/categoryServices";

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

const CategoryPage = ({ location }) => {
  const classes = useStyles();
  const { user } = useSelector((state) => state);

  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState({
    show: false,
    severity: "",
    message: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getCategories();
        setCategories(data);
      } catch (error) {
        console.log(`category fetching error`, error);
        return;
      }
    };
    fetchCategories();
  }, []);

  const doCategoryCreate = async (categoryName) => {
    setLoading(true);
    try {
      const { data } = await createCategory(categoryName, user);
      const updatedCategory = [...categories, data];
      setCategories(updatedCategory);
      setLoading(false);
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
      setLoading(false);
    }
  };

  const doCategoryUpdate = async (category) => {
    setListLoading({ [category.slug]: true });
    try {
      const { data } = await updateCategory(category, user);
      const updatedCategory = categories.map((c) =>
        c._id === data._id ? data : c
      );
      setCategories(updatedCategory);
      setListLoading({ [category.slug]: false });
      setShowSnackBar({
        editing: true,
        show: true,
        severity: "success",
        message: "Updated successfully.",
      });
    } catch (error) {
      console.log(`category update error`, error);
      setListLoading({ [category.slug]: false });
      setShowSnackBar({
        editing: true,
        show: true,
        severity: "error",
        message: "Update failed. Please try again later.",
      });
    }
  };

  const doCategoryDelete = async (category) => {
    setListLoading({ [category.slug]: true });
    try {
      const { data } = await deleteCategory(category, user);
      const updatedCategory = categories.filter((c) => c.slug !== data.slug);
      setCategories(updatedCategory);
      setListLoading({ [category.slug]: false });
      setSelectedCategory(null);
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

  const filteredCategories = categories.filter((c) => {
    const categoryName = c.name.toLowerCase();
    const term = query.toLowerCase();
    return categoryName.includes(term);
  });

  return (
    <Layout location={location}>
      <CustomSnackBar
        showSnackBar={showSnackBar}
        setShowSnackBar={setShowSnackBar}
      />
      <ConfirmDialog
        showDialog={showDialog}
        item={selectedCategory}
        handleConfirm={doCategoryDelete}
        setShowDialog={setShowDialog}
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
            loading={loading}
          />
          <EditCategory
            query={query}
            setQuery={setQuery}
            filteredCategories={filteredCategories}
            doCategoryUpdate={doCategoryUpdate}
            doCategoryDelete={doCategoryDelete}
            setShowDialog={setShowDialog}
            listLoading={listLoading}
            setListLoading={setListLoading}
            setSelectedCategory={setSelectedCategory}
          />
        </Container>
      </div>
    </Layout>
  );
};

export default CategoryPage;
