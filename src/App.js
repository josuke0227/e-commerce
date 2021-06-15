import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import SignupPage from "./pages/SignupPage";
import ActivationPage from "./pages/ActivationPage";
import SigninPage from "./pages/SigninPage";
import Dashboard from "./pages/Dashboard";
import { theme } from "./styles/theme";
import CategoryPage from "./pages/CategoryPage";
import SubCategoryPage from "./pages/SubCategoryPage";
import AdminRoute from "./components/shared/AdminRoute";
import HomePage from "./pages/HomePage";

import Playground from "./Playground";
import CreateProductPage from "./pages/CreateProductPage";
import ProductPage from "./pages/ProductPage";

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/signup" component={SignupPage} />
        <Route exact path="/signin" component={SigninPage} />
        <Route exact path="/activate/:token" component={ActivationPage} />
        <Route exact path="/forgotpassword" component={SignupPage} />
        <Route exact path="/resetpassword/:token" component={ActivationPage} />
        <Route exact path="/admin/dashboard" component={Dashboard} />
        <Route exact path="/admin/categories" component={CategoryPage} />
        <Route exact path="/admin/subcategories" component={SubCategoryPage} />
        <Route exact path="/admin/newproduct" component={CreateProductPage} />
        <Route exact path="/admin/products" component={ProductPage} />
        <Route exact path="/playground" component={Playground} />
      </Switch>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
