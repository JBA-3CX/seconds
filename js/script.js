const cities = [
    { name: "USA - Baker Island", timeZone: "Etc/GMT+12" },        // UTC−12:00
    { name: "USA - Honolulu", timeZone: "Pacific/Honolulu" },      // UTC−10:00
    { name: "USA - Anchorage", timeZone: "America/Anchorage" },    // UTC−09:00
    { name: "USA - Los Angeles", timeZone: "America/Los_Angeles" },// UTC−08:00
    { name: "USA - Denver", timeZone: "America/Denver" },          // UTC−07:00
    { name: "USA - Chicago", timeZone: "America/Chicago" },        // UTC−06:00
    { name: "USA - New York", timeZone: "America/New_York" },      // UTC−05:00
    { name: "Venezuela - Caracas", timeZone: "America/Caracas" },  // UTC−04:00
    { name: "Canada - Halifax", timeZone: "America/Halifax" },     // UTC−03:00
    { name: "Argentina - Buenos Aires", timeZone: "America/Argentina/Buenos_Aires" }, // UTC−03:00
    { name: "South Georgia - South Georgia", timeZone: "Atlantic/South_Georgia" }, // UTC−02:00
    { name: "Portugal - Azores", timeZone: "Atlantic/Azores" },    // UTC−01:00
    { name: "Iceland - Reykjavik", timeZone: "Atlantic/Reykjavik" }, // UTC±00:00
    { name: "UK - London", timeZone: "Europe/London" },
    { name: "Germany - Berlin", timeZone: "Europe/Berlin" },       // UTC+01:00
    { name: "Egypt - Cairo", timeZone: "Africa/Cairo" },           // UTC+02:00
    { name: "Russia - Moscow", timeZone: "Europe/Moscow" },        // UTC+03:00
    { name: "Iran - Tehran", timeZone: "Asia/Tehran" },            // UTC+03:30
    { name: "UAE - Dubai", timeZone: "Asia/Dubai" },               // UTC+04:00
    { name: "Afghanistan - Kabul", timeZone: "Asia/Kabul" },       // UTC+04:30
    { name: "Pakistan - Karachi", timeZone: "Asia/Karachi" },      // UTC+05:00
    { name: "India - New Delhi", timeZone: "Asia/Kolkata" },       // UTC+05:30
    { name: "Nepal - Kathmandu", timeZone: "Asia/Kathmandu" },     // UTC+05:45
    { name: "Bangladesh - Dhaka", timeZone: "Asia/Dhaka" },        // UTC+06:00
    { name: "Myanmar - Yangon", timeZone: "Asia/Yangon" },         // UTC+06:30
    { name: "Thailand - Bangkok", timeZone: "Asia/Bangkok" },      // UTC+07:00
    { name: "Singapore - Singapore", timeZone: "Asia/Singapore" }, // UTC+08:00
    { name: "Australia - Eucla", timeZone: "Australia/Eucla" },    // UTC+08:45
    { name: "Japan - Tokyo", timeZone: "Asia/Tokyo" },             // UTC+09:00
    { name: "Australia - Adelaide", timeZone: "Australia/Adelaide" }, // UTC+09:30
    { name: "Australia - Sydney", timeZone: "Australia/Sydney" },  // UTC+10:00
    { name: "New Caledonia - Nouméa", timeZone: "Pacific/Noumea" }, // UTC+11:00
    { name: "New Zealand - Auckland", timeZone: "Pacific/Auckland" }, // UTC+12:00
    { name: "New Zealand - Chatham Islands", timeZone: "Pacific/Chatham" }, // UTC+12:45
    { name: "Samoa - Apia", timeZone: "Pacific/Apia" },            // UTC+13:00
    { name: "Kiribati - Kiritimati", timeZone: "Pacific/Kiritimati" } // UTC+14:00
];

/**
 * Returns the current time as a string in HH:MM format for a given IANA timezone.
 * @param {string} timeZone - The IANA timezone name (e.g., "America/New_York").
 * @returns {string} The current time in HH:MM format.
 */
function getTimeInTimeZone(timeZone) {
    const now = new Date();
    return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: timeZone
    }).format(now);
}

/**
 * Returns the current hour (0-23) for a given IANA timezone.
 * @param {string} timeZone - The IANA timezone name (e.g., "America/New_York").
 * @returns {number} The current hour (0-23) in the specified timezone.
 */
