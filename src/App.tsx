import React from 'react';
import { IonApp } from '@ionic/react';
import { setupIonicReact } from '@ionic/react';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

// If you have an Ionic variables file, keep this import (adjust path if needed).
// If not, you can remove it.
import './theme/variables.css';

import AppRoutes from './AppRoutes';

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <AppRoutes />
    </IonApp>
  );
};

export default App;
