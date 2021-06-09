import { useState } from "react";
import {
  ListItem,
  List,
  InputAdornment,
  makeStyles,
  LinearProgress,
} from "@material-ui/core";
import { SearchOutlined as SearchIcon } from "@material-ui/icons";
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
  listItemLoading,
  setShowDialog,
  handleBack,
  loading,
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
            <SearchIcon />
          </InputAdornment>
        ),
      },
    },
  ];

  if (!loading && !subCategories.length)
    return (
      <Alert severity="info" className={classes.alert}>
        <p>
          No Sub Category registered. <br />
          Tap <strong onClick={handleBack}>here</strong> to choose another
          category or create a new one.
        </p>
      </Alert>
    );

  const filteredSubCategory = getSearchResult(subCategories, query);

  return (
    <List className={classes.list}>
      {loading ? (
        <LinearProgress />
      ) : (
        <>
          <ListItem className={classes.searchBar}>
            <TextInputGenerator definitions={subCategoryFilterInput} />
          </ListItem>

          {filteredSubCategory.map((c) => (
            <SubCategoryListItem
              key={c._id}
              subCategory={c}
              doSubCategoryUpdate={doSubCategoryUpdate}
              setSubCategory={setSubCategory}
              listItemLoading={listItemLoading}
              setShowDialog={setShowDialog}
            />
          ))}
        </>
      )}
    </List>
  );
};

export default SubCategoryList;
