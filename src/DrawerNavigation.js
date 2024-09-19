

import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Linking, ActivityIndicator, Modal, Platform } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView , useDrawerStatus} from '@react-navigation/drawer';
import { NavigationContainer, } from '@react-navigation/native';
// import UnityAds from 'react-native-unity-ads';
import Calendar from './Calendar';  
import Holidays from './Holidays';
import Emcalendar from './Emcalendar';
import Share from 'react-native-share';
import MyanmarZodiacSigns from './MyanmarZodiacSigns';
// import { InterstitialAd as AppLovinInterstitialAd } from 'react-native-applovin-max';
// import { BannerAd, BannerAdSize, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { InterstitialAd as AdMobInterstitialAd, AdEventType , BannerAd, BannerAdSize, InterstitialAd} from 'react-native-google-mobile-ads';
import { InterstitialAd as AppLovinInterstitialAd } from 'react-native-applovin-max';
import { AdContext, AdProvider } from './adsContext';  // Context to manage Ad count
import axios from 'axios';


const Drawer = createDrawerNavigator();

const platform = Platform.OS;

// console.log("platform === 'ios'" , platform === 'ios');

const CustomDrawerContent = (props) => {
  const isDrawerOpen = useDrawerStatus() === 'open'; 
  const { adCount, incrementAdCount, isBennerAds } = useContext(AdContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [adUnitId, setAdUnitId] = useState(null);  // State for holding dynamic ad unit ID
  // const [apidata, setapidata] = useState(null); 

  const [apidata, setapidata] = useState({ ads: {} });


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
    if (isDrawerOpen) {
      props.setBannShow(false)
      console.log('Drawer opened');
      // Handle drawer open event
    } else {
      console.log('Drawer closed');
      props.setBannShow(true)
      // Handle drawer close event
    }
  }, [isDrawerOpen]);


  // ==========================  InterstitialAd ads  ==============================================//



  const fetchApiData = async () => {
    try {
      const response = await axios.get('https://atharvainfinity.com/atharvainfinity/ios/calendar/myanmar/myanmar_caladsapi.json', {
      }); 
  
      setapidata(response.data?.meta); // Fetch and set the dynamic ad unit ID
    } catch (error) {
      console.error('Error fetching API data:', error);
    }
  };

  useEffect(() => {
    fetchApiData();  // Fetch the dynamic ad unit ID once on component mount
  }, []);

  // useEffect(() => {
  //   if(apidata){
  //     initializeUnityAds();
  //   }
  // }, []);

  // const initializeUnityAds = async () => {
  //   try {
  //     await UnityAds.initialize(apidata.ads.android_adsid.unity_game_id, true);
  //     console.log('Unity Ads Initialized');
  //   } catch (error) {
  //     console.error('Unity Ads Initialization Error:', error);
  //   }
  // };

  
  useEffect(() => {
    if (adCount > 0 && adCount % apidata?.ads.interstitial_ad_interval === 0 && apidata?.ads.ad_status === "1")
    {
      console.log("Showing Interstitial Ad with ID: ", apidata.ads.ad_status);
      const adUnitId = Platform.select({
        android: apidata.ads.android_adsid.admob_interstitial_unit_id, // Use AdMob ID for Android
        // android: "ca-app-pub-3940256099942544/1033173722",
        ios: apidata.ads.ios_adsid.admob_interstitial_unit_id,    // Use AppLovin ID for iOS
      });
      const interstitialAd = InterstitialAd.createForAdRequest(adUnitId);  // Use dynamic ad unit ID
      setLoading(true);

      const adLoadListener = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        setLoading(false);
        interstitialAd.show();
        console.log("ads is Show");
        
      });

      const adErrorListener = interstitialAd.addAdEventListener(AdEventType.ERROR, async (error) => {
        setLoading(false);
        console.log("Failed to Load Interstitial Ad: ", error);
        showUnityInterstitialAd()
        .then(() => {
          setLoading(false);
          console.log("Unity Ad showed");
        })
        .catch(error => {
          setLoading(false);
          console.log("Failed to show Unity Ad: ", error);
        });
      });
  
      const adCloseListener = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        // Optionally handle ad closure
      });

      interstitialAd.load();

      return () => {
        adLoadListener();
        adErrorListener();
        adCloseListener();
      };
    }
  }, [adCount, adUnitId]);

  // const showUnityInterstitialAd = async () => {
  //   try {
  //     if (!UnityAds) {
  //       console.error('UnityAds is not imported correctly');
  //       return;
  //     }
  
  //     if (!UnityAds.isReady) {
  //       console.error('UnityAds.isReady is not available');
  //       return;
  //     }
  
  //     const isAdReady = await UnityAds.isReady(apidata.ads.android_adsid.unity_interstitial_placement_id);
  //     if (isAdReady) {
  //       await UnityAds.show(apidata.ads.android_adsid.unity_interstitial_placement_id);
  //       console.log('Unity Ad shown');
  //     } else {
  //       console.log('Unity Ad is not ready');
  //     }
  //   } catch (error) {
  //     console.error('Failed to show Unity Ad:', error);
  //   }
  // };



  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000); // 4 seacond loader time ...........

    return () => clearTimeout(timer); 
  }, []);

  
  return (
    <DrawerContentScrollView {...props}>
      <Modal visible={loading} transparent>
        <View style={styles.modalContainer}>
          <View style={styles.loaderContainer}>
            <ActivityIndicator  style={{ transform: [{ scale: 1.2}] }} size="large" color="#7B61FF" />
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
            source={require('./assets/cal.png')}
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
            { backgroundColor: selectedItem === 'MyanmarZodiacSigns' ? '#FFBABA' : 'transparent' }
          ]}
          onPress={() => {
            setSelectedItem('MyanmarZodiacSigns');
            props.navigation.navigate('MyanmarZodiacSigns');
            incrementAdCount();
          }}
        >
          <Image
            source={require('./assets/zodiac.png')}
            style={[
              styles.drawerItemImage,
              { tintColor: selectedItem === 'MyanmarZodiacSigns' ? '#FF3030' : 'white' }
            ]}
          />
          <Text style={[
            styles.drawerItemText,
            { color: selectedItem === 'MyanmarZodiacSigns' ? '#FF3030' : 'white' }
          ]}>
            Myanmar Zodiac Signs
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

