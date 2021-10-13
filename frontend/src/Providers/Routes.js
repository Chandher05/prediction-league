import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link,
  // useRouteMatch,
  // useParams
} from "react-router-dom";
import Games from "../Pages/Admin/Games/Games";
import Login from "../Pages/Admin/Login/Login";
import User from "../Pages/Admin/Users/Users";
import Home from "../Pages/User/Home"
import Leaderboard from "../Pages/User/Leaderboard/Leaderboard";
import PastGames from "../Pages/User/PastGames/Games";
import Predict from "../Pages/User/Predict/Predict";

function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/admin/Users">
          <User></User>
        </Route>
        <Route path="/admin/Games">
          <Games></Games>
        </Route>
        <Route path="/admin">
          <Login></Login>
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
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  )
}

export default Routes;