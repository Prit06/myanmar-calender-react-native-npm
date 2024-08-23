// CustomPicker.js

import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';

const CustomPicker = ({ selectedValue, onValueChange, items }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [itemData, setItemData] = useState("");

  useEffect(() => {
    if (items.length) {
      setItemData(items[0]?.name);
    }
  }, [items]);

  const handleSelect = (itemValue) => {
    onValueChange(itemValue);
    setModalVisible(false);
  };

  const selectedItem = items.find((item) => item.id === selectedValue);
  const displayText = selectedItem ? selectedItem.name : itemData;

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.customPicker}>
        <Text style={styles.customPickerText}>{displayText}</Text>
      </TouchableOpacity>
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <TouchableWithoutFeedback onPress={handleCloseModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => { }}>
              <View style={styles.modalContent}>
                <FlatList
                  data={items}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleSelect(item.id)} style={styles.item}>
                      <Text style={styles.itemText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  customPicker: {
    height: 50,
    width: '90%',
    backgroundColor: '#FF5454',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderColor: '#000',
  },
  customPickerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    marginBottom: '50%',
    width: '70%',
    backgroundColor: '#FFBABA',
    borderRadius: 20,
    padding: 10,
    borderBottomColor: '#000',
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  itemText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default CustomPicker;
