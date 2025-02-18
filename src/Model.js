import React, { useState, useEffect } from 'react';
import { Modal, Text, View, TouchableOpacity, StyleSheet, Linking, BackHandler } from 'react-native';



const Model = (props) => {


  useEffect(() => {
    // Add event listener for back button when the modal is visible
    if (props.versionmodel) {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        handleNoThanks // Close the app on back button press
      );

      // Cleanup the event listener when modal is closed
      return () => backHandler.remove();
    }
  }, [props.versionmodel]);

  const handleNoThanks = () => {
    console.log('User chose not to update');
    // props.setversionmodel(false);
    BackHandler.exitApp(); // Close the app
  };  

  const handleUpdate = () => {
    const playStoreUrl = 'https://apps.apple.com/us/app/inreel-saver-repost-reel/id6680188818'; // Replace with your app's Play Store URL
    Linking.openURL(playStoreUrl).catch((err) => 
      console.error('Error opening URL:', err)
    );
  };

  return (
    <View style={styles.container}>

      {/* Version Update Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.versionmodel}
        onRequestClose={handleNoThanks} // Handle back button press
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>New version available</Text>
            <Text style={styles.modalMessage}>
              Please update the app to the new version to continue using the app.
            </Text>

            <View style={styles.divider} />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleUpdate}
              >
                <Text style={styles.buttonUpdate}>UPDATE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 350,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginVertical: 10,
    width: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    padding: 5,
    borderRadius: 5,
    width: '48%',
  },
  buttonUpdate: {
    marginTop: 10,
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
  },
});

export default Model;























