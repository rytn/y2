function isBetweenDates(date, min, max) {
    return date >= min && date <= max;
}

function displayDateInterval(startDate, endDate) {
    var months = document.getElementsByClassName('schedule-month');

    for (var i = 0; i < months.length; i++) {
        // count days to decide whether to remove the schedule-month-heading
        var hiddenDays = 0;
        var currentDay = months[i].getElementsByClassName('schedule-line__datetime__date');

        for (var j = 0; j < currentDay.length; j++) {
            var currentDate = new Date(months[i].id.substring(3) + months[i].id.substring(0, 3)
                + currentDay[j].textContent.trim());

            // if current date do not fall between two dates hide the lecture
            if (!isBetweenDates(currentDate, startDate, endDate)) {
                currentDay[j].parentNode.parentNode.parentNode.parentNode.style.display = 'none';
                hiddenDays++;
            } else {
                currentDay[j].parentNode.parentNode.parentNode.parentNode.style.display = 'table';
            }
        }

        if (hiddenDays === currentDay.length) {
            currentDay[0].parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
        } else {
            currentDay[0].parentNode.parentNode.parentNode.parentNode.parentNode.style.display = 'block';
        }
    }
}

