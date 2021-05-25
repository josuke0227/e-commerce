import { BrowserRouter, Switch, Route } from "react-router-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import SignupPage from "./pages/SignupPage";
import ActivationPage from "./pages/ActivationPage";
import SigninPage from "./pages/SigninPage";
import Header from "./components/Header";
import { CssBaseline } from "@material-ui/core";

const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      "@global": {
        body: {
          margin: 0,
        },
      },
    },
  },
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
  headerItem: {
    marginRight: "0.3rem",
  },
  menuText: {
    margin: 0,
  },
});

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Header />
    <BrowserRouter>
      <Switch>
        <Route path="/signup" component={SignupPage} />
        <Route path="/signin" component={SigninPage} />
        <Route path="/activate/:token" component={ActivationPage} />
        <Route path="/forgotpassword/" component={SignupPage} />
        <Route path="/resetpassword/:token" component={ActivationPage} />
      </Switch>
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
