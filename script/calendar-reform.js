function dashToSpace(s) {
    return s.replaceAll('-', ' ');
}

function navigationEntry($section) {
    // console.log('navigation entry');
    // console.log($section);
    if ($section[0].nodeName !== 'SECTION') {
        // console.log('navigation entry return early');
        return $('<div>');
    }
    const id = $section.attr('id');
    const navigationId = `navigation-${id}`;
    const text = dashToSpace(id);
    return $(`<li><a class="${navigationId}" href="#${id}">${text}</a></li>`);
}

function generateNavigationForSection($section) {
    // console.log('generate navigation for section');
    // console.log($section);
    let $navigationSection = navigationEntry($section);
    // console.log($navigationSection);
    const $childSections = $section.children("section");
    if ($childSections.length > 0) {
        const $childContainer = $('<ul>');
        $childSections.each(function(i) {
            let childNavigation = generateNavigationForSection($(this));
            $childContainer.append(childNavigation);
        });
        $navigationSection.append($childContainer);
    }
    return $navigationSection;
}

function generateNavigation() {
    const $navigationContainer = $('nav.article');
    const $article = $('article').first();
    const $navigation = generateNavigationForSection($article).unwrap();
    $navigationContainer.empty().append($navigation);
}

function formatDateTime() {
    // console.log("format date time");
    const dateString = $('input.date').val();
    // console.log(dateString);
    const timeString = $('input.time').val();
    // console.log(timeString);
    const offsetString = $('select.timezone').val();
    // console.log(offsetString);
    const dateTimeString = dateString + 'T' + timeString + offsetString;
    let d = new Date(dateTimeString);
    // console.log(d);
    const localeString = d.toString();
    $('.datetime-formats .default').text(localeString);
    const isoString = d.toISOString(); // this isnt good enough because it converts to utc
    $('.datetime-formats .iso8601').text(isoString);
}

function generateDateFormats(d) {
    $('table.formats .format-example').each(function(i) {
        let $e = $(this);
        let df = $e.attr('data-format');
        // console.log(df);
        $e.text(renderDateFormat(df, d));
    });
}

function setNow() {
    let now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const isoString = now.toISOString().slice(0, -1);
    // console.log(isoString);
    const tIndex = isoString.indexOf('T');
    const dateString = isoString.slice(0, tIndex);
    // console.log(dateString);
    const timeString = isoString.slice(tIndex + 1, isoString.length);
    // console.log(timeString);
    $('input.date').val(dateString);
    $('input.time').val(timeString);
    // console.log(now.getTimezoneOffset());
    const offsetRemainder = now.getTimezoneOffset() % 60;
    const offsetHours = (now.getTimezoneOffset() - offsetRemainder) / 60;
    let offsetHoursPrefix = '';
    if (Math.abs(offsetHours) < 10) {
        offsetHoursPrefix = '0';
    }
    let offsetMinutesPrefix = '';
    if (Math.abs(offsetRemainder) < 10) {
        offsetMinutesPrefix = '0';
    }
    let offsetPrefix = '-';
    if (offsetHours < 0) {
        offsetPrefix = '+';
    }
    const offset = offsetPrefix + offsetHoursPrefix + Math.abs(offsetHours).toString() + ':' + offsetMinutesPrefix + Math.abs(offsetRemainder).toString();
    // console.log(offset);
    $('select.timezone').val(offset);
    formatDateTime();
    generateDateFormats(now);
    // gregorianToJulianDay(new Date('-004713-11-24'));
    // console.log(`jdn 0\n\n`);
    // gregorianToJulianDay(new Date('-004713-11-25'));
    // console.log(`jdn 1\n\n`);
    // gregorianToJulianDay(new Date('-004712-11-24'));
    // console.log(`jdn 365\n\n`);
    // gregorianToJulianDay(new Date('0001-01-01'));
    // console.log(`jdn 1721425.5 1721424 \n\n`);
    // gregorianToJulianDay(new Date('1582-10-15'));
    // console.log(`gregorian calendar jd 2299160\n\n`);
    // gregorianToJulianDay(new Date('1970-01-01'));
    // console.log(`unix epoch jd 2440587\n\n`);
    // gregorianToJulianDay(now);
    // console.log(`today jd 2459923\n\n`);
}

function setDark() {
    $('body').addClass('dark').removeClass('light');
}

function setLight() {
    $('body').addClass('light').removeClass('dark');
}

function capitalize() {
    $('button.capitalize').removeClass('capitalize').addClass('decapitalize').text("decapitalize");
    $('.capitalizable').addClass('capitalize');
}

