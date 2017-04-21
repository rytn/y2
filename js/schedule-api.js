// for converting words from schedule-month's ids to ordinal number of month
var MONTHSNAMES = {
    "jan": "1",
    "feb": "2",
    "mar": "3",
    "apr": "4",
    "may": "5",
    "jun": "6",
    "jul": "7",
    "aug": "8",
    "sep": "9",
    "oct": "10",
    "nov": "11",
    "dec": "12"
};
// for converting month's ordinal number to word for schedule-month's id
var MONTHSIDS = {
    "1": "jan",
    "2": "feb",
    "3": "mar",
    "4": "apr",
    "5": "may",
    "6": "jun",
    "7": "jul",
    "8": "aug",
    "9": "sep",
    "10": "oct",
    "11": "nov",
    "12": "dec"
};
// months in russian
var MONTHSRUS = {
    "1": "январь",
    "2": "февраль",
    "3": "март",
    "4": "апрель",
    "5": "май",
    "6": "июнь",
    "7": "июль",
    "8": "август",
    "9": "сентябрь",
    "10": "октябрь",
    "11": "ноябрь",
    "12": "декабрь"
};

var schedule = [];

function gatherDates() {
    var months = document.getElementsByClassName('schedule-month');

    for (var i = 0; i < months.length; i++) {
        var month = months[i].id.substring(0, 3);
        var year = months[i].id.substring(3);
        var days = months[i].getElementsByClassName('schedule-line__datetime__date');
        var hours = months[i].getElementsByClassName('schedule-line__datetime__time');

        for (var j = 0; j < days.length; j++) {
            var day = days[j].textContent;
            var hour = hours[j].textContent;
            var date = new Date(year + '/' + month + '/' + day + ' ' + hour);
            var title = months[i].getElementsByClassName('schedule-line__lecture__title')[j].textContent.trim();

            var lecturerDiv = months[i].getElementsByClassName('tooltip tooltip--right');
            var name = lecturerDiv[0].innerHTML.substring(0, lecturerDiv[0].innerHTML.indexOf('<')).trim();
            var about = lecturerDiv[0].innerHTML.substring(lecturerDiv[0].innerHTML.indexOf('>') + 1,
                lecturerDiv[0].innerHTML.lastIndexOf('<'));
            var lecturer = {name: name, about:about};

            var auditorium = days[j].parentNode.parentNode.parentNode.parentNode
                .getElementsByClassName('auditorium')[0].textContent.trim();
            var schools = days[j].parentNode.parentNode.parentNode.parentNode
                .getElementsByClassName('school');
            var school = '';
            for (var k = 0; k < schools.length; k++) {
                school += schools[k].textContent.trim() + ',';
            }
            school = school.slice(0, -1);
            var newDate = { date: date, title: title, lecturer: lecturer, auditorium: auditorium, school: school };
            schedule.push(newDate);
        }
    }
}

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

function checkLecture(datetime, auditorium, school, lecturer) {
    var lectures = JSON.parse(localStorage.getItem('lectures'));
    if (lectures === null) {
        return true;
    }

    for (var i = 0; i < lectures.length; i++) {
        // ms to hours
        var diffHours = (datetime - new Date(lectures[i].date)) / 36e5;

        // if two lectures in one auditorium at the same time
        // or if two lectures for one school
        // or if two lecturers for one lecture
        if ((diffHours > -2.5 && diffHours < 2.5) && lectures[i].auditorium.indexOf(auditorium) !== -1) {
            throw new Error('В этой аудитории уже идет лекция в это время.');
        }
        if ((diffHours > -2.5 && diffHours < 2.5) && lectures[i].school.indexOf(school) !== -1) {
            throw new Error('Для этой школы уже читается лекция в это время.');
        }
        if ((diffHours > -2.5 && diffHours < 2.5) && lectures[i].lecturer.name.indexOf(lecturer) !== -1) {
            throw new Error('Этот лектор уже читает лекцию в это время.');
        }
    }
}

