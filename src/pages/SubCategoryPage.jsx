import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
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
import { getCategories } from "../services/categoriesServices";

const useStyles = makeStyles((theme) => {});

const SubCategoryPage = ({ location }) => {
  const [isCategorySelected, setIsCategorySelected] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [inputValue, setInpuValue] = useState("");

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
                <Button variant="contained" color="primary" fullWidth>
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
          <ListItem button>
            <ListItemText primary={c.name} />
            <IconButton onClick={() => handleCategorySelect(c)}>
              <MenuIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Layout>
  );
};

export default SubCategoryPage;
