

import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, StatusBar, Linking } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Calendar from './Calendar';  // Ensure these are correctly exported from their files
import Holidays from './Holidays';
import Emcalendar from './Emcalendar';
import Share from 'react-native-share';
import { BannerAd, BannerAdSize, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { AdContext, AdProvider } from './adsContext';  // Import AdContext and AdProvider


const INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-3940256099942544/1033173712";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const { adCount, incrementAdCount } = useContext(AdContext);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);



  const openURL = (url) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err));
  };

  const shareContent = () => {
    const shareOptions = {
      title: 'Share this app',
      message: 'Check out this awesome app!',
      url: 'https://example.com',
    };

    Share.open(shareOptions).catch((err) => console.error("Couldn't share content", err));
  };


  //==================== ads count ===========================//


  useEffect(() => {
    if (adCount > 0 && adCount % 3 === 0) {
     
      const interstitialAd = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID);
      setLoading(true)
 
      

      const adLoadListener = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        setLoading(false)
        interstitialAd.show();
      });

      const adCloseListener = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        // Optionally handle ad closure
      });

      // interstitialAd.load();

      return () => {
        adLoadListener();
        adCloseListener();
      };
    }
  }, [adCount]);


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
            incrementAdCount();
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
            incrementAdCount();
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
            incrementAdCount();
          }}
        >
          <Image
            source={require('./assets/sunset.png')}
            style={[
              styles.drawerItemImage,
              { tintColor: selectedItem === 'Holiday' ? '#FF3030' : 'white' }
            ]}
          />
          <Text style={[
            styles.drawerItemText,
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
              styles.drawerItemImage,
              { tintColor: selectedItem === 'PrivacyPolicy' ? '#FF3030' : 'white' }
            ]}
          />
          <Text style={[
            styles.drawerItemText,
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
            incrementAdCount();
          }}
        >
          <Image
            source={require('./assets/share.png')}
            style={[
              styles.drawerItemImage,
              { tintColor: selectedItem === 'Share' ? '#FF3030' : 'white' }
            ]}
          />
          <Text style={[
            styles.drawerItemText,
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
          unitId={"ca-app-pub-3940256099942544/9214589741"}
          size={BannerAdSize.LARGE_BANNER}
        />
      </View>
    </NavigationContainer>
  );
};

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
  drawerItemImage: {
    width: 25,
    height: 25,
    margin: 10,
    tintColor: 'white',
  },
  drawerImage: {
    marginTop: 80,
    width: 80,
    height: 80,
    alignSelf: 'center',
  },
  drawerItemText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  adContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: 'white'
  },
});

export default () => (
  <AdProvider>
    <DrawerNavigation />
  </AdProvider>
);









































