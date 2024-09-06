// import React, { useState, useEffect, createContext, useContext } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Linking } from 'react-native';
// import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
// import { NavigationContainer } from '@react-navigation/native';
// import Calendar from './Calendar';
// import Holidays from './Holidays';
// import Emcalendar from './Emcalendar';
// import Share from 'react-native-share'; // Import the Share module
// import { BannerAd, BannerAdSize, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

// // Create a context for ad management
// const AdContext = createContext();

// export const AdProvider = ({ children }) => {
//   const [adCount, setAdCount] = useState(0);

//   const incrementAdCount = () => setAdCount(adCount + 1);
//   const resetAdCount = () => setAdCount(0);

//   return (
//     <AdContext.Provider value={{ adCount, incrementAdCount, resetAdCount }}>
//       {children}
//     </AdContext.Provider>
//   );
// };

// export const useAdContext = () => useContext(AdContext);

// const Drawer = createDrawerNavigator();

// const CustomDrawerContent = (props) => {
//   const { adCount, incrementAdCount } = useAdContext(); // Ensure this is correctly accessing the context
//   const [selectedItem, setSelectedItem] = useState(null);

//   const openURL = (url) => {
//     Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
//   };

//   const shareContent = () => {
//     const shareOptions = {
//       title: 'Share this app',
//       message: 'Check out this awesome app!',
//       url: 'https://example.com', // Replace with your app's URL or content you want to share
//     };

//     Share.open(shareOptions).catch((err) => console.error("Couldn't share content", err));
//   };

//   useEffect(() => {
//     if (adCount > 0 && adCount % 3 === 0) {
//       // Display Interstitial Ad if adCount is a multiple of 3
//       const interstitialAd = InterstitialAd.createForAdRequest("ca-app-pub-3940256099942544/1033173712"); // Use your Interstitial Ad Unit ID

//       // Set up the event listeners
//       const adLoadListener = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
//         interstitialAd.show();
//       });

//       const adCloseListener = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
//         // Optionally handle ad closure
//       });

//       // Load the ad
//       interstitialAd.load();

//       // Clean up event listeners on unmount
//       return () => {
//         adLoadListener();
//         adCloseListener();
//       };
//     }
//   }, [adCount]);

//   return (
//     <DrawerContentScrollView {...props}>
//       <View style={styles.drawerHeader}>
//         <Image
//           source={require('./assets/mayanmarcalendar.png')}
//           style={styles.drawerImage}
//         />
//         <Text style={styles.drawerTitle}>Myanmar Calendar ~ 1500 Years</Text>
//       </View>

