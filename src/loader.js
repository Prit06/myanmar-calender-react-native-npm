import React from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const Loader = ({isMainScreen}) => {
  // console.log("is" , isMainScreen)
    return (
        <>
        {
            isMainScreen ? 
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
            : 
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        }
        </>
    );
};


const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: "absolute",
    zIndex: 900,
    height: screenHeight,  // Full screen height
    width: screenWidth,    // Full screen width
    // backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: "absolute",
    zIndex: 900,
    height: screenHeight, // 50% of screen height
    width: screenWidth,         // Full screen width
    // backgroundColor: "#fff",
    // opacity: 0.5,
  },
});

export default Loader;
