
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
import { AdContext, AdProvider } from './adsContext';
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
  const [adUnitId, setAdUnitId] = useState(null);
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
      // Handle drawer open event
    } else {
      props.setBannShow(true)
      props.setBannunity(true)
      // Handle drawer close event
    }
  }, [isDrawerOpen]);

  // ========================== InterstitialAd ads ==============================================//



  const fetchApiData = async () => {
    try {
      const response = await axios.get('https://atharvainfinity.com/atharvainfinity/ios/calendar/myanmar/myanmar_caladsapi.json', {
      });
      // const response = await axios.get('https://myanmarcalendar.com/myanmar_caladsapi.json', {
      // });

      setapidata(response.data?.meta);
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
        props.setLangCalTypeButton(false);
        if (apidata?.ads.admob_ads === "1") {
          const adUnitId = Platform.select({
            android: apidata.ads.android_adsid.admob_interstitial_unit_id, 
            ios: apidata.ads.ios_adsid.admob_interstitial_unit_id,   
          });

          const interstitialAd = InterstitialAd.createForAdRequest(adUnitId);
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
        } else {
          showUnityAd();
        }
      }
    } else if (Platform.OS === 'ios') {
      loadIosadmobads();
    }
  }, [adCount, adUnitId]);


  const loadInterstitialAd = () => {
    if (apidata?.ads?.admob_ads === "1") {
      console.log("Loading Interstitial Ad...");

      const adUnitId = Platform.select({
        android: apidata.ads.android_adsid.admob_interstitial_unit_id,   
        ios: apidata.ads.ios_adsid.admob_interstitial_unit_id,   
      });

      const ad = InterstitialAd.createForAdRequest(adUnitId);  
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
    } else {
      showUnityAd();
    }
  };

  const showInterstitialAd = async () => {
    if (interstitialAd) {
     StatusBar.setHidden(true);  // Hide status bar when ad shows
      await interstitialAd.show();
    //  setLoading(false);
      console.log("Interstitial Ad shown");
    } else {
      console.log("Interstitial Ad not ready to show yet");
    }
  };

  const loadIosadmobads =  async () => {
    if (adCount > 0 && adCount % apidata?.ads.interstitial_ad_interval !== 0 && apidata?.ads.ad_status === "1") {
      loadInterstitialAd();
    }

    // Show ad when adCount equals 3
    if (adCount > 0 && adCount % apidata?.ads.interstitial_ad_interval === 0 && apidata?.ads.ad_status === "1") {
      props.setLangCalTypeButton(false);
      setLoading(true);
      setTimeout( async () => {
        setLoading(false); // Hide loader
        console.log('Process Complete!');
        setTimeout(() => {
          showInterstitialAd();
        },30);
        // Call the function after the loading completes
     //   showInterstitialAd();
      }, 2000);
       
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
      ios: apidata.ads.ios_adsid.unity_interstitial_placement_id,
    });

    // Initialize Unity Ads
    UnityAds.initialize(gameId, true)
      .then(() => UnityAds.loadAd(interstitialPlacementId))
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

  }
  
  const showAdIfReady = (placementId) => {
    UnityAds.showAd(placementId)
      .then(() => {
        console.log('Unity ad shown successfully');
      })
      .catch(error => {
        console.error('UnityAds.showAd failed', error);
        UnityAds.loadAd(placementId); 
      });
  }


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


// ============================bannnr ads show ====================================================//