//       <View style={styles.drawerItems}>
//         <TouchableOpacity
//           style={[
//             styles.drawerItemContainer,
//             { backgroundColor: selectedItem === 'Calendar' ? '#FFBABA' : 'transparent' }
//           ]}
//           onPress={() => {
//             setSelectedItem('Calendar');
//             props.navigation.navigate('Myanmar Calendar');
//             incrementAdCount();
//           }}
//         >
//           <Image
//             source={require('./assets/calendar.png')}
//             style={[
//               styles.drawerItemImage,
//               { tintColor: selectedItem === 'Calendar' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text style={[
//             styles.drawerItemText,
//             { color: selectedItem === 'Calendar' ? '#FF3030' : 'white' }
//           ]}>
//             Calendar
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.drawerItemContainer,
//             { backgroundColor: selectedItem === 'EmCalendar' ? '#FFBABA' : 'transparent' }
//           ]}
//           onPress={() => {
//             setSelectedItem('EmCalendar');
//             props.navigation.navigate('Emcalendar');
//             incrementAdCount();
//           }}
//         >
//           <Image
//             source={require('./assets/calendar.png')}
//             style={[
//               styles.drawerItemImage,
//               { tintColor: selectedItem === 'EmCalendar' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text style={[
//             styles.drawerItemText,
//             { color: selectedItem === 'EmCalendar' ? '#FF3030' : 'white' }
//           ]}>
//             {"Em > Calendar"}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.drawerItemContainer,
//             { backgroundColor: selectedItem === 'Holiday' ? '#FFBABA' : 'transparent' }
//           ]}
//           onPress={() => {
//             setSelectedItem('Holiday');
//             props.navigation.navigate('Holidays');
//             incrementAdCount();
//           }}
//         >
//           <Image
//             source={require('./assets/sunset.png')}
//             style={[
//               styles.drawerItemImage,
//               { tintColor: selectedItem === 'Holiday' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text style={[
//             styles.drawerItemText,
//             { color: selectedItem === 'Holiday' ? '#FF3030' : 'white' }
//           ]}>
//             Holidays
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.drawerItemContainer,
//             { backgroundColor: selectedItem === 'PrivacyPolicy' ? '#FFBABA' : 'transparent' }
//           ]}
//           onPress={() => {
//             setSelectedItem('PrivacyPolicy');
//             openURL('https://pratikmathukiyadeveloper.blogspot.com/');
//           }}
//         >
//           <Image
//             source={require('./assets/privacy_policy.png')}
//             style={[
//               styles.drawerItemImage,
//               { tintColor: selectedItem === 'PrivacyPolicy' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text style={[
//             styles.drawerItemText,
//             { color: selectedItem === 'PrivacyPolicy' ? '#FF3030' : 'white' }
//           ]}>
//             Privacy Policy
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.drawerItemContainer,
//             { backgroundColor: selectedItem === 'Share' ? '#FFBABA' : 'transparent' }
//           ]}
//           onPress={() => {
//             setSelectedItem('Share');
//             shareContent();
//             incrementAdCount();
//           }}
//         >
//           <Image
//             source={require('./assets/share.png')} // Add an appropriate image for sharing
//             style={[
//               styles.drawerItemImage,
//               { tintColor: selectedItem === 'Share' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text style={[
//             styles.drawerItemText,
//             { color: selectedItem === 'Share' ? '#FF3030' : 'white' }
//           ]}>
//             Share
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </DrawerContentScrollView>
//   );
// };

// const DrawerNavigation = () => {
//   return (
//     <NavigationContainer>
//       <StatusBar barStyle="dark-content" backgroundColor="#FFBABA" />
//       <Drawer.Navigator
//         drawerContent={(props) => <CustomDrawerContent {...props} />}
//         screenOptions={{
//           drawerStyle: {
//             backgroundColor: '#FF5454',
//             width: '65%',
//           },
//           headerStyle: {
//             backgroundColor: '#FFBABA',
//           },
//           drawerLabelStyle: {
//             fontSize: 16,
//           },
//           headerTitleStyle: {
//             fontWeight: 'bold',
//           },
//         }}
//       >
//         <Drawer.Screen name="Myanmar Calendar" component={Calendar} />
//         <Drawer.Screen name="Emcalendar" component={Emcalendar} />
//         <Drawer.Screen name="Holidays" component={Holidays} />
//       </Drawer.Navigator>
//       <View style={styles.adContainer}>
//         <BannerAd
//           unitId={"ca-app-pub-3940256099942544/9214589741"} // Use the provided Ad Unit ID
//           size={BannerAdSize.LARGE_BANNER}
//         />
//       </View>
//     </NavigationContainer>
//   );
// };

// const styles = StyleSheet.create({
//   drawerHeader: {
//     alignItems: 'center',
//     backgroundColor: '#FF5454',
//   },
//   drawerItemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 40,
//     marginBottom: 10,
//   },
//   drawerTitle: {
//     marginTop: 40,
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'white',
//     textAlign: 'center',
//   },
//   drawerItems: {
//     marginTop: 100,
//   },
//   drawerItemImage: {
//     width: 25,
//     height: 25,
//     margin: 10,
//     tintColor: 'white',
//   },
//   drawerImage: {
//     marginTop: 80,
//     width: 80,
//     height: 80,
//     alignSelf: 'center',
//   },
//   drawerItemText: {
//     fontSize: 16,
//     color: 'white',
//     marginLeft: 5,
//     fontWeight: 'bold',
//   },
//   adContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 10,
//   },
// });

