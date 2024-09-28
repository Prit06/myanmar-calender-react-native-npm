
import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Linking, ActivityIndicator, Modal, Platform, NativeModules, DeviceEventEmitter } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, useDrawerStatus } from '@react-navigation/drawer';
import { NavigationContainer, } from '@react-navigation/native';
import Calendar from './Calendar';
import Holidays from './Holidays';

import Emcalendar from './Emcalendar';
import Share, { Button } from 'react-native-share';
import MyanmarZodiacSigns from './MyanmarZodiacSigns';
import { AdEventType, BannerAd, BannerAdSize, InterstitialAd } from 'react-native-google-mobile-ads';
// import { InterstitialAd as AppLovinInterstitialAd } from 'react-native-applovin-max';
// import { AppLovinMAX } from 'react-native-applovin-max';
import { AdContext, AdProvider } from './adsContext';  // Context to manage Ad count
import axios from 'axios';
import UnityAds from 'react-native-unity-ads-monetization';

const Drawer = createDrawerNavigator();

const platform = Platform.OS;

const CustomDrawerContent = (props) => {
  const isDrawerOpen = useDrawerStatus() === 'open';
  const { adCount, incrementAdCount, isBennerAds } = useContext(AdContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [interstitialAd, setInterstitialAd] = useState(null);
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
      props.setBannunity(false)
      console.log('Drawer opened');
      // Handle drawer open event
    } else {
      console.log('Drawer closed');
      props.setBannShow(true)
      props.setBannunity(true)
      // Handle drawer close event
    }
  }, [isDrawerOpen]);

  // ========================== InterstitialAd ads ==============================================//

  const fetchApiData = async () => {
    try {
      const response = await axios.get('https://myanmarcalendar.com/myanmar_caladsapi.json', {
      });
      console.log("response", response);
      
      // const response = await axios.get('https://atharvainfinity.com/atharvainfinity/ios/calendar/myanmar/myanmar_caladsapi.json', {
      // const response = await axios.get('https://atharvainfinity.com/atharvainfinity/ios/calendar/myanmar/myanmar_caladsapi.json', {
      // });

      setapidata(response.data?.meta); // Fetch and set the dynamic ad unit ID
    } catch (error) {
      console.error('Error fetching API data:', error);
    }
  };


  useEffect(() => {
    fetchApiData();

  }, []);

  useEffect(() => {
    if (adCount > 0 && adCount % apidata?.ads.interstitial_ad_interval === 0 && apidata?.ads.ad_status === "1" && Platform.OS !== 'ios') {
      console.log("Showing Interstitial Ad with ID: ", apidata.ads.ad_status);
      if (Platform.OS === 'android') {
        const adUnitId = Platform.select({
          android: apidata.ads.android_adsid.admob_interstitial_unit_id, // Use AdMob ID for Android
          // android: "ca-app-pub-3940256099942544/1033173711",
          ios: apidata.ads.ios_adsid.admob_interstitial_unit_id,    // Use AppLovin ID for iOS
        });

        const interstitialAd = InterstitialAd.createForAdRequest(adUnitId);  // Use dynamic ad unit ID
        setLoading(true);

        const adLoadListener = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
          setLoading(false);
          interstitialAd.show();
          console.log("ads is Show");
        });

        const adErrorListener = interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
          setLoading(false);
          console.log("Failed to Load Interstitial Ad: ", error);
          showUnityAd();
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
    } else if (Platform.OS === 'ios') {
      loadIosadmobads();
    }
  }, [adCount, adUnitId]);


  const loadInterstitialAd = () => {
    console.log("Loading Interstitial Ad...");

    const adUnitId = Platform.select({
      android: apidata.ads.android_adsid.admob_interstitial_unit_id,   // AdMob ID for Android
      ios: apidata.ads.ios_adsid.admob_interstitial_unit_id,    // AdMob ID for iOS
    });

    const ad = InterstitialAd.createForAdRequest(adUnitId);  // Create interstitial ad instance
    // setLoading(true);

    const adLoadListener = ad.addAdEventListener(AdEventType.LOADED, () => {
      // setLoading(false);
      setInterstitialAd(ad); // Store the loaded ad
      console.log("Interstitial Ad loaded successfully");
    });

    const adErrorListener = ad.addAdEventListener(AdEventType.ERROR, (error) => {
      // setLoading(false);
      console.log("Failed to load Interstitial Ad: ", error);
      showUnityAd();
    });

    ad.load(); // Load the ad

    return () => {
      adLoadListener();
      adErrorListener();
    };
  };

  const showInterstitialAd = async () => {
    if (interstitialAd) {
      StatusBar.setHidden(true);  // Hide status bar when ad shows
      await interstitialAd.show();
      setLoading(false);
      console.log("Interstitial Ad shown");
    } else {
      console.log("Interstitial Ad not ready to show yet");
    }
  };

  const loadIosadmobads = () => {
    if (adCount > 0 && adCount % apidata?.ads.interstitial_ad_interval !== 0 && apidata?.ads.ad_status === "1") {
      loadInterstitialAd();
    }

    // Show ad when adCount equals 3
    if (adCount > 0 && adCount % apidata?.ads.interstitial_ad_interval === 0 && apidata?.ads.ad_status === "1") {
      setLoading(true);
      showInterstitialAd();
    }
  }


  // ==================================== show Unity Ads ======================================= //


  const showUnityAd = () => {
    const gameId = Platform.select({
      android: apidata.ads.android_adsid.unity_game_id,
      ios: apidata.ads.ios_adsid.unity_game_id,
    });

    const interstitialPlacementId = Platform.select({
      android: apidata.ads.android_adsid.unity_interstitial_placement_id,
      // android: "Interstitial_Androiu",
      ios: apidata.ads.ios_adsid.unity_interstitial_placement_id,
    });

    // Initialize Unity Ads
    UnityAds.initialize(gameId, true)
      .then(() => UnityAds.loadAd(interstitialPlacementId))  // Load the interstitial ad using the placement ID
      .catch(error => console.error('UnityAds initialization failed', error));

    // Set listeners for ad loading
    UnityAds.setOnUnityAdsLoadListener({
      onAdLoaded: (placementId) => {
        console.log(`UnityAds.onAdLoaded: ${placementId}`);
        if (placementId === interstitialPlacementId) {
          // setUnityLoaded(true);
          showAdIfReady(interstitialPlacementId);
        }
      },
      onAdLoadFailed: (placementId, error) => {
        console.log(`UnityAds.onAdLoadFailed: ${placementId}`, error);
        // showAppLovinAd();
      },
    });





    // Unityads.initialize("5402023", 1, (callback) => { //second parameter for test mode, 1 default. 0 for production.
    //   setIsInitialized(true);
    //   logStatus('SDK Initialized: '+ callback);

    //   // Attach ad listeners for rewarded ads, and banner ads
    //   attachAdListeners();
    // });

  }
  // Optionally, show the ad when it's loaded
  const showAdIfReady = (placementId) => {
    UnityAds.showAd(placementId)
      .then(() => {
        console.log('Unity ad shown successfully');
      })
      .catch(error => {
        console.error('UnityAds.showAd failed', error);
        UnityAds.loadAd(placementId); // Try to load a new ad if showing failed
      });
  }


  // const initializeAppLovinSdk = () => {
  //   const appLovinSdkKey = Platform.select({
  //     android: "iTwh_UVXAifQEJI0VaSCck97B9evnrT9g7Epl7OEtIRgVROTh5pFoGDiVGdWPasG1Knys15HQLeVriCHP_1WA6",
  //     ios: "iTwh_UVXAifQEJI0VaSCck97B9evnrT9g7Epl7OEtIRgVROTh5pFoGDiVGdWPasG1Knys15HQLeVriCHP_1WA6",
  //   });

  //   // Initialize AppLovin SDK
  //   AppLovinMAX.initialize(appLovinSdkKey, (configuration) => {
  //     console.log('AppLovin SDK initialized:', configuration);
  //   });
  // };

  //=============================== AppLovin ads show  ===============================================//

  // const showAppLovinAd = () => {
  //   console.log("Attempting to show AppLovin ad");

  //   // Ensure the AppLovin SDK is initialized
  //   initializeAppLovinSdk();

  //   const appLovinInterstitialUnitId = Platform.select({
  //     android: apidata.ads.android_adsid.applovin_interstitial_unit_id,
  //     ios: apidata.ads.ios_adsid.applovin_interstitial_unit_id,
  //   });

  //   // Check if AppLovin SDK is initialized before loading the ad
  //   if (!AppLovinMAX.isInitialized()) {
  //     console.error("AppLovin SDK is not initialized. Please initialize it before showing ads.");
  //     return;
  //   }

  //   AppLovinMAX.loadInterstitial(appLovinInterstitialUnitId);

  //   const appLovinLoadListener = AppLovinMAX.addInterstitialLoadedEventListener(() => {
  //     setLoading(false);
  //     if (AppLovinMAX.isInterstitialReady(appLovinInterstitialUnitId)) {
  //       AppLovinMAX.showInterstitial(appLovinInterstitialUnitId);
  //       console.log("AppLovin interstitial ad is shown");
  //     }
  //   });

  //   const appLovinErrorListener = AppLovinMAX.addInterstitialLoadFailedEventListener((errorCode) => {
  //     setLoading(false);
  //     console.log("Failed to load AppLovin Interstitial Ad: ", errorCode);
  //   });

  //   const appLovinCloseListener = AppLovinMAX.addInterstitialHiddenEventListener(() => {
  //     console.log("AppLovin interstitial ad closed");
  //   });

  //   return () => {
  //     appLovinLoadListener();
  //     appLovinErrorListener();
  //     appLovinCloseListener();
  //   };
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
            <ActivityIndicator style={{ transform: [{ scale: 1.2 }] }} size="large" color="#7B61FF" />
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


