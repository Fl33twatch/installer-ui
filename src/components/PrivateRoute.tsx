import React from "react";
import { Route, Redirect } from "react-router-dom";
import type { RouteProps } from "react-router";
import { isAuthed } from "../lib/api";

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const ok = isAuthed();
  return (
    <Route
      {...rest}
      render={(props) =>
        ok ? <Component {...props} /> : <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
      }
    />
  );
};

export default PrivateRoute;