// ================================  banner ads  ===========================================================//


const DrawerNavigation = () => {
  const [bannerAdUnitId, setBannerAdUnitId] = useState(null);
  const [bannShow, setBannShow] = useState(true); 

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const response = await axios.get('https://atharvainfinity.com/atharvainfinity/ios/calendar/myanmar/myanmar_caladsapi.json');
        if (Platform.OS === 'android') {
          setBannerAdUnitId(response.data?.meta.ads.android_adsid.admob_banner_unit_id);
        } else if (Platform.OS === 'ios') {
          setBannerAdUnitId(response.data?.meta.ads.ios_adsid.admob_banner_unit_id);
        }
      } catch (error) {
        console.error('Error fetching API data:', error);
      }
    };

    fetchApiData();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#FFBABA" />

        <Drawer.Navigator
          drawerContent={(props) => (
            <CustomDrawerContent
              {...props}
              setBannShow={setBannShow}
          />)}
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
          <Drawer.Screen name="Myanmar Calendar" component={Calendar}/>
          <Drawer.Screen name="Emcalendar" component={Emcalendar} />
          <Drawer.Screen name="Holidays" component={Holidays} />
          <Drawer.Screen name="MyanmarZodiacSigns" component={MyanmarZodiacSigns} />
        </Drawer.Navigator>


{ bannShow && bannerAdUnitId ? (
      <View style={styles.adContainer}>
      <Text style={{color:'black',fontSize:20,marginBottom:10}}>Advertisement</Text>
  {bannerAdUnitId ? (
    <BannerAd
      unitId={bannerAdUnitId}
      size={BannerAdSize.LARGE_BANNER}
    />
  ) : (
    <Text>Loading Banner Ad...</Text>
  )}
  </View>

  )
: ""
}

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
    paddingHorizontal: 40,
    marginBottom: 10,
  },
  drawerTitle: {
    marginTop: 40,
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  drawerItems: {
    marginTop: 100,
  },
  drawerItemImage: {
    width: 25,
    height: 25,
    margin: 10,
    tintColor: 'white',
  },
  drawerImage: {
    marginTop: 100,
    width: 100,
    height: 80,
    alignSelf: 'center',
  },
  drawerItemText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  adContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor:'white',
  },
  loaderText: {
    fontSize: 16,
    marginBottom: 10,
    marginTop:10,
    color: 'black',
    textAlign: 'center',
  },

  // modalContainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  // },
  // loaderContainer: {
  //   width: 100,
  //   height: 120,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'white',
  //   borderRadius: 10,
  // },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: darken the background
  },
  loaderContainer: {
    width: 130,    // Set the width to create a square
    height: 130,   // Same as width for the square shape
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 20, // Add some border radius for smooth edges
    padding: 20,     // Add padding for spacing inside the box
  },
});

export default DrawerNavigation;














































