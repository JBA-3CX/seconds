function updateWorkWeekProgress() {
    const now = new Date();
    const totalWorkMs = 5 * 8.5 * 60 * 60 * 1000; // 42.5 hours

    // Determine the Monday 09:00 of the current week
    const day = now.getDay(); // Sunday = 0
    const diffToMonday = (day + 6) % 7; // 0 if Monday
    const monday = new Date(now);
    monday.setHours(9, 0, 0, 0);
    monday.setDate(now.getDate() - diffToMonday);

    let workedMs = 0;

    for (let i = 0; i < 5; i++) {
        const workDayStart = new Date(monday);
        workDayStart.setDate(monday.getDate() + i);
        const workDayEnd = new Date(workDayStart);
        workDayEnd.setHours(17, 30, 0, 0);

        if (now > workDayEnd) {
            // Whole day already worked
            workedMs += 8.5 * 60 * 60 * 1000;
        } else if (now >= workDayStart && now <= workDayEnd) {
            // Currently within work hours
            workedMs += now - workDayStart;
            break;
        } else if (now < workDayStart) {
            // Future day
            break;
        }
    }

    const percentComplete = (workedMs / totalWorkMs) * 100;
    const percentLeft = 100 - percentComplete;

    const fill = document.getElementById("work-week-fill");
    const text = document.getElementById("work-week-text");

    const outsideHours = (
        day === 0 || day === 6 || // weekend
        now < monday ||           // before Monday 09:00
        now.getHours() < 9 ||     // before 9:00
        now.getHours() > 17 || (now.getHours() === 17 && now.getMinutes() > 30) // after 17:30
    );

    if (outsideHours) {
        fill.style.width = (workedMs / totalWorkMs * 100).toFixed(2) + "%";
        fill.style.backgroundColor = "#999";
        text.textContent = "Outside of work hours";
    } else {
        fill.style.width = percentComplete.toFixed(2) + "%";
        fill.style.backgroundColor = "#4caf50";
        text.textContent = `${percentLeft.toFixed(2)}% of the work week remaining`;
    }
}

updateWorkWeekProgress();
setInterval(updateWorkWeekProgress, 60000);