const DrawerNavigation = () => {
  const [bannerAdUnitId, setBannerAdUnitId] = useState(null);
  const [bannShow, setBannShow] = useState(true);
  const [bannunity, setBannunity] = useState(true);
  const [admobFailed, setAdmobFailed] = useState(false);
  const [unityAdsInitialized, setUnityAdsInitialized] = useState(false);
  const [showUnityBanner, setShowUnityBanner] = useState(false);


  const logStatus = (message) => {
    console.log(message); // Add your logging logic here
  };

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const response = await axios.get('https://myanmarcalendar.com/myanmar_caladsapi.json');
        // const response = await axios.get('https://atharvainfinity.com/atharvainfinity/ios/calendar/myanmar/myanmar_caladsapi.json');
        if (Platform.OS === 'android') {
          setBannerAdUnitId(response.data?.meta.ads.android_adsid.admob_banner_unit_id);
          // setBannerAdUnitId("ca-app-pub-3940256099942544/921458974");
        } else if (Platform.OS === 'ios') {
          setBannerAdUnitId(response.data?.meta.ads.ios_adsid.admob_banner_unit_id);
        }
      } catch (error) {
        console.error('Error fetching API data:', error);
      }
    };

    fetchApiData();
  }, []);

  const Unityads = NativeModules.Unityads
    ? NativeModules.Unityads
    : new Proxy(
        {},
        {
          get() {
            throw new Error('Linking error');
          },
        }
      );

  useEffect(() => {
    Unityads.initialize("5402023", 1, (callback) => { // Test mode 1, production 0
      logStatus('SDK Initialized: ' + callback);
      setUnityAdsInitialized(true);
      attachAdListeners();
    });
  }, []);

  function attachAdListeners() {
    if (!Unityads || typeof Unityads.addEventListener !== 'function') {
      console.log('Unityads.addEventListener is not a function');
      return;
    }

    // Ad event listeners...
    Unityads.addEventListener('onUnityAdsAdFailedToLoad', (errorInfo) => {
      logStatus('Interstitial ad failed to load: ' + errorInfo);
      // Retry logic here...
    });

    // More listeners...
  }

  const handleAdFailedToLoad = () => {
    console.log('AdMob banner failed to load, falling back to Unity Ads.');
    setAdmobFailed(true);
    setShowUnityBanner(true); // Trigger showing Unity banner ads
    // ubitcall();
  };

  const ubitcall = () => {
    console.log("Banner_Android show");
    
    Unityads.loadBottomBanner("Banner_Android");
  }

  const unloadBottomBanner = () => {
    if (Unityads && typeof Unityads.unLoadBottomBanner === 'function') {
      Unityads.unLoadBottomBanner(); // Call the unload method
      console.log("Bottom banner ad unloaded");
      logStatus('Bottom banner ad unloaded');
    }
  };

  useEffect(() => {
    if(bannunity && admobFailed){
      console.log("soooooooooooooo");
      ubitcall();
    }else{
      console.log("noooooooooo");
      unloadBottomBanner()
    }

    const bannerErrorListener = DeviceEventEmitter.addListener('onBannerViewDidLeaveApplication', (event) => {
      console.log('Banner failed to load:', event);
    });

    return () => {
      bannerErrorListener.remove();
    };

  }, [bannunity]) 





  useEffect(() => {
    // Cleanup function to unload the banner ad on unmount
    return () => {
      if (admobFailed) {
        unloadBottomBanner();
      }
    };
  }, [unityAdsInitialized]); // Run on unmount or when Unity Ads initializes


  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#FFBABA" />

      <Drawer.Navigator
        drawerContent={(props) => (
          <CustomDrawerContent
            {...props}
            setBannShow={setBannShow}
            setBannunity={setBannunity}
          />
        )}
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
        <Drawer.Screen name="MyanmarZodiacSigns" component={MyanmarZodiacSigns} />
      </Drawer.Navigator>

      {bannShow ? (
        <View style={styles.adContainer}>
          {!admobFailed ? (
            bannerAdUnitId ? (
              <>
                <Text style={{ color: 'black', fontSize: 20, marginBottom: 10 }}>Advertisement</Text>
                <BannerAd
                  unitId={bannerAdUnitId}
                  size={BannerAdSize.LARGE_BANNER}
                  onAdFailedToLoad={handleAdFailedToLoad}
                />
              </>
            ) : null
          ) : (
            showUnityBanner && (
              // <Text style={{ color: 'black', fontSize: 20, marginBottom: 10 }}>Loading Unity Ad...</Text>
              <></>
            )
          )}
        </View>
      ) : null}

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
    backgroundColor: 'white',
  },
  loaderText: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 10,
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
    backgroundColor: 'rgba(=], 0, 0, 0.5)', // Optional: darken the background
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