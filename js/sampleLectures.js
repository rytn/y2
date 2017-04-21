var sampleAuditoriums = {
    "2.Ствола": 40,
    "4.The Beatles": 60,
    "4.Апрель": 100,
    "4.Марс": 140,
    "5.Аргентина-Ямайка": 55,
    "6.Серафим": 130,
    "7.Нянек": 90
};

var sampleSchools = {
    "ШРИ": 50,
    "ШМД": 40,
    "ШМР": 40
};


var sampleLectures = [{
    date: "2016/10/20 19:00",
    title: "Адаптивная вёрстка",
    lecturer: {
        name: "Дмитрий Душкин",
        about: "Кандидат технических наук, научный сотрудник ИПУ РАН с 2008 по 2013. Пришёл в Яндекс.Картинки в 2014 году, отвечал за мобильную версию и рост производительности сервиса. В 2016 перешёл в Yandex Data Factory, где разрабатывает интерфейсы и дизайн веб-приложений для B2B."
    },
    auditorium: "4.The Beatles",
    school: "ШРИ"
}, {
    date: "2016/10/27 18:00",
    title: "Работа с сенсорным пользовательским вводом",
    lecturer: {
        name: "Дмитрий Душкин",
        about: "Кандидат технических наук, научный сотрудник ИПУ РАН с 2008 по 2013. Пришёл в Яндекс.Картинки в 2014 году, отвечал за мобильную версию и рост производительности сервиса. В 2016 перешёл в Yandex Data Factory, где разрабатывает интерфейсы и дизайн веб-приложений для B2B."
    },
    auditorium: "4.Марс",
    school: "ШРИ, ШМД, ШМР"
}, {
    date: "2016/10/30 13:00",
    title: "Мультимедиа: возможности браузера",
    lecturer: {
        name: "Максим Васильев",
        about: "Во фронтенд-разработке с 2007 года. До 2013-го, когда пришёл в Яндекс, работал технологом в студии Лебедева и других компаниях."
    },
    auditorium: "5.Аргентина-Ямайка",
    school: "ШРИ"
}, {
    date: "2016/11/24 17:00",
    title: "Клиентская оптимизация: мобильные устройства и инструменты",
    lecturer: {
        name: "Иван Карев",
        about: "Окончил факультет ВМК (вычислительной математики и кибернетики) МГУ им. М.В. Ломоносова, занимается веб-программированием с 2007 года. Сначала делал админки для системы фильтрации трафика, затем — интерфейсы онлайн-карт для проекта Космоснимки. В Яндексе начинал с Народа и Я.ру, последние два года занимался главной страницей. В настоящее время специализируется на вопросах производительности: от серверного JS до оптимизации загрузки страницы на клиенте."
    },
    auditorium: "7.Нянек",
    school: "ШРИ"
}, {
    date: "2016/11/24 19:00",
    title: "Развите продукта",
    lecturer: {
        name: "Андрей Гевак",
        about: "В конце 2013 года команда сервиса Яндекс.Музыка начала разработку новой версии. Новой получилась не только «шкурка», то есть дизайн, но и сами возможности. Мы переосмыслили поведение пользователей на сайте и в приложении и иначе оценили потребность людей в новой музыке. В результате этого получилась нынешняя версия music.yandex.ru и её мобильные клиенты. В докладе я расскажу о том, как шёл процесс переосмысления, почему мы сделали именно так, как сделали, и что из этого всего вышло."
    },
    auditorium: "4.Апрель",
    school: "ШМД"
}, {
    date: "2017/08/03 16:00",
    title: "Природа операционных систем",
    lecturer: {
        name: "Николай Васюнин",
        about: "Пришёл в Яндекс в 2014 году. Дизайнер продукта в музыкальных сервисах компании, участник команды разработки Яндекс.Радио."
    },
    auditorium: "6.Серафим",
    school: "ШРИ, ШМД, ШМР"
}, {
    date: "2017/08/23 18:00",
    title: "Debugging & Polishing",
    lecturer: {
        name: "Илья Сергеев",
        about: "Разрабатывает приложения под мобильные платформы с 2009 года. За это время принял участие более чем в 30 законченных проектах под Android, iOS, и Windows Phone. В Яндексе с 2015 года, занимается разработкой КиноПоиска под Android и iOS."
    },
    auditorium: "2.Ствола",
    school: "ШМР"
}];
