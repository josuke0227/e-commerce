import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import {
  Button,
  ListItem,
  ListItemText,
  Grid,
  IconButton,
  List,
} from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import CategoryFilterInput from "../components/CategoryFilterInput";
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
import SubCategoryListItem from "../components/SubCategoryListItem";

const useStyles = makeStyles((theme) => {});

const SubCategoryPage = ({ location }) => {
  const [isCategorySelected, setIsCategorySelected] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [inputValue, setInpuValue] = useState("");
  const [listLoading, setListLoading] = useState({});
  const [showDialog, setShowDialog] = useState(false);
  const [showSnackBar, setShowSnackBar] = useState({
    show: false,
    severity: "",
    message: "",
  });

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
    setInpuValue("");
    setIsCategorySelected(true);
    setCategory(selectedCategory);
  };

  const handleCancel = () => {
    setInpuValue("");
    setIsCategorySelected(false);
    setCategory(null);
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
      setInpuValue("");
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

  return (
    <Layout location={location}>
      <ConfirmDialog
        showDialog={showDialog}
        item={subCategory}
        handleConfirm={doSubCategoryDelete}
        setShowDialog={setShowDialog}
      />
      <Grid container>
        <Grid item xs={12}>
          <CategoryFilterInput
            value={inputValue}
            onChange={setInpuValue}
            isCategorySelected={isCategorySelected}
          />
        </Grid>
        <Grid container spacing={1}>
          {isCategorySelected && (
            <>
              <Grid item xs={6}>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Submit
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="default"
                  onClick={handleCancel}
                  fullWidth
                >
                  Cancel
                </Button>
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
      <List>
        {categories.map((c) => (
          <ListItem key={c._id}>
            <ListItemText primary={c.name} />
            <IconButton onClick={() => handleCategorySelect(c)}>
              <MenuIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <List>
        {subCategories.map((c) => (
          <SubCategoryListItem
            key={c._id}
            subCategory={c}
            doSubCategoryUpdate={doSubCategoryUpdate}
            setSubCategory={setSubCategory}
            listLoading={listLoading}
            setShowDialog={setShowDialog}
          />
        ))}
      </List>
      <CustomSnackBar
        showSnackBar={showSnackBar}
        setShowSnackBar={setShowSnackBar}
      />
    </Layout>
  );
};

export default SubCategoryPage;
