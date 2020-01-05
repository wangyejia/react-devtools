import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Home } from "Components";

export const App = () => {
  return (
    <Router>
      <Route path="/" exact render={() => <Redirect to="/home" />} />
      <Route path="/home" component={Home}></Route>
    </Router>
  );
};
