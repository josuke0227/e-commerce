import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { List, LinearProgress } from "@material-ui/core/";
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
  alert: {
    margin: "0.5rem",
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
  listItemLoading,
  setListItemLoading,
  setShowDialog,
  setSelectedCategory,
  variant,
  handleSelect,
  taller,
  listLoading,
}) => {
  const classes = useStyles();

  if (!listLoading && !categories.length)
    return (
      <Alert className={classes.alert} severity="info">
        No Category registered.
      </Alert>
    );

  return (
    <List
      classes={{ padding: classes.listPadding }}
      className={clsx(classes.list, {
        [classes.listTaller]: taller,
      })}
    >
      {listLoading ? (
        <LinearProgress />
      ) : (
        categories.map((c) => (
          <CategoryListItem
            key={c._id}
            category={c}
            doCategoryUpdate={doCategoryUpdate}
            doCategoryDelete={doCategoryDelete}
            listItemLoading={listItemLoading}
            setListItemLoading={setListItemLoading}
            setShowDialog={setShowDialog}
            setSelectedCategory={setSelectedCategory}
            variant={variant}
            handleSelect={handleSelect}
          />
        ))
      )}
    </List>
  );
};

export default CategoryList;
