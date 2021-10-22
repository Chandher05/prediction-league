import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Games from "../Pages/Admin/Games/Games";
import Login from "../Pages/Admin/Login/Login";
import User from "../Pages/Admin/Users/Users";
import Home from "../Pages/User/Home/Home"
import Leaderboard from "../Pages/User/Leaderboard/Leaderboard";
import PastGames from "../Pages/User/PastGames/Games";
import Predict from "../Pages/User/Predict/Predict";
import Predictions from "../Pages/User/Predictions/Predictions";

function Routes() {
  const [authenticated, setAuth] = useState(false);
  const handleAuth = (value) => {
    setAuth(value)
  }

  return (
    <Router basename={`${process.env.REACT_APP_PUBLIC_URL}`}>
      <Switch>
        <PrivateRoute authenticated={authenticated} path="/admin/Users">
          <User></User>
        </PrivateRoute>
        <PrivateRoute authenticated={authenticated} path="/admin/Games">
          <Games></Games>
        </PrivateRoute>
        <Route path="/admin">
          <Login handleAuth={handleAuth}></Login>
        </Route>
        {/* User screens */}
        <Route path="/predict">
          <Predict />
        </Route>
        <Route path="/leaderboard">
          <Leaderboard />
        </Route>
        <Route path="/PastGames">
          <PastGames />
        </Route>
        <Route path="/predictions">
          <Predictions />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}

export default Routes;

function PrivateRoute ({ authenticated, children, ...rest }) {

  return (
    <Route
      {...rest}
      render={({ location }) =>
       authenticated
          ? (
            children
          )
          : (
            <Redirect
              to={{
                pathname: "/admin/",
                state: { from: location }
              }}
            />
          )
      }
    />
  );
}
