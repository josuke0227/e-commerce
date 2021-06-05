import { useState } from "react";
import {
  ListItem,
  IconButton,
  List,
  InputAdornment,
  makeStyles,
} from "@material-ui/core";
import { ChevronLeftOutlined, SearchOutlined } from "@material-ui/icons";
import SubCategoryListItem from "../components/SubCategoryListItem";
import TextInputGenerator from "../components/shared/TextInputGenerator";
import { getSearchResult } from "../util/search.util";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  list: {
    // minHeight: "400px",
    // [theme.breakpoints.up("sm")]: {
    //   minHeight: "400px",
    // },
  },
}));

const SubCategoryList = ({
  subCategories,
  doSubCategoryUpdate,
  setSubCategory,
  listLoading,
  setShowDialog,
  handleBack,
}) => {
  const [query, setQuery] = useState("");

  const classes = useStyles();

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

  if (!subCategories.length)
    return (
      <Alert severity="info">
        <p>
          No Sub Categories registered. <br />
          Tap <strong onClick={handleBack}>here</strong> to chooseanother
          category or create new one.
        </p>
      </Alert>
    );

  const filteredSubCategory = getSearchResult(subCategories, query);

  return (
    <List className={classes.list}>
      <ListItem>
        <IconButton onClick={handleBack}>
          <ChevronLeftOutlined />
        </IconButton>
        <TextInputGenerator definitions={subCategoryFilterInput} />
      </ListItem>
      {filteredSubCategory.map((c, i) => (
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
