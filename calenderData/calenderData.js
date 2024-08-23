const { ceMmTranslate, ceMmChronicle, ceMmDateTime } = require("./calender");

const getCalenderData = async (month, year, calenderType, calenderLanguage) => {
  try {
    var x = new ceMmTranslate();
    var chron = new ceMmChronicle();
    var dt = new Date();

    var response = {};

    var uis = {
      Lang: undefined, // Language
      Type: calenderType, // Gregorian or Julian
      y: dt.getFullYear(),
      m: 1 + dt.getMonth(),
      d: dt.getDate(), // y, m, d to display
      cy: dt.getFullYear(),
      cm: 1 + dt.getMonth(),
      cd: dt.getDate(), // current y, m, d
      BY: 640,
      EY: 2140, // beginning and end of the calendar
      LT: 1700,
      UT: 2022, // lower and upper threshold for accurate years
    };

    function initc() {
      // var ce = document.getElementById("mcalg");
      if (uis.Lang === undefined) {
        var L = calenderLanguage;
        var F = "";
        if (F == "Zawgyi-One") L = "Zawgyi";
        uis.Lang = SelectLang(L); // set a global variable for translation
      }

      var me = month;
      var mn = Number(me);
      var ye = year;
      var yn = Number(ye);
      uis.y = yn;
      uis.m = mn;
      // mn--; me.selectedIndex = mn;
      ye = yn;
      DisplayUI(0);
    }

    function SelectLang(L) {
      var l = 1;
      switch (L) {
        case 0:
        case "English":
        case "my-En":
        case "my-en":
          l = 0;
          break;
        case 3:
        case "Moon":
        case "my-Mon":
        case "my-mon":
          l = 3;
          break;
        case 2:
        case "Zawgyi":
        case "my-Z1":
        case "my-z1":
        case "Zawgyi-One":
          l = 2;
          break;
        case 4:
        case "Tai":
        case "my-Tai":
        case "my-tai":
          l = 4;
          break;
        case 5:
        case "Karen":
        case "my-Kar":
        case "my-kar":
          l = 5;
          break;
        default:
          l = 1;
      }
      return l;
    }
    //-----------------------------------------------------------------------------
    //change month
    //input: (v: value [1: increase, -1: decrease])
    function emc(v) {
      var me = month;
      var mn = Number(me);
      var ye = year;
      var yn = Number(ye);
      mn += Number(v);
      if (mn <= 0) {
        mn += 12;
        yn--;
      } else if (mn > 12) {
        mn -= 12;
        yn++;
      }
      uis.y = yn;
      uis.m = mn;
      mn--;
      me.selectedIndex = mn;
      ye = yn;
      DisplayUI(0);
    }
    //-------------------------------------------------------------------------
    //input: (cev: calendar element to update [1:year, 2:month,
    //4:language, 3: type])
    function DisplayUI(cev) {
      switch (cev) {
        case 1:
          var ye = year;
          var yn = Number(ye);
          if (yn < uis.BY) {
            ye = yn = uis.BY;
          } else if (yn > uis.EY) {
            ye = yn = uis.EY;
          } else {
            ye = yn;
          }
          uis.y = yn;
          break; //year
        case 2:
          var me = month;
          uis.m = Number(me);
          break; //month
        case 3:
          var te = calenderType;
          uis.Type = te;
          break; //type
        case 4:
          var le = calenderLanguage;
          uis.Lang = SelectLang(le);
          break; //Language
      }
      // var oce = document.getElementById("oc");
      response = UIContent();
      // console.log("oce", oce);
    }
    //-------------------------------------------------------------------------
    //Produce html string for calendar content
    //output: (str: html string)
    function UIContent() {
      var r, i, js, je, eml, tstr, canvas;
      var calenderArr = [];
      var str = "";
      //------------------------------------------------------------------------
      var Cday = new ceMmDateTime(); // start of month
      Cday.SetTimezone(0);
      Cday.SetDateTime(uis.cy, uis.cm, uis.cd, 12, 0, 0, 0); // time zone is irrelevant
      //------------------------------------------------------------------------
      var MS = new ceMmDateTime(); // start of month
      MS.SetTimezone(0);
      MS.SetDateTime(uis.y, uis.m, 1, 12, 0, 0, 0, uis.Type); // time zone is irrelevant
      js = MS.jdn; //Find julian day number of start of
      //the month according to calendar type
      eml = MS.mlen; //get the length of the month
      je = js + eml - 1; //Julian day number of end of the month
      var ME = new ceMmDateTime(); // end of month
      ME.SetTimezone(0);
      ME.SetJD(je);
      //------------------------------------------------------------------------
      //Start of the table for calendar days

      var headerLine = tHead(MS, ME); //header
      var WeekdayHeader = tWeek(); //Weekday header row

      //Calendar days are populated starting from second row
      r = (MS.w + 6) % 7;
      eml = Math.ceil((eml + r) / 7) * 7;
      var M = new ceMmDateTime(); // end of month
      M.SetTimezone(0);
      M.SetCT(uis.Type);
      for (i = 0; i < eml; i++) {
        var calDataObj = {};
        //start of checking valid day to display
        if (i >= r && js <= je) {
          M.SetJD(js);
          //Check holidays, weekend, inaccurate days and change style
          tstr = "PriDay";
          if (js == Cday.jdn) tstr = "PriDayToday";
          else if (M.holidays.length > 0) tstr = "PriDayHoliday";
          else if (M.w == 0 || M.w == 1) tstr = "PriDayWeekend";
          else if (uis.y < uis.LT || uis.y > uis.UT) tstr = "PriDayInaccu";

          //sabbath and moon just beside English day
          if (M.mp == 1) canvas = "FM";
          else if (M.mp == 3) canvas = "NM";
          calDataObj.js = js;
          calDataObj.englishDaysClass = tstr;
          calDataObj.EnglishDay = M.d;
          calDataObj.MCSabbath = x.T(M.sabbath, uis.Lang);
          calDataObj.canvas = canvas ? canvas : "";
          canvas = null
          //displaying Myanmar date
          if (M.my >= 2) {
            calDataObj = { ...calDataObj, ...mMDStr(M) };
          }
          calenderArr.push(calDataObj);
          js++; //Julian day number for next day
        } //end of checking valid day to display
        else {
          calenderArr.push({});
        } //if no day to display
      } //end of for loop

      //------------------------------------------------------------------------
      var response = {
        headerLine: headerLine,
        WeekdayHeader: WeekdayHeader,
        calenderArr: calenderArr,
      };
      return response;
    }
    //-------------------------------------------------------------------------
    //Produce html string for calendar day table header
    //input: (MS: Myanmar date at the start ,
    // ME: Myanmar date at the end)
    //output: (str: html string)
    function tHead(MS, ME) {
      var PThMC =
        MS.ToString("%y %M") +
        "," + //english year and month
        " Sasana Year " +
        MS.ToMString("&YYYY");
      // response.PThMC = PThMC

      if (MS.sy != ME.sy) PThMC = PThMC + " - " + ME.ToMString("&YYYY");

      PThMC = PThMC + " Ku,";

      if (ME.my >= 2) {
        //if Myanmar year after 2 ME
        PThMC = PThMC + " Myanmar Year ";
        if (MS.my >= 2) {
          PThMC = PThMC + MS.ToMString("&yyyy");
          if (MS.my != ME.my) PThMC = PThMC + " - ";
        }
        if (MS.my != ME.my) PThMC = PThMC + ME.ToMString("&yyyy");
        PThMC = PThMC + " Ku, ";
        if (MS.my >= 2) {
          PThMC = PThMC + MS.ToMString("&M");
          if (MS.mm != ME.mm) PThMC = PThMC + " - ";
        }
        if (MS.mm != ME.mm) {
          PThMC = PThMC + ME.ToMString("&M");
        }
      }

      PThMC = x.T(PThMC, uis.Lang);
      return PThMC;
    }

    //-------------------------------------------------------------------------
    //Produce html string for calendar day table weekday header row
    //output: (str: html string)
    function tWeek() {
      var str = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      var daysArr = [];
      for (var i = 0; i < str.length; i++) {
        var newStr = x.T(str[i], uis.Lang);
        daysArr.push(newStr);
      }
      return daysArr;
    }
    //-------------------------------------------------------------------------
    //Produce html string for Myanmar day
    //input: (M: Myanmar date)
    //output: (str: html string)
    function mMDStr(M) {
      tstr = "";

      //month name
      var PTdMCMonth = M.ToMString("&M");

      //moon phase and day
      tstr = "SecDa";
      if (M.sabbath == "Sabbath") tstr = "SecDaH";
      var moonPhaseAndDay = M.ToMString("&P");
      if (M.mp % 2 == 0) {
        moonPhaseAndDay = moonPhaseAndDay + " " + M.ToMString("&f");
      }

      //holiday
      // str += "<p class='MCPubHol'>" + sa.join("<br/>") + "</p>";
      // str += "<p class='MCHol'>" + sa.join("<br/>") + "</p>";

      var holidays = M.holidays.toString();
      var holidays2 = M.holidays2.toString();

      //astroligical days
      // str += "<p class='MCYtyz'>" + M.yatyaza + "</p>";
      // str += "<p class='MCYtyz'>" + M.pyathada + "</p>";

      var yatyaza = M.yatyaza;
      var pyathada = M.pyathada;
      var historicalDates = "";


      //historical dates
      try {
        var ih = chron.hSearch(M.jdn); //search for historical date
        if (ih >= 0) {
          historicalDates = "Chronicled";
        }
      } catch (err) { }
      var strObj = {
        PTdMCMonth: PTdMCMonth,
        moonPhaseAndDay: moonPhaseAndDay,
        englishMoonPhaseAndDay: moonPhaseAndDay,
        moonPhaseAndDayClass: tstr,
        holidays: holidays,
        holidays2: holidays2,
        yatyaza: yatyaza,
        pyathada: pyathada,
        historicalDates: historicalDates,
      };
      for (const property in strObj) {
        if (property != "englishMoonPhaseAndDay") {
          var test = x.T(strObj[property], uis.Lang);
          strObj[property] = test;
        } else {
          strObj[property] = strObj[property];
        }
      }
      return strObj;
    }

    initc();

    return response;
  } catch (error) {
    console.log(error);
  }
};

