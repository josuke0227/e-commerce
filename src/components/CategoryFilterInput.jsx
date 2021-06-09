import { InputAdornment } from "@material-ui/core";
import { SearchOutlined as SearchIcon } from "@material-ui/icons/";
import TextInputGenerator from "./shared/TextInputGenerator";

const CategoryFilterInput = ({ value, onChange, category }) => {
  const toggleInputField = () => {
    if (category) {
      const definition = categoryFilterInput[0];
      definition.label = "New sub category name";
      delete definition.InputProps;
      return categoryFilterInput;
    }
    return categoryFilterInput;
  };

  const categoryFilterInput = [
    {
      id: "categoryQuery",
      onChange: (e) => onChange(e.target.value),
      type: "text",
      value,
      InputLabelProps: {
        shrink: false,
      },
      InputProps: {
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      },
    },
  ];
  return <TextInputGenerator definitions={toggleInputField()} />;
};

export default CategoryFilterInput;
