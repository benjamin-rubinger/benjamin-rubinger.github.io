function spaceToDash(s) {
    return s.replaceAll(' ', '-');
}

function setData($e, data) {
    for (const [key, value] of Object.entries(data)) {
        $e.attr(`data-${spaceToDash(key)}`, value);
    }
}

function renderCalendarData(calendar) {
    const keys = ['name', 'type', 'introduced', 'by', 'community', 'based on', 'epoch', 'leap day ratio', 'leap month ratio', 'month length', 'week length', 'weeks per month', 'hours per day', 'minutes per hour'];// , 'notes'
    let $tr = $('<tr>').addClass('calendar-data');
    setData($tr, calendar);
    for (const key of Object.values(keys)) {
        console.log(`${key} ${calendar[key]}`);
        let value = calendar[key];
        let $tdValue = $('<td>').text(value);
        $tr.append($tdValue);
    }
    return $tr;
}

function fetchCalendarData(calendarName) {
    console.log('fetch calendar data');
    const path = `json/${calendarName}.json`;
    console.log(path)
    fetch(path)
        .then(response => response.json())
        .then(json => console.log(json));
}

function chineseJson() {
    return '{"based on":"","by":"chinese emperor","community":"china","hours per day":12,"intercalary days":0,"introduced":-221,"epoch":"era","leap day ratio":0,"leap month ratio":2.71,"minutes per hour":8,"month length":"29.53125","months":"corner,apricot,peach,plum,pomegranate,lotus,orchid,osmanthus,chrysanthemum,dew,reed,ice","name":"chinese","new day time":"midnight","new year day":274,"notes":"daytime was also divided into 100 parts.","type":"lunisolar","week length":"9 - 10","weeks per month":"3"}';
}

function egyptianJson() {
    return '{"based on":"mesopotamian","by":"","community":"egypt","hours per day":24,"intercalary days":5,"introduced":-2450,"epoch":"era","leap day ratio":0,"leap month ratio":0,"minutes per hour":"","month length":"30","months":"1 Ꜣḫt,2 Ꜣḫt,3 Ꜣḫt,4 Ꜣḫt,1 Prt,2 Prt,3 Prt,4 Prt,1 Šmw,2 Šmw,3 Šmw,4 Šmw","name":"egyptian","new day time":"sunrise","new year day":254,"notes":"exactly 365 days a year, shifts through the seasons on the sothic cycle","type":"solar","week length":10,"weeks per month":"3"}';
}

function gregorianJson() {
    return '{"based on":"julian","by":"pope gregory xiii","community":"catholic church","hours per day":24,"intercalary days":0,"introduced":1582,"epoch":"1 bc","leap day ratio":0.2425,"leap month ratio":0,"minutes per hour":60,"month length":"28 - 31","months":"january,february,march,april,may,june,july,august,september,october,november,december","name":"gregorian","new day time":"midnight","new year day":1,"notes":"two sets of 12 hours with am and pm, timezones, daylight savings time","type":"solar","week length":7,"weeks per month":"about 4"}';
}

function julianJson() {
    return '{"based on":"egyptian and roman","by":"julius caesar","community":"roman empire","hours per day":24,"intercalary days":0,"introduced":-45,"epoch":"? bc","leap day ratio":0.25,"leap month ratio":0,"minutes per hour":60,"month length":"28 - 31","months":"january,february,march,april,may,june,july,august,september,october,november,december","name":"julian","new day time":"midnight","new year day":1,"notes":"two sets of 12 hours with am and pm","type":"solar","week length":7,"weeks per month":"about 4"}';
}

function romanJson() {
    return '{"based on":"","by":"king numa","community":"roman empire","hours per day":24,"intercalary days":0,"introduced":-672,"epoch":"? bc","leap day ratio":0,"leap month ratio":0,"minutes per hour":"","month length":"28 - 31","months":"january,february,march,april,may,june,july,august,september,october,november,december","name":"roman","new day time":"midnight","new year day":60,"notes":"two sets of 12 hours with am and pm","type":"lunar","week length":7,"weeks per month":"about 4"}';
}

function fetchLocal(calendarName) {
    let calendarJson;
    if (calendarName === 'chinese') {
        calendarJson = chineseJson();
    } else if (calendarName === 'egyptian') {
        calendarJson = egyptianJson();
    } else if (calendarName === 'gregorian') {
        calendarJson = gregorianJson();
    } else if (calendarName === 'julian') {
        calendarJson = julianJson();
    } else if (calendarName === 'roman') {
        calendarJson = romanJson();
    }
    console.log(calendarJson);
    const calendarData = JSON.parse(calendarJson);
    console.log(calendarData);
    return calendarData;
}

// sortable table
// from https://stackoverflow.com/questions/14267781/sorting-html-table-with-javascript/49041392#49041392
function sortable() {
    const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

    const comparer = (idx, asc) => (a, b) => ((v1, v2) =>
            v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
    )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

    document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
        const table = th.closest('table');
        Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
            .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
            .forEach(tr => table.appendChild(tr) );
    })));
}

function initialize() {
    const $table = $('table');
    const calendarNames = ['chinese', 'egyptian', 'gregorian', 'julian', 'roman'];
    for (const calendarName of Object.values(calendarNames)) {
        // fetchCalendarData('gregorian');
        let calendarData = fetchLocal(calendarName);
        $table.append(renderCalendarData(calendarData));
    }
    sortable();
}

const $body = $('body');
$(() => initialize());
