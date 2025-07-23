function updateWorkWeekProgress() {
    const now = new Date();
    const day = now.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    const hour = now.getHours();
    const minute = now.getMinutes();

    const workStartHour = 9;
    const workEndHour = 17.5; // 17:30 in decimal

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

    const percentLeft = ((remainingMs / totalWorkMs) * 100).toFixed(2);

    const output = (day === 0 || day === 6 || hour >= 17.5 || hour < 9)
        ? "Outside of work hours"
        : `${percentLeft}% of the work week remaining`;

    document.getElementById("work-week-progress").textContent = output;
}

updateWorkWeekProgress();
setInterval(updateWorkWeekProgress, 60000); 
