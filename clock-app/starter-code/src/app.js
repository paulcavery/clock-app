document.addEventListener("DOMContentLoaded", () => {
	const windowWidth = window.outerWidth;
	const button = document.getElementById("toggleExpand");
	const more = document.getElementById("moreLess");
	const div = document.getElementById("weekDayContainer");
	const expand = document.getElementsByClassName("expansion")[0];
	const refresh = document.getElementById("refresh");
	const morning = "Good Morning";
	const afternoon = "Good Afternoon";
	const evening = "Good Evening";
	const quoteContainer = document.getElementsByClassName("quoteContainer")[0];
	if (windowWidth > 767) {
		div.parentNode.insertBefore(div, document.getElementById("yearContainer"));
	}

	const toggleDay = () => {
		const theme = document.getElementById("theme");
		theme.classList.remove("nightMode");
		theme.classList.add("dayMode");
	};
	const toggleNight = () => {
		const theme = document.getElementById("theme");
		theme.classList.remove("dayMode");
		theme.classList.add("nightMode");
	};
	const toggleGreeting = (greet) => {
		if (windowWidth > 767) {
			d3.select("#greeting").text(greet + ", it's currently");
		} else {
			d3.select("#greeting").text(greet);
		}
	};

	const toggleArrowUp = () => {
		d3.select("svg").remove();
		d3.select("#arrow").insert("img");
		d3.select("img").attr("src", "./assets/desktop/icon-arrow-up.svg");
	};
	const toggleArrowDown = () => {
		d3.select("svg").remove();
		d3.select("#arrow").insert("img");
		d3.select("img").attr("src", "./assets/desktop/icon-arrow-down.svg");
	};
	button.addEventListener("click", () => {
		console.log("clicked");
		if (expand.style.display == "none") {
			console.log("expanded");
			expand.style.display = "block";
			quoteContainer.style.display = "none";
			more.innerHTML = "less";
			d3.select(".timeContainer").style("margin-top", "5rem");
			toggleArrowUp();
			convertImage("img");
		} else if ((expand.style.display = "block")) {
			console.log("no expand");
			expand.style.display = "none";
			quoteContainer.style.display = "block";
			more.innerHTML = "more";
			d3.select(".timeContainer").style("margin-top", "0");
			toggleArrowDown();
			convertImage("img");
		}
	});

	const displayTime = () => {
		axios
			.get("http://worldtimeapi.org/api/ip")
			.then((res) => {
				const data = res.data;
				const rawTime = new Date(data.datetime);
				const hours = rawTime.getHours();
				const minutes = rawTime.getMinutes();
				const extraMinutes = "0" + minutes;
				const timeStamp = hours + ":" + minutes;
				const extraTimeStamp = hours + ":" + extraMinutes;
				console.log(rawTime);
				console.log(data);
				if (minutes < 10) {
					d3.select(".time").text(extraTimeStamp);
				} else {
					d3.select(".time").text(timeStamp);
				}

				d3.select(".time").insert("span").text(data.abbreviation);
			})
			.catch((e) => {
				console.log(e);
			});
	};
	displayTime();
	const getLocation = () => {
		axios
			.get("https://freegeoip.app/json/")
			.then((res) => {
				const data = res.data;
				const country = data.country_code;
				const city = data.city;
				d3.select(".location").text("in " + city + ", " + country);
			})
			.catch((e) => {
				console.log(e);
			});
	};
	getLocation();
	const themeToggle = () => {
		axios
			.get("http://worldtimeapi.org/api/ip")
			.then((res) => {
				const data = res.data;
				const rawTime = new Date(data.datetime);
				const hours = rawTime.getHours();
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
			})
			.catch((e) => {
				console.log(e);
			});
	};
	themeToggle();
	const displayExpansion = () => {
		axios.get("http://worldtimeapi.org/api/ip").then((res) => {
			const data = res.data;
			const timeZone = data.timezone;
			const dayOfTheWeek = data.day_of_week;
			const dayOfTheYear = data.day_of_year;
			const weekNumber = data.week_number;
			d3.select(".timeZone")
				.text(timeZone)
				.select(".weekDay")
				.text(dayOfTheWeek)
				.select(".yearDay")
				.text(dayOfTheYear)
				.select(".weekNumber")
				.text(weekNumber);
		});
	};
	displayExpansion();
	refresh.addEventListener("click", () => {
		axios
			.get("http://api.quotable.io/random?tags=inspirational&minLength=100")
			.then((res) => {
				const data = res.data;
				const content = data.content;
				const author = data.author;
				d3.select("#quote").text(content);
				d3.select(".author").text(author);
			})
			.catch((err) => {
				console.log(err);
			});
	});
});
