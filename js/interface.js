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


function addSchoolToInput(inputId, selectId, numberId) {
    var schoolsInput = document.getElementById(inputId);
    var school = document.getElementById(selectId);
    var schoolName = school.options[document.getElementById(selectId).selectedIndex].value;

    if (schoolsInput.value.indexOf(schoolName) !== -1) {
        alert('Школа уже добавлена');
        return;
    }

    if (schoolsInput.value === '') {
        schoolsInput.value += schoolName;
    } else {
        schoolsInput.value += ',' + schoolName;
    }

    var schools = JSON.parse(localStorage.getItem('schools'));
    var acronyms = JSON.parse(localStorage.getItem('schoolsAcronyms'));

    document.getElementById(numberId).innerHTML = +document.getElementById(numberId).innerHTML + schools[acronyms[schoolName]];
}

function removeLastSchoolFromInput(inputId, numberId) {
    var schoolsInput = document.getElementById(inputId);

    var lastSchool = schoolsInput.value.substring(schoolsInput.value.lastIndexOf(',') + 1).trim();

    document.getElementById(inputId).value = schoolsInput.value.substring(0, schoolsInput.value.lastIndexOf(','));

    var schools = JSON.parse(localStorage.getItem('schools'));
    var acronyms = JSON.parse(localStorage.getItem('schoolsAcronyms'));

    var oldNumber = Number(document.getElementById(numberId).innerHTML);
    var newNumber = oldNumber - schools[acronyms[lastSchool]];

    document.getElementById(numberId).innerHTML = newNumber;
}

function displayCapacity(selectId, capacityId) {
    var aud = document.getElementById(selectId);
    var cap = document.getElementById(capacityId);
    cap.innerHTML = JSON.parse(localStorage.getItem('auditoriums'))[aud.options[aud.selectedIndex].value];
}

function displayStudentsEdit() {
    var select = document.getElementById('schoolNameEdit');
    var students = document.getElementById('studentsNumberEdit');
    var acronyms = JSON.parse(localStorage.getItem('schoolsAcronyms'));
    students.innerHTML = JSON.parse(localStorage.getItem('schools'))[acronyms[select.options[select.selectedIndex].value]];
}

function displayEditForm(select) {
    var editFormToDisplay = document.getElementById(select.value);
    var editForms = document.getElementById('editForms').getElementsByTagName('div');
    for (var i = 0; i < editForms.length; i++) {
        editForms[i].style.display = 'none';
    }
    editFormToDisplay.style.display = '';
}

function makeArrayByClassName(className) {
    var elements = document.getElementsByClassName(className);
    var array = [];
    for (var i = 0; i < elements.length; i++) {
        if (array.indexOf(elements[i].textContent.trim()) === -1) {
            array.push(elements[i].textContent.trim());
        }
    }
    return array;
}

function updateAuditoriumsSelect(selectId) {
    var select = document.getElementById(selectId);
    var auditoriums = JSON.parse(localStorage.getItem('auditoriums'));

    // clear select
    while (select.firstChild) {
        select.removeChild(select.firstChild);
    }

    if (selectId === 'auditoriumSelect') {
        var opt = document.createElement('option');
        opt.value = 'любая';
        opt.innerHTML = 'любая';
        select.appendChild(opt);
    }

    for (auditorium in auditoriums) {
        if (auditoriums.hasOwnProperty(auditorium)) {
            var option = document.createElement('option');
            option.value = auditorium;
            option.innerHTML = auditorium;
            select.appendChild(option);
        }
    }
}

function updateSchoolsSelect(selectId) {
    var select = document.getElementById(selectId);
    var schools = JSON.parse(localStorage.getItem('schoolsAcronyms'));

    while (select.firstChild) {
        select.removeChild(select.firstChild);
    }

    if (selectId === 'schoolSelect') {
        var opt = document.createElement('option');
        opt.value = 'любая';
        opt.innerHTML = 'любая';
        select.appendChild(opt);
    }

    for (school in schools) {
        if (schools.hasOwnProperty(school)) {
            var option = document.createElement('option');
            option.innerHTML = school;
            select.appendChild(option);
        }
    }
}

function updateLecturesSelect() {
    var select = document.getElementById('lectureTitleEdit');
    var lectures = JSON.parse(localStorage.getItem('lectures'));

    while (select.firstChild) {
        select.removeChild(select.firstChild);
    }

    for (var i = 0; i < lectures.length; i++) {
        var option = document.createElement('option');
        option.innerHTML = lectures[i].title;
        select.appendChild(option);
    }
}