function decapitalize() {
    $('button.decapitalize').removeClass('decapitalize').addClass('capitalize').text("Capitalize");
    $('.capitalizable').removeClass('capitalize');
}

function apostrophes() {
    $('button.apostrophes').removeClass('apostrophes').addClass('deapostrophe').text("deapostrophe");
    $('.apostrophe').html('&apos;');
}

function deapostrophe() {
    $('button.deapostrophe').removeClass('deapostrophe').addClass('apostrophes').html("apostrophe&apos;s");
    $('.apostrophe').text('');
}

function bumpSize(amount) {
    const minimumSize = 8;
    const $html = $('html');
    const currentSize = parseInt($html.css('font-size'));
    let nextSize = currentSize + amount;
    if (nextSize < minimumSize) {
        nextSize = minimumSize;
    }
    $html.css('font-size', nextSize + 'px');
}

function bigger() {
    bumpSize(4);
}

function smaller() {
    bumpSize(-4);
}

function navigationCollapse() {
    $('button.navigation-collapse').removeClass('navigation-collapse').addClass('navigation-expand').html('&lt;');
    $('nav.article').hide();
    $('main > article').addClass('no-navigation');
}

function navigationExpand() {
    $('button.navigation-expand').removeClass('navigation-expand').addClass('navigation-collapse').html('&gt;');
    $('main > article').removeClass('no-navigation');
    $('nav.article').show();
}

// based on https://www.bram.us/2020/01/10/smooth-scrolling-sticky-scrollspy-navigation/
function registerObservers() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const navigationId = `navigation-${id}`;
            if (entry.intersectionRatio > 0) {
                $(`.${navigationId}`).addClass('active');
            } else {
                $(`.${navigationId}`).removeClass('active');
            }
        });
    });

    document.querySelectorAll('section[id]').forEach((section) => {
        observer.observe(section);
    });
}

function julianLeapDay(year) {
    return (year % 4) === 0;
}

function gregorianLeapDay(year) {
    if ((year % 4) === 0) {
        if ((year % 100) === 0) {
            return (year % 400) === 0;
        } else {
            return true;
        }
    }
    return false;
}

function betterLeapDay(year) {
    if ((year % 4) === 0) {
        if ((year % 100) === 0) {
            if ((year % 400) === 0) {
                return (year % 3600) !== 0;
            }
        } else {
            return true;
        }
    }
    return false;
}

function anotherLeapDay(year) {
    if ((year % 4) === 0) {
        if ((year % 40) === 0) {
            return false;
        } else {
            return true;
        }
    }
    return false;
}

function calculateLeapDays() {
    let julianLeapDayCount = 0;
    let gregorianLeapDayCount = 0;
    let betterLeapDayCount = 0;
    const yearRange = 100000;
    for (let year = 0; year < yearRange; year++) {
        if (julianLeapDay(year)) {
            julianLeapDayCount += 1;
        }
        if (gregorianLeapDay(year)) {
            gregorianLeapDayCount += 1;
        }
        if (betterLeapDay(year)) {
            betterLeapDayCount += 1;
        }
    }
    const julianRatio = julianLeapDayCount / yearRange;
    console.log(`julian leap day ratio ${julianRatio}`); // 0.25

    const gregorianRatio = gregorianLeapDayCount / yearRange;
    console.log(`gregorian leap day ratio ${gregorianRatio}`); // 0.2425

    const betterRatio = betterLeapDayCount / yearRange;
    console.log(`better leap day ratio ${betterRatio}`); // 0.24222
}

function daysPerMonth(monthNumber, isLeapYear) {
    if ((monthNumber == 1) || (monthNumber == 3) || (monthNumber == 5) || (monthNumber == 7) || (monthNumber == 8) || (monthNumber == 10) || (monthNumber == 12)) {
        return 31;
    } else if ((monthNumber == 2) && isLeapYear) {
        return 29;
    } else if (monthNumber == 2) {
        return 28;
    }
    return 30;
}

function unixEpoch() {
    return 2440587.5;
}