const getStaticData = async () => {
  try {
    var ema = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var typeName = ["British", "Gregorian", "Julian"];
    var languageName = [
      "English",
      "Myanmar",
      "Zawgyi",
      "Mon",
      "Tai",
      "S'Karen",
    ];
    var month = [];
    var type = [];
    var language = [];
    for (var i = 1; i <= 12; i++) {
      month.push({ id: i, name: ema[i - 1] });
    }
    for (var i = 0; i < typeName.length; i++) {
      type.push({ id: i, name: typeName[i] });
    }
    for (var i = 0; i < languageName.length; i++) {
      language.push({ id: i, name: languageName[i] });
    }

    return {
      month,
      type,
      language,
    };
  } catch (error) {
    console.log(error);
  }
};

const getCalenderDaysData = async (js, calenderType, calenderLanguage) => {
  try {
    js = +js;
    var response = {};
    var dt = new Date();
    var tstr = ""
    var uis = {
      Type: +calenderType,
      Lang: +calenderLanguage,
      y: dt.getFullYear(),
      BY: 640,
      EY: 2140, // beginning and end of the calendar
      LT: 1700,
      UT: 2022, // lower and upper threshold for accurate years
    };
    var M = new ceMmDateTime(js, 0, uis.Type);
    var x = new ceMmTranslate();
    var chron = new ceMmChronicle();

    var date = M.ToString("%y-%M-%dd");
    response.date = date;
    response.MyanmarDate = false
    if (M.my >= 2) {
      response.MyanmarDate = true
      tstr = "Sasana Year " + M.ToMString("&YYYY");
      tstr = x.T(tstr, uis.Lang);
      response.SasanaYear = tstr;

      tstr = "Myanmar Year " + M.ToMString("&yyyy");
      tstr = x.T(tstr, uis.Lang);
      response.MyanmarYear = tstr;

      //month name, moon phase and day
      tstr = "SecDa";
      if (M.sabbath == "Sabbath") tstr = "SecDaH";
      response.moonPhaseClass = tstr;
      tstr = M.ToMString("&M &P");
      if (M.mp % 2 == 0) {
        tstr += " " + M.ToMString("&f");
      }
      tstr = x.T(tstr, uis.Lang);
      response.moonPhase = tstr;

      //weekday
      tstr = M.ToString("%W");
      tstr = x.T(tstr, uis.Lang);
      response.weekday = tstr;

      //sabbath and moon
      if (M.sabbath != "") {
        tstr = M.sabbath;
        tstr = x.T(tstr, uis.Lang);
        response.sabbathAndMoon = tstr;
        if (M.mp == 1) response.canvas = "FM";
        else if (M.mp == 3) response.canvas = "NM";
      }

      //holiday  DaFontSize
      tstr = M.holidays.toString();
      tstr = x.T(tstr, uis.Lang);
      tstr = tstr ? tstr.split(",") : []
      response.holidays = tstr;

      tstr = M.holidays2.toString();
      tstr = x.T(tstr, uis.Lang);
      tstr = tstr ? tstr.split(",") : []
      response.holidays2 = tstr;

      //astroligical days
      // if (M.yatyaza != "") response.yatyaza = M.yatyaza;
      // if (M.pyathada != "") response.pyathada = M.pyathada;

      if (M.yatyaza != "") {
        tstr = x.T(M.yatyaza, uis.Lang);
        response.yatyaza = tstr;
      }
      if (M.pyathada != "") {
        tstr = x.T(M.pyathada, uis.Lang);
        response.pyathada = tstr;
      }

      tstr = M.astro.toString();
      tstr = x.T(tstr, uis.Lang);
      tstr = tstr ? tstr.split(",") : []
      response.astro = tstr;

      response.yearName = x.T(M.my_name + " Year", uis.Lang);
      response.mahabote = x.T("Mahabote - " + M.mahabote + " Born", uis.Lang);
      response.nakhat = x.T(M.nakhat + " Nakhat", uis.Lang);
      response.nagaHead = x.T("Naga Head " + M.nagahle + " Facing", uis.Lang);

      //Thingyan
      if (M.m == 4) {
        response.ThingyanLink =
          "https://yan9a.github.io/mmcal/html/Thingyan.htm";
        response.ThingyanName =
          x.T("Thingyan Calculator", uis.Lang) + " &gt;&gt";
      }
    }

    response.DaFoot = "JDN: " + js; //julian day number

    //historical dates
    try {
      var ih = chron.hSearch(M.jdn); //search for historical date
      if (ih >= 0) {
        response.MCAstro = "Chronicled: " + chron.chronicle(M.jdn);
      }
    } catch (err) { }

    if (M.y < uis.cy) {
      //rulers
      try {
        var ra = chron.ruler(M.jdn);
        if (ra.length > 0) {
          var i = 0;
          var r;
          var dyn;
          if (js < 2432555) response.DaFootRulers = "Ruler(s):";
          else response.DaFootRulers = "President:";
          var DaFootUl = [];
          for (i = 0; i < ra.length; i++) {
            r = ra[i];
            dyn = chron.dynasty(r.Dynasty);
            DaFootUl.push({
              r_url: r.URL,
              r_name: r.Name,
              dyn_url: dyn.URL,
              dyn_Description: dyn.Description,
            });
          }
          response.DaFootUl = DaFootUl;
        }
      } catch (err) { }
    }

    //accuracy
    if (uis.y < uis.LT || uis.y > uis.UT)
      response.ImportantNote =
        "Important note: the accuracy of this Myanmar date is in question!";

    return response
  } catch (error) {
    console.log(error);
  }
};


