import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Linking } from 'react-native';

// Import your existing styles

const Exitmodel = ({ onConfirm, onCancel }) => {



    
    const handleCancel = () => {
        // Replace the URL with the actual Play Store link you want to open
        const playStoreUrl = 'https://apps.apple.com/us/app/inreel-saver-repost-reel/id6479700632'; // Your app's Play Store URL
        Linking.openURL(playStoreUrl).catch(err => console.error("Failed to open URL:", err));
        onCancel(); // Call the onCancel function after opening the link
    };

    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={true}
            onRequestClose={onCancel} // Handle Android back button press within the modal
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalView}>

                <Text style={{color:'#FF3030',fontWeight:'bold',fontSize:16,alignSelf:'flex-start'}}>Myanmar Calendar</Text>
                    <Text style={styles.modalTitle}>Are you sure you want to exit the app?</Text>

                    {/* <View style={styles.divider} /> */}

                    <View style={{ marginTop:20,borderBottomColor: 'black', borderBottomWidth: 1, width: '113%' }} />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button} onPress={handleCancel}>
                            <Text style={styles.buttonUpdate}>Rate Us</Text>
                        </TouchableOpacity>

                        <View style={{ borderRightColor: 'black', borderRightWidth: 1, height: '147%', marginHorizontal: 10 }} />


                        <TouchableOpacity style={styles.button} onPress={onConfirm}>
                            <Text style={styles.buttonUpdate}>Exit App</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
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
        marginTop:10,
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
 
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
        fontSize:16,
        marginTop: 10,
        fontWeight: 'bold',
        color: 'green',
        textAlign: 'center',
    },
});

export default Exitmodel;
