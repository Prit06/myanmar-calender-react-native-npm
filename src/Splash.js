import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Image,Dimensions  } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import NetInfo from "@react-native-community/netinfo";
import maynmarimg from "./assets/mayanmarcalendar.png";
import { API_KEY } from "@env";
import { AdContext, AdProvider } from "./adsContext";
import App from "../App";
import NetworkModel from "./Networkmodel";                                                
import axios from 'axios';
const { width, height } = Dimensions.get('window');
var adFunLoad = false

const Splash = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const { setApiDataFun, apiData } = useContext(AdContext);

  useEffect(() => {
   console.log("dfdfdfdfddfd");
   
  }, []);


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    if (isConnected) {
      setTimeout(() => {
        fetchApiData()
      }, 500); // Wait for 2 seconds (Splash screen timeout)
    }
  }, [isConnected]);

  // useEffect(() => {
  //   fetchApiData
  // }, []);

  const fetchApiData = async () => {
    try {
      setTimeout(() => {
        console.log("API Key:",  API_KEY );
        // Replace this with your actual API call
        axios 
        .get(API_KEY)
        .then((response) => {
          console.log("responseresponseresponseresponseresponseresponse", response.data);
          
          setData(response.data); // Access data from the Axios response
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data with Axios:", error);
          setIsLoading(false);
        });
      }, 500); // Wait for 2 seconds (Splash screen timeout)
    } catch (error) {
      console.error('Error fetching API data:', error);
    }
  };

  useEffect(() => {
    if (!isLoading && data) {
      console.log("data", data);
      setApiDataFun(data);
    }
  }, [isLoading, data]);


  const handleRetry = () => {
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected);
    });
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {apiData ? (
        <App apiData={apiData}/>
      ) : (
        <View style={styles.container}>
          <Image source={maynmarimg} style={{ width: width * 0.8, height: height * 0.4, }}/>
        </View>
      )}
      <NetworkModel isConnected={isConnected} handleRetry={handleRetry} />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Splash;