const DrawerNavigation = () => {
  const [bannerAdUnitId, setBannerAdUnitId] = useState(null);
  const [bannShow, setBannShow] = useState(true);
  const [bannunity, setBannunity] = useState(true);
  const [admobFailed, setAdmobFailed] = useState(false);
  const [unityAdsInitialized, setUnityAdsInitialized] = useState(false);
  const [showUnityBanner, setShowUnityBanner] = useState(false);
  const [responseData, setresponseData] = useState(null);
  const [langCalTypeButton, setLangCalTypeButton] = useState(false);
  const [adsValue , setadsValue] = useState("unity")

  const logStatus = (message) => {
    console.log(message);
  };

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        // const response = await axios.get('https://atharvainfinity.com/atharvainfinity/ios/calendar/myanmar/myanmar_caladsapi.json');

        const response = await axios.get('https://myanmarcalendar.com/myanmar_caladsapi.json');
        const dataSet = response.data?.meta.ads;
        if (dataSet?.ad_status === "1") {
          setresponseData(response.data?.meta.ads);
          if (dataSet?.admob_ads === "1") {
            if (Platform.OS === 'android') {
              setBannerAdUnitId(response.data?.meta.ads.android_adsid.admob_banner_unit_id);
            } else if (Platform.OS === 'ios') {
              setBannerAdUnitId(response.data?.meta.ads.ios_adsid.admob_banner_unit_id);
            }
          }
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
    if (!responseData) return
    const unity_game_id = Platform.select({
      android: responseData.android_adsid.unity_game_id,
      ios: responseData.ios_adsid.unity_game_id,
    });
    Unityads.initialize(unity_game_id, 1, (callback) => { // Test mode 1, production 0
      logStatus('SDK Initialized: ' + callback);
      setUnityAdsInitialized(true);
      attachAdListeners();
    });

    if (responseData?.admob_ads !== "1") {
      handleAdFailedToLoad();
    }
  }, [responseData]);

  function attachAdListeners() {
    if (!Unityads || typeof Unityads.addEventListener !== 'function') {
      console.log('Unityads.addEventListener is not a function');
      return;
    }

    // Ad event listeners...
    Unityads.addEventListener('onUnityAdsAdFailedToLoad', (errorInfo) => {
      logStatus('Interstitial ad failed to load: ' + errorInfo);
    });

  }

  const handleAdFailedToLoad = () => {
    console.log('AdMob banner failed to load, falling back to Unity Ads.');
    setadsValue("unity")
    setAdmobFailed(true);
    setShowUnityBanner(true);
    ubitcall();
  };

  const ubitcall = () => {
    const unity_banner_placement_id = Platform.select({
      android: responseData.android_adsid.unity_banner_placement_id,
      ios: responseData.ios_adsid.unity_banner_placement_id,
    });
    Unityads.loadBottomBanner(unity_banner_placement_id);
  }

  const unloadBottomBanner = () => {
    if (Unityads && typeof Unityads.unLoadBottomBanner === 'function') {
      Unityads.unLoadBottomBanner(); // Call the unload method
      console.log("Bottom banner ad unloaded");
      logStatus('Bottom banner ad unloaded');
    }
  };

  useEffect(() => {
    if (bannunity && admobFailed) {
      ubitcall();
    } else {
      unloadBottomBanner()
    }

    const bannerErrorListener = DeviceEventEmitter.addListener('onBannerViewDidLeaveApplication', (event) => {
      console.log('Banner failed to load:', event);
    });

    return () => {
      bannerErrorListener.remove();
    };

  }, [bannunity])




  const handleAdLoaded = () => {
    setadsValue("admob")
    setAdmobFailed(false);
  };

  // useEffect(() => {
  //   // Cleanup function to unload the banner ad on unmount
  //   return () => {
  //     if (admobFailed) {
  //       unloadBottomBanner();
  //     }
  //   };
  // }, [unityAdsInitialized]); // Run on unmount or when Unity Ads initializes

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#FFBABA" />

      <Drawer.Navigator
        drawerContent={(props) => (
          <CustomDrawerContent
            {...props}
            setBannShow={setBannShow}
            setBannunity={setBannunity}
            setLangCalTypeButton={setLangCalTypeButton}
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



        <Drawer.Screen name="Myanmar Calendar">
          {(props) => <Calendar {...props} langCalTypeButton={langCalTypeButton} setLangCalTypeButton={setLangCalTypeButton} />}
        </Drawer.Screen>
        <Drawer.Screen name="Emcalendar" component={Emcalendar} />
        <Drawer.Screen name="Holidays" component={Holidays} />
        <Drawer.Screen name="MyanmarZodiacSigns" component={MyanmarZodiacSigns} />
      </Drawer.Navigator>

      

        
      {/* {bannShow ? (
        <View style={[
          adsValue === "admob" ? styles.adContainer : adsValue === "unity" ? styles.unityadContainer : null,
          { height: adsValue === "admob" ? 100 : adsValue === "unity" ? 100 : 0 } // Adjust height for AdMob and Unity
        ]}>
        
            <>{
              
              <Text style={{ color: 'black', fontSize: 18, marginBottom: 10 }}>Advertisement</Text>
             
            }
              <BannerAd
                unitId={bannerAdUnitId}
                size={BannerAdSize.LARGE_BANNER}
                onAdFailedToLoad={handleAdFailedToLoad}
                onAdLoaded={handleAdLoaded}
              />
            </>
         
        </View>
      ) : null} */}

{bannShow ? (
        <View style={adsValue === "admob" ? styles.adContainer : (adsValue === "unity" ? styles.unityadContainer : null)}>
         {!admobFailed && bannerAdUnitId ? (
            <>{
              adsValue === "admob" ? 
              <Text style={{ color: 'black', fontSize: 18, marginBottom: 10 }}>Advertisement</Text>
              : (
                adsValue === "unity" ?  
                "" : ""
              )
            }
              <BannerAd
                unitId={bannerAdUnitId}
                size={BannerAdSize.LARGE_BANNER}
                onAdFailedToLoad={handleAdFailedToLoad}
                onAdLoaded={handleAdLoaded}
              />
            </>
          ) : (
            // showUnityBanner && (
            //   // <Text style={{ color: 'black', fontSize: 20, marginBottom: 10 }}>Loading Unity Ad...</Text>
            //   <></>
            // )
            <>
             </>
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
  unityadContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'transparent',
    height:0
  },
  loaderText: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 10,
    color: 'black',
    textAlign: 'center',
  },

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
  hiddenBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white', // or whatever color you want
    zIndex: 1, // Ensure it overlays other content
  },
});

export default DrawerNavigation;