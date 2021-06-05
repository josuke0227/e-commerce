import { makeStyles } from "@material-ui/core/styles";
import { List } from "@material-ui/core/";
import Alert from "@material-ui/lab/Alert";
import CategoryListItem from "./CategoryListItem";

const useStyles = makeStyles((theme) => ({
  list: {
    overflowY: "scroll",
    maxHeight: "250px",

    [theme.breakpoints.up("sm")]: {
      maxHeight: "400px",
    },
  },
  listPadding: {
    padding: 0,
  },
}));

// TODO: use contextAPI to make it cleaner.
const CategoryList = ({
  categories,
  doCategoryUpdate,
  doCategoryDelete,
  listLoading,
  setListLoading,
  setShowDialog,
  setSelectedCategory,
  variant,
  handleSelect,
}) => {
  const classes = useStyles();

  if (!categories.length)
    return <Alert severity="info">No Category registered.</Alert>;

  return (
    <List className={classes.list} classes={{ padding: classes.listPadding }}>
      {categories.map((c) => (
        <CategoryListItem
          key={c._id}
          category={c}
          doCategoryUpdate={doCategoryUpdate}
          doCategoryDelete={doCategoryDelete}
          listLoading={listLoading}
          setListLoading={setListLoading}
          setShowDialog={setShowDialog}
          setSelectedCategory={setSelectedCategory}
          variant={variant}
          handleSelect={handleSelect}
        />
      ))}
    </List>
  );
};

export default CategoryList;
