import { useState, useEffect } from "react";

import { pickByParentId } from "../services/subCategoryServices";
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

const SubCategorySelector = ({
  errors,
  setSubCategory,
  parent,
  defaultValue,
  category,
}) => {
  const classes = useStyles();

  const [subCategories, setSubCategories] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!parent) return;
    loadSubCategories(parent._id);
  }, [parent]);

  useEffect(() => {
    if (!category) return;
    loadSubCategories(category._id);
  }, [category]);

  const loadSubCategories = async (id) => {
    try {
      const { data } = await pickByParentId(id);
      setSubCategories(data);
    } catch (error) {
      console.log("category fetching error", error);
    }
  };

  useEffect(() => {
    if (subCategories.length && defaultValue) {
      setValue(getIndex(subCategories, defaultValue));
      setSubCategory(defaultValue);
    }
  }, [subCategories, defaultValue]);

  useEffect(() => {
    setSubCategory(subCategories[value]);
  }, [value]);

  const handleInputChange = (e) => {
    setValue(e.target.value);
  };

  const toggleStatus = (path) => {
    if (errors[path]) return { error: true, helperText: errors[path] };

    return { error: false, helperText: "" };
  };

  if (!subCategories.length) return <div className="">loading...</div>;

  return (
    <TextField
      className={classes.formParts}
      error={toggleStatus("subCategory").error}
      helperText={toggleStatus("subCategory").helperText}
      id="subCategory"
      name="subCategory"
      label="Sub category"
      onChange={handleInputChange}
      value={value}
      variant="outlined"
      fullWidth
      select
    >
      {subCategories.map((c, i) => (
        <MenuItem key={c._id} value={i} name={c.name}>
          {c.name}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default SubCategorySelector;
