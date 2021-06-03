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
  Divider,
} from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import CategoryFilterInput from "../components/CategoryFilterInput";
import Layout from "../components/Layout";
import { createSubCategory } from "../services/subCategoryServices";
import { getCategories } from "../services/categoryServices";
import { subCategorySchema } from "../schemas/subCategorySchema";

const useStyles = makeStyles((theme) => {});

const SubCategoryPage = ({ location }) => {
  const [isCategorySelected, setIsCategorySelected] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [inputValue, setInpuValue] = useState("");

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
    doSubmit(subCategory);
  };

  const doSubmit = async (subCategory) => {
    try {
      const { data } = await createSubCategory(subCategory, user);
      return alert(`New sub category "${data.name}" was successfully created.`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout location={location}>
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
          <>
            <ListItem button>
              <ListItemText primary={c.name} />
              <IconButton onClick={() => handleCategorySelect(c)}>
                <MenuIcon />
              </IconButton>
            </ListItem>
          </>
        ))}
      </List>
    </Layout>
  );
};

export default SubCategoryPage;