function fillTimeSelect() {
    var hour = document.getElementById('lectureHour');
    var minute = document.getElementById('lectureMinute');

    for (var i = 0; i < 24; i++) {
        var option = document.createElement('option');
        if (i > 9) {
            option.value = i;
            option.innerHTML = i;
        } else {
            option.value = '0' + i;
            option.innerHTML = '0' + i;
        }
        hour.appendChild(option);
    }
    for (var i = 0; i < 60; i++) {
        var option = document.createElement('option');
        if (i > 9) {
            option.value = i;
            option.innerHTML = i;
        } else {
            option.value = '0' + i;
            option.innerHTML = '0' + i;
        }
        minute.appendChild(option);
    }
}

function extractDates() {
    var dayStart = document.getElementById('startDay')
        .options[document.getElementById('startDay').selectedIndex].value;
    var monthStart = document.getElementById('startMonth')
        .options[document.getElementById('startMonth').selectedIndex].value;
    var yearStart = document.getElementById('startYear')
        .options[document.getElementById('startYear').selectedIndex].value;
    var dayEnd = document.getElementById('endDay')
        .options[document.getElementById('endDay').selectedIndex].value;
    var monthEnd = document.getElementById('endMonth')
        .options[document.getElementById('endMonth').selectedIndex].value;
    var yearEnd = document.getElementById('endYear')
        .options[document.getElementById('endYear').selectedIndex].value;

    return {
        dayStart: dayStart,
        monthStart: monthStart,
        yearStart: yearStart,
        dayEnd: dayEnd,
        monthEnd: monthEnd,
        yearEnd: yearEnd
    };
}

function callDisplayAuditoriumDateInterval() {
    var dates = extractDates();

    var startDate = new Date(dates['yearStart'] + '/' + dates['monthStart'] + '/' + dates['dayStart']);
    var endDate = new Date(dates['yearEnd'] + '/' + dates['monthEnd'] + '/' + dates['dayEnd']);
    var auditorium = document.getElementById('auditoriumSelect')
        .options[document.getElementById('auditoriumSelect').selectedIndex].value;
    var school = document.getElementById('schoolSelect')
        .options[document.getElementById('schoolSelect').selectedIndex].value;

    var lectures = getLecturesInInterval(startDate, endDate, auditorium, school);
    clearLectures();
    displayLectures(lectures);
}

function callAddLecture() {
    var day =
        document.getElementById('lectureDay')
        .options[document.getElementById('lectureDay').selectedIndex].value;
    var month = document.getElementById('lectureMonth')
        .options[document.getElementById('lectureMonth').selectedIndex].value;
    var year = document.getElementById('lectureYear')
        .options[document.getElementById('lectureYear').selectedIndex].value;
    var hour = document.getElementById('lectureHour')
        .options[document.getElementById('lectureHour').selectedIndex].value;
    var minute = document.getElementById('lectureMinute')
        .options[document.getElementById('lectureMinute').selectedIndex].value;
    var title = document.getElementById('lectureTitle').value;
    var lecturerName = document.getElementById('lecturerName').value;
    var lecturerAbout = document.getElementById('lecturerAbout').value;
    var school = document.getElementById('schoolsInput').value;
    var auditorium = document.getElementById('lectureAuditorium')
        .options[document.getElementById('lectureAuditorium').selectedIndex].value;

    var datetime = new Date(year + '/' + month + '/' + day + ' ' + hour + ':' + minute);
    var lecturer = { name: lecturerName, about: lecturerAbout };

    if (datetime === '' || title === '' || lecturer === '' || auditorium === '' || school === '') {
        alert('Заполните все поля.');
        return;
    }

    try {
        addLecture(datetime, title, lecturer, auditorium, school);
    } catch (e) {
        alert(e.message);
        return;
    }

    displayLecture(datetime, title, lecturer, auditorium, school);
}

function callAddSchool() {
    var name = document.getElementById('newSchoolName').value;
    var studentsNumber = document.getElementById('newSchoolStudents').value;

    if (name === '' || studentsNumber === '') {
        alert('Заполните все поля.');
        return;
    }

    try {
        addSchool(name, studentsNumber);
    } catch (e) {
        alert(e.message);
        return;
    }

    document.getElementById('newSchoolName').value = '';
    document.getElementById('newSchoolStudents').value = '';
    updateSchoolsSelect('lectureSchool');
    updateSchoolsSelect('schoolNameEdit');
}

function callAddAuditorium() {
    var name = document.getElementById('newAuditoriumName').value;
    var address = document.getElementById('newAuditoriumAddress').value;
    var capacity = document.getElementById('newAuditoriumCapacity').value;

    if (name === '' || address === '' || capacity === '') {
        alert('Заполните все поля.');
        return;
    }

    try {
        addAuditorium(name, address, capacity);
    } catch (e) {
        alert(e.message);
        return;
    }

    document.getElementById('newAuditoriumName').value = '';
    document.getElementById('newAuditoriumAddress').value = '';
    document.getElementById('newAuditoriumCapacity').value = '';
    updateAuditoriumsSelect('lectureAuditorium');
    updateAuditoriumsSelect('auditoriumSelect');
    updateAuditoriumsSelect('auditoriumNameEdit');
}

