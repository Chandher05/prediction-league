import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useLocation
} from "react-router-dom";
import Games from "../Pages/Admin/Games/Games";
import Login from "../Pages/Admin/Login/Login";
import User from "../Pages/Admin/Users/Users";
import Home from "../Pages/User/Home/Home";
import GoogleLogin from "../Pages/User/Login/Login";
import Leaderboard from "../Pages/User/Leaderboard/Leaderboard";
import PastGames from "../Pages/User/PastGames/Games";
import Predict from "../Pages/User/Predict/Predict";
import Predictions from "../Pages/User/Predictions/Predictions";
import Trends from "../Pages/User/Trends/Trends";
import Unsubscribe from "../common/Unsubscribe";
import { auth } from "../Firebase/config";
import { useAuthState } from 'react-firebase-hooks/auth';
import { useStoreActions } from 'easy-peasy';

function Routes() {
  const [authenticated, setAuth] = useState(false);
  const handleAuth = (value) => {
    setAuth(value)
  }

  return (
    <Router >
      <Switch>
        <PrivateRoute authenticated={authenticated} path="/admin/Users">
          <User></User>
        </PrivateRoute>
        <PrivateRoute authenticated={authenticated} path="/admin/Games">
          <Games></Games>
        </PrivateRoute>
        <PrivateGoogleRoute path="/admin">
          <Login handleAuth={handleAuth}></Login>
        </PrivateGoogleRoute>
        {/* User screens */}
        <PrivateGoogleRoute path="/predict/:id">
          <Predict />
        </PrivateGoogleRoute>
        <PrivateGoogleRoute path="/predict/">
          <Predict />
        </PrivateGoogleRoute>
        <PrivateGoogleRoute path="/leaderboard">
          <Leaderboard />
        </PrivateGoogleRoute>
        <PrivateGoogleRoute path="/PastGames">
          <PastGames />
        </PrivateGoogleRoute>
        <PrivateGoogleRoute path="/predictions">
          <Predictions />
        </PrivateGoogleRoute>
        <PrivateGoogleRoute path="/trends">
          <Trends />
        </PrivateGoogleRoute>
        <PrivateGoogleRoute path="/unsubscribe">
          <Unsubscribe />
        </PrivateGoogleRoute>
        <Route path="/login">
          <GoogleLogin />
        </Route>
        <PrivateGoogleRoute path="/">
          <Home />
        </PrivateGoogleRoute>
      </Switch>
    </Router>
  )
}

export default Routes;

function PrivateRoute({ authenticated, children, ...rest }) {

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

function PrivateGoogleRoute({ children, ...rest }) {
  const [user, loading, error] = useAuthState(auth);
  const setAuthId = useStoreActions((actions) => actions.setAuthId);
  const setUserName = useStoreActions((actions) => actions.setUserName);
  const setPhotoURL = useStoreActions((actions) => actions.setPhotoURL);

  console.log(`Autheticated - ${auth}`)
  // console.log(`User - ${user.getIdToken()}`)

  useEffect(() => {

    const idToken = async () => {
      // console.log(await user.getIdToken())
      if (user) {
        await user.getIdToken().then(function (idToken) {  // <------ Check this line
          console.log(idToken); // It shows the Firebase token now
          setAuthId({authId: idToken});
          return idToken;
        });
        setUserName({userName: user.displayName})
        setPhotoURL({photoURL: user.photoURL})
      }
    }
    idToken()
  }, [user, setAuthId])


  if (loading) {
    return 'loading'
  }
  if (error) {
    return 'Something has gone wrong'
  }

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user
          ? (
            children
          )
          : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
      }
    />
  );
}

