import { useState } from "react";
import { ListItem, IconButton, List, InputAdornment } from "@material-ui/core";
import { ChevronLeftOutlined, SearchOutlined } from "@material-ui/icons";
import SubCategoryListItem from "../components/SubCategoryListItem";
import TextInputGenerator from "../components/shared/TextInputGenerator";
import { getSearchResult } from "../util/search.util";

const SubCategoryList = ({
  subCategories,
  doSubCategoryUpdate,
  setSubCategory,
  listLoading,
  setShowDialog,
}) => {
  const [query, setQuery] = useState("");

  const subCategoryFilterInput = [
    {
      id: "subCategoryQuery",
      onChange: (e) => setQuery(e.target.value),
      type: "text",
      value: query,
      InputProps: {
        startAdornment: (
          <InputAdornment position="start">
            <SearchOutlined />
          </InputAdornment>
        ),
      },
    },
  ];

  const filteredSubCategory = getSearchResult(subCategories, query);

  return (
    <List>
      <ListItem>
        <IconButton>
          <ChevronLeftOutlined />
        </IconButton>
        <TextInputGenerator definitions={subCategoryFilterInput} />
      </ListItem>
      {filteredSubCategory.map((c) => (
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
  );
};

export default SubCategoryList;
