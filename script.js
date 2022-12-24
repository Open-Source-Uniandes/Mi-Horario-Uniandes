/* USER PARAMETERS */
let myCourses = [
    {
        name: "ArquiEmp",
        code: "ISIS-2403",
    },
    {
        name: "Desarollo",
        code: "ISIS-2603",
    },
    {
        name: "Dalgo",
        code: "ISIS-1105",
       exclude: ["4"],
    },
    {
        name: "InfreTec",
        code: "ISIS-1304",
    },
    {
        name: "LyM",
        code: "ISIS-1106",
       exclude: ["1", "2"],
    },
    {
        name: "SisTrans",
        code: "ISIS-2304",
    },
    {
        name: "Maratones",
        code: "ISIS-2804",
    },
    {
        name: "Opti Avanzada",
        code: "IIND-4101",
        color: "#8A2BE2	",
    },
];

let customBlocks = [
    {
        name: "Despertar",
        code: "CSTM-0002",
        color: "#FF2400",
        sche: ["6:30-Lunes", "6:30-Martes", "6:30-Miércoles", "6:30-Jueves", "6:30-Viernes"],
    },
    {
        name: "Almuerzo",
        code: "CSTM-0003",
        color: "#FF2400",
        sche: ["12:30-Lunes", "12:30-Martes", "12:30-Miércoles", "12:30-Jueves", "12:30-Viernes",
               "11:00-Lunes", "11:00-Martes", "11:00-Miércoles", "11:00-Jueves", "11:00-Viernes"],
    },
];

const SCORE_MODE = "MinHuecos";
function customScore(schedule) {
    if(SCORE_MODE === "MinHoraSalida") {
        // Minimizar (-) la hora de salida de cada día
        const allSchedules = schedule.reduce((allSchedules, currentCourse) => [...allSchedules, ...currentCourse.sche], []);
        const coursesPerTime = START_TIMES.map(time => allSchedules.filter(el => el.includes(time)).length);
        const score = - coursesPerTime.reduce((score, el, idx) => score + el * (DAYS_OF_THE_WEEK.length ** idx), 0); // Lexicografic score assuming max values per entry of 5 
        return score;
    }
    else if(SCORE_MODE === "MinHuecos") {
        // Minimizar (-) huecos entre clases de un mismo día
        const allSchedules = schedule.reduce((allSchedules, currentCourse) => [...allSchedules, ...currentCourse.sche], []);
        const schesPerDay = DAYS_OF_THE_WEEK.map(day => allSchedules.filter(el => el.includes(day)).map(el => {
            const firstIndex = el.indexOf("-");
            const secondIndex = el.indexOf("-", firstIndex + 1);
            const time = el.substring(firstIndex + 1, secondIndex);
            const order = START_TIMES.indexOf(time);
            return order;
        }).sort((a,b) => a-b)); 
        const gapsPerDay = schesPerDay.map(sches => sches.reduce((totalGaps, value, idx, array) => {
            if (idx === 0) return 0;
            const thereIsAGap = (value - array[idx - 1] > 1);
            return totalGaps + Number(thereIsAGap);
        }, 0));
        const score = -gapsPerDay.reduce((score, el) => score + el, 0);
        return score;
    }
    return 0;
}

/* CONSTANTS */
const DAYS_OF_THE_WEEK = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const START_TIMES = ["6:30", "8:00", "9:30", "11:00", "12:30", "14:00", "15:30", "17:00"];

/* FUNCTIONS */
function transformData(data) {
    const code = [data.class, data.course].join("-");
    let prof = data.instructors;
    const section = data.section;
    if (prof.length) prof = prof[0].name; else prof = "NA";
    const sche = [];
    data.schedules.forEach(schedule => {
        let time = String(Number(schedule.time_ini));
        time = time.slice(0, -2) + ":" + time.slice(-2);
        let options = ["l", "m", "i", "j", "v"];
        const days = Object.fromEntries(options.map((d,i) => {return [d, DAYS_OF_THE_WEEK[i]]}));
        options = options.filter(option => schedule[option]);
        options = options.map(option => days[option]);
        options.forEach(day => sche.push(['article', time, day].join("-")));
    });
    return { code, prof, sche, section };
}

