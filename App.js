
import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DrawerNavigation from './src/DrawerNavigation';
import SplashScreen from 'react-native-splash-screen';
import { AdProvider } from './src/adsContext';
import axios from 'axios';
import Model from './src/Model';
import DeviceInfo from 'react-native-device-info';
import { AppOpenAd, AdEventType } from 'react-native-google-mobile-ads';
import { BackHandler } from 'react-native';
import Exitmodel from './src/Exitmodel';

const App = () => {
    const [versionModel, setVersionModel] = useState(false);
    const [appVersion, setAppVersion] = useState("");
    const [adClosed, setAdClosed] = useState(false);
    const [isAdLoaded, setIsAdLoaded] = useState(false); // Track if the ad has been loaded
    const [isAdsFailed, setIsAdsFailed] = useState(false); // Track if the ad has been loaded
    const [apiData, setApiData] = useState("");
    const [exitModel, setExitModel] = useState(false);

    useEffect(() => {
        fetchApiData(); // Fetch API data and load the ad

        const backAction = () => {
            if (exitModel) {
                // If the exit confirmation modal is visible, close it
                setExitModel(false);
                return true; // Prevent default back button behavior
            } else {
                // Show exit confirmation modal
                setExitModel(true);
                return true; // Prevent default back button behavior
            }
        };

        // Add event listener for back button press
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

        return () => {
            backHandler.remove(); // Cleanup the event listener when component unmounts
        };
    }, [exitModel]);

    useEffect(() => {
        if (isAdsFailed && apiData) {
            checkAppVersion(appVersion, apiData?.update_on);
        }
    }, [isAdsFailed, apiData]);

    const fetchApiData = async () => {
        try {
            // const response = await axios.get('https://atharvainfinity.com/atharvainfinity/ios/calendar/myanmar/myanmar_caladsapi.json');
            const response = await axios.get('https://myanmarcalendar.com/myanmar_caladsapi.json', {});
            const adsData = response.data?.meta?.ads;
            setApiData(adsData?.update_on);
            // Store the ad configuration dynamically
            setAppVersion(adsData?.update);
            loadAppOpenAd(adsData); // Load ad after fetching API data
            // checkAppVersion(adsData?.update);

        } catch (error) {
            console.error('Error fetching API data:', error);
            SplashScreen.hide(); // Hide splash screen if there's an error
        }
    };

    const loadAppOpenAd = (adsData) => {
        if (adsData?.ad_status === "0" || adsData?.admob_ads === "0") setIsAdsFailed(true)
        if (adsData?.ad_status === "1" && adsData?.admob_ads === "1") {
            const appOpenAd = AppOpenAd.createForAdRequest(adsData.android_adsid.admob_app_open_unit_id, {
                requestNonPersonalizedAdsOnly: true,
            });

            appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
                setIsAdLoaded(true);
                appOpenAd.show(); // Show the ad once it's loaded
                SplashScreen.hide();
            });

            appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
                setAdClosed(true); // Mark ad as closed
                SplashScreen.hide(); // Hide the splash screen after the ad is closed
                checkAppVersion(adsData?.update, adsData?.update_on); // Check app version after ad is closed
            });

            // Handle ad load failure
            appOpenAd.addAdEventListener(AdEventType.ERROR, () => {
                SplashScreen.hide(); // Hide the splash screen if ad fails to load
                setIsAdsFailed(true)
            });

            // Load the ad
            appOpenAd.load();

            // Fallback in case the ad takes too long to load (e.g., 3 seconds timeout)
            setTimeout(() => {
                if (!isAdLoaded) {
                    SplashScreen.hide(); // Hide the splash screen if ad hasn't loaded within 3 seconds
                }
            }, 3000); // 3-second fallback
        } else {
            // If ads are disabled or not available, hide the splash screen
            SplashScreen.hide();
        }
    };

    const checkAppVersion = async (latestVersion, update_on) => {
        const version = await DeviceInfo.getVersion();
        console.log("Current version:", version);
        console.log("Latest version:", latestVersion);
        console.log("apiData.update_on", update_on);
        
        if (version < latestVersion && update_on === 1) {
            setVersionModel(true); // Show update modal if the version is outdated
        }
    };

    const handleModalClose = () => {
        setVersionModel(false); // Hide the version update modal
    };

    const handleExitConfirm = () => {
        // Implement the logic to exit the app
        BackHandler.exitApp(); // This will close the app
    };

    const handleExitCancel = () => {
        setExitModel(false);
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AdProvider>
                <DrawerNavigation />
                {/* Show version update modal if needed */}
                {versionModel && <Model versionmodel={versionModel} setversionmodel={handleModalClose} />}
                {exitModel && <Exitmodel onConfirm={handleExitConfirm} onCancel={handleExitCancel} />}
            </AdProvider>
        </GestureHandlerRootView>
    );
};

export default App;



