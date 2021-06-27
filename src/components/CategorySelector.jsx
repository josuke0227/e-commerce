import { useState, useEffect } from "react";
import { getCategories } from "../services/categoryServices";
import { TextField, MenuItem, makeStyles } from "@material-ui/core";
import { getIndex } from "../util/getIndex";

const useStyles = makeStyles((theme) => ({
  formParts: {
    marginTop: theme.spacing(3),
  },
  slideButton: {
    marginBottom: theme.spacing(1),
  },
}));

const CategorySelector = ({ errors, setCategory, defaultValue }) => {
  const classes = useStyles();

  const [categories, setCategories] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    setCategory(categories[value]);
  }, [value]);

  useEffect(() => {
    if (defaultValue && categories) {
      setValue(getIndex(categories, defaultValue));
    }
  }, [defaultValue, categories]);

  const loadCategories = async () => {
    try {
      const { data } = await getCategories();
      setCategories(data);
    } catch (error) {
      console.log("category fetching error", error);
    }
  };

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  const toggleStatus = (path) => {
    if (errors[path]) return { error: true, helperText: errors[path] };

    return { error: false, helperText: "" };
  };

  if (!categories.length) return <div className="">loading...</div>;

  return (
    <TextField
      className={classes.formParts}
      error={toggleStatus("category").error}
      helperText={toggleStatus("category").helperText}
      id="category"
      name="category"
      label="Category"
      onChange={handleInputChange}
      value={value}
      variant="outlined"
      fullWidth
      select
    >
      {categories.map((c, i) => (
        <MenuItem key={c._id} value={i} name={c.name}>
          {c.name}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default CategorySelector;