const getMCalenderData = async (month, year, calenderType, calenderLanguage) => {
  try {
    var x = new ceMmTranslate();
    var chron = new ceMmChronicle();
    var dt = new Date();

    var response = {};

    var uis = {
      Lang: undefined, // Language
      Type: calenderType, // Gregorian or Julian
      y: dt.getFullYear(),
      m: 1 + dt.getMonth(),
      d: dt.getDate(), // y, m, d to display
      cy: dt.getFullYear(),
      cm: 1 + dt.getMonth(),
      cd: dt.getDate(), // current y, m, d
      BY: 2,
      EY: 1500, //beginning and end of the calendar,
      LT: 1062,
      UT: 1384, //lower and upper threshold for accurate years
    };

    //-------------------------------------------------------------------------
    //initialize the calendar
    function initc() {
      //ce.className="DivMain";
      if (uis.Lang === undefined) {
        var L = calenderLanguage;
        var F = "";
        if (F == "Zawgyi-One") L = "Zawgyi";
        uis.Lang = SelectLang(L); //set a global variable for translation
      }
      var M = new ceMmDateTime(); // end of month
      var me = month;
      var mn = Number(me);
      var ye = year;
      var yn = Number(ye);
      uis.y = yn;
      uis.m = mn;
      uis.cy = M.my;
			uis.cm = M.mm;
			uis.d = uis.cd = M.md;
      // ye = yn;
      DisplayUI(0);
      // ce.innerHTML = UI();
    }

    //-------------------------------------------------------------------------
    //Select language
    //input: (L: number[0=English, 1=Myanmar, 2=Zawgyi, 3=Mon, 4=Tai, 5=Karen])
    function SelectLang(L) {
      var l = 1;
      if (L == 0 || L == "English" || L == "my-En" || L == "my-en") {
        l = 0;
      } else if (L == 3 || L == "Mon" || L == "my-Mon" || L == "my-mon") {
        l = 3;
      } else if (
        L == 2 ||
        L == "Zawgyi" ||
        L == "my-Z1" ||
        L == "my-z1" ||
        L == "Zawgyi-One"
      ) {
        l = 2;
      } else if (L == 4 || L == "Tai" || L == "my-Tai" || L == "my-tai") {
        l = 4;
      } else if (L == 5 || L == "Karen" || L == "my-Kar" || L == "my-kar") {
        l = 5;
      } else {
        l = 1;
      }
      return l;
    }

    function emc(v) {
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
      var si = M1.mm;
      var ei = M2.mm;
      if (mn == 0) mn = v == 1 ? 4 : 3;
      else if (mn == 4 && M1.myt != 0 && v != 1) mn = 0;
      else if (mn == 3 && M1.myt != 0 && v == 1) mn = 0;
      else {
        mn += Number(v);
        if (mn < si) {
          mn += 12;
          yn--;
        } else if (mn > ei) {
          mn = mn % 12;
          yn++;
        }
      }
      uis.y = yn;
      uis.m = mn;
      // me.innerHTML = mSelector(uis.y, uis.m);
      ye.value = yn;
      // var oce = document.getElementById("oc");
      // oce.innerHTML = UIContent(uis);
    }

    //-------------------------------------------------------------------------
    //display UI
    //input: (cev: calendar element to update [1:year, 2:month,
    //4:language, 3: type])
    function DisplayUI(cev) {
      switch (cev) {
        case 1:
          var ye = year;
          var yn = Number(ye);
          if (yn < uis.BY) {
            ye = yn = uis.BY;
          } else if (yn > uis.EY) {
            ye = yn = uis.EY;
          } else {
            ye = yn;
          }
          uis.y = yn;
          var me = month;
          uis.m = Number(me);
          // me.innerHTML = mSelector(uis.y, uis.m);
          break; //year
        case 2:
          var me = month;
          uis.m = Number(me);
          break; //month
        case 3:
          var te = calenderType;
          uis.Type = te;
          break; //type
        case 4:
          var le = calenderLanguage;
          uis.Lang = SelectLang(le);
          break; //Language
        //SelectLang: set a global variable in mc.js for translation
      }
      // var oce = document.getElementById("oc");
      // oce.innerHTML = UIContent();
      response = UIContent();
    }

    //-------------------------------------------------------------------------
    //Produce html string for calendar content
    //output: (str: html string)
    function UIContent() {
      var r, eml, i, js, je, tstr, canvas;
      var calenderArr = [];
      //------------------------------------------------------------------------
      var Cday = new ceMmDateTime(); // start of month
      Cday.SetTimezone(0);
      Cday.SetMDateTime(uis.cy, uis.cm, uis.cd); // time zone is irrelevant
      //------------------------------------------------------------------------
      //Find julian day number of start of the month
      var MS = new ceMmDateTime(); // start of month
      MS.SetTimezone(0); // time zone is irrelevant
      MS.SetCT(uis.Type);
      MS.SetMDateTime(uis.y, uis.m, 1, 12, 0, 0, 0);
      js = MS.jdn; //Find julian day number of start of
      eml = MS.mmlen;
      je = js + eml - 1;
      var ME = new ceMmDateTime(); // end of month
      ME.SetTimezone(0);
      ME.SetCT(uis.Type);
      ME.SetJD(je);
      //------------------------------------------------------------------------
      //Start of the table for calendar days
      // var str = " <table class='TableMC'> ";
      var headerLine = tHead(MS, ME); //header
      var WeekdayHeader = tWeek(); //Weekday header row

      var EnglishYear = ME.ToString("%y");
      var englishMonth = ME.ToString("%M");

      //Calendar days are populated starting from second row
      r = (MS.w + 6) % 7;
      eml = Math.ceil((eml + r) / 7) * 7;
      var M = new ceMmDateTime(); // end of month
      M.SetTimezone(0);
      M.SetCT(uis.Type);
      for (i = 0; i < eml; i++) {
        var calDataObj = {};
        //start of checking valid day to display
        if (i >= r && js <= je) {
          M.SetJD(js);
          tstr = "PriDay"; //Myanmar date and astrological days
          //Check holidays, weekend, inaccurate days and change style
          if (js == Cday.jdn) tstr = "PriDayToday";
          else if (M.holidays.length > 0) tstr = "PriDayHoliday";
          else if (M.w == 0 || M.w == 1) tstr = "PriDayWeekend";
          else if (uis.y < uis.LT || uis.y > uis.UT) tstr = "PriDayInaccu";
          //sabbath and moon just beside English day

          if (M.mp == 1) canvas = "FM";
          else if (M.mp == 3) canvas = "NM";
          calDataObj.js = js;
          calDataObj.englishDaysClass = tstr;
          calDataObj.EnglishDay = M.d;
          calDataObj.MCSabbath = x.T(M.sabbath, uis.Lang);
          calDataObj.canvas = canvas ? canvas : "";
          //displaying Myanmar date
          if (M.my >= 2) {
            calDataObj = { ...calDataObj, ...mMDStr(M) };
          }
          calenderArr.push(calDataObj);
          js++; //Julian day number for next day
        } //end of checking valid day to display
        else {
          calenderArr.push({});
        } //if no day to display
      } //end of for loop
      var response = {
        headerLine: headerLine,
        WeekdayHeader: WeekdayHeader,
        calenderArr: calenderArr,
        EnglishYear: EnglishYear,
        englishMonth: englishMonth
      };
      return response;
    }

    //-------------------------------------------------------------------------
    //Produce html string for calendar day table header
    //input: (MS: Myanmar date start ,
    // ME: Myanmar date end)
    //output: (str: html string)
    function tHead(MS, ME) {
      var PThMC = "";
      if (ME.my >= 2) {
        //if Myanmar year after 2 ME
        PThMC = PThMC + "Myanmar Year ";
        if (MS.my >= 2) {
          PThMC = PThMC + MS.ToMString("&yyyy");
          if (MS.my != ME.my) PThMC = PThMC + " - ";
        }
        if (MS.my != ME.my) PThMC = PThMC + ME.ToMString("&yyyy");
        PThMC = PThMC + " Ku, ";
        if (MS.my >= 2) {
          PThMC = PThMC + MS.ToMString("&M");
          if (MS.mm != ME.mm) PThMC = PThMC + " - ";
        }
        if (MS.mm != ME.mm) {
          PThMC = PThMC + ME.ToMString("&M");
        }
        PThMC += ", ";
      }

      PThMC = PThMC + "Sasana Year " + MS.ToMString("&YYYY"); //Sasana year
      if (MS.sy != ME.sy) PThMC = PThMC + " - " + ME.ToMString("&YYYY");
      PThMC = PThMC + " Ku, ";
      PThMC = PThMC + MS.ToString("%y"); //english year
      if (MS.y != ME.y) PThMC = PThMC + " - " + ME.ToString("%y");
      PThMC = PThMC + " " + MS.ToString("%M"); //english month
      if (MS.m != ME.m) PThMC = PThMC + " - " + ME.ToString("%M");
      PThMC = x.T(PThMC, uis.Lang);
      return PThMC;
    }
    //-------------------------------------------------------------------------
    //Produce html string for calendar day table weekday header row
    //output: (str: html string)
    function tWeek() {
      var str = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      var daysArr = [];
      for (var i = 0; i < str.length; i++) {
        var newStr = x.T(str[i], uis.Lang);
        daysArr.push(newStr);
      }
      return daysArr;
    }

    //-------------------------------------------------------------------------
    //Produce html string for Myanmar day
    //input: (M: Myanmar date)
    //output: (str: html string)
    function mMDStr(M) {
      var tstr = "";

      //month name
      var PTdMCMonth = M.ToMString("&M");

      //moon phase and day
      tstr = "SecDa";
      if (M.sabbath == "Sabbath") tstr = "SecDaH";
      var moonPhaseAndDay = M.ToMString("&P");
      if (M.mp % 2 == 0) {
        moonPhaseAndDay = moonPhaseAndDay + " " + M.ToMString("&f");
      }

      //holiday
      // str += "<p class='MCPubHol'>" + sa.join("<br/>") + "</p>";
      // str += "<p class='MCHol'>" + sa.join("<br/>") + "</p>";

      var holidays = M.holidays.toString();
      var holidays2 = M.holidays2.toString();

      //astroligical days
      // str += "<p class='MCYtyz'>" + M.yatyaza + "</p>";
      // str += "<p class='MCYtyz'>" + M.pyathada + "</p>";

      var yatyaza = M.yatyaza;
      var pyathada = M.pyathada;

      var historicalDates = "";

      //historical dates
      try {
        var ih = chron.hSearch(M.jdn); //search for historical date
        if (ih >= 0) {
          historicalDates = "Chronicled";
        }
      } catch (err) { }
      var strObj = {
        PTdMCMonth: PTdMCMonth,
        moonPhaseAndDay: moonPhaseAndDay,
        moonPhaseAndDayClass: tstr,
        englishMoonPhaseAndDay: moonPhaseAndDay,
        holidays: holidays,
        holidays2: holidays2,
        yatyaza: yatyaza,
        pyathada: pyathada,
        historicalDates: historicalDates,
      };
      for (const property in strObj) {
        if(property != "englishMoonPhaseAndDay"){
          var test = x.T(strObj[property], uis.Lang);
          strObj[property] = test;
        }else{
          strObj[property] = strObj[property];
        }
      }
      return strObj;
    }

    var ema = ["1st Waso", "Tagu", "Kason", "Nayon", "Waso", "Wagaung", "Tawthalin",
      "Thadingyut", "Tazaungmon", "Nadaw", "Pyatho", "Tabodwe",
      "Tabaung", "Late Tagu", "Late Kason"];
   
    initc();
    var MS = new ceMmDateTime();
    response.year = MS.ToMString("&yyyy")
    response.month = MS.ToMString("&M")


    var month = [];
    var SY = 1577917828 / 4320000; //solar year (365.2587565)
    var MO = 1954168.050623; //beginning of 0 ME
    var i = 0;
    var j1 = Math.round(SY * response.year + MO) + 1;
    var j2 = Math.round(SY * (response.year + 1) + MO);
    var M1 = ceMmDateTime.j2m(j1);
    var M2 = ceMmDateTime.j2m(j2);
    var si = M1.mm;
    var ei = M2.mm;
    if (si == 0) si = 4; // si will always Tagu or Kason, 
    var monthId = null
    for (i = si; i <= ei; i++) {
      if (i == 4 && M1.myt != 0) {
        if(response.month == name){
          monthId = 0
        }
      }
      var name = ((i == 4 && M1.myt != 0) ? "2nd " : "") + ema[i]
      if(response.month == name){
        monthId = i
      }
    }
    response.monthId =monthId

    return response
  } catch (error) {
    console.log(error);
    return false
  }
};