function checkCapacity(auditorium, school) {
    var auditoriums = JSON.parse(localStorage.getItem('auditoriums'));
    var schools = JSON.parse(localStorage.getItem('schools'));
    var acronyms = JSON.parse(localStorage.getItem('schoolsAcronyms'));

    var schoolNames = school.split(',');
    var studentsNumber = 0;

    for (var i = 0; i < schoolNames.length; i++) {
        studentsNumber += schools[acronyms[schoolNames[i]]];
    }

    if (auditoriums[auditorium] < studentsNumber) {
        throw new Error('Нет места. В аудитории только ' + auditoriums[auditorium] + ' мест.');
    }
}

function createNewElement(tag, className, innerHtml) {
    var element = document.createElement(tag);
    element.className += ' ' + className;
    element.innerHTML = innerHtml;

    return element;
}


function plusZero(value) {
    if (value < 10) {
        return '0' + value;
    } else {
        return value;
    }
}

function getSchoolTip(school) {
    if (school === 'ШРИ') {
        return 'Школа разработки интерфейсов';
    } else if (school === 'ШМР') {
        return 'Школа мобильной разработки';
    } else if (school === 'ШМД') {
        return 'Школа мобильного дизайна';
    }
    return 'Школа';
}

function addLecture(datetime, title, lecturer, auditorium, school) {
    checkCapacity(auditorium, school);
    checkLecture(datetime, auditorium, school, lecturer.name);
    displayLecture(datetime, title, lecturer, auditorium, school);

    // add new lecture to schedule array
    var newLecture = {date: datetime, title: title, lecturer: {name: lecturer.name, about: lecturer.about},
        auditorium: auditorium, school: school};
    schedule.push(newLecture);

    var lectures = JSON.parse(localStorage.getItem('lectures'));
    if (lectures === null) {
        lectures = [];
    }
    if (lectures.indexOf(newLecture)) {
        lectures.push(newLecture);
    }

    localStorage.setItem('lectures', JSON.stringify(lectures));
}

function displayLecture(datetime, title, lecturer, auditorium, school) {
    var newMonth = false;
    var monthId = document.getElementById(MONTHSIDS[datetime.getMonth() + 1] + datetime.getFullYear());

    // if there is no such month create a new schedule-month element
    if (monthId === null) {
        var divMonth = createNewElement('div', 'schedule-month', '');
        divMonth.id = MONTHSIDS[datetime.getMonth() + 1] + datetime.getFullYear();

        var divMonthHeading = createNewElement('div', 'schedule-month-heading', '');
        var spanMonth = createNewElement('span', '', MONTHSRUS[datetime.getMonth() + 1] + ' ' + datetime.getFullYear());
        divMonthHeading.appendChild(spanMonth);
        divMonth.appendChild(divMonthHeading);

        monthId = divMonth;
        document.getElementById('schedule').appendChild(monthId);
        newMonth = true;
    }

    // create new schedule-line
    var tableLecture = createNewElement('table', 'schedule-line', '');
    var tbLecutre = document.createElement('tbody');
    var trLecture = document.createElement('tr');

    var tdDateTime = createNewElement('td', 'schedule-line__datetime', '');
    var spanDate = createNewElement('span', 'schedule-line__datetime__date', datetime.getDate());
    var spanHour = createNewElement('span', 'schedule-line__datetime__time',
        plusZero(datetime.getHours()) + ':' + plusZero(datetime.getMinutes()));
    tdDateTime.appendChild(spanDate);
    tdDateTime.appendChild(spanHour);
    trLecture.appendChild(tdDateTime);

    // if lecture is already past mark it
    var lecture = createNewElement('td', 'schedule-line__lecture', '');
    if (datetime < new Date()) {
        lecture.className += ' schedule-line__lecture--past';
    }
    var divTitle = createNewElement('div', 'schedule-line__lecture__title', '');
    if (datetime < new Date()) {
        var aTitle = createNewElement('a', '', title);
        aTitle.href = '#';
        divTitle.appendChild(aTitle);
    } else {
        divTitle.innerHTML = title;
    }
    var divLecturer = createNewElement('div', 'schedule-line__lecturer', '');
    var divTooltip = createNewElement('div', 'tooltip tooltip--right', lecturer.name);
    var spanTooltip = createNewElement('span', 'tooltiptext', lecturer.about);
    divTooltip.appendChild(spanTooltip);
    divLecturer.appendChild(divTooltip);
    lecture.appendChild(divTitle);
    lecture.appendChild(divLecturer);

    var tdAuditorium = createNewElement('td', 'schedule-line__auditorium', '');
    var divATooltip = createNewElement('div', 'tooltip tooltip--left', '');
    var divA = createNewElement('div', 'auditorium', auditorium);
    var spanATooltip = createNewElement('span', 'tooltiptext', 'Аудитория');
    divATooltip.appendChild(divA);
    divATooltip.appendChild(spanATooltip);
    tdAuditorium.appendChild(divATooltip);

    var tdSchool = createNewElement('td', 'schedule-line__school', '');
    var schools = school.split(',');
    var acronyms = JSON.parse(localStorage.getItem('schoolsAcronyms'));
    for (var i = 0; i < schools.length; i++) {
        var divSTooltip = createNewElement('div', 'tooltip tooltip--left', '');
        var divSchool = createNewElement('div', 'school', schools[i]);
        var spanSTooltip = createNewElement('span', 'tooltiptext', acronyms[schools[i]]);
        divSTooltip.appendChild(divSchool);
        divSTooltip.appendChild(spanSTooltip);
        tdSchool.appendChild(divSTooltip);
    }

    tableLecture.appendChild(tbLecutre);
    tbLecutre.appendChild(trLecture);
    trLecture.appendChild(tdDateTime);
    trLecture.appendChild(lecture);
    trLecture.appendChild(tdAuditorium);
    trLecture.appendChild(tdSchool);

    // insert lecture at the end
    monthId.appendChild(tableLecture);

    // sort lectures by date after inserting
    sortTables(monthId);

    // if month is new sort months
    if (newMonth) {
        sortMonths();
    }
}

