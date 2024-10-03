
import React, { useEffect, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import {  NavigationContainer} from '@react-navigation/native';
import DrawerNavigation from './src/DrawerNavigation';
import SplashScreen from 'react-native-splash-screen';
import { AdProvider } from './src/adsContext';
import { Modal } from 'react-native';
import Model from './src/Model';


const App = () => {

  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hide();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);


  // const [versionmodel, setversionmodel]= useState(true);


  
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AdProvider>
        <DrawerNavigation />
        {/* <Model versionmodel={versionmodel} setversionmodel={setversionmodel}/> */}
      </AdProvider>
    
    </GestureHandlerRootView>
  )
}

export default App;





















