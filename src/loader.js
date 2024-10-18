// import React from 'react';
// import { View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';

// const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

// const Loader = ({isMainScreen}) => {
//   // console.log("is" , isMainScreen)
//     return (
//         <>
//         {
//             isMainScreen ? 
//             <View style={styles.container}>
//                 <ActivityIndicator size="large" color="#0000ff" />
//             </View>
//             : 
//             <View style={styles.container}>
//                 <ActivityIndicator size="large" color="#0000ff" />
//             </View>
//         }
//         </>
//     );
// };


// const styles = StyleSheet.create({
//   containerMain: {
//     height:"100%",
//     // flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: "absolute",
//     zIndex: 900,
//     backgroundColor: "pink", // Set pink background for main screen
// },
//   container: {
//     width: '15%',            // Set the width to 15% of the screen width
//     aspectRatio: 1,          // Maintain a square shape (width and height are equal)
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 20,        // Rounded edges
//     padding: 20,
//     backgroundColor: 'white',// Background for the loader
//     zIndex: 1000,
//   },





// });

// export default Loader;












































import React from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const Loader = ({isMainScreen}) => {
    return (
        <View style={isMainScreen ? styles.containerMain : styles.containerOverlay}>
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,                  // Take full screen
    justifyContent: 'center',  // Center vertically
    alignItems: 'center',      // Center horizontally  
    zIndex: 900,
  },
  containerOverlay: {
    position: 'absolute',      // Overlay on top of other components
    width: screenWidth,
    height: screenHeight,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    zIndex: 1000,
  },
  loaderContainer: {
    width: '15%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    padding: 20,
    backgroundColor: 'white',  // Background for the loader
  },
});

export default Loader;
