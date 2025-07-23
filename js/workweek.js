function updateWorkWeekProgress() {
    const now = new Date();

    const totalWorkMs = 5 * 8.5 * 60 * 60 * 1000; // 42.5 hours in ms

    // Calculate Monday 09:00 of this week
    const currentDay = now.getDay(); // Sunday=0 ... Saturday=6
    const daysFromMonday = (currentDay + 6) % 7; // Mon=0, Tue=1...
    const monday = new Date(now);
    monday.setDate(now.getDate() - daysFromMonday);
    monday.setHours(9, 0, 0, 0);
    monday.setMinutes(0, 0, 0);

    let workedMs = 0;

    for (let i = 0; i < 5; i++) {
        const workStart = new Date(monday);
        workStart.setDate(monday.getDate() + i);
        workStart.setHours(9, 0, 0, 0);

        const workEnd = new Date(workStart);
        workEnd.setHours(17, 30, 0, 0);

        if (now >= workEnd) {
            // Entire workday done
            workedMs += 8.5 * 60 * 60 * 1000;
        } else if (now >= workStart && now < workEnd) {
            // Current workday, partial time
            workedMs += now - workStart;
            break; // No more days to count after today
        } else if (now < workStart) {
            // Future workday, no time counted
            break;
        }
    }

    const percentComplete = (workedMs / totalWorkMs) * 100;
    const percentLeft = 100 - percentComplete;

    // Detect if now is outside work hours or weekend
    const isWeekend = currentDay === 0 || currentDay === 6;
    const beforeWorkday = now < monday;
    const beforeTodayWorkStart = (now.getHours() < 9) || (now.getHours() === 9 && now.getMinutes() === 0 && now.getSeconds() === 0);
    const afterWorkHours = (now.getHours() > 17) || (now.getHours() === 17 && now.getMinutes() > 30);

    const outsideHours = isWeekend || beforeWorkday || afterWorkHours || beforeTodayWorkStart;

    const fill = document.getElementById("work-week-fill");
    const text = document.getElementById("work-week-text");

    if (outsideHours) {
        // Pause progress but keep bar as is
        fill.style.width = percentComplete.toFixed(2) + "%";
        fill.style.backgroundColor = "#999";
        text.textContent = "Outside of work hours";
    } else {
        fill.style.width = percentComplete.toFixed(2) + "%";
        fill.style.backgroundColor = "#4caf50";
        text.textContent = `${percentComplete.toFixed(2)}% Completed / ${percentLeft.toFixed(2)}% Remaining of the work week`;
    }
}

// Run on page load and update every minute
updateWorkWeekProgress();
setInterval(updateWorkWeekProgress, 60000);
