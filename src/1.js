




// import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar } from 'react-native';
// import React, { useState } from 'react';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { DrawerContentScrollView } from '@react-navigation/drawer';
// import { NavigationContainer } from '@react-navigation/native';
// import Calendar from './Calendar';
// import Holidays from './Holidays';
// import Emcalendar from './Emcalendar';

// const Drawer = createDrawerNavigator();

// const CustomDrawerContent = (props) => {
//   const [selectedItem, setSelectedItem] = useState(null);

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
//           }}
//         >
//           <Image
//             source={require('./assets/calendar.png')}
//             style={[
//               styles.drawerItemImage,
//               { tintColor: selectedItem === 'Calendar' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text
//             style={[
//               styles.drawerItemText,
//               { color: selectedItem === 'Calendar' ? '#FF3030' : 'white' }
//             ]}
//           >
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
//           }}
//         >
//           <Image
//             source={require('./assets/calendar.png')}
//             style={[
//               styles.drawerItemImage,
//               { tintColor: selectedItem === 'EmCalendar' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text
//             style={[
//               styles.drawerItemText,
//               { color: selectedItem === 'EmCalendar' ? '#FF3030' : 'white' }
//             ]}
//           >
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
//           }}
//         >
//           <Image
//             source={require('./assets/sunset.png')}
//             style={[
//               styles.drawerItemImage,
//               { tintColor: selectedItem === 'Holiday' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text
//             style={[
//               styles.drawerItemText,
//               { color: selectedItem === 'Holiday' ? '#FF3030' : 'white' }
//             ]}
//           >
//             Holidays
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
//     </NavigationContainer>
//   );
// };

// export default DrawerNavigation;

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
//   drawerImage: {
//     marginTop: 80,
//     width: 80,
//     height: 80,
//     alignSelf: 'center',
//   },
//   drawerItemImage: {
//     width: 25,
//     height: 25,
//     margin: 10,
//     tintColor: 'white',
//   },
//   drawerItemText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });































// ==== shrebutton,privacypolicy code =========================================================.





// import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Linking } from 'react-native';
// import React, { useState } from 'react';
// import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
// import { NavigationContainer } from '@react-navigation/native';
// import Calendar from './Calendar';
// import Holidays from './Holidays';
// import Emcalendar from './Emcalendar';
// import Share from 'react-native-share'; // Import the Share module

// const Drawer = createDrawerNavigator();

// const CustomDrawerContent = (props) => {
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
//           }}
//         >
//           <Image
//             source={require('./assets/sunset.png')}
//             style={[
//               styles.drawersImage,
//               { tintColor: selectedItem === 'Holiday' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text style={[
//             styles.drawerItemText1,
//             { color: selectedItem === 'Holiday' ? '#FF3030' : 'white' }
//           ]}>
//             Holidays
//           </Text>
//         </TouchableOpacity>

//         {/* New TouchableOpacity for opening a URL */}
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
//               styles.drawersImage,
//               { tintColor: selectedItem === 'PrivacyPolicy' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text style={[
//             styles.drawerItemText1,
//             { color: selectedItem === 'PrivacyPolicy' ? '#FF3030' : 'white' }
//           ]}>
//             Privacy Policy
//           </Text>
//         </TouchableOpacity>

//         {/* New TouchableOpacity for sharing content */}
//         <TouchableOpacity
//           style={[
//             styles.drawerItemContainer,
//             { backgroundColor: selectedItem === 'Share' ? '#FFBABA' : 'transparent' }
//           ]}
//           onPress={() => {
//             setSelectedItem('Share');
//             shareContent();
//           }}
//         >
//           <Image
//             source={require('./assets/share.png')} // Add an appropriate image for sharing
//             style={[
//               styles.drawersImage,
//               { tintColor: selectedItem === 'Share' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text style={[
//             styles.drawerItemText1,
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
//     </NavigationContainer>
//   );
// };

// export default DrawerNavigation;

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
//   drawersImage: {
//     width: 28,
//     height: 28,
//     margin: 10,
//     tintColor: 'white',
//   },
//   drawerImage: {
//     marginTop: 80,
//     width: 80,
//     height: 80,
//     alignSelf: 'center',
//   },
//   drawerItemImage: {
//     width: 25,
//     height: 25,
//     margin: 10,
//     tintColor: 'white',
//   },
//   drawerItemText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   drawerItemText1: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     paddingVertical: 10,
//   },
// });


























// ================================ ads demo code======================================================================



// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Linking } from 'react-native';
// import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
// import { NavigationContainer } from '@react-navigation/native';
// import Calendar from './Calendar';
// import Holidays from './Holidays';
// import Emcalendar from './Emcalendar';
// import Share from 'react-native-share'; // Import the Share module
// import { BannerAd, InterstitialAd, AdEventType, BannerAdSize } from 'react-native-google-mobile-ads';

// const Drawer = createDrawerNavigator();