// several references, not all used in this code
// https://keisan.casio.com/exec/system/1227779487
// https://squarewidget.com/julian-day/
// https://quasar.as.utexas.edu/BillInfo/JulianDatesG.html
// https://sciencing.com/calculate-day-born-5512884.html
// https://core2.gsfc.nasa.gov/time/julian.html
// https://github.com/stevebest/julian/blob/master/test/test.js
//
function gregorianToJulianDay(d) {
    const julianEpochYear = -4713;
    const julianEpochMonth = 11;
    const julianEpochDay = 24;

    const unixTime = d.getTime();
    const trivial = unixTime / 86400000 + unixEpoch();

    const givenYear = getFourDigitYear(d) * 1;
    const givenMonth = getMonthNumber(d) * 1;
    const dayOfMonth = (getDayOfMonthNumber(d) * 1) - 1;
    console.log(`year ${givenYear}  month ${givenMonth}  given day ${getDayOfMonthNumber(d)}  day in month ${dayOfMonth}`);

    // from https://en.wikipedia.org/wiki/Julian_day
    // JDN = (1461 * (Y + 4800 + (M - 14)/12))/4 + (367 * (M - 2 - 12 * ((M - 14)/12)))/12 - (3 * ((Y + 4900 + (M - 14)/12)/100))/4 + D - 32075
    const offsetMonth = (givenMonth - 14) / 12;
    const part0 = Math.floor(1461 * (givenYear + 4800 + offsetMonth)/4);
    const part1 = Math.floor((367 * (givenMonth - 2 - 12 * offsetMonth)) / 12);
    const part2 = Math.floor((3 * ((givenYear + 4900 + offsetMonth)/100)) / 4);
    const wikipedia = part0 + part1 - part2 + dayOfMonth - 32075;
    // console.log(`part0 ${part0}  part1 ${part1}  part2 ${part2}`);

    let years = givenYear - julianEpochYear;
    // unnecessary conversion from anno domini to makes sensomini
    // if (givenYear > -1) {
    //     years += 1;
    // }
    let leapYearCount = 0;
    for (let year = julianEpochYear; year < givenYear; year++) {
        // unnecessary conversion between julian calendar and gregorian calendar, jdn stays in gregorian proleptic
        // if ((year <= 1582) && julianLeapDay(year)) {
        //     console.log(`julian leap year ${year}`);
        //     leapYearCount += 1;
        // } else if (gregorianLeapDay(year)) {
        //     leapYearCount += 1;
        // }
        if (gregorianLeapDay(year)) {
            leapYearCount += 1;
        }
    }
    // console.log(`leap years ${leapYearCount}`);
    const commonYearDays = 365 * years;
    const yearDays = commonYearDays + leapYearCount;
    const isLeapYear = gregorianLeapDay(givenYear);
    // unnecessary conversion between julian calendar and gregorian calendar, jdn stays in gregorian proleptic
    // if (givenYear > 1582) {
    //     yearDays -= 10; // switch from julian to gregorian calendar
    //     isLeapYear = gregorianLeapDay(givenYear);
    // } else {
    //     isLeapYear = julianLeapDay(givenYear);
    // }
    // console.log(`year days ${yearDays}`);
    console.log(`julian years ${years}  leap years ${leapYearCount}  year days ${yearDays}`);
    console.log(`is given year a leap year ${isLeapYear}`);
    let monthDays = 0;
    let dayDays = dayOfMonth;
    if (givenYear > julianEpochYear) {
        for (let m = 1; m < givenMonth; m++) {
            monthDays += daysPerMonth(m, isLeapYear);
        }
        monthDays -= 328; // julian period doesnt start at the beginning of the year, so i subtract out the 37 days from the year before
    } else if (givenYear === julianEpochYear) {
        if (givenMonth === julianEpochMonth) {
            dayDays -= julianEpochDay;
        } else if (givenMonth > julianEpochMonth) {
            monthDays += 6;
        }
    }

    console.log(`year days ${yearDays}  month days ${monthDays}  day days ${dayDays}`);

    let d2 = new Date(d);
    d2.setMinutes(d2.getMinutes() + d2.getTimezoneOffset()); // add back the timezone?
    const hourSeconds = getHours(d2) * 3600;
    const minuteSeconds = getMinutes(d2) * 60;
    const secondSeconds = getSeconds(d2);
    const milliseconds = getMilliseconds(d2) / 1000;
    const fractionalDays = ((hourSeconds + minuteSeconds + secondSeconds + milliseconds) / 86400) - 0.5;
    console.log(`hours ${getHours(d2)}  minutes ${getMinutes(d2)}  seconds ${getSeconds(d2)}  milliseconds ${getMilliseconds(d2)}  fractionalDays ${fractionalDays}`);

    const result = yearDays + monthDays + dayDays + fractionalDays;

    console.log(`trivial ${trivial}`);
    console.log(`wikipedia ${wikipedia}`);
    console.log(`manual ${result}`);
    return result;
}

function spaceToDash(s) {
    return s.replaceAll(' ', '-');
}

