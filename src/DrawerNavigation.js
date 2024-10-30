
import React, { useState, useEffect, useContext, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Linking, ActivityIndicator, Modal, Platform, NativeModules, DeviceEventEmitter } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, useDrawerStatus } from '@react-navigation/drawer';
import { NavigationContainer, } from '@react-navigation/native';
import Calendar from './Calendar';
import Holidays from './Holidays';
import Emcalendar from './Emcalendar';
import Share, { Button } from 'react-native-share';
import MyanmarZodiacSigns from './MyanmarZodiacSigns';
import { AdEventType, BannerAd, BannerAdSize, InterstitialAd } from 'react-native-google-mobile-ads';
import { AdContext } from './adsContext';
import axios from 'axios';
import UnityAds from 'react-native-unity-ads-monetization';
import {API_KEY} from '@env';

const Drawer = createDrawerNavigator();

const platform = Platform.OS;

const CustomDrawerContent = (props) => {
  const isDrawerOpen = useDrawerStatus() === 'open';
  const { adCount, incrementAdCount, isBennerAds, isConnected } = useContext(AdContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(null);

  const [adUnitIds, setAdUnitIds] = useState({})
  const [adLoaded, setAdLoaded] = useState(false);;

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

  useEffect(() => {
    fetchApiData();
  }, [isConnected]);

  const fetchApiData = async () => {
    try {
      const response = await axios.get(API_KEY); // Replace with your API endpoint
      const apidata = response.data;
      setApiData(response.data?.meta);
      setAdUnitIds({
        admobId: Platform.select({
          android: apidata.meta.ads.android_adsid.admob_interstitial_unit_id,
          ios: apidata.meta.ads.ios_adsid.admob_interstitial_unit_id,
        }),
        unityId: Platform.select({
          android: apidata.meta.ads.android_adsid.unity_interstitial_placement_id,
          ios: apidata.meta.ads.ios_adsid.unity_interstitial_placement_id,
        }),
        gameId: Platform.select({
          android: apidata.meta.ads.android_adsid.unity_game_id,
          ios: apidata.meta.ads.ios_adsid.unity_game_id,
        }),
        applovinId: Platform.select({
          android: apidata.meta.ads.android_adsid.applovin_interstitial_id,
          ios: apidata.meta.ads.ios_adsid.applovin_interstitial_id,
        }),
      });
    } catch (error) {
      console.error('Error fetching API data:', error);
    }
  };

  useEffect(() => {
    if (adCount > 0 && adCount % apiData?.ads.interstitial_ad_interval === 0 && apiData?.ads.ad_status === "1") {
      console.log("adUnitIds.admobId", adUnitIds.admobId);
      setLoading(true);
      if (apiData?.ads.admob_ads === "1"){
        const interstitialAd = InterstitialAd.createForAdRequest(adUnitIds.admobId);
        const adLoadListener = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
          setAdLoaded(true);
          setTimeout(() => {
              interstitialAd.show();
              setAdLoaded(false);
          }, 500);
        });
        const adErrorListener = interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
          console.log("Failed to Load Interstitial Ad: ", error);
          handleUnityAdShow()
        });
        const adCloseListener = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
          setLoading(false);
        });
        interstitialAd.load();
        return () => {
          adLoadListener();
          adErrorListener();
          adCloseListener();
        };
      }else{
        handleUnityAdShow()
      }
    }
  }, [adCount, adUnitIds]);



  const handleUnityAdShow = async () => {
    try {
      await UnityAds.initialize(adUnitIds.gameId, true)
      .then(() => UnityAds.loadAd(adUnitIds.unityId))
      .catch(error => console.error('UnityAds initialization failed', error));

      await UnityAds.setOnUnityAdsLoadListener({
        onAdLoaded: (placementId) => {
          console.log(`UnityAds.onAdLoaded: ${placementId}`);
          if (placementId === adUnitIds.unityId) {
            setTimeout(() => {
              showAdIfReady(adUnitIds.unityId)
            }, 500);
          }
        },
        onAdLoadFailed: (placementId, error) => {
          console.log(`UnityAds.onAdLoadFailed: ${placementId}`, error);
          setLoading(false);
          // showAppLovinAd();
        },
      });
    } catch (unityError) {
      console.log("unityError", unityError);
      showAppLovinAd()
      // Fallback to AppLovin
      // AppLovinMAX.loadInterstitial(adUnitIds.applovinId);
      // AppLovinMAX.showInterstitial(adUnitIds.applovinId);
    }
  };

  const showAdIfReady = async(placementId) => {
    await UnityAds.showAd(placementId)
      .then(() => {
        console.log('Unity ad shown successfully');
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
        console.error('UnityAds.showAd failed', error);
        // showAppLovinAd()
        // UnityAds.loadAd(placementId);
      });
  }

  const showAppLovinAd = () => {
  }

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //   }, 4000); // 4 seacond loader time ...........
  //   return () => clearTimeout(timer);
  // }, []);

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
            { backgroundColor: selectedItem === 'English Calendar' ? '#FFBABA' : 'transparent' }
          ]}
          onPress={() => {
            setSelectedItem('English Calendar');
            props.navigation.navigate('English Calendar');
            incrementAdCount();  // Increment ad count on click
          }}
        >
          <Image
            source={require('./assets/calendar.png')}
            style={[
              styles.drawerItemImage,
              { tintColor: selectedItem === 'English Calendar' ? '#FF3030' : 'white' }
            ]}
          />
          
          <Text style={[
            styles.drawerItemText,
            { color: selectedItem === 'English Calendar' ? '#FF3030' : 'white' }
          ]}>
            English Calendar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.drawerItemContainer,
            { backgroundColor: selectedItem === 'Myanmar Calendar' ? '#FFBABA' : 'transparent' }
          ]}
          onPress={() => {
            setSelectedItem('Myanmar Calendar');
            props.navigation.navigate('Myanmar Calendar');
            incrementAdCount();
          }}
        >
          <Image
            source={require('./assets/cal.png')}
            style={[
              styles.drawerItemImage,
              { tintColor: selectedItem === 'Myanmar Calendar' ? '#FF3030' : 'white' }
            ]}
          />
          <Text style={[
            styles.drawerItemText,
            { color: selectedItem === 'Myanmar Calendar' ? '#FF3030' : 'white' }
          ]}>
            {"Myanmar Calendar"}
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
  const bannerRef = useRef(null);
  const [bannerAdUnitId, setBannerAdUnitId] = useState(null);
  const [bannShow, setBannShow] = useState(true);
  const [bannunity, setBannunity] = useState(true);
  const [admobFailed, setAdmobFailed] = useState(false);
  const [unityAdsInitialized, setUnityAdsInitialized] = useState(false);
  const [showUnityBanner, setShowUnityBanner] = useState(false);
  const [responseData, setresponseData] = useState(null);
  const [langCalTypeButton, setLangCalTypeButton] = useState(false);
  const [adsValue, setadsValue] = useState("");
  const { isConnected } = useContext(AdContext);

  const logStatus = (message) => {
    console.log(message);
  };

  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const response = await axios.get(API_KEY);
        // const response = await axios.get('https://atharvainfinity.com/atharvainfinity/ios/calendar/myanmar/myanmar_caladsapi.json');

        // const response = await axios.get('https://myanmarcalendar.com/myanmar_caladsapi.json');
        const dataSet = response.data?.meta.ads;
        if (dataSet?.ad_status === "1") {
          setresponseData(response.data?.meta.ads);
          if (dataSet?.admob_ads === "1") {
            if (Platform.OS === 'android') {
              setBannerAdUnitId(response.data?.meta.ads.android_adsid.admob_banner_unit_id);
              setadsValue("admob")
              setAdmobFailed(false);
              setShowUnityBanner(false);
              if(bannerRef) bannerRef?.current?.loadAd()
            } else if (Platform.OS === 'ios') {
              setBannerAdUnitId(response.data?.meta.ads.ios_adsid.admob_banner_unit_id);
              setadsValue("admob")
              setAdmobFailed(false);
              setShowUnityBanner(false);
              bannerRef.current?.loadAd()
            }
          }
        }
      } catch (error) {
        console.error('Error fetching API data:', error);
      }
    };

    fetchApiData();
  }, [isConnected]);



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
      // logStatus('Interstitial ad failed to load: ' + errorInfo);
      console.log("onUnityAdsAdFailedToLoad", errorInfo);
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
    DeviceEventEmitter.addListener('onBannerViewDidError', (event) => {
      console.log('Banner failed to load:--------', event);
      setadsValue("")
    });

    return () => {
      bannerErrorListener.remove();
    };
  }, [bannunity])

  // const handleAdLoaded = () => {
  //   console.log("bannShow================", bannShow , bannerAdUnitId);
  //   setadsValue("admob")
  //   setAdmobFailed(false);
  //   setShowUnityBanner(false);
  // };


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
        <Drawer.Screen name="English Calendar">
          {(props) => <Calendar {...props} langCalTypeButton={langCalTypeButton} setLangCalTypeButton={setLangCalTypeButton} />}
        </Drawer.Screen>
        <Drawer.Screen name="Myanmar Calendar">
          {(props) => <Emcalendar {...props} langCalTypeButton={langCalTypeButton} setLangCalTypeButton={setLangCalTypeButton} />}
        </Drawer.Screen>
        {/* <Drawer.Screen name="Emcalendar" component={Emcalendar} /> */}
        <Drawer.Screen name="Holidays" component={Holidays} />
        <Drawer.Screen name="MyanmarZodiacSigns" component={MyanmarZodiacSigns} />
      </Drawer.Navigator>


      {bannShow ? (
        <View style={adsValue === "admob" ? styles.adContainer : (adsValue === "unity" ? styles.unityadContainer : styles.noadsContainer)}>
          {
            adsValue === "admob" ?
              <Text style={{ color: 'black', fontSize: 16, marginBottom: 10 }}>Advertisement</Text>
              : (
                adsValue === "unity" ?
                  <Text style={{ color: 'black', fontSize: 16, marginBottom: 10 }}>Advertisement</Text>
                  :
                  ""
              )
          }

          {!admobFailed && bannerAdUnitId ? (
            <>
              {adsValue === "admob" && (
                <View style={{ position: 'absolute', top: 60, alignSelf: 'center' }}>
                  <Text style={{ color: 'black', fontSize: 16 }}>Loading...</Text>
                </View>
              )
              }
              <BannerAd
                unitId={bannerAdUnitId}
                size={BannerAdSize.LARGE_BANNER}
                onAdFailedToLoad={handleAdFailedToLoad}
                // onAdLoaded={handleAdLoaded}
                ref={bannerRef}
              />
            </>
          ) : (
            showUnityBanner && (
              adsValue === "unity" && (
                <View style={{ position: 'absolute', top: 50, alignSelf: 'center' }}>
                  <Text style={{ color: 'black', fontSize: 16 }}>Loading...</Text>
                </View>
              )
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
  // unityconetion: {
  //   alignItems: 'center',
  //   marginBottom: 20,
  //   backgroundColor: 'white',
  //   height:150,
  //   position:"absolute",
  //   bottom:0,
  //   width:"100%"
  // },
  unityadContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    height: 100,
    marginBottom: 0
  },
  noadsContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    height: 0,
    // marginBottom: 0
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
    padding: 15,     // Add padding for spacing inside the box
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