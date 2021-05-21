import { BrowserRouter, Switch, Route } from "react-router-dom";
import SignupPage from "./pages/signup/SignupPage";
import ActivationPage from "./pages/activate/ActivationPage";
import SigninPage from "./pages/signin/SigninPage";

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/signup" component={SignupPage} />
      <Route path="/signin" component={SigninPage} />
      <Route path="/activate/:token" component={ActivationPage} />
    </Switch>
  </BrowserRouter>
);

export default App;
