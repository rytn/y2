// for converting words from schedule-month's ids to ordinal number of month
var MONTHSNAMES = {"jan": "1", "feb": "2", "mar": "3", "apr": "4", "may": "5", "jun": "6", "jul": "7",
                   "aug": "8", "sep": "9", "oct": "10", "nov": "11", "dec": "12"};

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


function sortTables(scheduleMonth) {
    var month = MONTHSNAMES[scheduleMonth.id.substring(0, 3)];
    var year = scheduleMonth.id.substring(3);
    var lectureTables = Array.prototype.slice.call(scheduleMonth.children, 1);

    // sort lectures by date
    lectureTables.sort(function(a, b) {
       var day1 = a.getElementsByClassName('schedule-line__datetime__date')[0].textContent;
       var hour1 = a.getElementsByClassName('schedule-line__datetime__time')[0].textContent;
       var date1 = new Date(year + '/' + month + '/' + day1 + ' ' + hour1);
       var day2 = b.getElementsByClassName('schedule-line__datetime__date')[0].textContent;
       var hour2 = b.getElementsByClassName('schedule-line__datetime__time')[0].textContent;
       var date2 = new Date(year + '/' + month + '/' + day2 + ' ' + hour2);

       if (date1 > date2) {
           return 1;
       } else if (date2 > date1) {
           return -1;
       }

       return 0;
    });

    // clear scheduleMonth
    for (var i = scheduleMonth.children.length - 1; i > 0; i--) {
        scheduleMonth.removeChild(scheduleMonth.lastElementChild);
    }
    // append sorted lectures to scheduleMonth
    for (var i = 0; i < lectureTables.length; i++) {
        scheduleMonth.appendChild(lectureTables[i]);
    }
}
