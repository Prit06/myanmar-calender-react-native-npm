import React, { useContext, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Splash from './src/Splash';
import { AdContext, AdProvider } from './src/adsContext';
import NetInfo from '@react-native-community/netinfo';
import { API_KEY } from '@env';
import AppContainer from './AppContainer';
import { SafeAreaView, StyleSheet } from 'react-native';

var adFunLoad = false
const App = ({apiData}) => {
    const [appVersion, setAppVersion] = useState("");
    const [isConnected, setIsConnected] = useState(true); // For offline modal
    const [showOfflineModal, setShowOfflineModal] = useState(false); // State to manage offline modal
    // const {apiData} = useContext(AdContext);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
            if (state.isConnected) {
                setShowOfflineModal(false);
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
        // console.log("apiData---------", apiData);
    }, [apiData]);

    return (
        <>
            {/* <GestureHandlerRootView style={{ flex: 1 }}> */}
            <AdProvider isConnected={isConnected}>
                <SafeAreaView style={styles.container}>
                        <AppContainer showOfflineModal={showOfflineModal} apiDatas={apiData}/>
                </SafeAreaView>
            </AdProvider>
            {/* </GestureHandlerRootView> */}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFBABA',
    },
  });

export default App;