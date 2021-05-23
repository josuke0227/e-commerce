import { BrowserRouter, Switch, Route } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import SignupPage from "./pages/signup/SignupPage";
import ActivationPage from "./pages/activate/ActivationPage";
import SigninPage from "./pages/signin/SigninPage";

const theme = createMuiTheme({
  formTitle: {
    marginBottom: "1rem",
  },
  inputForm: {
    width: "100%",
    marginBottom: "1rem",
  },
  formButton: {
    textTransform: "uppercase",
    marginBottom: "1rem",
  },
  formAlert: {
    marginBottom: "1rem",
  },
  formSubtitle: {
    marginBottom: "1rem",
    textAlign: "center",
  },
});

const App = () => (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <Switch>
        <Route path="/signup" component={SignupPage} />
        <Route path="/signin" component={SigninPage} />
        <Route path="/activate/:token" component={ActivationPage} />
      </Switch>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