// const CustomDrawerContent = (props) => {
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
//           }}
//         >
//           <Image
//             source={require('./assets/sunset.png')}
//             style={[
//               styles.drawersImage,
//               { tintColor: selectedItem === 'Holiday' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text style={[
//             styles.drawerItemText1,
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
//               styles.drawersImage,
//               { tintColor: selectedItem === 'PrivacyPolicy' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text style={[
//             styles.drawerItemText1,
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
//           }}
//         >
//           <Image
//             source={require('./assets/share.png')} // Add an appropriate image for sharing
//             style={[
//               styles.drawersImage,
//               { tintColor: selectedItem === 'Share' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text style={[
//             styles.drawerItemText1,
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
//   const [interstitialAd, setInterstitialAd] = useState(null);
//   const [isAdReady, setIsAdReady] = useState(false);

//   useEffect(() => {
//     loadInterstitialAd();
//   }, []);

//   const loadInterstitialAd = () => {
//     const ad = InterstitialAd.createForAdRequest("ca-app-pub-3940256099942544/1033173712");

//     ad.addAdEventListener(AdEventType.LOADED, () => {
//       setIsAdReady(true); // Ad is ready to be shown
//       console.log("Interstitial ad loaded!");
//     });

//     ad.addAdEventListener(AdEventType.CLOSED, () => {
//       setIsAdReady(false); // Reset ad readiness
//       loadInterstitialAd(); // Load a new ad for next display
//       console.log("Interstitial ad closed!");
//     });

//     ad.load();
//     setInterstitialAd(ad);
//   };

//   const showAd = () => {
//     if (isAdReady) {
//       interstitialAd.show();
//     } else {
//       console.log("Ad is not ready to be shown.");
//     }
//   };

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
//           unitId={"ca-app-pub-3940256099942544/6300978111"} // Replace with your actual Ad Unit ID
//           size={BannerAdSize.LARGE_BANNER}
//         />
//         <TouchableOpacity 
//           style={styles.showAdButton} 
//           onPress={showAd}
//         >
//           <Text style={styles.showAdButtonText}>Show Ad</Text>
//         </TouchableOpacity>
//       </View>
//     </NavigationContainer>
//   );
// };

// export default DrawerNavigation;

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
//   drawersImage: {
//     width: 28,
//     height: 28,
//     margin: 10,
//     tintColor: 'white',
//   },
//   drawerImage: {
//     marginTop: 80,
//     width: 80,
//     height: 80,
//     alignSelf: 'center',
//   },
//   drawerItemImage: {
//     width: 25,
//     height: 25,
//     margin: 10,
//     tintColor: 'white',
//   },
//   drawerItemText: {
//     fontSize: 16,
//     color: 'white',
//   },
//   drawerItemText1: {
//     fontSize: 16,
//     color: 'white',
//   },
//   adContainer: {
//     height:150,
//     backgroundColor:'white',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingBottom: 50, // Add some padding to the bottom for spacing
//   },
//   showAdButton: {
//     position: 'absolute',
//     width:'50%',
//     bottom: 10, // Adjust this value as needed
//     backgroundColor: '#FF5454',
//     padding:3,
//     marginTop:30,

//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   showAdButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });



















// ======================bennar ads show code =====================================




  
// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Linking } from 'react-native';
// import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
// import { NavigationContainer } from '@react-navigation/native';
// import Calendar from './Calendar';
// import Holidays from './Holidays';
// import Emcalendar from './Emcalendar';
// import Share from 'react-native-share'; // Import the Share module
// import { BannerAd, AdEventType, BannerAdSize } from 'react-native-google-mobile-ads';

// const Drawer = createDrawerNavigator();

// const CustomDrawerContent = (props) => {
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
//           }}
//         >
//           <Image
//             source={require('./assets/sunset.png')}
//             style={[
//               styles.drawersImage,
//               { tintColor: selectedItem === 'Holiday' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text style={[
//             styles.drawerItemText1,
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
//               styles.drawersImage,
//               { tintColor: selectedItem === 'PrivacyPolicy' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text style={[
//             styles.drawerItemText1,
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
//           }}
//         >
//           <Image
//             source={require('./assets/share.png')} // Add an appropriate image for sharing
//             style={[
//               styles.drawersImage,
//               { tintColor: selectedItem === 'Share' ? '#FF3030' : 'white' }
//             ]}
//           />
//           <Text style={[
//             styles.drawerItemText1,
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

// export default DrawerNavigation;

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
//   drawersImage: {
//     width: 28,
//     height: 28,
//     margin: 10,
//     tintColor: 'white',
//   },
//   drawerImage: {
//     marginTop: 80,
//     width: 80,
//     height: 80,
//     alignSelf: 'center',
//   },
//   drawerItemImage: {
//     width: 25,
//     height: 25,
//     margin: 10,
//     tintColor: 'white',
//   },
//   drawerItemText: {
//     fontSize: 16,
//     color: 'white',
//     marginLeft: 5,
//     fontWeight: 'bold',
//   },
//   drawerItemText1: {
//     fontSize: 16,
//     color: 'white',
//     marginLeft: 5,
//     fontWeight: 'bold',
//   },
//   adContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 10,
//     backgroundColor: 'white',
//   },
// });































































































































































































































