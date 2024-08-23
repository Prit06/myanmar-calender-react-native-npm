import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, ScrollView } from 'react-native';
import Holidaydata from '../calenderData/holidays'; // Assuming holidaysData is imported and used within Holidaydata

const Holiday = () => {
  const [holidays, setHolidays] = useState([]);
  const [title, setTitle] = useState('');

  const Item = ({ date, day, name, types, comments }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{date}</Text>
      <Text style={styles.celles}>{day}</Text>
      <Text style={styles.cells}>{name}</Text>
      <Text style={styles.celles}>{types}</Text>
      <Text style={styles.celles}>{comments}</Text>
    </View>
  );

  useEffect(() => {
    const fetchHolidayData = async () => {
      const data = await Holidaydata(); // Fetch the data from Holidaydata
      setHolidays(data.holidays); // Set holidays data
      setTitle(data.title); // Set title data
    };

    fetchHolidayData(); // Call the function to fetch data on component mount
  }, []);

  const renderItem = ({ item, index }) => (
    <Item
      key={index}
      date={item.date}
      day={item.day}
      name={item.name}
      types={item.types}
      comments={item.comments}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView horizontal>
        <View>
          <View style={styles.header}>
            <Text style={styles.headerCell}>Date</Text>
            <Text style={styles.headerCell}>Day</Text>
            <Text style={styles.headerCell}>Name</Text>
            <Text style={styles.headerCell}>Type</Text>
            <Text style={styles.headerCell}>Comments</Text>
          </View>
          <FlatList
            data={holidays}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEDED',
  },
  title: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
    marginTop: 12,
    marginHorizontal: 20, // Combined marginLeft and marginRight
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    padding: 5,
  },
  headerCell: {
    width: 130, // Adjust the width as needed
    textAlign: 'center',
    fontSize: 17,
    color:'black',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginTop: 10,
  },
  cell: {
    flex: 1,
    width: 130,
    textAlign: 'center',
    fontSize: 13,
    color:'black',
    fontWeight: '600',
  },
  celles: {
    flex: 1,
    textAlign: 'center',
    width: 130,
    fontSize: 13,
    color: 'gray',
  },
  cells: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    color: 'red',
    width: 130,
  },
});

export default Holiday;
