import React, { useState, useEffect, useRef ,useContext} from "react";
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
  getMCalenderData,
  getMCalenderStaticData,
  getMCalenderDaysData,
} from "../calenderData/calenderData";
import CustomPicker from "./CustomPicker";
import Svg, { Path } from "react-native-svg";
import Holidaydata from "../calenderData/holidays";
import Loader from "./loader";
import { ceMmDateTime } from "../calenderData/calender";

import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { AdContext, AdProvider } from './adsContext';  // Import AdContext and AdProvider



const EmCalender = () => {
  var dt = new Date();
  const [day, setDay] = useState(dt.getDate());
  const [MCalenderData, setMCalenderData] = useState([]);
  const [WeekdayHeader, setWeekdayHeader] = useState([]);
  const [headerLine, setHeaderLine] = useState("");
  const [monthData, setMonthData] = useState([]);
  const [languageData, setLanguageData] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const drawer = useRef(null);
  const [drawerPosition, setDrawerPosition] = useState("left");
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [calendarType, setCalendarType] = useState(0);
  const [selectedJs, setSelectedJs] = useState(null);
  const [language, setLanguage] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [modelData, setModelData] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [fullMoon, setFullMoon] = useState([]);
  const [newMoon, setNewMoon] = useState([]);
  const [waxingMoon, setWaxingMoon] = useState([]);
  const [WaningMoon, setWaningMoon] = useState([]);
  // const [firstloading, setFirstLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMainScreen, setIsMainScreen] = useState(false);
  const [englishMonth, setEnglishMonth] = useState("")
  const [englishYears, setEnglishYears] = useState("")
  const [currentYear, setCurrentYear] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(null);

  const { adCount, incrementAdCount } = useContext(AdContext);
  
  const scrollViewRef = useRef(null);

  const scrollToTop = () => {
    if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
  };



  const toggleModal = (js) => {
    setModalData(js);
    setModalVisible(!isModalVisible);
  };

  const startLoading = (time) => {
    setTimeout(() => {
      // setFirstLoading(false);
      setLoading(false)
    }, time);
  };

  const startLoadingMain = (time) => {
    setTimeout(() => {
      setLoading(false);
    }, time);
  };

  // useEffect(() => {
  //   // calenderDataFun();
  //   staticDataFun();
  //   // setSelectedDate(null)
  // }, [year, month]);

  useEffect(() => {
    setLoading(true);
    calenderDataFun();
    staticDataFun();
    getDaysData(selectedJs);
    // }, [month, year, calendarType, language]);
  }, [month, year]);

  useEffect(() => {
    setLoading(true);
    getDaysData(selectedJs);
  }, [currentMonth, currentYear]);

  useEffect(() => {
    setLoading(true);
    calenderDataFun();
    staticDataFun();
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
    var data = await getMCalenderData(selectedDate?.month + 1, selectedDate?.year, calendarType, language)
    data = data?.calenderArr
    toDateJs = data.find((dayData) => {
      return dayData.EnglishDay == +selectedDate.EnglishDay;
    });
    return toDateJs?.js
  }

  useEffect(() => {
    const today = new Date();
    // setFirstLoading(true)
    setLoading(true)
    setCurrentDate(today);
  }, []);

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

  useEffect(() => {
    const fullMoonDays = MCalenderData
      .filter((ele) => ele.englishMoonPhaseAndDay === "Full Moon")
      .map((ele) => ele.EnglishDay);
    setFullMoon(fullMoonDays);

    const newMoonDays = MCalenderData
      .filter((ele) => ele.englishMoonPhaseAndDay === "New Moon")
      .map((ele) => ele.EnglishDay);
    setNewMoon(newMoonDays);

    const WaxingDay = MCalenderData
      .filter((ele) => ele.englishMoonPhaseAndDay === "Waxing 8")
      .map((ele) => ele.EnglishDay);
    setWaxingMoon(WaxingDay);

    const WaningDay = MCalenderData
      .filter((ele) => ele.englishMoonPhaseAndDay === "Waning 8")
      .map((ele) => ele.EnglishDay);
    setWaningMoon(WaningDay);
  }, [MCalenderData]);

  const filteredHolidays = holidays.filter((ele) => {
    const date = new Date(ele.date);
    const holidayMonth = date.getMonth(); // 0 for January, 11 for December
    const holidayYear = date?.getFullYear();

    return holidayMonth + 1 === month && holidayYear === year; // Adjust month and year variables accordingly
  });

  const getDaysData = async (js, status) => {
    var jsId = js
    if (currentMonth == month && currentYear == year && !status) {
      var data = await getMCalenderData(currentMonth, currentYear, calendarType, language)
      data = data?.calenderArr
      toDateJs = data.find((dayData) => {
        return dayData.englishDaysClass == "PriDayToday";
      });
      jsId = toDateJs?.js
      setSelectedJs(jsId)
      setSelectedDate(null)
    }
    if (jsId) {
      var MCalenderStaticData = await getMCalenderDaysData(jsId, calendarType, language);
      setModelData(MCalenderStaticData);
    }
  };

  const calenderDataFun = async () => {
    var data = await getMCalenderData(month, year, calendarType, language);
    if (!year) {
      setYear(data?.year)
      setMonth(data?.monthId)
      setCurrentMonth(data?.monthId)
      setCurrentYear(data?.year)
    }

    setMCalenderData(data?.calenderArr);
    setWeekdayHeader(data?.WeekdayHeader);
    setHeaderLine(data?.headerLine);
    setEnglishYears(data.EnglishYear)
    setEnglishMonth(data.englishMonth)
    if (MCalenderData) {
      startLoading(0);
      startLoadingMain(500);
    }

    if (!month && month != 0) {
      var staticData = await getMCalenderStaticData(data?.year);
      const currentMonth = staticData?.month?.findIndex(m => m.name === data?.month);
      setMonth(currentMonth + 1)
    }
  }

  const staticDataFun = async () => {
    var staticData = await getMCalenderStaticData(year);
    setMonthData(staticData.month);
    setLanguageData(staticData.language);
    setTypeData(staticData.type);
  };

  useEffect(() => {
    const fetchHolidayData = async () => {
      const data = await Holidaydata();
      const shortMonth = englishMonth.slice(0, 3);
      const updatedHolidays = data.holidays.filter(holiday => {
        const [monthS, , holidayYear] = holiday.date.split(" ");
        return monthS === shortMonth && holidayYear === englishYears;
      });
      setHolidays(updatedHolidays);
    };

    fetchHolidayData();
  }, [englishMonth, englishYears]);

  const changeMonth = (value) => {
    setLoading(true);
    var v = value
    var SY = 1577917828 / 4320000; //solar year (365.2587565)
    var MO = 1954168.050623; //beginning of 0 ME
    var me = month;
    var mn = Number(me);
    var ye = year;
    var yn = Number(ye);
    var j1 = Math.round(SY * yn + MO) + 1;
    var j2 = Math.round(SY * (yn + 1) + MO);
    var M1 = ceMmDateTime.j2m(j1);
    var M2 = ceMmDateTime.j2m(j2);
    var si = M1.mm; var ei = M2.mm;
    if (mn == 0) mn = (v == 1) ? 4 : 3;
    else if (mn == 4 && M1.myt != 0 && v != 1) mn = 0;
    else if (mn == 3 && M1.myt != 0 && v == 1) mn = 0;
    else {
      mn += Number(v);
      if (mn < si) { mn += 12; yn--; }
      else if (mn > ei) { mn = mn % 12; yn++; }
    }
    setMonth(mn);
    setYear(yn);
  };

  const changeYear = (value) => {
    setLoading(true);
    setYear(+year + value);
  };

  const isToday = (day) => {
    return (
      currentYear == year &&
      currentMonth + 1 == month &&
      currentDate.getDate() == day
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

    if (toDayDateClass == "PriDayToday" && selected) {
      dayContainerStyle.push(styles.selectedAndTodayCircle);
    } else if (toDayDateClass == "PriDayToday") {
      dayContainerStyle.push(styles.todayCircle);
    } else if (selected) {
      return (
        <TouchableOpacity
          key={index}
          style={styles.dayContainer}
          onPress={() => {
            // setSelectedDate(new Date(year, month, day));
            setSelectedDate({
              EnglishDay: day,
              month: month - 1,
              year: year,
            });
            setSelectedJs(js);
            scrollToTop();
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
          // setSelectedDate(new Date(year, month, day));
          setSelectedDate({
            EnglishDay: day,
            month: month - 1,
            year: year,
          });
          setSelectedJs(js);
          incrementAdCount();
          scrollToTop();
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
      {/* {
        firstloading ? <Loader isMainScreen={true} /> : (
           */}
      <ScrollView contentContainerStyle={styles.scrollContainer}  ref={scrollViewRef}>
        <View style={styles.containerHeader}>
          




        {loading && (
  <View style={{ 
   height:"80%",
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



            
            {/* loading && <Loader isMainScreen={isMainScreen} /> */}
          
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
                      {/* {monthData[month + 1]?.name} */}
                      {monthData?.find(e => e.id == month)?.name}
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

              {/* <View style={styles.pickersContainer}>
                <View style={styles.pickerWrapper}>
                  <CustomPicker
                    selectedValue={calendarType}
                    onValueChange={(itemValue) => setCalendarType(itemValue)}
                    items={typeData}
                    setLoading={setLoading}
                  />
                </View>

                <View style={styles.pickerWrapper}>
                  <CustomPicker
                    selectedValue={language}
                    onValueChange={(itemValue) => setLanguage(itemValue)}
                    items={languageData}
                  />
                </View>
              </View> */}












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
                  {MCalenderData.map((dayData, index) =>
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
                  {holidays.map((holiday, index) => (
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
                        {holiday.date.split(" ")[1]}
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
                      <Text style={[styles.daFontSize, styles.sm]} >
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


              {/* <NavigationContainer>
                      <Stack.Navigator>
                        <Stack.Screen name="settings" component={Settings} />
                      </Stack.Navigator>
                    </NavigationContainer> */}

            </View>
          </View>

        </View>

      </ScrollView>
      {/* )
      } */}
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  containerHeader: {
    flex: 1,
    alignItems: "center",
    position: "relative"
  },
  sidebardetailsfirstsizeset: {
    color: '#727272',
    fontWeight: 700
  },
  container: {
    flex: 1,
    backgroundColor: "#FFBABA",
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
    fontSize: 20,
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
  FM: {
    borderRadius: 5,
    width: 10,
    height: 10,
    backgroundColor: "#ffffcc",
    borderWidth: 1,
    borderColor: "#CCCCCC",
  },

  sm: {
    color: 'black',
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

export default EmCalender;