function setData($e, data) {
    for (const [key, value] of Object.entries(data)) {
        $e.attr(`data-${spaceToDash(key)}`, value);
    }
}

function renderCalendarData(calendar) {
    const keys = ['name', 'type', 'introduced', 'by', 'community', 'based on', 'epoch', 'leap day ratio', 'leap month ratio', 'month length', 'week length', 'weeks per month', 'hours per day', 'minutes per hour', 'notes'];
    let $result = $('<div>').addClass('calendar-data');
    let $table = $('<table>');
    setData($result, calendar);
    for (const key of Object.values(keys)) {
        console.log(`${key} ${calendar[key]}`);
        let $tr = $('<tr>');
        let $tdKey = $('<td>').text(key);
        let value = calendar[key];
        let $tdValue = $('<td>').text(value);
        $tr.append([$tdKey, $tdValue]);
        $table.append($tr);
    }
    $result.append($table);
    return $result;
}

function fetchCalendarData(calendarName) {
    console.log('fetch calendar data');
    const path = `json/${calendarName}.json`;
    console.log(path)
    fetch(path)
        .then(response => response.json())
        .then(json => console.log(json));
}

function egyptianJson() {
    return '{"based on":"mesopotamian","by":"","community":"egypt","hours per day":24,"intercalary days":5,"introduced":"2450 bc","epoch":"era","leap day ratio":0,"leap month ratio":0,"minutes per hour":"","month length":"30","months":"1 Ꜣḫt,2 Ꜣḫt,3 Ꜣḫt,4 Ꜣḫt,1 Prt,2 Prt,3 Prt,4 Prt,1 Šmw,2 Šmw,3 Šmw,4 Šmw","name":"egyptian","new day time":"sunrise","new year day":254,"notes":"exactly 365 days a year, shifts through the seasons on the sothic cycle","type":"solar","week length":10,"weeks per month":"3"}';
}

function gregorianJson() {
    return '{"based on":"julian","by":"pope gregory xiii","community":"catholic church","hours per day":24,"intercalary days":0,"introduced":"1582-10-15T00:00:00Z","epoch":"1 bc","leap day ratio":0.2425,"leap month ratio":0,"minutes per hour":"60","month length":"28 - 31","months":"january,february,march,april,may,june,july,august,september,october,november,december","name":"gregorian","new day time":"midnight","new year day":1,"notes":"two sets of 12 hours with am and pm, timezones, daylight savings time","type":"solar","week length":7,"weeks per month":"about 4"}';
}

function fetchLocal(calendarName) {
    let calendarJson;
    if (calendarName === 'egyptian') {
        calendarJson = egyptianJson();
    } else if (calendarName === 'gregorian') {
        calendarJson = gregorianJson();
    }
    console.log(calendarJson);
    const calendarData = JSON.parse(calendarJson);
    console.log(calendarData);
    return calendarData;
}

function getFourDigitYear(d) {
    return d.getFullYear();
}

function getTwoDigitYear(d) {
    let yearString = d.getFullYear().toString();
    return yearString.slice(yearString.length - 2, yearString.length);
}

function getFullMonthName(d) {
    return d.toLocaleString('default', { month: 'long' });
}

function getShortMonthName(d) {
    return d.toLocaleString('default', { month: 'short' }).toUpperCase();
}

function getMonthNumber(d) {
    return (d.getMonth() + 1).toString();
}

function getDayOfMonthNumber(d) {
    return d.getDate().toString();
}

// integer hours 0 - 23
function getHours(d) {
    return d.getHours();
}

// integer minutes 0 - 59
function getMinutes(d) {
    return d.getMinutes();
}

// integer seconds 0 - 59
function getSeconds(d) {
    return d.getSeconds();
}

// integer milliseconds 0 - 999
function getMilliseconds(d) {
    return d.getMilliseconds();
}

function renderDateFormat(df, d) {
    let result = '';
    let year = '';
    let month = '';
    let day = '';
    if (df.indexOf('yyyy') >= 0) {
        year = getFourDigitYear(d);
    } else {
        year = getTwoDigitYear(d);
    }
    if (df.indexOf('mmmm') >= 0) {
        month = getFullMonthName(d);
    } else if (df.indexOf('mmm') >= 0) {
        month = getShortMonthName(d);
    } else {
        month = getMonthNumber(d);
    }
    if (df.indexOf('mm') >= 0) {
        if (month.length < 2) {
            month = '0' + month;
        }
    }
    day = getDayOfMonthNumber(d);
    if (df.indexOf('dd') >= 0) {
        if (day.length < 2) {
            day = '0' + day;
        }
    }
    for (let char of df) {
        if (char === 'y') {
            result += year;
            year = '';
        }else if (char === 'm') {
            result += month;
            month = '';
        } else if (char === 'd') {
            result += day;
            day = '';
        } else {
            result += char;
        }
    }
    return result;
}