function callEditAuditorium() {
    var oldName = document.getElementById('auditoriumNameEdit')
        .options[document.getElementById('auditoriumNameEdit').selectedIndex].value;
    var newName = document.getElementById('auditoriumNewName').value;
    var newAddress = document.getElementById('auditoriumNewAddress').value;
    var newCapacity = document.getElementById('auditoriumNewCapacity').value;

    if (oldName === '' || newName === '' || newAddress === '' || newCapacity === '') {
        alert('Заполните все поля.');
        return;
    }

    try {
        editAuditorium(oldName, newName, newAddress, newCapacity);
    } catch (e) {
        alert(e.message);
        return;
    }

    document.getElementById('auditoriumNewName').value = '';
    document.getElementById('auditoriumNewAddress').value = '';
    document.getElementById('auditoriumNewCapacity').value = '';
    updateAuditoriumsSelect('auditoriumSelect');
    updateAuditoriumsSelect('lectureAuditorium');
    updateAuditoriumsSelect('auditoriumNameEdit');
    updateLectures();
}

function callEditSchool() {
    var oldName = document.getElementById('schoolNameEdit')
        .options[document.getElementById('schoolNameEdit').selectedIndex].value;
    var newName = document.getElementById('schoolNewName').value;
    var newNumber = document.getElementById('schoolNewNumber').value;

    if (oldName === '' || newName === '' || newNumber === '') {
        alert('Заполните все поля.');
        return;
    }

    try {
        editSchool(oldName, newName, newNumber);
    } catch (e) {
        alert(e.message);
        return;
    }

    document.getElementById('schoolNewName').value = '';
    document.getElementById('schoolNewNumber').value = '';
    updateSchoolsSelect('lectureSchool');
    updateSchoolsSelect('schoolNameEdit');
    updateLectures();
}

function callEditLecture() {
    var oldTitle = document.getElementById('lectureTitleEdit')
        .options[document.getElementById('lectureTitleEdit').selectedIndex].value;

    var day = document.getElementById('newLectureDay').value;
    var month = document.getElementById('newLectureMonth')
        .options[document.getElementById('newLectureMonth').selectedIndex].value;
    var year = document.getElementById('newLectureYear')
        .options[document.getElementById('newLectureYear').selectedIndex].value;
    var hour = document.getElementById('newLectureHour').value;
    var minute = document.getElementById('newLectureMinute').value;
    var title = document.getElementById('newLectureTitle').value;
    var lecturerName = document.getElementById('newLecturerName').value;
    var lecturerAbout = document.getElementById('newLecturerAbout').value;
    var school = document.getElementById('newSchoolsInput').value;
    var auditorium = document.getElementById('lectureAuditoriumEdit')
        .options[document.getElementById('lectureAuditoriumEdit').selectedIndex].value;

    var datetime = new Date(year + '/' + month + '/' + day + ' ' + hour + ':' + minute);
    var lecturer = { name: lecturerName, about: lecturerAbout };

    if (oldTitle === '' || datetime === '' || title === '' || lecturer === '' || auditorium === '' || school === '') {
        alert('Заполните все поля.');
        return;
    }

    try {
        editLecture(oldTitle, datetime, title, lecturer, auditorium, school);
    } catch (e) {
        alert(e.message);
        return;
    }

    updateLecturesSelect();
    updateLectures();
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

function callRemoveAuditorium() {
    var auditorium = document.getElementById('auditoriumNameEdit')
        .options[document.getElementById('auditoriumNameEdit').selectedIndex].value;

    try {    
        removeAuditorium(auditorium);
    } catch(e) {
        alert(e.message);
    }
    
    updateAuditoriumsSelect('auditoriumNameEdit');
    updateAuditoriumsSelect('auditoriumSelect');
    updateAuditoriumsSelect('lectureAuditorium');
    updateAuditoriumsSelect('lectureAuditoriumEdit');
    displayCapacity('lectureAuditorium', 'audCapacity');
    displayCapacity('auditoriumNameEdit', 'audCapacityEdit');
    displayCapacity('lectureAuditoriumEdit', 'lectureAudCapacity');
}

function callRemoveLecture() {
    var lecture = document.getElementById('lectureTitleEdit')
        .options[document.getElementById('lectureTitleEdit').selectedIndex].value;

    removeLecture(lecture);
    updateLecturesSelect();
    updateLectures();
}