function getHourInTimeZone(timeZone) {
    const now = new Date();
    return parseInt(new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        hour12: false,
        timeZone: timeZone
    }).format(now));
}

/**
 * Updates the list of locations currently experiencing nighttime (1 AM to 5 AM).
 * This function fetches the current hour for each city in the `cities` array,
 * filters those that are between 1 AM and 5 AM, and then dynamically updates
 * the HTML list element with id "night-locations".
 * If no cities are in this time range, it displays a corresponding message.
 */
function updateNighttimeList() {
    const ul = document.getElementById("night-locations");
    ul.innerHTML = ""; // Clear the current list

    // Filter cities to find those where the local time is between 1 AM and 5 AM
    const inNight = cities.filter(city => {
        const hour = getHourInTimeZone(city.timeZone);
        return hour >= 1 && hour < 5; // 1 AM (01:00) to 4:59 AM (04:59)
    });

    if (inNight.length === 0) {
        const li = document.createElement("li");
        li.textContent = "No locations currently between 1AM–5AM.";
        ul.appendChild(li);
    } else {
        // Populate the list with cities in nighttime
        inNight.forEach(city => {
            const li = document.createElement("li");
            const time = getTimeInTimeZone(city.timeZone);
            li.textContent = `${city.name} – ${time}`;
            ul.appendChild(li);
        });
    }
}

// Initial call to populate the list on page load
updateNighttimeList();
// Set an interval to refresh the nighttime list every 60000 milliseconds (1 minute)
// This ensures the displayed information remains relatively current.
setInterval(updateNighttimeList, 60000);

/**
 * Calculates the total number of seconds from Sunday 00:00:00 to a user-selected day and time.
 * 
 * The function performs the following steps:
 * 1. Retrieves the selected day and time string from the input fields.
 * 2. Validates the time string:
 *    - Checks if it matches the HH:MM:SS format.
 *    - If not, displays an error message "Invalid time format. Please use HH:MM:SS." and exits.
 * 3. Parses the time string into hours, minutes, and seconds.
 * 4. Validates the parsed time components:
 *    - Checks if they are numbers and within valid ranges (H: 0-23, M: 0-59, S: 0-59).
 *    - If not, displays an error message "Invalid time values. Hours (0-23), Minutes (0-59), Seconds (0-59)." and exits.
 * 5. Determines the index of the selected day (Sunday = 0, Monday = 1, etc.).
 * 6. Calculates the total seconds:
 *    - Converts the number of full days past Sunday into seconds (dayIndex * 24 * 60 * 60).
 *    - Converts the input time (hours, minutes, seconds) into seconds.
 *    - Sums these two values to get the total seconds from Sunday 00:00:00.
 * 7. Displays the calculated total seconds or an error message in the HTML element with id "result".
 */
function calculateSeconds() {
    const dayElement = document.getElementById("day");
    const timeElement = document.getElementById("time");
    const resultElement = document.getElementById("result");

    const selectedDay = dayElement.value;
    const timeString = timeElement.value;

    // Validate time format (HH:MM:SS)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (!timeRegex.test(timeString)) {
        resultElement.textContent = "Invalid time format. Please use HH:MM:SS.";
        return;
    }

    // Parse time components
    const timeParts = timeString.split(":");
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const seconds = parseInt(timeParts[2], 10);

    // Validate time component values
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) ||
        hours < 0 || hours > 23 ||
        minutes < 0 || minutes > 59 ||
        seconds < 0 || seconds > 59) {
        resultElement.textContent = "Invalid time values. Hours (0-23), Minutes (0-59), Seconds (0-59).";
        return;
    }

    // Calculate seconds from days
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayIndex = days.indexOf(selectedDay);

    // This check is more of a safeguard; the dropdown should prevent invalid day selection.
    if (dayIndex === -1) {
        resultElement.textContent = "Invalid day selected."; 
        return;
    }

    const secondsInADay = 24 * 60 * 60;
    const secondsFromDays = dayIndex * secondsInADay;

    // Calculate seconds from time
    const secondsFromTime = hours * 60 * 60 + minutes * 60 + seconds;

    // Total seconds
    const totalSeconds = secondsFromDays + secondsFromTime;

    resultElement.textContent = "Total seconds since Sunday 00:00:00: " + totalSeconds;
}