// export default () => (
//   <AdProvider>
//     <DrawerNavigation />
//   </AdProvider>
// );



































// import React, { useState, useEffect, createContext, useContext } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Linking } from 'react-native';
// import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
// import { NavigationContainer } from '@react-navigation/native';
// import Calendar from './Calendar';
// import Holidays from './Holidays';
// import Emcalendar from './Emcalendar';
// import Share from 'react-native-share';
// import { BannerAd, BannerAdSize, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

// // Create a context for ad management
// const AdContext = createContext();

// export const AdProvider = ({ children }) => {
//   const [adCount, setAdCount] = useState(0);

//   const incrementAdCount = () => setAdCount(adCount + 1);
//   const resetAdCount = () => setAdCount(0);

//   return (
//     <AdContext.Provider value={{ adCount, incrementAdCount, resetAdCount }}>
//       {children}
//     </AdContext.Provider>
//   );
// };

// export const useAdContext = () => useContext(AdContext);

// const Drawer = createDrawerNavigator();

// const CustomDrawerContent = (props) => {
//   const { adCount, incrementAdCount } = useAdContext();
//   const [selectedItem, setSelectedItem] = useState(null);

//   const openURL = (url) => {
//     Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
//   };

//   const shareContent = () => {
//     const shareOptions = {
//       title: 'Share this app',
//       message: 'Check out this awesome app!',
//       url: 'https://example.com',
//     };

//     Share.open(shareOptions).catch((err) => console.error("Couldn't share content", err));
//   };

//   useEffect(() => {
//     if (adCount > 0 && adCount % 3 === 0) {
//       const interstitialAd = InterstitialAd.createForAdRequest("ca-app-pub-3940256099942544/1033173712");

//       const adLoadListener = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
//         interstitialAd.show();
//       });

//       const adCloseListener = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
//         // Optionally handle ad closure
//       });

//       interstitialAd.load();

//       return () => {
//         adLoadListener();
//         adCloseListener();
//       };
//     }
//   }, [adCount]);

//   return (
//     <DrawerContentScrollView {...props}>
//       <View style={styles.drawerHeader}>
//         <Image
//           source={require('./assets/mayanmarcalendar.png')}
//           style={styles.drawerImage}
//         />
//         <Text style={styles.drawerTitle}>Myanmar Calendar ~ 1500 Years</Text>
//       </View>

