import React, { useContext, useEffect, useState } from 'react';
import DrawerNavigation from './src/DrawerNavigation';
import SplashScreen from 'react-native-splash-screen';
import { AdContext, AdProvider } from './src/adsContext';
import axios from 'axios';
import Model from './src/Model';
import DeviceInfo from 'react-native-device-info'
import { AppOpenAd, AdEventType } from 'react-native-google-mobile-ads';
import { BackHandler, Modal, View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Exitmodel from './src/Exitmodel';
import NetInfo from '@react-native-community/netinfo';
import RNExitApp from 'react-native-exit-app';
import { API_KEY } from '@env';
import AppLovinMAX, { AppOpenAd as applovinAppOpenAd, AdViewPosition } from 'react-native-applovin-max';
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');


var adFunLoad = false
const AppContainer = ({showOfflineModal, apiDatas}) => {
  const [versionModel, setVersionModel] = useState(false);
  const [appVersion, setAppVersion] = useState("");
  const [adClosed, setAdClosed] = useState(false);
  const [adShow, setAdShow] = useState(false);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isAdsFailed, setIsAdsFailed] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [exitModel, setExitModel] = useState(false);
  const [isConnected, setIsConnected] = useState(true); // For offline modal
  const [isInitializedApplovin, setIsInitializedApplovin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

 // var adFunLoad = false
  useEffect(() => {
      // fetchApiData();
      console.log("contextData.apiData", apiDatas);
      if (apiDatas) {
        const adsData = apiDatas?.meta?.ads;
        setApiData(adsData);
        setAppVersion(adsData?.update);
        console.log("fffff")
        if (!adFunLoad) {
          loadAppOpenAd(adsData)
        }
        setIsLoading(false);
      }else{
        setIsLoading(true);
      }
  }, [apiDatas]);

  useEffect(() => {
      const backAction = () => {
          if (exitModel) {
              setExitModel(false);
              return true;
          } else {
              setExitModel(true);
              return true;
          }
      };
      const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => {
          backHandler.remove();
      };
  }, [exitModel]);

  useEffect(() => {
    console.log("isAdsFailed", isAdsFailed);
    console.log("apiData", apiData);
    
      if (isAdsFailed && apiData) {
        if(Platform.OS == "ios"){
            const initializeAppLovin = async () => {
                try {
                    AppLovinMAX.initialize(SDK_KEY)
                    .then(config => {
                        setIsInitializedApplovin(true);
                        console.log('AppLovin SDK initialized successfully:', config);
                        applovinAppOpenAd.loadAd(apiData.ios_adsid.applovin_app_open_unit_id);
                    })
                    .catch(error => {
                    console.error('AppLovin SDK initialization failed:', error);
                    });
                } catch (error) {
                    console.error('AppLovin SDK initialization failed:', error);
                }
            };
            initializeAppLovin();
        }
        if(Platform.OS == "android"){
            checkAppVersion(appVersion, apiData?.update_on);
        }
      }
  }, [isAdsFailed, apiData]);

  const loadAppOpenAd = (adsData) => {
    console.log("adsDataadsData", adsData);
      // return setIsAdsFailed(true)
      if (adsData?.ad_status === "0" || adsData?.admob_ads === "0"){
          setIsAdsFailed(true)
      } 
      if (adsData?.ad_status === "1" && adsData?.admob_ads === "1") {
          const appOpenAd = AppOpenAd.createForAdRequest(adsData.android_adsid.admob_app_open_unit_id, {
              requestNonPersonalizedAdsOnly: true,
          });
  
          appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
              setIsAdLoaded(true);
              adFunLoad = true
              appOpenAd.show();
          });
  
          appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
              setAdClosed(true);
              adFunLoad = true
              checkAppVersion(adsData?.update, adsData?.update_on);
          });
  
          appOpenAd.addAdEventListener(AdEventType.ERROR, () => {
              setIsAdsFailed(true);  // Trigger fallback on error
          });
  
          appOpenAd.load();
      } else {
          // Skip AdMob ad loading if it's not enabled
          SplashScreen.hide();
      }
  };


  useEffect(()=>{
      const loadListeners = [
          applovinAppOpenAd.addAdLoadedEventListener((adInfo) => {
              //     if (nextAppState === 'active') {
              if(apiData){
                  if (applovinAppOpenAd.isAdReady(apiData.ios_adsid.applovin_app_open_unit_id)) {
                  console.log("asdasdoasoa show");
                  
                  applovinAppOpenAd.showAd(apiData.ios_adsid.applovin_app_open_unit_id);
                  } else {
                  // Preload the App Open Ad again
                  applovinAppOpenAd.loadAd(apiData.ios_adsid.applovin_app_open_unit_id);
                  }
              }
          }),
          applovinAppOpenAd.addAdLoadFailedEventListener((errorInfo) => {
            console.error('applovinAppOpenAd ad failed to load:', errorInfo);
            checkAppVersion(appVersion, apiData?.update_on);
          //   setLoading(false);
          }),
          applovinAppOpenAd.addAdDisplayedEventListener((adInfo) => {
            console.log('applovinAppOpenAd ad displayed:', adInfo);
          }),
          applovinAppOpenAd.addAdClickedEventListener(() => {
            console.log('applovinAppOpenAd ad clicked');
          }),
          applovinAppOpenAd.addAdFailedToDisplayEventListener(() => {
            console.error('applovinAppOpenAd ad failed to display');
            checkAppVersion(appVersion, apiData?.update_on);
          //   setLoading(false);
          }),
          applovinAppOpenAd.addAdHiddenEventListener(() => {
            console.log('applovinAppOpenAd ad hidden');
            checkAppVersion(appVersion, apiData?.update_on);
          //   setLoading(false);
          }),
          applovinAppOpenAd.addAdRevenuePaidListener((adRevenueInfo) => {
            console.log('applovinAppOpenAd ad revenue paid:', adRevenueInfo);
          }),
        ];
        // Clean up event listeners when the component is unmounted
        return () => {
          loadListeners.forEach(listener => listener?.remove());
        };
  }, [isAdsFailed, apiData])


  const checkAppVersion = async (latestVersion, update_on) => {
      const version = await DeviceInfo.getVersion();
      if (version < latestVersion && update_on === 1) {
          setVersionModel(true);
      }
  };

  const handleModalClose = () => {
      setVersionModel(false);
  };

  const handleExitConfirm = () => {
      setExitModel(false);
      BackHandler.exitApp();
      RNExitApp.exitApp();
  };

  const handleExitCancel = () => {
      setExitModel(false);
  };

  const handleRetry = () => {
      NetInfo.fetch().then(state => {
          setIsConnected(state.isConnected);
      });
  };
  return (
    <>
      <DrawerNavigation apiDatas={apiDatas}/>
      {versionModel && <Model versionmodel={versionModel} setversionmodel={handleModalClose} />}
      {exitModel && <Exitmodel onConfirm={handleExitConfirm} onCancel={handleExitCancel} />}

      {/* /* Offline Modal */}
    </>
  );
};

export default AppContainer;



