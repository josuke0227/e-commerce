import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Link, List } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

const AdminMenuList = () => {
  return (
    <List>
      {[
        { label: "Dashboard", path: "/admin/dashboard" },
        { label: "Product", path: "/admin/product" },
        { label: "Category Management", path: "/admin/categories" },
        { label: "SubCategory", path: "/admin/sub" },
        { label: "Coupon", path: "/admin/coupon" },
        { label: "Password", path: "/admin/password" },
      ].map(({ label, path }, index) => (
        <Link key={label} component={RouterLink} to={path}>
          <ListItem button key={index}>
            <ListItemText primary={label} />
          </ListItem>
        </Link>
      ))}
    </List>
  );
};

export default AdminMenuList;