//       <View style={styles.drawerItems}>
//         <TouchableOpacity
//           style={[
//             styles.drawerItemContainer,
//             { backgroundColor: selectedItem === 'Calendar' ? '#FFBABA' : 'transparent' }
//           ]}
//           onPress={() => {
//             setSelectedItem('Calendar');
//             props.navigation.navigate('Myanmar Calendar');
//             incrementAdCount();
//           }}
//         >
//           <Image
//             source={require('./assets/calendar.png')}
//             style={[
//               styles.drawerItemImage,
//               { tintColor: selectedItem === 'Calendar' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text style={[
//             styles.drawerItemText,
//             { color: selectedItem === 'Calendar' ? '#FF3030' : 'white' }
//           ]}>
//             Calendar
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.drawerItemContainer,
//             { backgroundColor: selectedItem === 'EmCalendar' ? '#FFBABA' : 'transparent' }
//           ]}
//           onPress={() => {
//             setSelectedItem('EmCalendar');
//             props.navigation.navigate('Emcalendar');
//             incrementAdCount();
//           }}
//         >
//           <Image
//             source={require('./assets/calendar.png')}
//             style={[
//               styles.drawerItemImage,
//               { tintColor: selectedItem === 'EmCalendar' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text style={[
//             styles.drawerItemText,
//             { color: selectedItem === 'EmCalendar' ? '#FF3030' : 'white' }
//           ]}>
//             {"Em > Calendar"}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.drawerItemContainer,
//             { backgroundColor: selectedItem === 'Holiday' ? '#FFBABA' : 'transparent' }
//           ]}
//           onPress={() => {
//             setSelectedItem('Holiday');
//             props.navigation.navigate('Holidays');
//             incrementAdCount();
//           }}
//         >
//           <Image
//             source={require('./assets/sunset.png')}
//             style={[
//               styles.drawerItemImage,
//               { tintColor: selectedItem === 'Holiday' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text style={[
//             styles.drawerItemText,
//             { color: selectedItem === 'Holiday' ? '#FF3030' : 'white' }
//           ]}>
//             Holidays
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.drawerItemContainer,
//             { backgroundColor: selectedItem === 'PrivacyPolicy' ? '#FFBABA' : 'transparent' }
//           ]}
//           onPress={() => {
//             setSelectedItem('PrivacyPolicy');
//             openURL('https://pratikmathukiyadeveloper.blogspot.com/');
//           }}
//         >
//           <Image
//             source={require('./assets/privacy_policy.png')}
//             style={[
//               styles.drawerItemImage,
//               { tintColor: selectedItem === 'PrivacyPolicy' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text style={[
//             styles.drawerItemText,
//             { color: selectedItem === 'PrivacyPolicy' ? '#FF3030' : 'white' }
//           ]}>
//             Privacy Policy
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.drawerItemContainer,
//             { backgroundColor: selectedItem === 'Share' ? '#FFBABA' : 'transparent' }
//           ]}
//           onPress={() => {
//             setSelectedItem('Share');
//             shareContent();
//             incrementAdCount();
//           }}
//         >
//           <Image
//             source={require('./assets/share.png')}
//             style={[
//               styles.drawerItemImage,
//               { tintColor: selectedItem === 'Share' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text style={[
//             styles.drawerItemText,
//             { color: selectedItem === 'Share' ? '#FF3030' : 'white' }
//           ]}>
//             Share
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </DrawerContentScrollView>
//   );
// };

// const DrawerNavigation = () => {
//   return (
//     <NavigationContainer>
//       <StatusBar barStyle="dark-content" backgroundColor="#FFBABA" />
//       <Drawer.Navigator
//         drawerContent={(props) => <CustomDrawerContent {...props} />}
//         screenOptions={{
//           drawerStyle: {
//             backgroundColor: '#FF5454',
//             width: '65%',
//           },
//           headerStyle: {
//             backgroundColor: '#FFBABA',
//           },
//           drawerLabelStyle: {
//             fontSize: 16,
//           },
//           headerTitleStyle: {
//             fontWeight: 'bold',
//           },
//         }}
//       >
//         <Drawer.Screen name="Myanmar Calendar" component={Calendar} />
//         <Drawer.Screen name="Emcalendar" component={Emcalendar} />
//         <Drawer.Screen name="Holidays" component={Holidays} />
//       </Drawer.Navigator>
//       <View style={styles.adContainer}>
//         <BannerAd
//           unitId={"ca-app-pub-3940256099942544/9214589741"}
//           size={BannerAdSize.LARGE_BANNER}
//         />
//       </View>
//     </NavigationContainer>
//   );
// };

