import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { List } from "@material-ui/core";
import CustomLink from "./shared/CustomLink";

const AdminMenuList = () => {
  return (
    <List>
      {[
        { label: "Dashboard", path: "/admin/dashboard" },
        { label: "Register Product", path: "/admin/newproduct" },
        { label: "Edit Product", path: "/admin/products" },
        { label: "Category Management", path: "/admin/categories" },
        { label: "SubCategory", path: "/admin/subcategories" },
        { label: "Coupon", path: "/admin/coupon" },
        { label: "Password", path: "/admin/password" },
      ].map(({ label, path }, index) => (
        <CustomLink key={label} to={path}>
          <ListItem button key={index}>
            <ListItemText primary={label} />
          </ListItem>
        </CustomLink>
      ))}
    </List>
  );
};

export default AdminMenuList;
