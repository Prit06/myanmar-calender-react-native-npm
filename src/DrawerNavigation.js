  
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Linking } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Calendar from './Calendar';
import Holidays from './Holidays';
import Emcalendar from './Emcalendar';
import Share from 'react-native-share'; // Import the Share module
import { BannerAd, AdEventType, BannerAdSize } from 'react-native-google-mobile-ads';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const openURL = (url) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  const shareContent = () => {
    const shareOptions = {
      title: 'Share this app',
      message: 'Check out this awesome app!',
      url: 'https://example.com', // Replace with your app's URL or content you want to share
    };

    Share.open(shareOptions).catch((err) => console.error("Couldn't share content", err));
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerHeader}>
        <Image
          source={require('./assets/mayanmarcalendar.png')}
          style={styles.drawerImage}
        />
        <Text style={styles.drawerTitle}>Myanmar Calendar ~ 1500 Years</Text>
      </View>

      <View style={styles.drawerItems}>
        <TouchableOpacity
          style={[
            styles.drawerItemContainer,
            { backgroundColor: selectedItem === 'Calendar' ? '#FFBABA' : 'transparent' }
          ]}
          onPress={() => {
            setSelectedItem('Calendar');
            props.navigation.navigate('Myanmar Calendar');
          }}
        >
          <Image
            source={require('./assets/calendar.png')}
            style={[
              styles.drawerItemImage,
              { tintColor: selectedItem === 'Calendar' ? '#FF3030' : 'white' }
            ]}
          />
          <Text style={[
            styles.drawerItemText,
            { color: selectedItem === 'Calendar' ? '#FF3030' : 'white' }
          ]}>
            Calendar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.drawerItemContainer,
            { backgroundColor: selectedItem === 'EmCalendar' ? '#FFBABA' : 'transparent' }
          ]}
          onPress={() => {
            setSelectedItem('EmCalendar');
            props.navigation.navigate('Emcalendar');
          }}
        >
          <Image
            source={require('./assets/calendar.png')}
            style={[
              styles.drawerItemImage,
              { tintColor: selectedItem === 'EmCalendar' ? '#FF3030' : 'white' }
            ]}
          />
          <Text style={[
            styles.drawerItemText,
            { color: selectedItem === 'EmCalendar' ? '#FF3030' : 'white' }
          ]}>
            {"Em > Calendar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.drawerItemContainer,
            { backgroundColor: selectedItem === 'Holiday' ? '#FFBABA' : 'transparent' }
          ]}
          onPress={() => {
            setSelectedItem('Holiday');
            props.navigation.navigate('Holidays');
          }}
        >
          <Image
            source={require('./assets/sunset.png')}
            style={[
              styles.drawersImage,
              { tintColor: selectedItem === 'Holiday' ? '#FF3030' : 'white' }
            ]}
          />
          <Text style={[
            styles.drawerItemText1,
            { color: selectedItem === 'Holiday' ? '#FF3030' : 'white' }
          ]}>
            Holidays
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.drawerItemContainer,
            { backgroundColor: selectedItem === 'PrivacyPolicy' ? '#FFBABA' : 'transparent' }
          ]}
          onPress={() => {
            setSelectedItem('PrivacyPolicy');
            openURL('https://pratikmathukiyadeveloper.blogspot.com/');
          }}
        >
          <Image
            source={require('./assets/privacy_policy.png')}
            style={[
              styles.drawersImage,
              { tintColor: selectedItem === 'PrivacyPolicy' ? '#FF3030' : 'white' }
            ]}
          />
          <Text style={[
            styles.drawerItemText1,
            { color: selectedItem === 'PrivacyPolicy' ? '#FF3030' : 'white' }
          ]}>
            Privacy Policy
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.drawerItemContainer,
            { backgroundColor: selectedItem === 'Share' ? '#FFBABA' : 'transparent' }
          ]}
          onPress={() => {
            setSelectedItem('Share');
            shareContent();
          }}
        >
          <Image
            source={require('./assets/share.png')} // Add an appropriate image for sharing
            style={[
              styles.drawersImage,
              { tintColor: selectedItem === 'Share' ? '#FF3030' : 'white' }
            ]}
          />
          <Text style={[
            styles.drawerItemText1,
            { color: selectedItem === 'Share' ? '#FF3030' : 'white' }
          ]}>
            Share
          </Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const DrawerNavigation = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#FFBABA" />
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#FF5454',
            width: '65%',
          },
          headerStyle: {
            backgroundColor: '#FFBABA',
          },
          drawerLabelStyle: {
            fontSize: 16,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Drawer.Screen name="Myanmar Calendar" component={Calendar} />
        <Drawer.Screen name="Emcalendar" component={Emcalendar} />
        <Drawer.Screen name="Holidays" component={Holidays} />
      </Drawer.Navigator>
      <View style={styles.adContainer}>
        <BannerAd
          unitId={"ca-app-pub-3940256099942544/9214589741"} // Use the provided Ad Unit ID
          size={BannerAdSize.LARGE_BANNER}
        />
      </View>
    </NavigationContainer>
  );
};

export default DrawerNavigation;

const styles = StyleSheet.create({
  drawerHeader: {
    alignItems: 'center',
    backgroundColor: '#FF5454',
  },
  drawerItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 40,
    marginBottom: 10,
  },
  drawerTitle: {
    marginTop: 40,
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  drawerItems: {
    marginTop: 100,
  },
  drawersImage: {
    width: 28,
    height: 28,
    margin: 10,
    tintColor: 'white',
  },
  drawerImage: {
    marginTop: 80,
    width: 80,
    height: 80,
    alignSelf: 'center',
  },
  drawerItemImage: {
    width: 25,
    height: 25,
    margin: 10,
    tintColor: 'white',
  },
  drawerItemText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  drawerItemText1: {
    fontSize: 16,
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  adContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
});
















































































































































































































