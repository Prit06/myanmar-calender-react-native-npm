

import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  DrawerLayoutAndroid,
  Image,
  Linking,
 
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import {
  getCalenderData,
  getCalenderDaysData,
  getStaticData,
} from "../calenderData/calenderData";
import CustomPicker from "./CustomPicker";
import Svg, { Path } from "react-native-svg";
import Holidaydata from "../calenderData/holidays";
import Loader from "./loader";
import { AdContext, AdProvider } from './adsContext';  // Import AdContext and AdProvider
import { InterstitialAd, AdEventType, AdManager } from 'react-native-google-mobile-ads';


const Calender = () => {
  var dt = new Date();
  const [day, setDay] = useState(dt.getDate());
  const [calenderData, setCalenderData] = useState([]);
  const [WeekdayHeader, setWeekdayHeader] = useState([]);
  const [headerLine, setHeaderLine] = useState("");
  const [monthData, setMonthData] = useState([]);
  const [languageData, setLanguageData] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const drawer = useRef(null);
  const [drawerPosition, setDrawerPosition] = useState("left");
  const [year, setYear] = useState(2021);
  const [month, setMonth] = useState(1);
  const [calendarType, setCalendarType] = useState(0);
  const [selectedJs, setSelectedJs] = useState(null);
  const [language, setLanguage] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [modelData, setModelData] = useState({});
  const [holidays, setHolidays] = useState([]);
  const [fullMoon, setFullMoon] = useState([]);
  const [newMoon, setNewMoon] = useState([]);
  const [waxingMoon, setWaxingMoon] = useState([]);
  const [WaningMoon, setWaningMoon] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMainScreen, setIsMainScreen] = useState(false);

  const { adCount, incrementAdCount } = useContext(AdContext);

  const [clickCount, setClickCount] = useState(0);
  const [adLoaded, setAdLoaded] = useState(false);



  const toggleModal = (js) => {
    setModalData(js);
    setModalVisible(!isModalVisible);
  };

  const startLoading = (time) => {
    // setLoading(true);
    // Simulate a network request or any other async operation
    setTimeout(() => {
      setLoading(false);
    }, time);
  };


  useEffect(() => {
    startLoading(5000);
    const today = new Date();
    setYear(today?.getFullYear());
    setMonth(today.getMonth() + 1);
    setCurrentDate(today);
    calenderDataFun();
    staticDataFun();
  }, []); 


  useEffect(() => {
    if (!loading) {
      startLoading(2000);
    }
    calenderDataFun();
    getDaysData(selectedJs);
  }, [month, year]);

  
  useEffect(() => {
    if (!loading) {
      startLoading(2000);
    }
    calenderDataFun();
    async function changeTypeDataSetFun() {
      var js = await selectedDateDataFunction()
      if (js) {
        getDaysData(js, true);
        setSelectedJs(js)
      } else {
        getDaysData(selectedJs);
      }
    }
    changeTypeDataSetFun()
  }, [calendarType, language]);


  const selectedDateDataFunction = async () => {
    if (!selectedDate) return false
    var data = await getCalenderData(selectedDate?.month + 1, selectedDate?.year, calendarType, language)
    data = data?.calenderArr
    toDateJs = data.find((dayData) => {
      return dayData.EnglishDay == +selectedDate.EnglishDay;
    });
    return toDateJs?.js
  }

  useEffect(() => {
    if (selectedJs) {
      getDaysData(selectedJs, true);
    }
  }, [selectedJs]);

  // holidayfetchdata
  useEffect(() => {
    const fetchHolidayData = async () => {
      const data = await Holidaydata();
      setHolidays(data.holidays);
    };
    fetchHolidayData();
  }, []);

  const filteredHolidays = holidays.filter((ele) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var monthName = monthNames[month - 1]
    var removeValue = [monthName, year.toString()]
    var dateArr = ele.date.split(" ").filter(item => !removeValue.includes(item)).toString();
    ele.dateStr = dateArr
    return ele.date.includes(monthName) && ele.date.includes(year)
  });

  const getDaysData = async (js, status) => {
    // var staticData = await getCalenderDaysData(js, calendarType, language);
    // setModelData(staticData);
    var jsId = js
    if (currentDate?.getMonth() + 1 == month && currentDate?.getFullYear() == year && !status) {
      var data = await getCalenderData(currentDate?.getMonth() + 1, currentDate?.getFullYear(), calendarType, language)
      data = data?.calenderArr
      toDateJs = data.find((dayData) => {
        return dayData.englishDaysClass == "PriDayToday";
      });
      jsId = toDateJs?.js
      setSelectedJs(jsId)
      setSelectedDate(null)
    }
    if (jsId) {
      var CalenderStaticData = await getCalenderDaysData(jsId, calendarType, language);
      setModelData(CalenderStaticData);
    }
  };

  const calenderDataFun = async () => {
    var data = await getCalenderData(month, year, calendarType, language);
    setCalenderData(data?.calenderArr);
    setWeekdayHeader(data?.WeekdayHeader);
    setHeaderLine(data?.headerLine);
    const fullMoonDays = data.calenderArr
      .filter((ele) => ele.englishMoonPhaseAndDay === "Full Moon")
      .map((ele) => ele.EnglishDay);
    setFullMoon(fullMoonDays);

    const newMoonDays = data.calenderArr
      .filter((ele) => ele.englishMoonPhaseAndDay === "New Moon")
      .map((ele) => ele.EnglishDay);
    setNewMoon(newMoonDays);

    const WaxingDay = data.calenderArr
      .filter((ele) => ele.englishMoonPhaseAndDay === "Waxing 8")
      .map((ele) => ele.EnglishDay);
    setWaxingMoon(WaxingDay);

    const WaningDay = data.calenderArr
      .filter((ele) => ele.englishMoonPhaseAndDay === "Waning 8")
      .map((ele) => ele.EnglishDay);
    setWaningMoon(WaningDay);

    if (calenderData) {
      startLoading(500)
    }
  };

  const staticDataFun = async () => {
    var staticData = await getStaticData();
    setMonthData(staticData.month);
    setLanguageData(staticData.language);
    setTypeData(staticData.type);
  };

  const changeMonth = (value) => {
    setLoading(true)
    let newMonth = month + value;
    let newYear = year;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    } else if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    setMonth(newMonth);
    setYear(newYear);
  };


  const changeYear = (value) => {
    setLoading(true)
    setYear(year + value);
  };

  const isToday = (day) => {
    return (
      currentDate?.getFullYear() === year &&
      currentDate.getMonth() + 1 === month &&
      currentDate.getDate() === day
    );
  };

  const isSelectedDay = (day) => {
    return (
      selectedDate &&
      selectedDate?.year == year &&
      selectedDate.month + 1 == month &&
      selectedDate.EnglishDay == day
    );
  };

  const renderDay = (data, index) => {
    var day = data.EnglishDay;
    var toDayDateClass = data.englishDaysClass;
    var js = data.js;
    

    const today = isToday(day);
    const selected = isSelectedDay(day);

    let dayContainerStyle = [styles.dayContainer];

    // if (today && selected) {
    if (toDayDateClass == "PriDayToday" && selected) {
      dayContainerStyle.push(styles.selectedAndTodayCircle);
      // } else if (today) {
    } else if (toDayDateClass == "PriDayToday") {
      dayContainerStyle.push(styles.todayCircle);
    } else if (selected) {
      return (
        <TouchableOpacity
          key={index}
          style={styles.dayContainer}
          onPress={() => {
            // setSelectedDate(new Date(year, month - 1, day));
            setSelectedDate({
              EnglishDay: day,
              month: month - 1,
              year: year,
            });
            setSelectedJs(js);
          
          }}
          activeOpacity={0.7}
        >

          <View style={styles.selectedDayCircle}>
            <View style={styles.dayContent}>
              <Text style={styles.dayText}>{day}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity
        key={index}
        style={dayContainerStyle}
        onPress={() => {
          // setSelectedDate(new Date(year, month - 1, day));
          setSelectedDate({
            EnglishDay: day,
            month: month - 1,
            year: year,
          });
          setSelectedJs(js);
          incrementAdCount();
        }}
        activeOpacity={0.7}
      >
        <View style={styles.dayContent}>
          <Text style={styles.dayText}>{day}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyDays = (count) => {
    const emptyDays = [];
    for (let i = 0; i < count; i++) {
      emptyDays.push(<View key={`empty-${i}`} style={styles.dayContainer} />);
    }
    return emptyDays;
  };

  const navigationView = () => (
    <View style={[styles.container, styles.navigationContainer]}>
      <Image onPress={() => drawer.current.closeDrawer()} />
    </View>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      drawerPosition={drawerPosition}
      renderNavigationView={navigationView}
    >

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.containerHeader}>
          {
            // loading && <Loader isMainScreen={isMainScreen} />
          }



{loading && (
  <View style={{ 
    height:"70%",
    justifyContent: 'center',  // Centers vertically
    alignItems: 'center',  // Centers horizontally
    position: 'absolute', // Ensure it stays in the center
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }}>
    
    <View style={{ 
      width: 90,    // Set the width to create a square
      height: 90,   // Same as width for the square shape
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 20, // Add some border radius for smooth edges
      padding: 20,
      zIndex: 900,    // Ensures the loader stays on top
      backgroundColor:'white',
    }}>
      <Loader isMainScreen={isMainScreen} />
    </View>
  </View>
)}

          <View>
            <View style={{ backgroundColor: "pink", flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => drawer.current.openDrawer()}
              ></TouchableOpacity>
            </View>

            <View style={styles.container}>
              <View style={styles.tableContainerCtrl}>
                <View style={styles.yearMonthContainer}>
                  <TouchableOpacity
                    onPress={() => changeMonth(-1)}
                    style={styles.arrowButtonMonth}
                  >
                    <Text style={styles.arrow}>◀</Text>
                  </TouchableOpacity>

                  <View style={styles.pickerWrapper}>
                    <Text style={styles.monthText}>
                      {monthData[month - 1]?.name}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => changeMonth(1)}
                    style={styles.arrowButtonMonth}
                  >
                    <Text style={styles.arrow}>▶</Text>
                  </TouchableOpacity>

                  <View style={styles.spacer} />

                  <TouchableOpacity
                    onPress={() => changeYear(-1)}
                    style={styles.arrowButtonYear}
                  >
                    <Text style={styles.arrow}>◀</Text>
                  </TouchableOpacity>

                  <View style={styles.yearContainer}>
                    <Text style={styles.inputYear}>{year}</Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => changeYear(1)}
                    style={styles.arrowButtonYear}
                  >
                    <Text style={styles.arrow}>▶</Text>
                  </TouchableOpacity>
                </View>
              </View>


              <View style={styles.pickersContainer}>
                <View style={styles.pickerWrapper}>
                  <CustomPicker
                    selectedValue={calendarType}
                    onValueChange={(itemValue) => {
                      setCalendarType(itemValue);
                      incrementAdCount(); // Increment ad count when calendar type changes
                    }}
                    items={typeData}
                  />
                </View>

                <View style={styles.pickerWrapper}>
                  <CustomPicker
                    selectedValue={language}
                    onValueChange={(itemValue) => {
                      setLanguage(itemValue);
                      incrementAdCount(); // Increment ad count when language changes
                    }}
                    items={languageData}
                  />
                </View>
              </View>


              <View>
                <Text
                  style={{
                    margin: 10,
                    textAlign: "center",
                    fontWeight: "bold",
                    color: 'black',
                  }}
                >
                  {headerLine}
                </Text>
              </View>

              <LinearGradient
                colors={["#FFEDED", "#FFEDED"]}
                style={styles.gradientBackground}
              >
                <View style={styles.weekdaysContainer}>
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <Text key={day} style={styles.weekdayText}>
                        {day}
                      </Text>
                    )
                  )}
                </View>


                
                <View style={styles.daysContainer}>
                  {calenderData.map((dayData, index) =>
                    Object.keys(dayData).length > 0
                      ? renderDay(dayData, index)
                      : renderEmptyDays(1)
                  )}
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#FF5454",
                    padding: 8,
                    margin: 8,
                    borderRadius: 15,
                    marginTop: 20,
                    justifyContent: "center",
                    width: "95%"
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Phases of the Moon :
                  </Text>

                  <Text
                    style={{
                      marginLeft: 10,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {newMoon.join(",")}:
                  </Text>
                  <Svg
                    viewBox="0 0 30 30"
                    height="20"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <Path
                      d="M3.74,14.44c0,2.04,0.5,3.93,1.51,5.65s2.37,3.1,4.1,4.1s3.61,1.51,5.65,1.51s3.92-0.5,5.65-1.51s3.09-2.37,4.09-4.1
 s1.51-3.61,1.51-5.65s-0.5-3.92-1.51-5.65s-2.37-3.09-4.09-4.09s-3.61-1.51-5.65-1.51S11.08,3.7,9.35,4.7s-3.1,2.37-4.1,4.09
 S3.74,12.4,3.74,14.44z"
                      fill="#000000"
                    />
                  </Svg>
                  <Text
                    style={{
                      marginLeft: 5,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {waxingMoon.join(",")} :
                  </Text>
                  <Svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 30 30"
                    height="20"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <Path
                      d="M3.74,14.44c0-1.52,0.3-2.98,0.89-4.37s1.4-2.58,2.4-3.59s2.2-1.81,3.59-2.4s2.84-0.89,4.37-0.89s2.98,0.3,4.37,0.89 s2.59,1.4,3.6,2.4s1.81,2.2,2.4,3.59s0.89,2.84,0.89,4.37s-0.3,2.98-0.89,4.37s-1.4,2.59-2.4,3.6s-2.2,1.81-3.6,2.4 s-2.85,0.89-4.37,0.89s-2.98-0.3-4.37-0.89s-2.58-1.4-3.59-2.4s-1.81-2.2-2.4-3.6S3.74,15.97,3.74,14.44z"
                      fill="#000000"
                    />
                    <Path
                      d="M14.8,24.51h0.19c1.37,0,2.67-0.27,3.91-0.8s2.31-1.25,3.21-2.15s1.61-1.97,2.15-3.21s0.8-2.54,0.8-3.91 c0-1.36-0.27-2.66-0.8-3.9s-1.25-2.31-2.15-3.21s-1.97-1.61-3.21-2.15s-2.54-0.8-3.91-0.8H14.8V24.51z"
                      fill="#ffffff"
                    />
                  </Svg>

                  <Text
                    style={{
                      marginLeft: 5,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {fullMoon.join(",")}:
                  </Text>
                  <Svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 30 30"
                    height="20"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <Path
                      d="M3.74,14.44c0-1.52,0.3-2.98,0.89-4.37s1.4-2.58,2.4-3.59s2.2-1.81,3.59-2.4s2.84-0.89,4.37-0.89s2.98,0.3,4.37,0.89 s2.59,1.4,3.6,2.4s1.81,2.2,2.4,3.59s0.89,2.84,0.89,4.37s-0.3,2.98-0.89,4.37s-1.4,2.59-2.4,3.6s-2.2,1.81-3.6,2.4 s-2.85,0.89-4.37,0.89s-2.98-0.3-4.37-0.89s-2.58-1.4-3.59-2.4s-1.81-2.2-2.4-3.6S3.74,15.97,3.74,14.44z"
                      fill="#ffffff"
                    />
                    <Path
                      d="M14.8,24.51h0.19c1.37,0,2.67-0.27,3.91-0.8s2.31-1.25,3.21-2.15s1.61-1.97,2.15-3.21s0.8-2.54,0.8-3.91 c0-1.36-0.27-2.66-0.8-3.9s-1.25-2.31-2.15-3.21s-1.97-1.61-3.21-2.15s-2.54-0.8-3.91-0.8H14.8V24.51z"
                      fill="#ffffff"
                    />
                  </Svg>

                  <Text
                    style={{
                      marginLeft: 5,
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {WaningMoon.join(",")}{" "}
                  </Text>
                  <Svg
                    viewBox="0 0 30 30"
                    height="20"
                    width="20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <Path
                      d="M3.74,14.44c0-1.52,0.3-2.98,0.89-4.37s1.4-2.58,2.4-3.59s2.2-1.81,3.59-2.4s2.84-0.89,4.37-0.89s2.98,0.3,4.37,0.89 s2.59,1.4,3.6,2.4s1.81,2.2,2.4,3.59s0.89,2.84,0.89,4.37s-0.3,2.98-0.89,4.37s-1.4,2.59-2.4,3.6s-2.2,1.81-3.6,2.4 s-2.85,0.89-4.37,0.89s-2.98-0.3-4.37-0.89s-2.58-1.4-3.59-2.4s-1.81-2.2-2.4-3.6S3.74,15.97,3.74,14.44z"
                      fill="#ffffff"
                    />
                    <Path
                      d="M14.8,24.51h0.19c1.37,0,2.67-0.27,3.91-0.8s2.31-1.25,3.21-2.15s1.61-1.97,2.15-3.21s0.8-2.54,0.8-3.91 c0-1.36-0.27-2.66-0.8-3.9s-1.25-2.31-2.15-3.21s-1.97-1.61-3.21-2.15s-2.54-0.8-3.91-0.8H14.8V24.51z"
                      fill="#000000"
                    />
                  </Svg>
                </View>

                <View>
                  <Text
                    style={{ margin: 10, fontWeight: "bold", fontSize: 16, color: 'black' }}
                  >
                    Holiday and Observances
                  </Text>
                  {filteredHolidays.map((holiday, index) => (
                    <View
                      key={index}
                      style={{ flexDirection: "row", margin: 10 }}
                    >
                      <Text
                        style={[
                          styles.dateColorSet,
                          { color: "#FF5454", fontWeight: "bold" },
                        ]}
                      >
                        {holiday.dateStr}
                      </Text>
                      <Text style={{ marginLeft: 5, fontWeight: "bold" }}>
                        :
                      </Text>
                      <Text
                        style={[
                          styles.holidayName,
                          {
                            color: "black",
                            fontWeight: "bold",
                            marginLeft: 5,
                            width: "95%",
                          },
                        ]}
                      >
                        {holiday.name}
                        {holiday.comments && holiday.comments !== "--"
                          ? ` (${holiday.comments})`
                          : ""}
                      </Text>
                    </View>
                  ))}
                </View>
              </LinearGradient>
              <LinearGradient
                colors={["#FFEDED", "#FFEDED"]}
                style={styles.linearGradient}
              >
                {/* <ScrollView contentContainerStyle={styles.scrollViewContent}> */}
                <View style={styles.dateContainer}>
                  {modelData?.MyanmarDate && (
                    <>
                      <Text style={[styles.daFontSize, styles.sm]}>
                        {modelData.SasanaYear}
                      </Text>
                      <Text style={[styles.daFontSize, styles.sm]}>
                        {modelData.MyanmarYear}
                      </Text>
                      <Text
                        style={[
                          styles[modelData.moonPhaseClass],
                          styles.daFontSize,
                        ]}
                      >
                        {modelData.moonPhase}
                      </Text>
                      <Text style={[styles.sidebardetailsfirstsizeset, styles.daFontSize]}>
                        {modelData.weekday}
                      </Text>
                      {modelData?.sabbathAndMoon && (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={[styles.mcYtyz, styles.daFontSize, { marginRight: 5 }]}>
                            {modelData.sabbathAndMoon}
                          </Text>
                          {modelData?.canvas && (
                            <>
                              <View style={styles[modelData?.canvas]} />
                            </>
                          )}
                        </View>
                      )}
                      {modelData?.holidays.length !== 0 && (
                        <Text style={[styles.mcPubHol, styles.daFontSize]}>
                          {modelData.holidays.join("\n")}
                        </Text>
                      )}
                      {modelData?.holidays2.length !== 0 && (
                        <Text style={[styles.weekdayclass, styles.daFontSize]}>
                          {modelData.holidays2.join("\n")}
                        </Text>
                      )}
                      {modelData.yatyaza && (
                        <Text style={[styles.mcYtyz, styles.daFontSize]}>
                          {modelData.yatyaza}
                        </Text>
                      )}
                      {modelData.pyathada && (
                        <Text style={[styles.mcYtyz, styles.daFontSize]}>
                          {modelData.pyathada}
                        </Text>
                      )}
                      {modelData?.astro.length !== 0 && (
                        <Text style={[styles.mcAstro, styles.daFontSize]}>
                          {modelData.astro.join("\n")}
                        </Text>
                      )}
                      <Text style={[styles.mcAstro, styles.daFontSize]}>
                        {modelData.yearName}
                      </Text>
                      <Text style={[styles.mcAstro, styles.daFontSize]}>
                        {modelData.mahabote}
                      </Text>
                      <Text style={[styles.mcAstro, styles.daFontSize]}>
                        {modelData.nakhat}
                      </Text>
                      <Text style={[styles.mcAstro, styles.daFontSize]}>
                        {modelData.nagaHead}
                      </Text>
                      {modelData?.ThingyanLink && (
                        <Text
                          style={[styles.anchorFootMC, styles.daFontSize]}
                          onPress={() =>
                            Linking.openURL(modelData.ThingyanLink)
                          }
                        >
                          Thingyan Calculator &gt;&gt;
                        </Text>
                      )}
                    </>
                  )}
                  <Text style={styles.daFoot}>{modelData?.DaFoot}</Text>
                  {modelData?.MCAstro && (
                    <Text style={[styles.mcAstro, styles.daFontSize]}>
                      {modelData.MCAstro}
                    </Text>
                  )}
                  {modelData?.ImportantNote && (
                    <Text style={styles.daFoot}>{modelData.ImportantNote}</Text>
                  )}
                </View>
              </LinearGradient>
            </View>
          </View>
        </View>
      </ScrollView>
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  containerHeader: {
    flex: 1,
    alignItems: "center",
    position: "relative"
  },
  container: {
    flex: 1,
    backgroundColor: "#FFBABA",
  },
  sidebardetailsfirstsizeset: {
    color: '#727272',
    fontWeight: 700
  },
  navigationContainer: {
    backgroundColor: "#FF5454",
  },
  scrollContainer: {
    flexGrow: 1,
    marginTop: -8,
  },
  weekdayclass: {
    color: "#cca6f2",
    fontWeight: 700,
  },
  paragraph: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
  },

  gradientBackground: {
    marginTop: 10,
    borderRadius: 20,
    margin: 10,
  },

  linearGradient: {
    marginTop: 10,
    flex: 1,
    borderRadius: 20,
    padding: 20,
    margin: 10,
  },

  scrollViewContent: {
    // padding: 20,
  },

  dateGradientBackground: {
    marginBottom: 10,
    margin: 10,
    borderRadius: 20,
  },

  dateText: {
    marginTop: 10,
    fontSize: 18,
    color: "#FF5454",
  },

  tableContainerCtrl: {
    flexDirection: "row",
    marginHorizontal: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
  },

  yearMonthContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  arrow: {
    fontSize: 30,
    color: "white",
    // marginHorizontal: 20,
  },
  spacer: {
    flex: 1,
  },
  yearContainer: {
    marginHorizontal: 5,
    width: 80,
  },
  inputYear: {
    fontSize: 15,
    color: "black",
    textAlign: "center",
    width: "100%",
  },

  pickerWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  picker: {
    height: 40,
    width: "100%",
    color: "black",
  },
  pickersContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  weekdaysContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    width: "100%"
  },
  weekdayText: {
    color: "#FF5454",
    fontSize: 13,
    fontWeight: "bold",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    // width: "100%",
    // alignItems: "center",
    justifyContent: "center",
  },
  dayContainer: {
    width: "14.28%",
    // justifyContent: "center",
    alignItems: "center",
    // marginVertical: 5,
    height: 45,
  },
  dayContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  monthText: {
    color: 'black',
  },

  dayText: {
    fontSize: 18,
    color: "black",
  },
  todayCircle: {
    backgroundColor: "#3EBAFF",
    borderRadius: 30,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedDayCircle: {
    backgroundColor: "#A5B9FF",
    borderRadius: 30,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedAndTodayCircle: {
    backgroundColor: "#3EBAFF",
    borderRadius: 30,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  daFontSize: {
    fontSize: 16,
    paddingTop: 5,
    paddingBottom: 5,
  },
  priDayHoliday: {
    color: "#ff8080",
    fontSize: 18,
  },
  priDayWeekend: {
    color: "#ff8080",
    fontSize: 18,
  },
  priDayInaccu: {
    color: "#cca6f2",
    fontSize: 18,
  },
  mcSabbath: {
    color: "#7ece7e",
    fontSize: 12,
  },
  SecDa: {
    color: "#999999",
    fontSize: 14,
  },
  SecDaH: {
    color: "#ff3535",
    fontSize: 14,
  },
  mcPubHol: {
    color: "#ff3535",
    fontSize: 12,
  },
  c: {
    color: "#cca6f2",
    fontSize: 12,
  },
  mcYtyz: {
    color: "#7ece7e",
    fontSize: 12,
  },
  mcAstro: {
    color: "#555555",
    fontSize: 12,
  },
  sm: {
    color: 'black',
  },

  FM: {
    borderRadius: 5,
    width: 10,
    height: 10,
    backgroundColor: "#ffffcc",
    borderWidth: 1,
    borderColor: "#CCCCCC",
  },
  NM: {
    borderRadius: 5,
    width: 10,
    height: 10,
    backgroundColor: "#666666",
    borderWidth: 1,
    borderColor: "#CCCCCC",
  },
  btnBack: {
    color: "#999999",
    padding: 3,
    margin: "auto",
    textAlign: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#333333",
    fontSize: 14,
    fontFamily: "Arial",
    width: 100,
    height: 32,
    display: "block",
  },
  hLabel: {
    color: "#7ece7e",
    fontSize: 12,
    fontWeight: "bold",
    textShadowColor: "#ff8080",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    borderWidth: 1,
    borderColor: "#333333",
    paddingTop: -8,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: -8,
    backgroundColor: "#662222",
    borderRadius: 5,
  },
  daFoot: {
    fontSize: 14,
    paddingTop: 5,
    paddingBottom: 5,
    color: 'black',
  },

  anchorFootMC: {
    textDecorationLine: "none",
    color: "#cca6f2",
    fontSize: 24,
  },

});

export default Calender;
