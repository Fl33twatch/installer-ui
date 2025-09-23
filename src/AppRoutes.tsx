// ==============================================================
// src/AppRoutes.tsx  (React Router v5 + Ionic)
// ==============================================================

import React from "react";
import { IonReactRouter } from "@ionic/react-router";
import { IonRouterOutlet } from "@ionic/react";
import { Switch, Route, Redirect } from "react-router-dom";

// ---- Pages (adjust paths only if your files live elsewhere) ----
import LoginPage from "./pages/LoginPage";
import JobSelectPage from "./pages/JobSelectPage";

import InstallType from "./pages/install/InstallType";
import UnitRegistrationFormIonic from "./pages/install/UnitRegistrationFormIonic";

import LookupUnit from "./pages/existing/LookupUnit";
import ExistingInstallActions from "./pages/existing/ExistingInstallActions";
import AddedFeatures from "./pages/existing/AddedFeatures";
import RetestUnit from "./pages/existing/RetestUnit";
import EditUnitDetails from "./pages/existing/EditUnitDetails";

const AppRoutes: React.FC = () => {
  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Switch>
          {/* Auth / Landing */}
          <Route path="/login" component={LoginPage} exact />

          {/* Job selection */}
          <Route path="/jobs" component={JobSelectPage} exact />

          {/* Choose install type (new vs existing) */}
          <Route path="/install-type" component={InstallType} exact />

          {/* New install flow */}
          <Route path="/install/new" component={UnitRegistrationFormIonic} exact />

          {/* Existing install flow */}
          <Route path="/install/existing/lookup" component={LookupUnit} exact />
          <Route path="/install/existing/actions" component={ExistingInstallActions} exact />
          <Route path="/install/existing/features" component={AddedFeatures} exact />
          <Route path="/install/existing/retest" component={RetestUnit} exact />
          <Route path="/install/existing/edit" component={EditUnitDetails} exact />

          {/* Default → login */}
          <Redirect exact from="/" to="/login" />

          {/* Fallback: anything else → login */}
          <Route render={() => <Redirect to="/login" />} />
        </Switch>
      </IonRouterOutlet>
    </IonReactRouter>
  );
};

export default AppRoutes;
