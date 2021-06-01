import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminRoute = ({ path, component: Component }) => {
  const { user } = useSelector((state) => ({ ...state }));

  const authorizedPath = <Route path={path} component={Component} />;

  const unauthorizedPath = <Redirect to="/" />;

  if (user && user.role === "admin") {
    return authorizedPath;
  }
  return unauthorizedPath;
};

export default AdminRoute;
