

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


// const INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-3940256099942544/1033173712";

// const Drawer = createDrawerNavigator();

// const CustomDrawerContent = (props) => {
//   const { adCount, incrementAdCount } = useContext(AdContext);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [adShown, setAdShown] = useState(false);


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


//   //==================== ads count ===========================//


//   useEffect(() => {
//     if (adCount > 0 && adCount % 3 === 0) {

//       const interstitialAd = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID);
//       setLoading(true)

//       const adLoadListener = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
//         setLoading(false)
//         interstitialAd.show();
//       });

//       const adCloseListener = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
//         // Optionally handle ad closure
//       });

//       // interstitialAd.load();

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


// export default () => (
//   <AdProvider>
//     <DrawerNavigation />
//   </AdProvider>
// );























// import React, { useState, useEffect, useContext } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Linking, ActivityIndicator, Modal } from 'react-native';
// import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
// import { NavigationContainer } from '@react-navigation/native';
// import Calendar from './Calendar';  // Ensure these are correctly exported from their files
// import Holidays from './Holidays';
// import Emcalendar from './Emcalendar';
// import Share from 'react-native-share';
// import { BannerAd, BannerAdSize, InterstitialAd, AdEventType} from 'react-native-google-mobile-ads';
// import { AdContext, AdProvider } from './adsContext';  // Import AdContext and AdProvider
// import axios from 'axios'; // Ensure you have axios installed



// const INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-3940256099942544/1033173712";

// const Drawer = createDrawerNavigator();

// const CustomDrawerContent = (props) => {
//   const { adCount, incrementAdCount, adUnitId } = useContext(AdContext);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [loading, setLoading] = useState(false);




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




//   //==================== ads count ===========================//





//   useEffect(() => {
//     if (adCount > 0 && adCount % 3 === 0) {
//       console.log("check Ads Drawer");

//       const interstitialAd = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID);
//       setLoading(true);

//       const adLoadListener = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
//         setLoading(false);
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



//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setLoading(false);
//     }, 2000); // 2 seconds

//     return () => clearTimeout(timer); // Cleanup the timer when the component unmounts
//   }, []);


//   return (
//     <DrawerContentScrollView {...props}>


// <Modal visible={loading} transparent>
//     <View style={styles.modalContainer}>
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#7B61FF" />
//         <Text style={styles.loaderText}>Ads Loading....</Text>
        
//       </View>
//     </View>
//   </Modal>



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
//     marginBottom: 20,
//     backgroundColor:'white',
//   },
//   loaderText: {
//     fontSize: 16,
//     marginBottom: 10,
//     color: 'black',
//     textAlign: 'center',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     // backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   loaderContainer: {
//     width: 100,
//     height: 120,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     borderRadius: 10,
//   },
// });

// export default DrawerNavigation;

































import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Linking, ActivityIndicator, Modal } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Calendar from './Calendar';  
import Holidays from './Holidays';
import Emcalendar from './Emcalendar';
import Share from 'react-native-share';
import { BannerAd, BannerAdSize, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { AdContext, AdProvider } from './adsContext';  // Context to manage Ad count
import axios from 'axios';



const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const { adCount, incrementAdCount } = useContext(AdContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adUnitId, setAdUnitId] = useState(null);  // State for holding dynamic ad unit ID

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



  // Fetch API data using the fetch method
  // const fetchApiData = async () => {
  //   try {
  //     const response = await fetch('https://atharvainfinity.com/atharvainfinity/ios/calendar/myanmar/myanmar_caladsapi.json');
  //     const data = await response.json();
  //     console.log("data",data);
      
  //     setAdUnitId(data.admob_interstitial_unit_id); // Fetch and set the dynamic ad unit ID
  //   } catch (error) {
  //     console.error('Error fetching API data:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchApiData();  // Fetch the dynamic ad unit ID once on component mount
  // }, []);



  const fetchApiData = async () => {
    try {
      // const response = await axios.get('https://atharvainfinity.com/atharvainfinity/ios/calendar/myanmar/myanmar_caladsapi.json');
      // console.log("data", response);
      axios.get('https://atharvainfinity.com/atharvainfinity/ios/calendar/myanmar/myanmar_caladsapi.json')
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      // setAdUnitId(response.data.admob_interstitial_unit_id); // Fetch and set the dynamic ad unit ID
    } catch (error) {
      console.error('Error fetching API data:', error);
    }
  };
  useEffect(() => {
    fetchApiData();  // Fetch the dynamic ad unit ID once on component mount
  }, []);



  useEffect(() => {
    if (adCount > 0 && adCount % 3 === 0 && adUnitId) {
      console.log("Showing Interstitial Ad with ID: ", adUnitId);
      const interstitialAd = InterstitialAd.createForAdRequest(adUnitId);  // Use dynamic ad unit ID
      setLoading(true);

      const adLoadListener = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        setLoading(false);
        interstitialAd.show();
      });

      const adCloseListener = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        // Optionally handle ad closure
      });

      interstitialAd.load();

      return () => {
        adLoadListener();
        adCloseListener();
      };
    }
  }, [adCount, adUnitId]);








  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); 

    return () => clearTimeout(timer); 
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      <Modal visible={loading} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#7B61FF" />
            <Text style={styles.loaderText}>Ads Loading....</Text>
          </View>
        </View>
      </Modal>

      <View style={styles.drawerHeader}>
        <Image
          source={require('./assets/mayanmarcalendar.png')}
          style={styles.drawerImage}
        />
        <Text style={styles.drawerTitle}>Myanmar Calendar ~ 1500 Years</Text>
      </View>

      <View style={styles.drawerItems}>
        <TouchableOpacity
          style={[
            styles.drawerItemContainer,
            { backgroundColor: selectedItem === 'Calendar' ? '#FFBABA' : 'transparent' }
          ]}
          onPress={() => {
            setSelectedItem('Calendar');
            props.navigation.navigate('Myanmar Calendar');
            incrementAdCount();  // Increment ad count on click
          }}
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
          onPress={() => {
            setSelectedItem('EmCalendar');
            props.navigation.navigate('Emcalendar');
            incrementAdCount();
          }}
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
          onPress={() => {
            setSelectedItem('Holiday');
            props.navigation.navigate('Holidays');
            incrementAdCount();
          }}
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
          onPress={() => {
            setSelectedItem('PrivacyPolicy');
            openURL('https://pratikmathukiyadeveloper.blogspot.com/');
          }}
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
          onPress={() => {
            setSelectedItem('Share');
            shareContent();
            incrementAdCount();
          }}
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
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  drawerTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  drawerImage: {
    marginTop: 50,
    width: 120,
    height: 120,
  },
  drawerItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 20,
    textAlign: 'center',
  },
  drawerItemImage: {
    width: 30,
    height: 30,
  },
  drawerItems: {
    paddingHorizontal: 20,
  },
  adContainer: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7B61FF',
  },
});

export default DrawerNavigation;