/* using https://github.com/visjs/vis-timeline */
function timeline() {
    const timelineContainer = $('.timeline')[0];
    const items = [
        { content: 'neolithic revolution', start: '-011700-01-01', type: 'point' },
        { content: 'human era epoch', start: '-010000-01-01', type: 'point' },
        { content: 'julian day epoch', start: '-004713-01-01', type: 'point' },
        { content: 'hebrew calendar epoch', start: '-003761-01-01', type: 'point' },
        { content: 'beginning of recorded history', start: '-003500-01-01', type: 'point' },
        { content: 'ancient egyptian calendar introduced', start: '-002450-01-01', type: 'point' },
        { content: 'chinese calendar introduced', start: '-000771-01-01', type: 'point' },
        { content: 'numa roman calendar reform', start: '-000672-01-01', type: 'point' },
        { content: 'julian calendar introduced', start: '-000045-01-01', type: 'point' },
        { content: 'gregorian calendar epoch', start: '-000000-01-01', type: 'point' },
        { content: 'sexagesimal minutes and seconds', start: '1000-01-01', type: 'point' },
        { content: 'copernicus proposes that the earth orbits the sun', start: '1543-01-01', type: 'point' },
        { content: 'gregorian calendar introduced', start: '1582-10-15', type: 'point' },
        { content: 'greenwich observatory established', start: '1675-06-22', type: 'point' },
        { content: 'french revolutionary calendar', start: '1793-11-24', end: '1806-01-01', type: 'point' },
        { content: 'greenwich observatory daily signals began', start: '1833-01-01', type: 'point' },
        { content: 'greenwich mean time', start: '1847-01-01', type: 'point' },
        { content: 'international meridian conference', start: '1884-10-01', type: 'point' },
        { content: 'greenwich observatory starts broadcasting hourly time signals', start: '1924-02-05', type: 'point' },
        { content: 'universal time established', start: '1928-01-01', type: 'point' },
        { content: 'atomic clocks', start: '1955-01-01', type: 'point' },
        { content: 'coordinated universal time established', start: '1956-01-01', type: 'point' },
        { content: 'unix time epoch', start: '1970-01-01', type: 'point' },
        { content: 'unix time introduced', start: '1971-11-01', type: 'point' },
        { content: 'leap seconds introduced', start: '1972-01-01', type: 'point' },
        { content: 'year 2000 problem', start: '2000-01-01', type: 'point' },
        { content: 'started writing choose your own calendar reform', start: '2022-10-21', type: 'point' },
        { content: 'year 2038 problem', start: '2038-01-01', type: 'point' },
        { content: 'earliest startrek stardate', start: '2256-05-11', type: 'point' },
    ];
    let index = 0;
    for (const item of items) {
        item.id = `timeline-item${index}`;
        // console.log(item);
        index += 1;
    }
    const ds = new vis.DataSet(items);
    const options = {
        end: '2040-01-01',
        max: '4000-01-01',
        maxHeight: '400px',
        min: '-013000-01-01',
        minHeight: '400px',
        start: '1880-01-01',
        zoomMax: 490000000000000,
    };
    const timeline = new vis.Timeline(timelineContainer, ds, options);
}

function initialize() {
    setNow();
    generateNavigation();
    registerObservers();
    timeline();
    // fetchCalendarData('gregorian');
    // let gregorianData = fetchLocal('gregorian');
    // $('section#gregorian-calendar').append(renderCalendarData(gregorianData));
    // let egyptianData = fetchLocal('egyptian');
    // $('section#egyptian-calendar').append(renderCalendarData(egyptianData));
}

const $body = $('body');
$(() => initialize());
$body.on('input change', 'input.date, input.time, select.timezone', formatDateTime);
$body.on('click', 'button.now', setNow);
$body.on('click', 'button.dark', setDark);
$body.on('click', 'button.light', setLight);
$body.on('click', 'button.bigger', bigger);
$body.on('click', 'button.smaller', smaller);
$body.on('click', 'button.capitalize', capitalize);
$body.on('click', 'button.decapitalize', decapitalize);
$body.on('click', 'button.apostrophes', apostrophes);
$body.on('click', 'button.deapostrophe', deapostrophe);
$body.on('click', 'button.navigation-collapse', navigationCollapse);
$body.on('click', 'button.navigation-expand', navigationExpand);
