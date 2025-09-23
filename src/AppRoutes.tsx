import React from "react";
import { IonReactRouter } from "@ionic/react-router";
import { IonRouterOutlet } from "@ionic/react";
import { Switch, Route, Redirect } from "react-router-dom";

import LoginPage from "./pages/LoginPage";                 // adjust path if different
import JobSelectPage from "./pages/JobSelectPage";         // your fixed filename
import InstallType from "./pages/install/InstallType";
import UnitRegistrationFormIonic from "./pages/install/UnitRegistrationFormIonic";
import LookupUnit from "./pages/existing/LookupUnit";
import ExistingInstallActions from "./pages/existing/ExistingInstallActions";
import AddedFeatures from "./pages/existing/AddedFeatures";
import RetestUnit from "./pages/existing/RetestUnit";
import EditUnitDetails from "./pages/existing/EditUnitDetails";

const AppRoutes: React.FC = () => (
  <IonReactRouter>
    <IonRouterOutlet>
      <Switch>
        {/* Login → Select Job → Install Type */}
        <Route path="/login" component={LoginPage} exact />
        <Route path="/jobs" component={JobSelectPage} exact />
        <Route path="/install-type" component={InstallType} exact />

        {/* New install */}
        <Route path="/install/new" component={UnitRegistrationFormIonic} exact />

        {/* Existing install */}
        <Route path="/install/existing/lookup" component={LookupUnit} exact />
        <Route path="/install/existing/actions" component={ExistingInstallActions} exact />
        <Route path="/install/existing/features" component={AddedFeatures} exact />
        <Route path="/install/existing/retest" component={RetestUnit} exact />
        <Route path="/install/existing/edit" component={EditUnitDetails} exact />

        <Redirect from="/" to="/login" />
      </Switch>
    </IonRouterOutlet>
  </IonReactRouter>
);

export default AppRoutes;
