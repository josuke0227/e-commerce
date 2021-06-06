import { makeStyles } from "@material-ui/core/styles";
import { Typography, Paper } from "@material-ui/core";
import CategoryList from "./CategoryList";
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
  listItemLoading,
  listLoading,
  setListItemLoading,
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
        <Paper elevation={3}>
          <CategoryList
            categories={filteredCategories}
            doCategoryUpdate={doCategoryUpdate}
            doCategoryDelete={doCategoryDelete}
            setShowDialog={setShowDialog}
            listItemLoading={listItemLoading}
            setListItemLoading={setListItemLoading}
            setSelectedCategory={setSelectedCategory}
            listLoading={listLoading}
          />
        </Paper>
      </div>
    </section>
  );
};

export default EditCategory;