function isValid(...courses) {
    const allSchedules = courses.reduce((allSchedules, currentCourse) => [...allSchedules, ...currentCourse.sche], []);
    return (new Set(allSchedules).size == allSchedules.length);
}

function showSchedule(...courses) {
    clearSchedule();
    currentNumber.innerText = scheduleNumber + 1;
    courses.forEach(course => {
        const myCourse = myCourses.find(myCourse => course.code === myCourse.code);
        const name = myCourse.name;
        const prof = course.prof.toLowerCase().split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
        const color = myCourse.color || "#82BA6D";
        course.sche.forEach(schedule => {
            const section = document.getElementById(schedule);
            section.style.backgroundColor = color;
            section.innerHTML = `<p>${name}<br>${prof}</p>`;
        });
    })
}

function clearSchedule() {
    const sections = document.querySelectorAll('main > article > section');
    sections.forEach(section => {
        section.style.backgroundColor = "rgb(255, 244, 225)";
        section.innerHTML = "";
    })
}

function getValidSchedules(data) {
    
    const optionsByCourse = Object.fromEntries(myCourses.map(course => [course.code,  []]));
    data.forEach(course => optionsByCourse[course.code].push(course));

    const cartesianProduct = (...sets) => sets.reduce((resultSet, currentSet) => resultSet.flatMap(resultTuple => currentSet.map(currentElement => [resultTuple, currentElement].flat())));
    const allOptions = cartesianProduct(...Object.values(optionsByCourse));

    return allOptions.filter(option => isValid(...option)).sort((a,b) => customScore(b) - customScore(a));
}

/* DOM */
const currentNumber = document.querySelector('#current-number');
const totalNumber = document.querySelector('#total-number');

/* FILL GRIDS */

const header = document.querySelector('main > header');
DAYS_OF_THE_WEEK.forEach(day => {
    const section = document.createElement('section');
    section.id = ['header', day].join("-");
    section.innerText = day;
    header.appendChild(section);
});

const aside = document.querySelector('main > aside');
START_TIMES.forEach(time => {
    const section = document.createElement('section');
    section.id = ['aside', time].join("-");
    section.innerText = time;
    aside.appendChild(section);
});

const article = document.querySelector('main > article');
START_TIMES.forEach(time => DAYS_OF_THE_WEEK.forEach(day => {
    const section = document.createElement('section');
    section.id = ['article', time, day].join("-");
    article.appendChild(section);
}));


/* FETCH API */
let data = localStorage.getItem("data");
if(!data) fetch('https://ofertadecursos.uniandes.edu.co/api/courses')
    .then(response => response.json())
    .then(data => localStorage.setItem("data", JSON.stringify(data)));
  
data = JSON.parse(data)
    .map(transformData)
    .filter(course => myCourses.map(myC => myC.code).includes(course.code))
    // Exclude sections
    .filter(course => {
        let excludeArray = myCourses.find(myC => myC.code === course.code).exclude || [];
        let condition = !excludeArray.includes(course.section);
        delete course.section;
        return condition;
    })

// Add custom blocks
let dataBlocks = customBlocks.map(el => {
    const code = el.code;
    const prof = "Definido por el usuario";
    const sche = el.sche.map(schedule => "article-" + schedule);
    return {code, prof, sche}
});
let courseBlocks = customBlocks.map(el => ({name: el.name, code: el.code, color: el.color}));

myCourses = [...myCourses, ...courseBlocks];
data = [...data, ...dataBlocks];

/* SCHEDULES */
let schedules = getValidSchedules(data);
if (!schedules.length) alert("No existen horarios que cumplan los requerimientos");
let scheduleNumber = 0;
totalNumber.innerText = schedules.length; 
showSchedule(...schedules[scheduleNumber]);

/* EVENT LISTENERS */
window.addEventListener('keydown', event => {
    switch(event.key) {
    
        case 'ArrowLeft':
            scheduleNumber = Math.max(0, scheduleNumber - 1);
            showSchedule(...schedules[scheduleNumber]);
            break;
    
        case 'ArrowRight':
            scheduleNumber = Math.min(schedules.length - 1, scheduleNumber + 1);
            showSchedule(...schedules[scheduleNumber]);
            break;
    
    }
})
