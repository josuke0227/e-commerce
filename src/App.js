import { BrowserRouter, Switch, Route } from "react-router-dom";
import SignupPage from "./pages/signup/SignupPage";

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/auth/registration" component={SignupPage} />
    </Switch>
  </BrowserRouter>
);

export default App;
