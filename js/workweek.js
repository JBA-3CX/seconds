function updateWorkWeekProgress() {
    const now = new Date();

    // Total milliseconds in the work week (5 days x 8.5 hours)
    const totalWorkMs = 5 * 8.5 * 60 * 60 * 1000;

    // Build Monday 09:00
    const weekStart = new Date(now);
    weekStart.setHours(9, 0, 0, 0);
    weekStart.setDate(now.getDate() - (now.getDay() - 1));

    // Build Friday 17:30
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 4);
    weekEnd.setHours(17, 30, 0, 0);

    let workedMs = 0;

    if (now < weekStart) {
        // Before Monday 09:00
        workedMs = 0;
    } else if (now > weekEnd) {
        // After Friday 17:30
        workedMs = totalWorkMs;
    } else {
        // We're inside the work week
        // Loop through Monday to Friday
        for (let i = 0; i < 5; i++) {
            const dayStart = new Date(weekStart);
            dayStart.setDate(weekStart.getDate() + i);

            const dayEnd = new Date(dayStart);
            dayEnd.setHours(17, 30, 0, 0);

            if (now > dayEnd) {
                workedMs += 8.5 * 60 * 60 * 1000; // full day
            } else if (now >= dayStart && now <= dayEnd) {
                workedMs += now - dayStart; // partial current day
                break;
            }
        }
    }

    const percentComplete = (workedMs / totalWorkMs) * 100;
    const percentLeft = 100 - percentComplete;

    const fill = document.getElementById("work-week-fill");
    const text = document.getElementById("work-week-text");

    if (now < weekStart || now > weekEnd) {
        fill.style.width = "100%";
        fill.style.backgroundColor = "#ccc";
        text.textContent = "Outside of work hours";
    } else {
        fill.style.width = percentComplete.toFixed(2) + "%";
        fill.style.backgroundColor = "#4caf50";
        text.textContent = `${percentLeft.toFixed(2)}% of the work week remaining`;
    }
}

updateWorkWeekProgress();
setInterval(updateWorkWeekProgress, 60000);
