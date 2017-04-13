function DateIntervalError(message) {
    this.name = 'DateIntervalError';
    this.message = message || 'Неправильный интервал дат';
    this.stack = (new Error()).stack;
}
DateIntervalError.prototype = Object.create(Error.prototype);
DateIntervalError.prototype.constructor = DateIntervalError;

function isBetweenDates(date, min, max) {
    return date >= min && date <= max;
}

function displayDateInterval(startDate, endDate) {
    if (Object.prototype.toString.call(startDate).slice(8, -1) !== 'Date' || Object.prototype.toString.call(endDate).slice(8, -1) !== 'Date' || startDate === undefined || startDate === null || endDate === undefined || endDate === null) {
        throw new TypeError('Аргументы должны быть типа Date');
    }

    if (startDate > endDate) {
        throw new DateIntervalError();
    }

    var months = document.getElementsByClassName('schedule-month');

    for (var i = 0; i < months.length; i++) {
        // count days to decide whether to remove the schedule-month-heading
        var hiddenDays = 0;
        var currentDay = months[i].getElementsByClassName('schedule-line__datetime__date');

        for (var j = 0; j < currentDay.length; j++) {
            var currentDate = new Date(months[i].id.substring(3) + months[i].id.substring(0, 3) + currentDay[j].textContent.trim());

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

function displayAuditoriumDateInterval(auditorium, startDate, endDate) {
    if (Object.prototype.toString.call(auditorium).slice(8, -1) !== 'String' || auditorium === undefined || auditorium === null) {
        throw new TypeError('Аргументы должны быть типа Date');
    }

    displayDateInterval(startDate, endDate);

    var auditoriums = document.getElementsByClassName('schedule-line__auditorium');

    if (auditorium !== 'любая') {
        for (var i = 0; i < auditoriums.length; i++) {
            if (auditoriums[i].textContent.trim().toLowerCase().indexOf(auditorium.toLowerCase()) === -1) {
                auditoriums[i].parentNode.parentNode.parentNode.style.display = 'none';
            } else {
                auditoriums[i].parentNode.parentNode.parentNode.style.display = 'table';
            }
        }
    }
}
