import { makeStyles } from "@material-ui/core/styles";
import { List } from "@material-ui/core/";
import CategoryListItem from "./CategoryListItem";

const useStyles = makeStyles((theme) => ({
  list: {
    overflowY: "scroll",
    maxHeight: "250px",
  },
  listPadding: {
    padding: 0,
  },
}));

const CategoryListItems = ({
  categories,
  doCategoryUpdate,
  doCategoryDelete,
  listLoading,
  setListLoading,
}) => {
  const classes = useStyles();

  return (
    <List className={classes.list} classes={{ padding: classes.listPadding }}>
      {categories.map((c) => (
        <CategoryListItem
          key={c.slug}
          category={c}
          doCategoryUpdate={doCategoryUpdate}
          doCategoryDelete={doCategoryDelete}
          listLoading={listLoading}
          setListLoading={setListLoading}
        />
      ))}
    </List>
  );
};

export default CategoryListItems;
