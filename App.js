
import React, { useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import {  NavigationContainer} from '@react-navigation/native';
import DrawerNavigation from './src/DrawerNavigation';
import SplashScreen from 'react-native-splash-screen';
import { AdProvider } from './src/adsContext';
// import { Modal } from 'react-native';
import axios from 'axios';
import Model from './src/Model';
import DeviceInfo from 'react-native-device-info';

const App = () => {
    const [versionmodel, setversionmodel]= useState(false);
    const [appVersion, setAppversion] = useState("");

  
  useEffect(() => {
    fetchApiData();
    const timer = setTimeout(() => {
      SplashScreen.hide();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  
  const fetchApiData = async () => {
    try {
      const response = await axios.get('https://atharvainfinity.com/atharvainfinity/ios/calendar/myanmar/myanmar_caladsapi.json', {
      });
      setAppversion(response.data?.meta?.ads?.update)
    } catch (error) {
      console.error('Error fetching API data:', error);
    }
  };

  useEffect(() => {
    const fetchAppVersion = async () => {
      const version = await DeviceInfo.getVersion();
      console.log("version", version);
      console.log("apiver" , appVersion);
      if(version < appVersion){
      setversionmodel(true)
      }
    };

    fetchAppVersion();
  }, [appVersion]);


  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AdProvider>
        <DrawerNavigation />
        <Model versionmodel={versionmodel} setversionmodel={setversionmodel}/>
      </AdProvider>
    
    </GestureHandlerRootView>
  )
}

export default App;





















