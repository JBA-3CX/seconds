function updateWorkWeekProgress() {
    const now = new Date();
    const day = now.getDay(); // Sunday = 0
    const hour = now.getHours();
    const minute = now.getMinutes();

    const workStartHour = 9;
    const workEndHour = 17.5; // 17:30
    const totalWorkMs = 5 * 8.5 * 60 * 60 * 1000;
    let workedMs = 0;

    for (let i = 1; i <= 5; i++) {
        if (day > i) {
            workedMs += 8.5 * 60 * 60 * 1000;
        } else if (day === i) {
            const currentHour = hour + minute / 60;
            if (currentHour > workEndHour) {
                workedMs += 8.5 * 60 * 60 * 1000;
            } else if (currentHour > workStartHour) {
                workedMs += (currentHour - workStartHour) * 60 * 60 * 1000;
            }
            break;
        }
    }

    let remainingMs = totalWorkMs - workedMs;
    if (remainingMs < 0) remainingMs = 0;

    const percentLeft = ((remainingMs / totalWorkMs) * 100);
    const percentComplete = 100 - percentLeft;

    const fill = document.getElementById("work-week-fill");
    const text = document.getElementById("work-week-text");

    if (day === 0 || day === 6 || hour >= 17.5 || hour < 9) {
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
