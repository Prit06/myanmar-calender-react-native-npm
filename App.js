

// import React, { useEffect, useState } from 'react';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import DrawerNavigation from './src/DrawerNavigation';
// import SplashScreen from 'react-native-splash-screen';
// import { AdProvider } from './src/adsContext';
// import axios from 'axios';
// import Model from './src/Model';
// import DeviceInfo from 'react-native-device-info';
// import { AppOpenAd, AdEventType } from 'react-native-google-mobile-ads';

// const App = () => {
//     const [versionModel, setVersionModel] = useState(false);
//     const [appVersion, setAppVersion] = useState("");
//     const [adClosed, setAdClosed] = useState(false);


//     useEffect(() => {
//       // Show splash screen for 1000ms (1 second)
//       fetchApiData(); // Fetch API data after splash screen
//         const splashTimer = setTimeout(() => {
//             SplashScreen.hide(); // Hide splash screen
//         }, 1000);

//         return () => clearTimeout(splashTimer); // Clean up the timer
//     }, []);

//     const fetchApiData = async () => {
//         try {
//             const response = await axios.get('https://atharvainfinity.com/atharvainfinity/ios/calendar/myanmar/myanmar_caladsapi.json');
//             const adsData = response.data?.meta?.ads;

//             // Store the ad configuration dynamically
//             setAppVersion(adsData?.update);
//             loadAppOpenAd(adsData); // Load ad after fetching API data
//         } catch (error) {
//             console.error('Error fetching API data:', error);
//         }
//     };

//     const checkAppVersion = async (latestVersion) => {
//         const version = await DeviceInfo.getVersion();
//         console.log("Current version:", version);
//         console.log("API version:", latestVersion);
//         if (version < latestVersion) { // Correct comparison for version check
//             setVersionModel(true); // Show update modal if the version is outdated
//         }
//     };

//     const loadAppOpenAd = (adsData) => {
//         if (adsData?.ad_status === "1" && adsData?.admob_ads === "1") {
//             const appOpenAd = AppOpenAd.createForAdRequest(adsData.android_adsid.admob_app_open_unit_id, {
//                 requestNonPersonalizedAdsOnly: true,
//             });

//             // Set up event listeners for the ad
//             appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
//                 // Show the ad once it's loaded
//                 appOpenAd.show();
//             });

//             // Handle when the ad is closed
//             appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
//                 setAdClosed(true); // Mark ad as closed
//                 checkAppVersion(appVersion); // Check app version after ad is closed
//             });

//             // Load the ad
//             appOpenAd.load();
//         }
//     };

//     useEffect(() => {
//         if (adClosed) {
//             checkAppVersion(appVersion); // Check app version only if ad was closed
//         }
//     }, [adClosed, appVersion]);

//     const handleModalClose = () => {
//         setVersionModel(false); // Hide the version update modal
//     };

//     return (
//         <GestureHandlerRootView style={{ flex: 1 }}>
//             <AdProvider>
//                 <DrawerNavigation />
//                 {/* Show version update modal if needed */}
//                 {versionModel && <Model versionmodel={versionModel} setversionmodel={handleModalClose} />}
//             </AdProvider>
//         </GestureHandlerRootView>
//     );
// };

// export default App;










import React, { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import DrawerNavigation from './src/DrawerNavigation';
import SplashScreen from 'react-native-splash-screen';
import { AdProvider } from './src/adsContext';
import axios from 'axios';
import Model from './src/Model';
import DeviceInfo from 'react-native-device-info';
import { AppOpenAd, AdEventType } from 'react-native-google-mobile-ads';

const App = () => {
    const [versionModel, setVersionModel] = useState(false);
    const [appVersion, setAppVersion] = useState("");
    const [adClosed, setAdClosed] = useState(false);
    const [isAdLoaded, setIsAdLoaded] = useState(false); // Track if the ad has been loaded
    const [isAdsFailed, setIsAdsFailed] = useState(false); // Track if the ad has been loaded
    const [apiData, setApiData] = useState("");

    useEffect(() => {
        fetchApiData(); // Fetch API data and load the ad
    }, []);

    useEffect(() => {
        if (isAdsFailed && apiData) {
            checkAppVersion(appVersion);
        }
    }, [isAdsFailed, apiData]);

    const fetchApiData = async () => {
        try {
            const response = await axios.get('https://atharvainfinity.com/atharvainfinity/ios/calendar/myanmar/myanmar_caladsapi.json');
            // const response = await axios.get('https://myanmarcalendar.com/myanmar_caladsapi.json', {});
            const adsData = response.data?.meta?.ads;
            setApiData(adsData);
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
                checkAppVersion(adsData?.update); // Check app version after ad is closed
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

    const checkAppVersion = async (latestVersion) => {
        const version = await DeviceInfo.getVersion();
        console.log("apiData.update_on", apiData.update_on);
        
        if (version < latestVersion && apiData.update_on === 1) {
            setVersionModel(true); // Show update modal if the version is outdated
        }
    };

    const handleModalClose = () => {
        setVersionModel(false); // Hide the version update modal
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AdProvider>
                <DrawerNavigation />
                {/* Show version update modal if needed */}
                {versionModel && <Model versionmodel={versionModel} setversionmodel={handleModalClose} />}
            </AdProvider>
        </GestureHandlerRootView>
    );
};

export default App;



