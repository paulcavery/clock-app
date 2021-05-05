"use strict";

document.addEventListener("DOMContentLoaded", function () {
  var windowWidth = window.outerWidth;
  var button = document.getElementById("toggleExpand");
  var more = document.getElementById("moreLess");
  var div = document.getElementById("weekDayContainer");
  var expand = document.getElementsByClassName("expansion")[0];
  var refresh = document.getElementById("refresh");
  var morning = "Good Morning";
  var afternoon = "Good Afternoon";
  var evening = "Good Evening";
  var quoteContainer = document.getElementsByClassName("quoteContainer")[0];

  if (windowWidth > 767) {
    div.parentNode.insertBefore(div, document.getElementById("yearContainer"));
  }

  var toggleDay = function toggleDay() {
    var theme = document.getElementById("theme");
    theme.classList.remove("nightMode");
    theme.classList.add("dayMode");
  };

  var toggleNight = function toggleNight() {
    var theme = document.getElementById("theme");
    theme.classList.remove("dayMode");
    theme.classList.add("nightMode");
  };

  var toggleGreeting = function toggleGreeting(greet) {
    if (windowWidth > 767) {
      d3.select("#greeting").text(greet + ", it's currently");
    } else {
      d3.select("#greeting").text(greet);
    }
  };

  var toggleArrowUp = function toggleArrowUp() {
    d3.select("svg").remove();
    d3.select("#arrow").insert("img");
    d3.select("img").attr("src", "./assets/desktop/icon-arrow-up.svg");
  };

  var toggleArrowDown = function toggleArrowDown() {
    d3.select("svg").remove();
    d3.select("#arrow").insert("img");
    d3.select("img").attr("src", "./assets/desktop/icon-arrow-down.svg");
  };

  button.addEventListener("click", function () {
    console.log("clicked");

    if (expand.style.display == "none") {
      console.log("expanded");
      expand.style.display = "block";
      quoteContainer.style.display = "none";
      more.innerHTML = "less";
      d3.select(".timeContainer").style("margin-top", "5rem");
      toggleArrowUp();
      convertImage("img");
    } else if (expand.style.display = "block") {
      console.log("no expand");
      expand.style.display = "none";
      quoteContainer.style.display = "block";
      more.innerHTML = "more";
      d3.select(".timeContainer").style("margin-top", "0");
      toggleArrowDown();
      convertImage("img");
    }
  });

  var displayTime = function displayTime() {
    axios.get("http://worldtimeapi.org/api/ip").then(function (res) {
      var data = res.data;
      var rawTime = new Date(data.datetime);
      var hours = rawTime.getHours();
      var minutes = rawTime.getMinutes();
      var extraMinutes = "0" + minutes;
      var timeStamp = hours + ":" + minutes;
      var extraTimeStamp = hours + ":" + extraMinutes;
      console.log(rawTime);
      console.log(data);

      if (minutes < 10) {
        d3.select(".time").text(extraTimeStamp);
      } else {
        d3.select(".time").text(timeStamp);
      }

      d3.select(".time").insert("span").text(data.abbreviation);
    })["catch"](function (e) {
      console.log(e);
    });
  };

  displayTime();

  var getLocation = function getLocation() {
    axios.get("https://freegeoip.app/json/").then(function (res) {
      var data = res.data;
      var country = data.country_code;
      var city = data.city;
      d3.select(".location").text("in " + city + ", " + country);
    })["catch"](function (e) {
      console.log(e);
    });
  };

  getLocation();

  var themeToggle = function themeToggle() {
    axios.get("http://worldtimeapi.org/api/ip").then(function (res) {
      var data = res.data;
      var rawTime = new Date(data.datetime);
      var hours = rawTime.getHours();

      if (hours > 5 && hours < 18) {
        toggleDay();
      } else {
        toggleNight();
      }

      if (hours > 5 && hours < 12) {
        toggleGreeting(morning);
      } else if (hours > 12 && hours < 18) {
        toggleGreeting(afternoon);
      } else {
        toggleGreeting(evening);
      }
    })["catch"](function (e) {
      console.log(e);
    });
  };

  themeToggle();

  var displayExpansion = function displayExpansion() {
    axios.get("http://worldtimeapi.org/api/ip").then(function (res) {
      var data = res.data;
      var timeZone = data.timezone;
      var dayOfTheWeek = data.day_of_week;
      var dayOfTheYear = data.day_of_year;
      var weekNumber = data.week_number;
      d3.select(".timeZone").text(timeZone).select(".weekDay").text(dayOfTheWeek).select(".yearDay").text(dayOfTheYear).select(".weekNumber").text(weekNumber);
    });
  };

  displayExpansion();
  refresh.addEventListener("click", function () {
    axios.get("http://api.quotable.io/random?tags=inspirational&minLength=100").then(function (res) {
      var data = res.data;
      var content = data.content;
      var author = data.author;
      d3.select("#quote").text(content);
      d3.select(".author").text(author);
    })["catch"](function (err) {
      console.log(err);
    });
  });
});