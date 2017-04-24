function isBetweenDates(date, min, max) {
    return date >= min && date <= max;
}

function getLecturesInInterval(startDate, endDate, auditorium, school) {
    var lectures = JSON.parse(localStorage.getItem('lectures'));
    var lecturesToDisplay = [];

    if (auditorium === 'любая' && school === 'любая') {
        for (var i = 0; i < lectures.length; i++) {
            if (isBetweenDates(new Date(lectures[i].date), startDate, endDate)) {
                lecturesToDisplay.push(lectures[i]);
            }
        }
    } else if (auditorium !== 'любая' && school !== 'любая') {
        for (var i = 0; i < lectures.length; i++) {
            if (isBetweenDates(new Date(lectures[i].date), startDate, endDate)
            && lectures[i].auditorium === auditorium && lectures[i].school.indexOf(school) !== -1) {
                lecturesToDisplay.push(lectures[i]);
            }
        }
    } else if (auditorium !== 'любая' && school === 'любая') {
        for (var i = 0; i < lectures.length; i++) {
            if (isBetweenDates(new Date(lectures[i].date), startDate, endDate) && lectures[i].auditorium === auditorium) {
                lecturesToDisplay.push(lectures[i]);
            }
        }
    } else if (auditorium === 'любая' && school !== 'любая') {
        for (var i = 0; i < lectures.length; i++) {
            if (isBetweenDates(new Date(lectures[i].date), startDate, endDate) && lectures[i].school.indexOf(school) !== -1) {
                lecturesToDisplay.push(lectures[i]);
            }
        }
    }

    return lecturesToDisplay;
}

function checkLecture(datetime, auditorium, school, lecturer) {
    var lectures = JSON.parse(localStorage.getItem('lectures'));
    if (lectures === null) {
        return;
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

function addLecture(datetime, title, lecturer, auditorium, school) {
    var studentsNumber = checkCapacity(auditorium, school);
    checkLecture(datetime, auditorium, school, lecturer.name);

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
    if (oldTitle === '' || newDateTime === '' || newTitle === '' || newLecturer === '' || newAuditorium === '' || newSchool === '') {
        throw new Error('Заполните все поля.');
    }

    var lectures = JSON.parse(localStorage.getItem('lectures'));
    var auditoriumsLoad = JSON.parse(localStorage.getItem('auditoriumsLoad'));
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
                
                delete auditoriumsLoad[oldLecture.auditorium + new Date(oldLecture.date).toString()];
                auditoriumsLoad[newAuditorium + newDateTime.toString()] = checkCapacity(newAuditorium, newSchool);
                localStorage.setItem('auditoriumsLoad', JSON.stringify(auditoriumsLoad));
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

function removeAuditorium(auditorium) {
    var auditoriums = JSON.parse(localStorage.getItem('auditoriums'));
    var lectures = JSON.parse(localStorage.getItem('lectures'));

    // check if lectures are planned in this auditorium
    for (var i = 0; i < lectures.length; i++) {
        if (new Date(lectures[i].date) > new Date() && lectures[i].auditorium === auditorium) {
            throw new Error('Нельзя удалить аудиторию, потому то в ней уже запланирована лекция');
        }
    }

    delete auditoriums[auditorium];
    localStorage.setItem('auditoriums', JSON.stringify(auditoriums));
}

function removeSchool(school) {
    var schools = JSON.parse(localStorage.getItem('schools'));
    var schoolsAcronyms = JSON.parse(localStorage.getItem('schoolsAcronyms'));
    var lectures = JSON.parse(localStorage.getItem('lectures'));
    
    // check if lectures are planned for this school
    for (var i = 0; i < lectures.length; i++) {
        if (new Date(lectures[i].date) > new Date() && lectures[i].school.indexOf(school) !== -1) {
            throw new Error('Нельзя удалить школу, потому то для нее уже запланирована лекция');
        }
    }
    
    delete schools[schoolsAcronyms[school]];
    localStorage.setItem('schools', JSON.stringify(schools));
}