// const styles = StyleSheet.create({
//   drawerHeader: {
//     alignItems: 'center',
//     backgroundColor: '#FF5454',
//   },
//   drawerItemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 40,
//     marginBottom: 10,
//   },
//   drawerTitle: {
//     marginTop: 40,
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'white',
//     textAlign: 'center',
//   },
//   drawerItems: {
//     marginTop: 100,
//   },
//   drawerItemImage: {
//     width: 25,
//     height: 25,
//     margin: 10,
//     tintColor: 'white',
//   },
//   drawerImage: {
//     marginTop: 80,
//     width: 80,
//     height: 80,
//     alignSelf: 'center',
//   },
//   drawerItemText: {
//     fontSize: 16,
//     color: 'white',
//     marginLeft: 5,
//     fontWeight: 'bold',
//   },
//   adContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 10,
//     backgroundColor:'white'
//   },
// });

// export default () => (
//   <AdProvider>
//     <DrawerNavigation />
//   </AdProvider>
// );


































// import React, { useState, useEffect, useContext } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Linking } from 'react-native';
// import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
// import { NavigationContainer } from '@react-navigation/native';
// import Calendar from './Calendar';  // Ensure these are correctly exported from their files
// import Holidays from './Holidays';
// import Emcalendar from './Emcalendar';
// import Share from 'react-native-share';
// import { BannerAd, BannerAdSize, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
// import { AdContext, AdProvider } from './adsContext';  // Import AdContext and AdProvider

// const Drawer = createDrawerNavigator();

// const CustomDrawerContent = (props) => {
//   const { adCount, incrementAdCount } = useContext(AdContext);
//   const [selectedItem, setSelectedItem] = useState(null);

//   const openURL = (url) => {
//     Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
//   };

//   const shareContent = () => {
//     const shareOptions = {
//       title: 'Share this app',
//       message: 'Check out this awesome app!',
//       url: 'https://example.com',
//     };

//     Share.open(shareOptions).catch((err) => console.error("Couldn't share content", err));
//   };

//   useEffect(() => {
//     if (adCount > 0 && adCount % 3 === 0) {
//       const interstitialAd = InterstitialAd.createForAdRequest("ca-app-pub-3940256099942544/1033173712");

//       const adLoadListener = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
//         interstitialAd.show();
//       });

//       const adCloseListener = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
//         // Optionally handle ad closure
//       });

//       interstitialAd.load();

//       return () => {
//         adLoadListener();
//         adCloseListener();
//       };
//     }
//   }, [adCount]);

//   return (
//     <DrawerContentScrollView {...props}>
//       <View style={styles.drawerHeader}>
//         <Image
//           source={require('./assets/mayanmarcalendar.png')}
//           style={styles.drawerImage}
//         />
//         <Text style={styles.drawerTitle}>Myanmar Calendar ~ 1500 Years</Text>
//       </View>