function sortMonths() {
    var months = Array.prototype.slice.call(document.getElementsByClassName('schedule-month'));

    months.sort(function(a, b) {
        var year1 = a.id.substring(3);
        var month1 = MONTHSNAMES[a.id.substring(0, 3)];
        var year2 = b.id.substring(3);
        var month2 = MONTHSNAMES[b.id.substring(0, 3)];


        var date1 = new Date(year1 + '/' + month1 + '/' + 1);
        var date2 = new Date(year2 + '/' + month2 + '/' + 1);

        if (date1 > date2) {
            return 1;
        } else if (date2 > date1) {
            return -1;
        }

        return 0;
    });

    var schedule = document.getElementById('schedule');

    // clear schedule
    for (var i = schedule.children.length - 1; i > 0; i--) {
        schedule.removeChild(schedule.lastElementChild);
    }
    // append sorted months to schedule
    for (var i = 0; i < months.length; i++) {
        schedule.appendChild(months[i]);
    }
}

function addSchool(name, studentsNumber) {
    if (name === '' || studentsNumber === '') {
        throw new Error('Заполните все поля.');
    }

    var schools = JSON.parse(localStorage.getItem('schools'));
    var schoolsAcronyms = JSON.parse(localStorage.getItem('schoolsAcronyms'));
    if (schools === null) {
        schools = {};
    }
    if (schoolsAcronyms === null) {
        schoolsAcronyms = {};
    }

    if (schools.hasOwnProperty(name)) {
        throw new Error('Школа с таким именем уже есть.');
    }

    // first letters of each word
    var firstLetters = name.split(' ');
    var acronym = '';
    for (var i = 0; i < firstLetters.length; i++) {
        acronym += firstLetters[i].substring(0,1).toUpperCase();
    }

    schools[name] = Number(studentsNumber);
    schoolsAcronyms[acronym] = name;
    localStorage.setItem('schools', JSON.stringify(schools));
    localStorage.setItem('schoolsAcronyms', JSON.stringify((schoolsAcronyms)));
}

function addAuditorium(name, capacity) {
    if (name === '' || capacity === '') {
        throw new Error('Заполните все поля.');
    }

    var auditoriums = JSON.parse(localStorage.getItem('auditoriums'));
    if (auditoriums === null) {
        auditoriums = {};
    }

    if (auditoriums.hasOwnProperty(name)) {
        throw new Error('Аудитория с таким именем уже есть.');
    }

    auditoriums[name] = Number(capacity);
    localStorage.setItem('auditoriums', JSON.stringify(auditoriums));
}
