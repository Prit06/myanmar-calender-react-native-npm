
// import React, { useEffect } from 'react'
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// // import {  NavigationContainer} from '@react-navigation/native';
// import DrawerNavigation from './src/DrawerNavigation';
// import SplashScreen from 'react-native-splash-screen';

// const App = () => {

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       SplashScreen.hide();
//     }, 1000);

//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <GestureHandlerRootView style={{flex: 1}}>
    
//       <DrawerNavigation />
    
//     </GestureHandlerRootView>
//   )
// }

// export default App;




import React, { useEffect } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import {  NavigationContainer} from '@react-navigation/native';
import DrawerNavigation from './src/DrawerNavigation';
import SplashScreen from 'react-native-splash-screen';
import { AdProvider } from './src/adsContext';


const App = () => {

  useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hide();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);


  
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <AdProvider>
        <DrawerNavigation />
      </AdProvider>
    
    </GestureHandlerRootView>
  )
}

export default App;





















