import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import CategoryListItems from "../components/CategoryListItems";
import CategoryFilterInput from "../components/CategoryFilterInput";

const useStyles = makeStyles((theme) => ({
  typographyRoot: {
    marginBottom: "1rem",
  },
  listContainer: {
    backgroundColor: theme.palette.background.paper,
  },
}));

const EditCategory = ({
  query,
  setQuery,
  filteredCategories,
  doCategoryUpdate,
  doCategoryDelete,
  setShowDialog,
  listLoading,
  setListLoading,
  setSelectedCategory,
}) => {
  const classes = useStyles();

  return (
    <section className="">
      <Typography
        classes={{ root: classes.typographyRoot }}
        variant="h6"
        component="h2"
      >
        Categories
      </Typography>
      <CategoryFilterInput value={query} onChange={setQuery} />
      <div className={classes.listContainer}>
        <CategoryListItems
          categories={filteredCategories}
          doCategoryUpdate={doCategoryUpdate}
          doCategoryDelete={doCategoryDelete}
          setShowDialog={setShowDialog}
          listLoading={listLoading}
          setListLoading={setListLoading}
          setSelectedCategory={setSelectedCategory}
        />
      </div>
    </section>
  );
};

export default EditCategory;
