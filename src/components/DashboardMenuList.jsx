import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { Link, List } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";

const DashboardMenuList = () => {
  return (
    <List>
      {[
        { label: "Dashboard", path: "/admin/dashboard" },
        { label: "Product", path: "/admin/product" },
        { label: "Category", path: "/admin/category" },
        { label: "SubCategory", path: "/admin/sub" },
        { label: "Coupon", path: "/admin/coupon" },
        { label: "Password", path: "/admin/password" },
      ].map(({ label, path }, index) => (
        <Link component={RouterLink} to={path}>
          <ListItem button key={index}>
            <ListItemText primary={label} />
          </ListItem>
        </Link>
      ))}
    </List>
  );
};

export default DashboardMenuList;
