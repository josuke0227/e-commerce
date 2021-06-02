import { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingToRedirect from "../LoadingToRedirect";
import { currentAdmin } from "../../services/authServices";

const AdminRoute = ({ children, ...props }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (user && user.token) {
      currentAdmin(user.token)
        .then((res) => {
          console.log("currentAdmin res: >>", res);
          setIsAuthorized(true);
        })
        .catch((err) => {
          console.log(`currentAdmin error`, err);
          return;
        });
    }
  }, [user]);

  return isAuthorized ? <Route {...props} /> : <LoadingToRedirect />;
};

export default AdminRoute;
