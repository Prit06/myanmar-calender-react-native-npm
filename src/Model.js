import React, { useState } from 'react';
import { Modal, Text, View, TouchableOpacity, StyleSheet } from 'react-native';



const Model = (props) => {


  const handleUpdate = () => {
    console.log('Update app');
    props.setversionmodel(false);
  };

  const handleNoThanks = () => {
    console.log('User chose not to update');
    props.setversionmodel(false);
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
              Please update the app to the new version to continue reposting.
            </Text>

            <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, marginVertical: 10, width: '112%', marginBottom: 0 }} />

            <View style={styles.buttonContainer}>
              {/* <TouchableOpacity
                style={styles.button}
                onPress={handleNoThanks}
              >
                <Text style={styles.buttontq}>NO, THANKS</Text>
              </TouchableOpacity> */}

              {/* <View style={{ borderLeftColor: 'black', borderLeftWidth: 1, height: '144%', marginHorizontal: 10, }} /> */}

              <TouchableOpacity
                style={styles.button}
                onPress={handleUpdate}
              >
                <Text style={styles.buttonupdate}>UPDATE</Text>
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
    // flex: 1,
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
    elevation: 5, // Optional shadow effect
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    padding: 5,
    borderRadius: 5,
    width: '48%', // Adjusting width for two button

  },
  buttontq: {
    marginTop: 10,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
  },
  buttonupdate: {
    marginTop: 10,
    fontWeight: 'bold',
    color: 'green',
    textAlign: 'center',
  },

});
export default Model;