//       <View style={styles.drawerItems}>
//         <TouchableOpacity
//           style={[
//             styles.drawerItemContainer,
//             { backgroundColor: selectedItem === 'Calendar' ? '#FFBABA' : 'transparent' }
//           ]}
//           onPress={() => {
//             setSelectedItem('Calendar');
//             props.navigation.navigate('Myanmar Calendar');
//             incrementAdCount();
//           }}
//         >
//           <Image
//             source={require('./assets/calendar.png')}
//             style={[
//               styles.drawerItemImage,
//               { tintColor: selectedItem === 'Calendar' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text style={[
//             styles.drawerItemText,
//             { color: selectedItem === 'Calendar' ? '#FF3030' : 'white' }
//           ]}>
//             Calendar
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.drawerItemContainer,
//             { backgroundColor: selectedItem === 'EmCalendar' ? '#FFBABA' : 'transparent' }
//           ]}
//           onPress={() => {
//             setSelectedItem('EmCalendar');
//             props.navigation.navigate('Emcalendar');
//             incrementAdCount();
//           }}
//         >
//           <Image
//             source={require('./assets/calendar.png')}
//             style={[
//               styles.drawerItemImage,
//               { tintColor: selectedItem === 'EmCalendar' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text style={[
//             styles.drawerItemText,
//             { color: selectedItem === 'EmCalendar' ? '#FF3030' : 'white' }
//           ]}>
//             {"Em > Calendar"}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.drawerItemContainer,
//             { backgroundColor: selectedItem === 'Holiday' ? '#FFBABA' : 'transparent' }
//           ]}
//           onPress={() => {
//             setSelectedItem('Holiday');
//             props.navigation.navigate('Holidays');
//             incrementAdCount();
//           }}
//         >
//           <Image
//             source={require('./assets/sunset.png')}
//             style={[
//               styles.drawerItemImage,
//               { tintColor: selectedItem === 'Holiday' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text style={[
//             styles.drawerItemText,
//             { color: selectedItem === 'Holiday' ? '#FF3030' : 'white' }
//           ]}>
//             Holidays
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.drawerItemContainer,
//             { backgroundColor: selectedItem === 'PrivacyPolicy' ? '#FFBABA' : 'transparent' }
//           ]}
//           onPress={() => {
//             setSelectedItem('PrivacyPolicy');
//             openURL('https://pratikmathukiyadeveloper.blogspot.com/');
//           }}
//         >
//           <Image
//             source={require('./assets/privacy_policy.png')}
//             style={[
//               styles.drawerItemImage,
//               { tintColor: selectedItem === 'PrivacyPolicy' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text style={[
//             styles.drawerItemText,
//             { color: selectedItem === 'PrivacyPolicy' ? '#FF3030' : 'white' }
//           ]}>
//             Privacy Policy
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.drawerItemContainer,
//             { backgroundColor: selectedItem === 'Share' ? '#FFBABA' : 'transparent' }
//           ]}
//           onPress={() => {
//             setSelectedItem('Share');
//             shareContent();
//             incrementAdCount();
//           }}
//         >
//           <Image
//             source={require('./assets/share.png')}
//             style={[
//               styles.drawerItemImage,
//               { tintColor: selectedItem === 'Share' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text style={[
//             styles.drawerItemText,
//             { color: selectedItem === 'Share' ? '#FF3030' : 'white' }
//           ]}>
//             Share
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </DrawerContentScrollView>
//   );
// };

// const DrawerNavigation = () => {
//   return (
//     <NavigationContainer>
//       <StatusBar barStyle="dark-content" backgroundColor="#FFBABA" />
//       <Drawer.Navigator
//         drawerContent={(props) => <CustomDrawerContent {...props} />}
//         screenOptions={{
//           drawerStyle: {
//             backgroundColor: '#FF5454',
//             width: '65%',
//           },
//           headerStyle: {
//             backgroundColor: '#FFBABA',
//           },
//           drawerLabelStyle: {
//             fontSize: 16,
//           },
//           headerTitleStyle: {
//             fontWeight: 'bold',
//           },
//         }}
//       >
//         <Drawer.Screen name="Myanmar Calendar" component={Calendar} />
//         <Drawer.Screen name="Emcalendar" component={Emcalendar} />
//         <Drawer.Screen name="Holidays" component={Holidays} />
//       </Drawer.Navigator>
//       <View style={styles.adContainer}>
//         <BannerAd
//           unitId={"ca-app-pub-3940256099942544/9214589741"}
//           size={BannerAdSize.LARGE_BANNER}
//         />
//       </View>
//     </NavigationContainer>
//   );
// };

// const styles = StyleSheet.create({
//   drawerHeader: {
//     alignItems: 'center',
//     backgroundColor: '#FF5454',
//   },
//   drawerItemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 10,
//     paddingHorizontal: 40,
//     marginBottom: 10,
//   },
//   drawerTitle: {
//     marginTop: 40,
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'white',
//     textAlign: 'center',
//   },
//   drawerItems: {
//     marginTop: 100,
//   },
//   drawerItemImage: {
//     width: 25,
//     height: 25,
//     margin: 10,
//     tintColor: 'white',
//   },
//   drawerImage: {
//     marginTop: 80,
//     width: 80,
//     height: 80,
//     alignSelf: 'center',
//   },
//   drawerItemText: {
//     fontSize: 16,
//     color: 'white',
//     marginLeft: 5,
//     fontWeight: 'bold',
//   },
//   adContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 10,
//     backgroundColor: 'white'
//   },
// });

