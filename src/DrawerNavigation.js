
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Animated, StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Linking, ActivityIndicator, Modal, Platform, NativeModules, DeviceEventEmitter, NativeEventEmitter } from 'react-native';
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
import  AppLovinMAX, { InterstitialAd as InterstitialApplovinAd, ErrorCode }  from 'react-native-applovin-max';
import { BannerAd as applovinBenner, AdViewPosition } from 'react-native-applovin-max';
// import type { Configuration, AdInfo, AdLoadFailedInfo, NativeUIComponentAdViewOptions } from 'react-native-applovin-max';

import {API_KEY} from '@env';

const Drawer = createDrawerNavigator();

const platform = Platform.OS;
function logStatus(status) {
  console.log(status);
}

const CustomDrawerContent = (props) => {
  const isDrawerOpen = useDrawerStatus() === 'open';
  const { adCount, incrementAdCount, isBennerAds, isConnected } = useContext(AdContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState(null);

  const [adUnitIds, setAdUnitIds] = useState({})
  const [adLoaded, setAdLoaded] = useState(false);
  const [isInitializedApplovin, setIsInitializedApplovin] = useState(false);
  const [isInitializedUnityAds, setIsInitializedUnityAds] = useState(false);  

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
  }, [apiData]);

  useEffect(() => {
    if (isDrawerOpen) {
      console.log("isDrawerOpen");
      props.setBannShow(false)
      props.setBannunity(false)
      // Handle drawer open event
    } else {
      console.log("close", props.unityAdsFailed);
      props.setBannShow(true)
      props.setBannunity(true)
      // Handle drawer close event 
    }
  }, [isDrawerOpen]);

  useEffect(() => {
    fetchApiData(props.apiDatas);
    if(props.apiDatas?.meta){
      setApiData(props.apiDatas?.meta);
    }
  }, [isConnected]);

  const fetchApiData = async (apidata) => {
    try {
      setApiData(props.apiDatas?.meta);
      setAdUnitIds({
        admobId: Platform.select({
          android: apidata.meta.ads.android_adsid.admob_interstitial_unit_id,
          ios: apidata.meta.ads.ios_adsid.admob_interstitial_unit_id,
        }),
        unityId: Platform.select({
          android: apidata.meta.ads.android_adsid.unity_interstitial_placement_id ,
          ios: apidata.meta.ads.ios_adsid.unity_interstitial_placement_id,
        }),
        gameId: Platform.select({
          android: apidata.meta.ads.android_adsid.unity_game_id,
          ios: apidata.meta.ads.ios_adsid.unity_game_id,
        }),
        applovinId: Platform.select({
          android: apidata.meta.ads.android_adsid.applovin_interstitial_unit_id,
          ios: apidata.meta.ads.ios_adsid.applovin_interstitial_unit_id,
        }),
      });
    } catch (error) {
      console.error('Error fetching API data:', error);
    }
  };

  useEffect(() => {
    const initializeUnityAds = async () => {
      try {
        if (adUnitIds?.gameId) {
          console.log("Initializing Unity Ads with Game ID:", adUnitIds.gameId);
          const result = await UnityAds.initialize(adUnitIds.gameId, true);
          if (result) {
            console.log("Unity Ads initialized successfully:", result);
            setIsInitializedUnityAds(true);
          }
        } else {
          console.log("Game ID is not defined.");
        }
      } catch (error) {
        setIsInitializedUnityAds(false);
        console.error("Unity Ads initialization failed:", error);
      }
    };

    initializeUnityAds();
  }, [adUnitIds?.gameId]);

  useEffect(() => {
    console.log("adCount", adCount);
    
    if (adCount > 0 && adCount % apiData?.ads.interstitial_ad_interval === 0 && apiData?.ads.ad_status === "1") {
      setLoading(true);

        if (apiData?.ads.admob_ads === "1"){
          // const interstitialAd = InterstitialAd.createForAdRequest(adUnitIds.admobId);
          const interstitialAd = InterstitialAd.createForAdRequest(String(adUnitIds.admobId));
          const adLoadListener = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
            setAdLoaded(true);
            setTimeout(() => {
              setLoading(false);
              setTimeout(() => {
                interstitialAd.show();
              }, 50);
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
      if (!isInitializedUnityAds) {
        showAppLovinAd()
      }else{
        // Set up the Unity Ads Load Listener first
        UnityAds.setOnUnityAdsLoadListener({
          onAdLoaded: (placementId) => {
            if (placementId === adUnitIds.unityId) {
              setTimeout(() => {
                showAdIfReady(placementId);
              }, 500);
              console.log("Unity Ads load success");
            }
          },
          onAdLoadFailed: (placementId, error) => {
            console.log("Unity Ads failed to load");
            console.log(`UnityAds.onAdLoadFailed: ${placementId}`, error);
            showAppLovinAd();
          },
        });
        // Now load the ad with the invalid ID
        console.log("Attempting to load Unity Ad:", adUnitIds.unityId);
        var data = await UnityAds.loadAd(adUnitIds.unityId); // This should fail
        if(data){
          setTimeout(async () => {
            var isLoaded = await UnityAds.isLoad(adUnitIds.unityId);  // This should return false
            console.log("isLoaded", isLoaded);
          }, 500);
        }
        console.log("Unity Ads load initiated", data);
      }
  
  
    } catch (error) {
      console.log("Unity error:", error);
      showAppLovinAd();
    }
  };
  let isAdShowing = false;
  // Show Ad if Ready
  const showAdIfReady = async (placementId) => {
    setTimeout(async() => {
      if (isAdShowing) {
        console.log("An ad is already being shown. Cannot show another ad.");
        return; // Exit early if an ad is currently showing
      }
      try {
        isAdShowing = true; // Set the flag to indicate an ad is being shown
        setTimeout(() => {
          setLoading(false);
          setTimeout(() => { 
            console.log("placementId", placementId);
            UnityAds.showAd(placementId);  
          }, 500);
        }, 30);
        console.log('Unity ad shown successfully');
      } catch (error) {
        console.error('UnityAds.showAd failed', error);
      } finally {
        isAdShowing = false; // Reset the flag after the ad is shown or failed
      }
    }, 500);
  };
  

//   const emitter = new NativeEventEmitter(UnityAds);
//   const subscriptions = {};
//   const addEventListener = (event, handler) => {
//     let subscription = emitter.addListener(event, handler);
//     let currentSubscription = subscriptions[event];
//     if (currentSubscription) {
//       currentSubscription.remove();
//     }
//     subscriptions[event] = subscription;
//   };
  
//   const removeEventListener = (event) => {
//     let currentSubscription = subscriptions[event];
//     if (currentSubscription) {
//       currentSubscription.remove();
//       delete subscriptions[event];
//     }
//   };

    useEffect(() => {
      // Add listeners for Unity Ads events using the custom addEventListener function
      // addEventListener('onUnityAdsAdFailedToLoad', (errorInfo) => {
      //   setadsValue("")
      //   let retryDelay = Math.pow(2, Math.min(6, interstitialRetryAttempt));
      //   logStatus(`Interstitial ad failed to load with code ${errorInfo} - retrying in ${retryDelay}s`);
      // });
    
      // addEventListener('onUnityAdsShowComplete', (adInfo) => {
      //   setUnityAdShowCompleteState(adsShowState.completed);
      //   logStatus(`Ads show completed, with ID: ${adInfo.adUnitId} state: ${adInfo.state}`);
      //   if (adInfo.adUnitId === REWARDED_AD_UNIT_ID && adInfo.state === 1) {
      //     console.log('Reward the user');
      //   }
      // });
    
      // Add listeners for Banner Ad events
      
      if(Platform.OS === 'ios'){
        const { Unityads } = NativeModules;
        const eventEmitter = new NativeEventEmitter(Unityads);
        const unityAdsAdLoaded = eventEmitter.addListener(
          'onUnityAdsAdLoaded',
          (event) => {
            console.log('Unity loaded successfully:', event);
          }
        );
        const unityAdsAdFailedToLoad = eventEmitter.addListener('onUnityAdsAdFailedToLoad', (event) => {
          console.log('Unity failed to load:...onUnityAdsAdFailedToLoad', event);
        });
        const unityAdsAdFailed = eventEmitter.addListener('unityAdsAdFailed', (event) => {
          console.log('Unity ad failed:', event);
        });
         const unityUnityAdsShowComplete = eventEmitter.addListener(
          'onUnityAdsShowComplete',
          (event) => {
            setUnityAdShowCompleteState(adsShowState.completed);
            if (adInfo.adUnitId === REWARDED_AD_UNIT_ID && adInfo.state === 1) {
              console.log('Reward the user');
            }
          }
        );
    
        return () => {
          unityAdsAdLoaded.remove();
          unityAdsAdFailedToLoad.remove();
          unityAdsAdFailed.remove();
          unityUnityAdsShowComplete.remove();
        };
      }
    
      // Clean up all listeners on unmount
      // return () => {
      //   Object.keys(subscriptions).forEach(removeEventListener);
      // };
  }, [adCount, adUnitIds]);



  // ====================================== Applovin Ads code start ==================================================//

  useEffect(() => {
    if(platform === "ios"){
      const initializeAppLovin = async () => {
        try {
          // AppLovinMAX.setTermsAndPrivacyPolicyFlowEnabled(true);
          // AppLovinMAX.setPrivacyPolicyUrl('https://your_company_name.com/privacy/'); // mandatory
          // AppLovinMAX.setTermsOfServiceUrl('https://your_company_name.com/terms/'); // optional
          // AppLovinMAX.setTestDeviceAdvertisingIds([]);
          AppLovinMAX.initialize(SDK_KEY)
          .then(config => {
            setIsInitializedApplovin(true);
            console.log('AppLovin SDK initialized successfully:', config);
            // You can also check the config object to ensure everything is set up correctly
          })
          .catch(error => {
            console.error('AppLovin SDK initialization failed:', error);
          });
        } catch (error) {
          console.error('AppLovin SDK initialization failed:', error);
        }
      };
      initializeAppLovin();
      const loadListeners = [
        InterstitialApplovinAd.addAdLoadedEventListener((adInfo) => {
          console.log('Interstitial ad loaded:', adInfo);
        }),
        InterstitialApplovinAd.addAdLoadFailedEventListener((errorInfo) => {
          console.error('Interstitial ad failed to load:', errorInfo);
          setLoading(false);
        }),
        InterstitialApplovinAd.addAdDisplayedEventListener((adInfo) => {
          console.log('Interstitial ad displayed:', adInfo);
        }),
        InterstitialApplovinAd.addAdClickedEventListener(() => {
          console.log('Interstitial ad clicked');
        }),
        InterstitialApplovinAd.addAdFailedToDisplayEventListener(() => {
          console.error('Interstitial ad failed to display');
          setLoading(false);
        }),
        InterstitialApplovinAd.addAdHiddenEventListener(() => {
          console.log('Interstitial ad hidden');
          setLoading(false);
        }),
        InterstitialApplovinAd.addAdRevenuePaidListener((adRevenueInfo) => {
          console.log('Interstitial ad revenue paid:', adRevenueInfo);
        }),
      ];
      // Clean up event listeners when the component is unmounted
      return () => {
        loadListeners.forEach(listener => listener?.remove());
      };
    }
  }, []);

  const showAppLovinAd = async () => {
    try {
      if(platform === "android") {
        console.log("hihihhihihihihi");
        
        setLoading(false);
        return
      }
      console.log("test app", InterstitialApplovinAd);
      const adUnitId = adUnitIds.applovinId;
      console.log("adUnitId", adUnitId);
      try {
          // const isLoaded = await AppLovinMAX.loadInterstitial(adUnitId);
          const isLoaded = InterstitialApplovinAd.loadAd(adUnitId);
          console.log("Interstitial loaded......", isLoaded);
          // if(!isInitializedApplovin){
          //   // setLoading(false);
          // }
          setTimeout(() => {
            showInterstitialAd()
          }, 500);
      } catch (error) {
          console.log("Failed to load interstitial:.....", error);
          setLoading(false);
      }

      const showInterstitialAd = async () => {
          // const isReady = await AppLovinMAX.isInterstitialReady(adUnitId);
          const isReady = await InterstitialApplovinAd.isAdReady(adUnitId);
          if (isReady) {
              setLoading(false);
              setTimeout(() => {
                // showInterstitialAd()
                // AppLovinMAX.showInterstitial(adUnitId, null, null);
                InterstitialApplovinAd.showAd(adUnitId);
              }, 500);
              console.log("Interstitial ad shown.");
          } else {
              setLoading(false);
              InterstitialApplovinAd.loadAd(adUnitId);
              console.log("Interstitial ad is not ready.");
          }
      };
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
      setLoading(false);
    }
  };

  
  // ====================================== Applovin Ads code end ==================================================//


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
            { backgroundColor: selectedItem === 'Myanmar Zodiac Signs' ? '#FFBABA' : 'transparent' }
          ]}
          onPress={() => {
            setSelectedItem('Myanmar Zodiac Signs');
            props.navigation.navigate('Myanmar Zodiac Signs');
            incrementAdCount();
          }}
        >
          <Image
            source={require('./assets/zodiac.png')}
            style={[
              styles.drawerItemImage,
              { tintColor: selectedItem === 'Myanmar Zodiac Signs' ? '#FF3030' : 'white' }
            ]}
          />
          <Text style={[        
            styles.drawerItemText,
            { color: selectedItem === 'Myanmar Zodiac Signs' ? '#FF3030' : 'white' }
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

//================================= bannnr ads show =======================================================//

const DrawerNavigation = ({apiDatas}) => {
  const bannerRef = useRef(null);
  const [bannerAdUnitId, setBannerAdUnitId] = useState(null);
  const [bannShow, setBannShow] = useState(true);
  const [bannunity, setBannunity] = useState(true);
  const [admobFailed, setAdmobFailed] = useState(false);
  const [isApplovinLoad, setIsApplovinLoad] = useState(false);
  const [unityAdsFailed, setUnityAdsFailed] = useState(false);
  const [showUnityBanner, setShowUnityBanner] = useState(false);
  const [responseData, setresponseData] = useState(null);
  const [langCalTypeButton, setLangCalTypeButton] = useState(false);

  const [isNativeUIBannerShowing, setIsNativeUIBannerShowing] = useState(false);
  const [statusText, setStatusText] = useState('Initializing SDK...');

  const [adsValue, setadsValue] = useState("");
  const { isConnected } = useContext(AdContext);
  const fadeAnim = useRef(new Animated.Value(0)).current;

    const Unityads = NativeModules.Unityads
    ? NativeModules.Unityads
    : 
    new Proxy(
      {
        addListener: () => {},
        removeListeners: () => {},
      },
      {
        get() {
          throw new Error('Linking error');
        },
      }
    );


//   useEffect(() => {
//     const fetchApiData = async () => {
//       try {
//         if (responseData) {
//           if (responseData?.ad_status === "1") {
//               setBannShow(true)
//             if (responseData?.admob_ads === "1") {
//               setupAdMobBanner(responseData);
//             } else {
//               // showUnityBannerFun();
//               setAdmobFailed(true)
//               setupAppLovinBanner()
//             }
//           }else{
//             setadsValue("");
//             setBannShow(false)
//           }
//         }else{
//           setBannShow(false)
//           setadsValue("");
//         }
//       } catch (error) {
//         console.log('Error fetching API data:', error);
//       }
//     };
//     fetchApiData();
//   }, [responseData]);

//   useEffect(() => {
//     const fetchApiData = async () => {
//       try {
//         const response = await axios.get(API_KEY);
//         const dataSet = response.data?.meta.ads;
//         setresponseData(dataSet);
//       } catch (error) {
//         console.log('Error fetching API data:', error);
//       }
//     };
//     fetchApiData();
//   }, [isConnected]);

//   const setupAdMobBanner = (data) => {
//     const adUnitId = Platform.OS === 'android'
//       ? data.android_adsid.admob_banner_unit_id 
//       : data.ios_adsid.admob_banner_unit_id;
//     setBannerAdUnitId(adUnitId);
//     setadsValue("admob");
//     setAdmobFailed(false);
//     setShowUnityBanner(false);
//   }; 

//   const handleAdFailedToLoad = () => {
//     console.log('AdMob banner failed to load, falling back to Unity Ads.');
//     setAdmobFailed(true);
//     // showUnityBannerFun();
//     setupAppLovinBanner()
//   };

//   const showUnityBannerFun = () => {
//     setBannShow(true)
//     setadsValue("unity");
//     const unityPlacementId = Platform.OS === 'android'
//       ? responseData?.android_adsid.unity_banner_placement_id 
//       : responseData?.ios_adsid.unity_banner_placement_id;
//       console.log("unityPlacementIdunityPlacementId", unityPlacementId);
//       if(unityPlacementId){
//         Unityads.loadBottomBanner(unityPlacementId);
//         setShowUnityBanner(true);
//       }
//   };

//   const unloadBottomBanner = () => {
//     if (Unityads && typeof Unityads?.unLoadBottomBanner === 'function') {
//       Unityads.unLoadBottomBanner(); // Call the unload method
//       setShowUnityBanner(false)
//       setUnityAdsFailed(true)
//       setBannShow(false)
//       // setadsValue("")
//       logStatus('Bottom banner ad unloaded....');
//     }
//   };

//   useEffect(() => {
//     if (Platform.OS === 'android') {
//       const bannerLoadListener = DeviceEventEmitter.addListener(
//          'bannerViewDidLoad',
//          (event) => {
//           //  setBannShow(true)
//           //  setadsValue("unity");
//            setShowUnityBanner(false)
//            setUnityAdsFailed(false)
//            console.log('Banner loaded successfully-----------:', event);
//          }
//        );
       
//        const bannerLeaveListener = DeviceEventEmitter.addListener('onBannerViewDidLeaveApplication', (event) => {
//          console.log('Banner failed to load:...onBannerViewDidLeaveApplication', event);
//          setBannShow(false)
//          setUnityAdsFailed(true)
//        });
  
//        const bannerClickListener = DeviceEventEmitter.addListener(
//         'onBannerViewDidClick',
//         (event) => {
//           console.log('Banner clicked:', event);
//         }
//       );
//        const bannerUnityAdsShowComplete = DeviceEventEmitter.addListener(
//         'onUnityAdsShowComplete',
//         (event) => {
//           console.log('onUnityAdsShowComplete', event);
//         }
//       );
//        const bannerErrorListener = DeviceEventEmitter.addListener('onBannerViewDidError', (event) => {
//          console.log('Banner failed to load:--------', event);
//           setUnityAdsFailed(true)
//           setBannShow(false)
//         //  setupAppLovinBanner();
//        });
//        return () => {
//         bannerLoadListener.remove();
//         bannerClickListener.remove();
//         bannerLeaveListener.remove();
//         bannerErrorListener.remove();
//         bannerUnityAdsShowComplete.remove();
//        };
//     }else{
//      const emitter = new NativeEventEmitter(Unityads);
//       const bannerLoadListener = emitter.addListener(
//         'bannerViewDidLoad',
//         (event) => {
//           console.log('Banner loaded successfully:', event);
//           setShowUnityBanner(false)
//           setUnityAdsFailed(false)
//           // Animated.timing(fadeAnim, {
//           //   toValue: 1,
//           //   duration: 500,
//           //   useNativeDriver: true,
//           // }).start();
//         }
//       );
//       const bannerLeaveListener = emitter.addListener('onBannerViewDidLeaveApplication', (event) => {
//         console.log('Banner failed to load:...onBannerViewDidLeaveApplication', event);
//        //  setadsValue("")
//         setBannShow(false)
//        //  setupAppLovinBanner();
//        setUnityAdsFailed(true)
//       });
//       const bannerClickListener = emitter.addListener(
//         'onBannerViewDidClick',
//         (event) => {
//           console.log('Banner clicked:', event);
//         }
//       );
//        const bannerUnityAdsShowComplete = emitter.addListener(
//         'onUnityAdsShowComplete',
//         (event) => {
//           console.log('onUnityAdsShowComplete', event);
//         }
//       );
  
//        const bannerErrorListener = emitter.addListener('onBannerViewDidError', (event) => {
//          console.log('Banner failed to load:--------', event);
//           setUnityAdsFailed(true)
//           setBannShow(false)
//         //  setupAppLovinBanner();
//        });
//       return () => {
//         bannerLoadListener.remove();
//         bannerLeaveListener.remove();
//         bannerClickListener.remove();
//         bannerUnityAdsShowComplete.remove();
//         bannerErrorListener.remove();
//       };
//     }
//    }, [responseData])

//    useEffect(() => {
//     if(Platform.OS === 'ios'){
//       applovinBenner.addAdLoadedEventListener((adInfo) => {
//         console.log('Banner ad loaded from ' + adInfo.networkName);
//         if(adInfo.networkName){
//             setIsApplovinLoad(true)
//         }
//       });
//       applovinBenner.addAdLoadFailedEventListener((errorInfo) => {
//           console.log('Applovin Banner ad failed to load with error code ' + errorInfo.code + ' and message: ' + errorInfo.message);
//           setIsApplovinLoad(true)
//           showUnityBannerFun();
//       });
//       applovinBenner.addAdClickedEventListener((/* adInfo: AdInfo */) => {
//           console.log('Banner ad clicked');
//       });
//       applovinBenner.addAdExpandedEventListener((/* adInfo: AdInfo */) => {
//           console.log('Banner ad expanded');
//       });
//       applovinBenner.addAdCollapsedEventListener((/* adInfo: AdInfo */) => {
//           console.log('Banner ad collapsed');
//       });
//       applovinBenner.addAdRevenuePaidListener((adInfo) => {
//           console.log('Banner ad revenue paid: ' + adInfo.revenue);
//       });
//     }
// }, [responseData]);

//   const setupAppLovinBanner = () => {
//     console.log("testtest");
//     if(Platform.OS === 'ios'){
//       console.log("unityPlacementId-798", responseData);
//       setadsValue("applovin");
//       const adUnitId = Platform.OS === 'android'
//       ? responseData?.android_adsid.applovin_banner_unit_id 
//       : responseData?.ios_adsid.applovin_banner_unit_id;
    
//       applovinBenner.createAd(adUnitId, AdViewPosition.BOTTOM_CENTER, 10, 0);
//       console.log("adUnitId", adUnitId);
      
//       applovinBenner.showAd(adUnitId);
//       console.log('AppLovin banner ad loaded');
//     }else{
//       console.log("unityPlacementId---", responseData);
//       showUnityBannerFun();
//     }
//   }; 

//   useEffect(() => {
//     if (bannunity && bannShow) {
//       if (adsValue == "unity" && admobFailed) {
//         console.log("check dtgdgfdffdf"); 
//         showUnityBannerFun()
//       }else if(adsValue == "applovin" && admobFailed){
//         setupAppLovinBanner();
//       }
//     } else {
//       if (adsValue == "unity") {
//         console.log("check-------------------------------------------------");
        
//         unloadBottomBanner()
//       }else if(adsValue == "applovin"){
//         const adUnitId = Platform.OS === 'android'
//           ? responseData.android_adsid.applovin_banner_unit_id
//           : responseData.ios_adsid.applovin_banner_unit_id;
//         applovinBenner.hideAd(adUnitId);
//         // applovinBenner.destroyAd(adUnitId);
//       }
//     }
//   }, [bannunity]);


//   function logStatus(status) {
//     console.log(status);
//     setStatusText(status);
//   }

  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#FFBABA" />
      <Drawer.Navigator
        drawerContent={(props) => (
          <CustomDrawerContent
            {...props}
            setBannShow={setBannShow}
            setBannunity={setBannunity}
            unityAdsFailed={unityAdsFailed}
            setLangCalTypeButton={setLangCalTypeButton}
            apiDatas={apiDatas}
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
        <Drawer.Screen name="Myanmar Zodiac Signs" component={MyanmarZodiacSigns} />
      </Drawer.Navigator>

      {
      // (bannShow && responseData?.ad_status === "1") ? (
      //   <View style={adsValue === "admob" ? styles.adContainer : (adsValue === "unity" ? styles.unityadContainer : styles.noadsContainer)}>
      //     {console.log("adsValue", adsValue)
      //     }
      //     {
      //       adsValue === "admob" ?
      //         <Text style={{ color: 'black', fontSize: 16, marginBottom: 10 }}>Advertisement</Text>
      //         : (
      //           adsValue === "unity" ?
      //             <Text style={{ color: 'black', fontSize: 16, marginBottom: 15 }}>Advertisement</Text>
      //             :
      //               (
      //                 adsValue === "applovin" ?
      //                   <Text style={{ color: 'black', fontSize: 16, marginBottom: 1, marginTop: 5 }}>Advertisements</Text>
      //                   :
      //                   ""
      //               )
      //         )
      //     }

      //     {
      //       adsValue === "unity" && (
      //         !isNativeUIBannerShowing && (
      //           <View style={{ position: 'absolute', top: 50, alignSelf: 'center'}}>
      //             <Text style={{ color: 'black', fontSize:16 }}>Loading...</Text>
      //           </View>
      //         )
      //       )
      //     }
      //     {
      //       console.log("admobFailed", admobFailed, bannerAdUnitId)
      //     }
      //     {/* // {(bannerAdUnitId) && ( */}
      //     {(!admobFailed && bannerAdUnitId) && (
      //       <>
      //         {
      //           adsValue === "admob" && (
      //             <View style={{ position: 'absolute', top: 60, alignSelf: 'center' }}>
      //               <Text style={{ color: 'black', fontSize: 16 }}>Loading...</Text>
      //             </View>
      //           )
      //         }
      //         <BannerAd
      //           unitId={bannerAdUnitId}
      //           size={BannerAdSize.LARGE_BANNER}
      //           onAdFailedToLoad={handleAdFailedToLoad}
      //           // onAdLoaded={handleAdLoaded}
      //           ref={bannerRef}
      //         />
      //       </>
      //     )}

      //     {
      //       adsValue === "applovin" && (
      //         !isApplovinLoad && (
      //           <View style={{ position: 'absolute', top: 50, alignSelf: 'center'}}>
      //             <Text style={{ color: 'black', fontSize:16 }}>Loading...</Text>
      //           </View>
      //         )
      //       )
      //     }
      //   </View>
      // ) : null
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
    marginBottom: 10,
    backgroundColor: 'white',
    height: 100,
  },
  noadsContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    height: 100,
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