import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  ListItem,
  ListItemText,
  Grid,
  IconButton,
} from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";
import CategoryFilterInput from "../components/CategoryFilterInput";
import Layout from "../components/Layout";

const useStyles = makeStyles((theme) => {});

const SubCategoryPage = ({ location }) => {
  const [query, setQuery] = useState("");
  const [listItemClicked, setListItemClicked] = useState(false);
  // const [categoryClicked, listItemClicked] = useState({
  //   slug: null,
  //   isClicked: false,
  // });

  const handleClick = () => {};

  const handleMenuIconClick = () => {
    setListItemClicked(true);
  };

  // const handleMenuIconClick = (slug) => {
  //   listItemClicked({ slug, isClicked: true });
  // };

  const open = false;

  return (
    <Layout location={location}>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <CategoryFilterInput query={query} setQuery={setQuery} />
        </Grid>
        {listItemClicked && (
          <Grid item xs={4}>
            <Button variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        )}
      </Grid>
      <ListItem button onClick={handleClick}>
        <ListItemText primary="Inbox" />
        {/* <IconButton onClick={() => handleMenuIconClick("slug")}> */}
        <IconButton onClick={handleMenuIconClick}>
          <MenuIcon />
        </IconButton>
      </ListItem>
    </Layout>
  );
};

export default SubCategoryPage;
