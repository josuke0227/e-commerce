import { InputAdornment } from "@material-ui/core";
import { SearchOutlined as SearchIcon } from "@material-ui/icons/";
import TextInputGenerator from "./shared/TextInputGenerator";

const CategoryFilterInput = ({ query, setQuery }) => {
  const categoryFilterInput = [
    {
      id: "categoryQuery",
      onChange: (e) => setQuery(e.target.value),
      type: "text",
      value: query,
      InputProps: {
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      },
    },
  ];
  return <TextInputGenerator definitions={categoryFilterInput} />;
};

export default CategoryFilterInput;