const getMCalenderStaticData = async (year) => {
  try {
    var ema = ["1st Waso", "Tagu", "Kason", "Nayon", "Waso", "Wagaung", "Tawthalin",
      "Thadingyut", "Tazaungmon", "Nadaw", "Pyatho", "Tabodwe",
      "Tabaung", "Late Tagu", "Late Kason"];

    var typeName = ["British", "Gregorian", "Julian"];
    var languageName = [
      "English",
      "Myanmar",
      "Zawgyi",
      "Mon",
      "Tai",
      "S'Karen",
    ];
    var month = [];
    var type = [];
    var language = [];
    var SY = 1577917828 / 4320000; //solar year (365.2587565)
    var MO = 1954168.050623; //beginning of 0 ME
    var i = 0;
    var j1 = Math.round(SY * year + MO) + 1;
    var j2 = Math.round(SY * (year + 1) + MO);
    var M1 = ceMmDateTime.j2m(j1);
    var M2 = ceMmDateTime.j2m(j2);
    var si = M1.mm;
    var ei = M2.mm;
    if (si == 0) si = 4; // si will always Tagu or Kason, 
    for (i = si; i <= ei; i++) {
      if (i == 4 && M1.myt != 0) {
        month.push({ id: 0, name: ema[0] });
      }
      var name = ((i == 4 && M1.myt != 0) ? "2nd " : "") + ema[i]
      month.push({ id: i.toString(), name: name });
    }
    for (var i = 0; i < typeName.length; i++) {
      type.push({ id: i, name: typeName[i] });
    }
    for (var i = 0; i < languageName.length; i++) {
      language.push({ id: i, name: languageName[i] });
    }

    return {
      month,
      type,
      language,
    }
  } catch (error) {
    console.log(error);
    return false
  }
};

