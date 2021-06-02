import { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingToRedirect from "../LoadingToRedirect";

const AdminRoute = ({ ...props }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [isAuthorized, setIsAuthorized] = useState(false);
  useEffect(() => {
    user && setIsAuthorized(user.role === "admin");
  }, [user]);

  return isAuthorized ? <Route {...props} /> : <LoadingToRedirect />;
};

export default AdminRoute;
