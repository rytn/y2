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


function isBetweenDates(date, min, max) {
    return date >= min && date <= max;
}

function getLecturesInInterval(startDate, endDate, auditorium) {
    var lectures = JSON.parse(localStorage.getItem('lectures'));
    var lecturesToDisplay = [];

    if (auditorium === 'любая') {
        for (var i = 0; i < lectures.length; i++) {
            if (isBetweenDates(new Date(lectures[i].date), startDate, endDate)) {
                lecturesToDisplay.push(lectures[i]);
            }
        }
    } else {
        for (var i = 0; i < lectures.length; i++) {
            if (isBetweenDates(new Date(lectures[i].date), startDate, endDate) && lectures[i].auditorium === auditorium) {
                lecturesToDisplay.push(lectures[i]);
            }
        }
    }

    return lecturesToDisplay;
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

    return studentsNumber;
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

function addLecture(datetime, title, lecturer, auditorium, school) {
    var studentsNumber = checkCapacity(auditorium, school);
    checkLecture(datetime, auditorium, school, lecturer.name);
    displayLecture(datetime, title, lecturer, auditorium, school);

    // add new lecture to schedule array
    var newLecture = {date: datetime, title: title, lecturer: {name: lecturer.name, about: lecturer.about},
        auditorium: auditorium, school: school};

    var lectures = JSON.parse(localStorage.getItem('lectures'));
    if (lectures === null) {
        lectures = [];
    }
    if (lectures.indexOf(newLecture)) {
        lectures.push(newLecture);
    }

    localStorage.setItem('lectures', JSON.stringify(lectures));

    var auditoriumsLoad = JSON.parse(localStorage.getItem('auditoriumsLoad'));
    if (auditoriumsLoad === null) {
        auditoriumsLoad = {};
    }

    auditoriumsLoad[auditorium + datetime.toString()] = studentsNumber;
    localStorage.setItem('auditoriumsLoad', JSON.stringify(auditoriumsLoad));
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

    var auditoriumsAddresses = JSON.parse(localStorage.getItem('auditoriumsAddresses'));
    var tdAuditorium = createNewElement('td', 'schedule-line__auditorium', '');
    var divATooltip = createNewElement('div', 'tooltip tooltip--left', '');
    var divA = createNewElement('div', 'auditorium', auditorium);
    var spanATooltip = createNewElement('span', 'tooltiptext', auditoriumsAddresses[auditorium]);
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

    var acronym = makeAcronym(name);

    schools[name] = Number(studentsNumber);
    schoolsAcronyms[acronym] = name;
    localStorage.setItem('schools', JSON.stringify(schools));
    localStorage.setItem('schoolsAcronyms', JSON.stringify((schoolsAcronyms)));
}

function makeAcronym(str) {
    // first letters of each word
    var firstWords = str.split(' ');
    var acronym = '';
    for (var i = 0; i < firstWords.length; i++) {
        acronym += firstWords[i].substring(0,1).toUpperCase();
    }

    return acronym;
}

function addAuditorium(name, address, capacity) {
    var auditoriums = JSON.parse(localStorage.getItem('auditoriums'));
    if (auditoriums === null) {
        auditoriums = {};
    }
    var auditoriumsAddresses = JSON.parse(localStorage.getItem('auditoriumsAddresses'));
    if (auditoriumsAddresses === null) {
        auditoriumsAddresses = {};
    }

    if (auditoriums.hasOwnProperty(name)) {
        throw new Error('Аудитория с таким именем уже есть.');
    }

    auditoriums[name] = Number(capacity);
    localStorage.setItem('auditoriums', JSON.stringify(auditoriums));
    auditoriumsAddresses[name] = address;
    localStorage.setItem('auditoriumsAddresses', JSON.stringify(auditoriumsAddresses));
}

function updateLectures() {
    clearLectures();
    displayLectures(JSON.parse(localStorage.getItem('lectures')));
}

function clearLectures() {
    var schedule = document.getElementById('schedule');
    for (var i = schedule.children.length; i > 1; i--) {
        schedule.removeChild(schedule.lastElementChild);
    }
}

function displayLectures(lectures) {
    for (var i = 0; i < lectures.length; i++) {
        displayLecture(new Date(lectures[i].date), lectures[i].title, lectures[i].lecturer,
            lectures[i].auditorium, lectures[i].school);
    }
}

function editAuditorium(oldName, newName, newAddress, newCapacity) {
    var auditoriums = JSON.parse(localStorage.getItem('auditoriums'));
    if (auditoriums.hasOwnProperty(newName)) {
        throw new Error('Аудитория с таким именем уже есть.');
    }

    var lectures = JSON.parse(localStorage.getItem('lectures'));
    var auditoriumsLoad = JSON.parse(localStorage.getItem('auditoriumsLoad'));
    for (var i = 0; i < lectures.length; i++) {
        if (lectures[i].auditorium !== oldName) {
            continue;
        }
        if (new Date(lectures[i].date) > new Date() && auditoriumsLoad[oldName + new Date(lectures[i].date)] > newCapacity) {
            throw new Error('Новая вместимость: ' + newCapacity + '. Но в этой аудитории уже запланирована лекция для '
                + auditoriumsLoad[oldName + new Date(lectures[i].date)] + ' человек. Поменяйте вместимость.');
        }
    }

    for (var i = 0; i < lectures.length; i++) {
        if (lectures[i].auditorium === oldName) {
            lectures[i].auditorium = newName;
        }
    }

    delete auditoriums[oldName];
    auditoriums[newName] = Number(newCapacity);
    localStorage.setItem('auditoriums', JSON.stringify(auditoriums));
    localStorage.setItem('lectures', JSON.stringify(lectures));
    var auditoriumsAddresses = JSON.parse(localStorage.getItem('auditoriumsAddresses'));
    delete auditoriumsAddresses[oldName];
    auditoriumsAddresses[newName] = newAddress;
    localStorage.setItem('auditoriumsAddresses', JSON.stringify(auditoriumsAddresses));
}  

function editSchool(oldName, newName, newNumber) {
    var schools = JSON.parse(localStorage.getItem('schools'));
    if (schools.hasOwnProperty(newName)) {
        throw new Error('Школа с таким именем уже есть.');
    }

    var lectures = JSON.parse(localStorage.getItem('lectures'));
    var auditoriumsLoad = JSON.parse(localStorage.getItem('auditoriumsLoad'));
    var acronyms = JSON.parse(localStorage.getItem('schoolsAcronyms'));
    for (var i = 0; i < lectures.length; i++) {
        if (lectures[i].school.indexOf(oldName) === -1) {
            continue;
        }

        var schoolNames = lectures[i].school.split(',');
        var studentsNumber = 0;
        for (var j = 0; j < schoolNames.length; j++) {
            studentsNumber += schools[acronyms[schoolNames[j]]];
        }
        studentsNumber -= schools[acronyms[oldName]];
        var newStudentsNumber = studentsNumber + Number(newNumber);

        if (new Date(lectures[i].date) > new Date()
            && auditoriumsLoad[lectures[i].auditorium + new Date(lectures[i].date)] < newStudentsNumber) {
            throw new Error('Новое количество студентов: ' + newNumber + '. Вместимость аудитории, в которой уже запланирована '
                    + 'лекция для этой и других школ ' + auditoriumsLoad[lectures[i].auditorium + new Date(lectures[i].date)]
                + ' человек. Поменяйте количетсво студентов или вместимость аудитории.');
        }
    }

    var newAcronym = makeAcronym(newName);
    for (var i = 0; i < lectures.length; i++) {
        if (lectures[i].school.indexOf(oldName) !== -1) {
            var schoolNames = lectures[i].school.split(',');
            for (var j = 0; j < schoolNames.length; j++) {
                if (schoolNames[j] === oldName) {
                    schoolNames[j] = newAcronym;
                }
            }

            lectures[i].school = schoolNames.join();
        }
    }

    delete schools[acronyms[oldName]];
    schools[newName] = Number(newNumber);
    delete acronyms[oldName];
    acronyms[newAcronym] = newName;
    localStorage.setItem('schools', JSON.stringify(schools));
    localStorage.setItem('schoolsAcronyms', JSON.stringify(acronyms));
    localStorage.setItem('lectures', JSON.stringify(lectures));
}

function editLecture(oldTitle, newDateTime, newTitle, newLecturer, newAuditorium, newSchool) {
    var lectures = JSON.parse(localStorage.getItem('lectures'));
    var oldLecture;

    for (var i = 0; i < lectures.length; i++) {
        if (lectures[i].title === oldTitle) {
            // save old lecture
            oldLecture = lectures[i];
            // remove lecture from array and save to local storage for checking
            lectures.splice(i, 1);
            localStorage.setItem('lectures', JSON.stringify(lectures));
            try {
                addLecture(newDateTime, newTitle, newLecturer, newAuditorium, newSchool);
            } catch(e) {
                // if lecture does not pass checking return it to the schedule
                lectures.push(oldLecture);
                localStorage.setItem('lectures', JSON.stringify(lectures));
                throw new Error(e.message);
            }

            // add new lecture
            var newLecture = {};
            newLecture.date = newDateTime;
            newLecture.title = newTitle;
            newLecture.lecturer = newLecturer;
            newLecture.auditorium = newAuditorium;
            newLecture.school = newSchool;
            lectures.push(newLecture);
        }
    }

    localStorage.setItem('lectures', JSON.stringify(lectures));
}
