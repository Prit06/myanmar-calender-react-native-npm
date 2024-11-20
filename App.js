import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DrawerNavigation from './src/DrawerNavigation';
import SplashScreen from 'react-native-splash-screen';
import { AdProvider } from './src/adsContext';
import axios from 'axios';
import Model from './src/Model';
import DeviceInfo from 'react-native-device-info';
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
const App = () => {
    const [versionModel, setVersionModel] = useState(false);
    const [appVersion, setAppVersion] = useState("");
    const [adClosed, setAdClosed] = useState(false);
    const [adShow, setAdShow] = useState(false);
    const [isAdLoaded, setIsAdLoaded] = useState(false);
    const [isAdsFailed, setIsAdsFailed] = useState(false);
    const [apiData, setApiData] = useState("");
    const [exitModel, setExitModel] = useState(false);
    const [isConnected, setIsConnected] = useState(true); // For offline modal
    const [showOfflineModal, setShowOfflineModal] = useState(false); // State to manage offline modal
    const [isInitializedApplovin, setIsInitializedApplovin] = useState(false);

    useEffect(() => {
        // Monitor network connection
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
            if (state.isConnected) {
                setShowOfflineModal(false);
                fetchApiData();
                // SplashScreen.hide();
            } else {
                setShowOfflineModal(true);
                return
            }
        });

        return () => {
            unsubscribe();
        };
    }, [isConnected]);

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
        if (isAdsFailed && apiData) {
        // if (apiData) {
        if(Platform.OS == "ios"){
            const initializeAppLovin = async () => {
                try {
                    AppLovinMAX.initialize('iTwh_UVXAifQEJI0VaSCck97B9evnrT9g7Epl7OEtIRgVROTh5pFoGDiVGdWPasG1Knys15HQLeVriCHP_1WA6')
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

    useEffect(()=>{
        const loadListeners = [
            applovinAppOpenAd.addAdLoadedEventListener((adInfo) => {
                 console.log('applovinAppOpenAd ad loaded:', adInfo);
                //     if (nextAppState === 'active') {
                console.log("applovinAppOpenAd.isAdReady(apiData.ios_adsid.applovin_app_open_unit_id)", apiData.ios_adsid.applovin_app_open_unit_id);
                console.log("applovinAppOpenAd.isAdReady(apiData.ios_adsid.applovin_app_open_unit_id)", applovinAppOpenAd.isAdReady(apiData.ios_adsid.applovin_app_open_unit_id));
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

    const fetchApiData = async () => {
        try {
            const response = await axios.get(API_KEY);
            // const response = await axios.get('https://myanmarcalendar.com/myanmar_caladsapi.json');

            const adsData = response.data?.meta?.ads;
            setApiData(adsData);
            setAppVersion(adsData?.update);
            if (!adFunLoad) {
                loadAppOpenAd(adsData);
            }
        } catch (error) {
            console.error('Error fetching API data:', error);
            SplashScreen.hide();
        }
    };

    const loadAppOpenAd = (adsData) => {
        return setIsAdsFailed(true)
        if (adsData?.ad_status === "0" || adsData?.admob_ads === "0") setIsAdsFailed(true)
        if (adsData?.ad_status === "1" && adsData?.admob_ads === "1") {
            const appOpenAd = AppOpenAd.createForAdRequest(adsData.android_adsid.admob_app_open_unit_id, {
                requestNonPersonalizedAdsOnly: true,
            });
            adFunLoad = true
            appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
                setIsAdLoaded(true);
                adsShowFun()
                SplashScreen.hide();
            });

            appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
                setAdClosed(true);
                SplashScreen.hide();
                checkAppVersion(adsData?.update, adsData?.update_on);
            });

            appOpenAd.addAdEventListener(AdEventType.ERROR, () => {
                SplashScreen.hide();
                setIsAdsFailed(true);
            });

            appOpenAd.load();
            function adsShowFun() {
                if (adFunLoad) {
                    appOpenAd.show();
                }
                setAdShow(true)
                // setIsAdLoaded(true);
            }
            setTimeout(() => {
                if (!isAdLoaded) {
                    SplashScreen.hide();
                }
            }, 3000);
        } else {
            SplashScreen.hide();
        }
    };

    const applovinAddOpen = () => {
        try {
            
        } catch (error) {
            console.log("error", error);
            
        }
    }

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
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AdProvider isConnected={isConnected}>
                <DrawerNavigation />
                {versionModel && <Model versionmodel={versionModel} setversionmodel={handleModalClose} />}
                {exitModel && <Exitmodel onConfirm={handleExitConfirm} onCancel={handleExitCancel} />}

                {/* /* Offline Modal */}
                <Modal animationType="fade" transparent={true} visible={showOfflineModal}>

                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.titleText}>Ooops!</Text>
                            <Text style={styles.messageText}>No Internet Connection found. Check your connection.</Text>

                            {/* Try Again Button */}
                            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16, }}>RETRY</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

            </AdProvider>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    
    modalView: {
        width: width * 0.8,  // 80% of the screen width
        // height: height * 0.2, // 20% of the screen height
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
    },

    titleText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    messageText: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 20,
    },
    retryButton: {
        width: '100%',
        backgroundColor: '#FF3030',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
    },

});

export default App;