// export default () => (
//   <AdProvider>
//     <DrawerNavigation />
//   </AdProvider>
// );
























import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Linking, ActivityIndicator, Dimensions } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Calendar from './Calendar';
import Holidays from './Holidays';
import Emcalendar from './Emcalendar';
import Share from 'react-native-share';
import { BannerAd, BannerAdSize, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { AdContext, AdProvider } from './adsContext';




const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
const Drawer = createDrawerNavigator();

const Loader = ({ isVisible }) => {
  return isVisible ? (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : null;
};


const CustomDrawerContent = (props) => {
  const { adCount, incrementAdCount } = useContext(AdContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoadingAd, setIsLoadingAd] = useState(false);
  const [clickCounts, setClickCounts] = useState({
    Calendar: 0,
    EmCalendar: 0,
    Holiday: 0,
  });

  const openURL = (url) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  const shareContent = () => {
    const shareOptions = {
      title: 'Share this app',
      message: 'Check out this awesome app!',
      url: 'https://example.com',
    };
    Share.open(shareOptions).catch((err) => console.error("Couldn't share content", err));
  };

  useEffect(() => {
    if (isLoadingAd) {
      const timeout = setTimeout(() => {
        const interstitialAd = InterstitialAd.createForAdRequest("ca-app-pub-3940256099942544/1033173712");

        const adLoadListener = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
          interstitialAd.show();
          setIsLoadingAd(false); // Hide the loader after showing the ad
        });

        const adErrorListener = interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
          console.error("Ad failed to load", error);
          setIsLoadingAd(false); // Hide the loader if the ad fails to load
        });

        const adCloseListener = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
          // Optionally handle ad closure
          setIsLoadingAd(false);
        });

        interstitialAd.load();

        return () => {
          adLoadListener();
          adErrorListener();
          adCloseListener();
        };
      }, 3000); // 3-second loader before showing the ad

      return () => clearTimeout(timeout);
    }
  }, [isLoadingAd]);

  const handlePress = (item) => {
    setClickCounts(prevCounts => {
      const newCount = prevCounts[item] + 1;
      if (newCount === 3 && (item === 'Calendar' || item === 'EmCalendar' || item === 'Holiday')) {
        // Show loader for 3 seconds and then show the ad
        setIsLoadingAd(true);
        setSelectedItem(item);
        incrementAdCount();
      } else {
        setSelectedItem(item);
        incrementAdCount();
        switch (item) {
          case 'Calendar':
            props.navigation.navigate('Myanmar Calendar');
            break;
          case 'EmCalendar':
            props.navigation.navigate('Emcalendar');
            break;
          case 'Holiday':
            props.navigation.navigate('Holidays');
            break;
          case 'PrivacyPolicy':
            openURL('https://pratikmathukiyadeveloper.blogspot.com/');
            break;
          case 'Share':
            shareContent();
            break;
        }
      }
      return { ...prevCounts, [item]: newCount };
    });
  };

  return (
    <>
      <Loader isVisible={isLoadingAd} />
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeader}>
          <Image source={require('./assets/mayanmarcalendar.png')} style={styles.drawerImage} />
          <Text style={styles.drawerTitle}>Myanmar Calendar ~ 1500 Years</Text>
        </View>

        <View style={styles.drawerItems}>
          <TouchableOpacity
            style={[
              styles.drawerItemContainer,
              { backgroundColor: selectedItem === 'Calendar' ? '#FFBABA' : 'transparent' }
            ]}
            onPress={() => handlePress('Calendar')}
          >
            <Image
              source={require('./assets/calendar.png')}
              style={[
                styles.drawerItemImage,
                { tintColor: selectedItem === 'Calendar' ? '#FF3030' : 'white' }
              ]}
            />
            <Text style={[
              styles.drawerItemText,
              { color: selectedItem === 'Calendar' ? '#FF3030' : 'white' }
            ]}>
              Calendar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.drawerItemContainer,
              { backgroundColor: selectedItem === 'EmCalendar' ? '#FFBABA' : 'transparent' }
            ]}
            onPress={() => handlePress('EmCalendar')}
          >
            <Image
              source={require('./assets/calendar.png')}
              style={[
                styles.drawerItemImage,
                { tintColor: selectedItem === 'EmCalendar' ? '#FF3030' : 'white' }
              ]}
            />
            <Text style={[
              styles.drawerItemText,
              { color: selectedItem === 'EmCalendar' ? '#FF3030' : 'white' }
            ]}>
              {"Em > Calendar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.drawerItemContainer,
              { backgroundColor: selectedItem === 'Holiday' ? '#FFBABA' : 'transparent' }
            ]}
            onPress={() => handlePress('Holiday')}
          >
            <Image
              source={require('./assets/sunset.png')}
              style={[
                styles.drawerItemImage,
                { tintColor: selectedItem === 'Holiday' ? '#FF3030' : 'white' }
              ]}
            />
            <Text style={[
              styles.drawerItemText,
              { color: selectedItem === 'Holiday' ? '#FF3030' : 'white' }
            ]}>
              Holidays
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.drawerItemContainer,
              { backgroundColor: selectedItem === 'PrivacyPolicy' ? '#FFBABA' : 'transparent' }
            ]}
            onPress={() => handlePress('PrivacyPolicy')}
          >
            <Image
              source={require('./assets/privacy_policy.png')}
              style={[
                styles.drawerItemImage,
                { tintColor: selectedItem === 'PrivacyPolicy' ? '#FF3030' : 'white' }
              ]}
            />
            <Text style={[
              styles.drawerItemText,
              { color: selectedItem === 'PrivacyPolicy' ? '#FF3030' : 'white' }
            ]}>
              Privacy Policy
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.drawerItemContainer,
              { backgroundColor: selectedItem === 'Share' ? '#FFBABA' : 'transparent' }
            ]}
            onPress={() => handlePress('Share')}
          >
            <Image
              source={require('./assets/share.png')}
              style={[
                styles.drawerItemImage,
                { tintColor: selectedItem === 'Share' ? '#FF3030' : 'white' }
              ]}
            />
            <Text style={[
              styles.drawerItemText,
              { color: selectedItem === 'Share' ? '#FF3030' : 'white' }
            ]}>
              Share
            </Text>
          </TouchableOpacity>
        </View>
      </DrawerContentScrollView>
    </>
  );
};

const DrawerNavigation = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#FFBABA" />
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#FF5454',
            width: '65%',
          },
          headerStyle: {
            backgroundColor: '#FFBABA',
          },
          drawerLabelStyle: {
            fontSize: 16,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Drawer.Screen name="Myanmar Calendar" component={Calendar} />
        <Drawer.Screen name="Emcalendar" component={Emcalendar} />
        <Drawer.Screen name="Holidays" component={Holidays} />
      </Drawer.Navigator>
      <View style={styles.adContainer}>
        <BannerAd
          unitId={"ca-app-pub-3940256099942544/9214589741"}
          size={BannerAdSize.LARGE_BANNER}
        />
      </View>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    alignItems: 'center',
    backgroundColor: '#FF5454',
  },
  drawerItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  drawerItemImage: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  drawerItemText: {
    fontSize: 16,
    fontWeight: '600',
  },
  drawerItems: {
    marginTop: 20,
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1000,
  },
  adContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const App = () => {
  return (
    <AdProvider>
      <DrawerNavigation />
    </AdProvider>
  );
};

export default App;
