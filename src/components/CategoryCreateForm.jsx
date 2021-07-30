import { useState } from "react";
import { Typography, makeStyles } from "@material-ui/core";
import ButtonWithLoader from "../components/shared/ButtonWIthLoader";
import TextInputGenerator from "../components/shared/TextInputGenerator";
import { categorySchema } from "../schemas/categorySchema";

const useStyles = makeStyles({
  createCategoryForm: {
    marginBottom: "1rem",
  },
});

const CategoryCreateForm = ({ doCategoryCreate, loading }) => {
  const classes = useStyles();

  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    e.preventDefault();
    const { value } = e.target;
    const { error } = categorySchema.validate(value);
    setError(error ? error.message : "");
    setCategoryName(value);
  };

  const handleCreateButtonClick = () => {
    const { error } = categorySchema.validate(categoryName);
    setError(error ? error.message : "");
    doCategoryCreate(categoryName);
    setCategoryName("");
  };

  const categoryNameInput = [
    {
      error: !!error && !!error.length,
      helperText: error,
      id: "categoryName",
      label: "Category name",
      onChange: handleInputChange,
      type: "text",
      value: categoryName,
    },
  ];

  return (
    <div className={classes.createCategoryForm}>
      <Typography variant="h6" component="h2">
        Create Category
      </Typography>
      <TextInputGenerator definitions={categoryNameInput} />
      <ButtonWithLoader
        label="Create"
        handleSubmit={handleCreateButtonClick}
        loading={loading}
      />
    </div>
  );
};

export default CategoryCreateForm;
