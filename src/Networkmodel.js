
// import React from "react";
// import { Modal, StyleSheet, View, Text, Dimensions } from "react-native"; // Import Text component
// import { TouchableOpacity } from "react-native-gesture-handler"; // Import TouchableOpacity for buttons

// const { width } = Dimensions.get('window');

// const NetworkModel = ({ isConnected, handleRetry }) => {
//     return (
//         <Modal animationType="fade" transparent={true} visible={!isConnected}> {/* Show modal only when internet is off */}
//             <View style={styles.centeredView}>
//                 <View style={styles.modalView}>
//                     <Text style={styles.titleText}>Ooops!</Text>  {/* Wrap text in <Text> */}
//                     <Text style={styles.messageText}>
//                         {!isConnected ? "No Internet Connection found. Check your connection." : "Fetching data..."}
//                     </Text> {/* Wrap message in <Text> */}

//                     {/* Retry Button */}
//                     <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
//                         <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
//                             RETRY
//                         </Text>  {/* Retry text inside <Text> */}
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         </Modal>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     centeredView: {
//         position: 'absolute', // Position at the top of the screen
//         top: 0,
//         left: 0,
//         right: 0,
//         paddingTop: 50, // Add some padding to push it down from the top
//         justifyContent: 'flex-start',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background dimming effect
//     },

//     modalView: {
//         width: width * 0.8, // 80% of the screen width
//         backgroundColor: 'white',
//         borderRadius: 10,
//         padding: 15,
//         alignItems: 'center',
//     },

//     titleText: {
//         fontSize: 25,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 10,
//     },
//     messageText: {
//         fontSize: 16,
//         textAlign: 'center',
//         color: '#666',
//         marginBottom: 20,
//     },
//     retryButton: {
//         width: '100%',
//         backgroundColor: '#FF3030',
//         padding: 12,
//         borderRadius: 5,
//         alignItems: 'center',
//     },
// });

// export default NetworkModel;






import React from "react";
import { Modal, StyleSheet, View, Text, Dimensions, TouchableOpacity } from "react-native";
const { width } = Dimensions.get("window");
import NetInfo from "@react-native-community/netinfo";

const NetworkModel = ({ isConnected, handleRetry }) => {
    
    const handleRetrys = () => {
        console.log("hiiiiiiii");
        NetInfo.fetch().then((state) => {
          setIsConnected(state.isConnected);
        });
      };
  return (
    <Modal animationType="fade" transparent={true} visible={!isConnected}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.titleText}>Ooops!</Text>
          <Text style={styles.messageText}>
            No Internet Connection found. Check your connection.
          </Text>

          {/* Retry Button */}
          <TouchableOpacity style={styles.retryButton} onPress={() => handleRetrys()}>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              RETRY
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalView: {
    width: width * 0.8, // 80% of the screen width
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },

  titleText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  retryButton: {
    width: "100%",
    backgroundColor: "#FF3030",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
});

export default NetworkModel;
