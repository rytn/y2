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

    try {
        displayAuditoriumDateInterval(auditorium, startDate, endDate);
    } catch (e) {
        alert(e.message);
        return;
    }
}

function callAddLecture() {
    var day = document.getElementById('lectureDay')
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
