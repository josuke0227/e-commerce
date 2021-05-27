import { BrowserRouter, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import SignupPage from "./pages/SignupPage";
import ActivationPage from "./pages/ActivationPage";
import SigninPage from "./pages/SigninPage";
import Dashboard from "./pages/Dashboard";
import { theme } from "./styles/theme";
import Layout from "./components/Layout";

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter>
      <Layout>
        <Switch>
          <Route path="/signup" component={SignupPage} />
          <Route path="/signin" component={SigninPage} />
          <Route path="/activate/:token" component={ActivationPage} />
          <Route path="/forgotpassword" component={SignupPage} />
          <Route path="/resetpassword/:token" component={ActivationPage} />
          <Route path="/admin/dashboard" component={Dashboard} />
        </Switch>
      </Layout>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
