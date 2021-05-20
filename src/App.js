import { BrowserRouter, Switch, Route } from "react-router-dom";
import SignupPage from "./pages/signup/SignupPage";
import ActivationPage from "./pages/activate/ActivationPage";

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/auth/registration" component={SignupPage} />
      <Route path="/auth/activate/:token" component={ActivationPage} />
    </Switch>
  </BrowserRouter>
);

export default App;
