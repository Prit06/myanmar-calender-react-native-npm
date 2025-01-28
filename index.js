/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { AdProvider } from './src/adsContext';
import Splash from './src/Splash';

const Root = () => (
    <AdProvider>
     <Splash />
      {/* <App /> */}
    </AdProvider>
  );

// AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent(appName, () => Root);
