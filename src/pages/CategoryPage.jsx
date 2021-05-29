import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import CategoryListItems from "../components/CategoryListItems";
import CategoryCreateForm from "../components/CategoryCreateForm";
import CategoryFilterInput from "../components/CategoryFilterInput";
import {
  getCategories,
  updateCategory,
  createCategory,
  deleteCategory,
} from "../services/categoriesServices";

const useStyles = makeStyles((theme) => ({
  typographyRoot: {
    marginBottom: "1rem",
  },
  createCategoryForm: {
    marginBottom: "1rem",
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  list: {
    overflowY: "scroll",
    maxHeight: "250px",
  },
  listPadding: {
    padding: 0,
  },
  buttonIconRoot: {
    color: theme.palette.success.main,
  },
}));

const CategoryPage = () => {
  const classes = useStyles();

  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getCategories();
        setCategories(data);
      } catch (error) {
        console.log(`category fetching error`, error);
      }
    };
    fetchCategories();
  }, []);

  const doCategoryCreate = async (categoryName) => {
    setLoading(true);
    try {
      // TODO: add toasty when update is done successfully.
      // TODO: add loader to list item.
      const { data } = await createCategory(categoryName);
      const updatedCategory = [...categories, data];
      setCategories(updatedCategory);
      setLoading(false);
    } catch (error) {
      console.log(`category update error`, error);
      setLoading(false);
    }
  };

  const doCategoryUpdate = async (category) => {
    try {
      // TODO: add toasty when update is done successfully.
      // TODO: add loader to list item.
      const { data } = await updateCategory(category);
      console.log(`data`, data);
    } catch (error) {
      console.log(`category update error`, error);
    }
  };

  const doCategoryDelete = async (category) => {
    try {
      // TODO: add toasty when update is done successfully.
      // TODO: add loader to list item.
      const { data } = await deleteCategory(category);
      const updatedCategory = categories.filter((c) => c.slug !== data.slug);
      setCategories(updatedCategory);
      console.log(`data`, data);
    } catch (error) {
      console.log(`category update error`, error);
    }
  };

  const filteredCategories = categories.filter((c) => {
    const categoryName = c.name.toLowerCase();
    const term = query.toLowerCase();
    return categoryName.includes(term);
  });

  return (
    <div>
      <Typography
        classes={{ root: classes.typographyRoot }}
        variant="h5"
        component="h1"
      >
        Category Management
      </Typography>
      <CategoryCreateForm
        doCategoryCreate={doCategoryCreate}
        loading={loading}
      />
      <div className="">
        <div className="">
          <Typography
            classes={{ root: classes.typographyRoot }}
            variant="h6"
            component="h2"
          >
            Categories
          </Typography>
          <CategoryFilterInput query={query} setQuery={setQuery} />
        </div>
        <div className={classes.demo}>
          <CategoryListItems
            categories={filteredCategories}
            doCategoryUpdate={doCategoryUpdate}
            doCategoryDelete={doCategoryDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
