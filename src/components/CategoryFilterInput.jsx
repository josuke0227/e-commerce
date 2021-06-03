import { InputAdornment } from "@material-ui/core";
import { SearchOutlined as SearchIcon } from "@material-ui/icons/";
import TextInputGenerator from "./shared/TextInputGenerator";

const CategoryFilterInput = ({ value, onChange, isCategorySelected }) => {
  const toggleIcon = () => {
    if (isCategorySelected === undefined) return <SearchIcon />;

    return isCategorySelected ? null : <SearchIcon />;
  };

  const categoryFilterInput = [
    {
      id: "categoryQuery",
      onChange: (e) => onChange(e.target.value),
      type: "text",
      value,
      InputProps: {
        startAdornment: (
          <InputAdornment position="start">{toggleIcon()}</InputAdornment>
        ),
      },
    },
  ];
  return <TextInputGenerator definitions={categoryFilterInput} />;
};

export default CategoryFilterInput;