const getMCalenderDaysData = async (js, calenderType, calenderLanguage) => {
  try {
    js = +js;
    var response = {};
    var dt = new Date();
    var tstr = ""
    var uis = {
      Type: +calenderType,
      Lang: +calenderLanguage,
      y: dt.getFullYear(),
      BY: 640,
      EY: 2140, // beginning and end of the calendar
      LT: 1700,
      UT: 2022, // lower and upper threshold for accurate years
    };
    var M = new ceMmDateTime(js, 0, uis.Type);
    var x = new ceMmTranslate();
    var chron = new ceMmChronicle();

    var date = M.ToString("%y-%M-%dd");
    response.date = date;
    response.MyanmarDate = false
    if (M.my >= 2) {
      response.MyanmarDate = true;
      tstr = "Sasana Year " + M.ToMString("&YYYY");
      tstr = x.T(tstr, uis.Lang);
      response.SasanaYear = tstr;

      tstr = "Myanmar Year " + M.ToMString("&yyyy");
      tstr = x.T(tstr, uis.Lang);
      response.MyanmarYear = tstr;

      //month name, moon phase and day
      tstr = "SecDa";
      if (M.sabbath == "Sabbath") tstr = "SecDaH";
      response.moonPhaseClass = tstr;
      tstr = M.ToMString("&M &P");
      if (M.mp % 2 == 0) {
        tstr += " " + M.ToMString("&f");
      }
      tstr = x.T(tstr, uis.Lang);
      response.moonPhase = tstr;

      //weekday
      tstr = M.ToString("%W");
      tstr = x.T(tstr, uis.Lang);
      response.weekday = tstr;

      //sabbath and moon
      if (M.sabbath != "") {
        tstr = M.sabbath;
        tstr = x.T(tstr, uis.Lang);
        response.sabbathAndMoon = tstr;
        if (M.mp == 1) response.canvas = "FM";
        else if (M.mp == 3) response.canvas = "NM";
      }


      //holiday  DaFontSize
      tstr = M.holidays.toString();
      tstr = x.T(tstr, uis.Lang);
      tstr = tstr ? tstr.split(",") : []
      response.holidays = tstr;

      tstr = M.holidays2.toString();
      tstr = x.T(tstr, uis.Lang);
      tstr = tstr ? tstr.split(",") : []
      response.holidays2 = tstr;

      //astroligical days
      if (M.yatyaza != "") {
        tstr = x.T(M.yatyaza, uis.Lang);
        response.yatyaza = tstr;
      }
      if (M.pyathada != "") {
        tstr = x.T(M.pyathada, uis.Lang);
        response.pyathada = tstr;
      }

      tstr = M.astro.toString();
      tstr = x.T(tstr, uis.Lang);
      tstr = tstr ? tstr.split(",") : []
      response.astro = tstr;

      response.yearName = x.T(M.my_name + " Year", uis.Lang);
      response.mahabote = x.T("Mahabote - " + M.mahabote + " Born", uis.Lang);
      response.nakhat = x.T(M.nakhat + " Nakhat", uis.Lang);
      response.nagaHead = x.T("Naga Head " + M.nagahle + " Facing", uis.Lang);

      //Thingyan
      if (M.m == 4) {
        response.ThingyanLink =
          "https://yan9a.github.io/mmcal/html/Thingyan.htm";
        response.ThingyanName =
          x.T("Thingyan Calculator", uis.Lang) + " &gt;&gt";
      }
    }

    response.DaFoot = "JDN: " + js; //julian day number

    //historical dates
    try {
      var ih = chron.hSearch(M.jdn); //search for historical date
      if (ih >= 0) {
        response.MCAstro = "Chronicled: " + chron.chronicle(M.jdn);
      }
    } catch (err) { }

    if (M.y < uis.cy) {
      //rulers
      try {
        var ra = chron.ruler(M.jdn);
        if (ra.length > 0) {
          var i = 0;
          var r;
          var dyn;
          if (js < 2432555) response.DaFootRulers = "Ruler(s):";
          else response.DaFootRulers = "President:";
          var DaFootUl = [];
          for (i = 0; i < ra.length; i++) {
            r = ra[i];
            dyn = chron.dynasty(r.Dynasty);
            DaFootUl.push({
              r_url: r.URL,
              r_name: r.Name,
              dyn_url: dyn.URL,
              dyn_Description: dyn.Description,
            });
          }
          response.DaFootUl = DaFootUl;
        }
      } catch (err) { }
    }

    //accuracy
    if (uis.y < uis.LT || uis.y > uis.UT)
      response.ImportantNote =
        "Important note: the accuracy of this Myanmar date is in question!";

    return response
  } catch (error) {
    console.log(error);
    return false
  }
};



module.exports = {
  getCalenderData: getCalenderData,
  getStaticData: getStaticData,
  getCalenderDaysData: getCalenderDaysData,
  getMCalenderData: getMCalenderData,
  getMCalenderStaticData: getMCalenderStaticData,
  getMCalenderDaysData: getMCalenderDaysData,
};
