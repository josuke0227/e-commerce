import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { List } from "@material-ui/core/";
import Alert from "@material-ui/lab/Alert";
import CategoryListItem from "./CategoryListItem";

const useStyles = makeStyles((theme) => ({
  list: {
    overflowY: "scroll",
    maxHeight: "400px",

    [theme.breakpoints.up("sm")]: {
      minHeight: "400px",
    },
  },
  listPadding: {
    padding: 0,
  },

  listTaller: {
    maxHeight: "100%",
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
  taller,
}) => {
  const classes = useStyles();

  if (!categories.length)
    return <Alert severity="info">No Category registered.</Alert>;

  return (
    <List
      classes={{ padding: classes.listPadding }}
      className={clsx(classes.list, {
        [classes.listTaller]: taller,
      })}
    >
      {categories.map((c, i) => (
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
