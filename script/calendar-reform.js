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
            let $childNavigation = generateNavigationForSection($(this));
            $childContainer.append($childNavigation);
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

function generateDatetimeInputs(index) {
    const $inputDate = $('<input>').attr('id', `input-date${index}`).addClass('input-date').attr('type', 'date');
    const $inputTime = $('<input>').attr('id', `input-time${index}`).addClass('input-time').attr('type', 'time'); //.attr('step', '1');
    const options = ['-12:00', '-11:00', '-10:00', '-09:30', '-09:00', '-08:00', '-07:00', '-06:00', '-05:00', '-04:00', '-03:30', '-03:00', '-02:00', '-01:00', '+00:00', '+01:00', '+02:00', '+03:00', '+03:30', '+04:00', '+04:30', '+05:00', '+05:30', '+05:45', '+06:00', '+07:00', '+08:00', '+08:45', '+09:00', '+09:30', '+10:00', '+10:30', '+11:00', '+12:00', '+12:45', '+13:00', '+14:00'];
    const $selectTimezone = $('<select>').attr('id', `select-timezone${index}`).addClass('timezone');
    for (const offset of options) {
        const $option = $('<option>').text(offset);
        $selectTimezone.append($option);
    }
    const $now = $('<button>').attr('id', `button-now${index}`).addClass('now').text('now');
    const $datetimeContainer = $('<div>').attr('id', `datetime-container${index}`).addClass('datetime-container');
    $datetimeContainer.append([$inputDate, $inputTime, $selectTimezone, $now]);
    return $datetimeContainer;
}

function insertDateTimeInputs() {
    $('body .datetime-container').each(function (index) {
        $(this).replaceWith(generateDatetimeInputs(index));
    });
}

function isoToDate(dateString, timeString, offsetString) {
    // console.log(`iso to date  dateString ${dateString}  timeString ${timeString}  offsetString ${offsetString}`);
    const dateTimeString = dateString + 'T' + timeString + offsetString;
    const d = new Date(dateTimeString);
    // console.log(`iso to date  date ${d}`);
    return d;
}

function parseOffsetDirection(offsetString) {
    if (offsetString[0] === '+') {
        return 'add';
    }
    return 'subtract';
}

function parseOffsetVerb(offsetString) {
    if (offsetString[0] === '+') {
        return 'to';
    }
    return 'from';
}

function parseOffsetHours(offsetString) {
    return +offsetString.slice(1, 3);
}

function parseOffsetMinutes(offsetString) {
    return +offsetString.slice(4, 6);
}

function formatUnixTime(d) {
    const $unixTime = $('p.unix-time');
    const unixTimeMilliseconds = d.getTime();
    const unixTimeSeconds = Math.floor(unixTimeMilliseconds / 1000).toString();
    $unixTime.text(unixTimeSeconds);
}

function formatJulianDays(d) {
    const $julianDays = $('p.julian-days');
    const unixTimeMilliseconds = d.getTime();
    const jdn = (unixTimeMilliseconds / 86400000 + unixEpoch()).toFixed(8); // convert from unix time to julian day number with millisecond precision
    $julianDays.text(jdn.toString());
}

function formatJulianCalendar(d) {
    const $julianCalendar = $('p.julian-calendar-date');
    const julianDate = gregorianToJulian(d);
    $julianCalendar.text(julianDate.toString());
}

function formatIso8601(dateString, timeString, offsetString) {
    const d = isoToDate(dateString, timeString, offsetString);
    const $iso8601 = $('.iso-8601');
    $iso8601.find('.year').text(getFourDigitYear(d));
    $iso8601.find('.month').text(getTwoDigitMonth(d));
    $iso8601.find('.day-of-month').text(getTwoDigitDayOfMonth(d));
    $iso8601.find('.hour').text(getTwoDigitHours(d));
    $iso8601.find('.minute').text(getTwoDigitMinutes(d));
    $iso8601.find('.second').text(getTwoDigitSeconds(d));
    $iso8601.find('.millisecond').text(getThreeDigitMilliseconds(d));
    $iso8601.find('.timezone').text(offsetString);
    $iso8601.find('.month-name').text(getFullMonthName(d));
    $iso8601.find('.offset-direction').text(parseOffsetDirection(offsetString));
    $iso8601.find('.offset-verb').text(parseOffsetVerb(offsetString));
    $iso8601.find('.offset-hours').text(parseOffsetHours(offsetString));
    $iso8601.find('.offset-minutes').text(parseOffsetMinutes(offsetString));
}

function formatDatetime(dateString, timeString, offsetString) {
    // console.log("format date time");
    formatIso8601(dateString, timeString, offsetString);
    const d = isoToDate(dateString, timeString, offsetString);
    // console.log(d);
    const localeString = d.toString();
    $('.datetime-formats .default').text(localeString);
    const isoString = d.toISOString(); // this isnt good enough because it converts to utc
    $('.datetime-formats .iso8601').text(isoString);
    generateDateFormats(d);
    formatIso8601(dateString, timeString, offsetString);
    formatUnixTime(d);
    formatJulianCalendar(d);
    formatJulianDays(d);
}

function setDatetime(dateString, timeString, offsetString) {
    $('.input-date').val(dateString);
    $('.input-time').val(timeString);
    $('select.timezone').val(offsetString);
    formatDatetime(dateString, timeString, offsetString);
}

function updateDatetime($datetimeContainer) {
    console.log('update datetime');
    const dateString = $datetimeContainer.find('.input-date').val();
    console.log(dateString);
    const timeString = $datetimeContainer.find('.input-time').val();
    console.log(timeString);
    const offsetString = $datetimeContainer.find('select.timezone').val();
    if ((dateString.length >= 10) && (timeString.length >= 12)) {
        setDatetime(dateString, timeString, offsetString);
    }
}

function updateDatetimeEvent(e) {
    const $target = $(e.target);
    const $datetimeContainer = $target.closest('.datetime-container');
    updateDatetime($datetimeContainer);
}

function getOffsetString(d) {
    const offsetRemainder = d.getTimezoneOffset() % 60;
    const offsetHours = (d.getTimezoneOffset() - offsetRemainder) / 60;
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
    const offsetString = offsetPrefix + offsetHoursPrefix + Math.abs(offsetHours).toString() + ':' + offsetMinutesPrefix + Math.abs(offsetRemainder).toString();
    return offsetString;
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
    // console.log(now.getTimezoneOffset());
    const offsetString = getOffsetString(now);
    // console.log(offsetString);
    setDatetime(dateString, timeString, offsetString);
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

function generateDateFormats(d) {
    $('table.formats .format-example').each(function(i) {
        let $e = $(this);
        let df = $e.attr('data-format');
        // console.log(df);
        $e.text(renderDateFormat(df, d));
    });
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

    const givenYear = getYearNumber(d) * 1;
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

function gregorianToJulian(d) {
    const julianCalendarEpochYear = 0;
    const julianCalendarEpochMonth = 1;
    const julianCalendarEpochDay = 1;

    const givenYear = getYearNumber(d) * 1;
    const givenMonth = getMonthNumber(d) * 1;
    const dayOfMonth = (getDayOfMonthNumber(d) * 1) - 1;
    console.log(`year ${givenYear}  month ${givenMonth}  given day ${getDayOfMonthNumber(d)}  day in month ${dayOfMonth}`);

    let years = givenYear - julianCalendarEpochYear;
    let leapYearCount = 0;
    for (let year = julianCalendarEpochYear; year < givenYear; year++) {
        if (gregorianLeapDay(year)) {
            leapYearCount += 1;
        }
    }
    // console.log(`leap years ${leapYearCount}`);
    const commonYearDays = 365 * years;
    const yearDays = commonYearDays + leapYearCount;
    const isLeapYear = gregorianLeapDay(givenYear);
    console.log(`julian years ${years}  leap years ${leapYearCount}  year days ${yearDays}`);
    console.log(`is given year a leap year ${isLeapYear}`);
    let monthDays = 0;
    for (let m = 1; m < givenMonth; m++) {
        monthDays += daysPerMonth(m, isLeapYear);
    }
    let dayDays = dayOfMonth;
    const totalDays = yearDays + monthDays + dayDays;
    console.log(`year days ${yearDays}  month days ${monthDays}  day days ${dayDays}  total days ${totalDays}`);
    let julianCalendarYear = 0;
    let julianCalendarMonth = 1;
    let julianCalendarDay = 1;
    let day = totalDays;
    while (day > 0) {
        console.log(`day ${day}  julianCalendarYear ${julianCalendarYear}  julianCalendarMonth ${julianCalendarMonth}  julianCalendarDay ${julianCalendarDay}`);
        let daysInYear = 365;
        let isCurrentLeap = julianLeapDay(julianCalendarYear);
        if (isCurrentLeap) {
            daysInYear += 1;
        }
        if (day >= daysInYear) {
            day -= daysInYear;
            julianCalendarYear += 1;
        } else {
            let currentMonthDays = daysPerMonth(julianCalendarMonth);
            if (day >= currentMonthDays) {
                day -= currentMonthDays;
                julianCalendarMonth += 1;
                if (julianCalendarMonth > 12) {
                    julianCalendarMonth = 1;
                }
            } else {
                julianCalendarDay += day;
                day = 0;
            }
        }
    }
    const yearString = yearNumberToSignedSix(julianCalendarYear);
    const resultString = `${yearString}-${julianCalendarMonth}-${julianCalendarDay}`;
    console.log(`result string ${yearString}-${julianCalendarMonth}-${julianCalendarDay}`);

    const result = new Date(resultString);
    console.log(`result ${result}`);
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

function getYearNumber(d) {
    return d.getFullYear();
}

function getFourDigitYear(d) {
    const yearNumber = getYearNumber(d);
    const isNegative = yearNumber < 0;
    let fourDigitYear = Math.abs(yearNumber).toString();
    if (fourDigitYear.length < 4) {
        fourDigitYear = '0' + fourDigitYear;
    }
    if (fourDigitYear.length < 4) {
        fourDigitYear = '0' + fourDigitYear;
    }
    if (fourDigitYear.length < 4) {
        fourDigitYear = '0' + fourDigitYear;
    }
    if (isNegative) {
        fourDigitYear = '-' + fourDigitYear;
    }
    return fourDigitYear;
}

function yearNumberToSignedSix(y) {
    const isNegative = y < 0;
    let yearString = Math.abs(y).toString();
    while (yearString.length < 6) {
        yearString = '0' + yearString;
    }
    if (isNegative) {
        yearString = '-' + yearString;
    } else {
        yearString = '+' + yearString;
    }
    return yearString;
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

function getTwoDigitMonth(d) {
    let twoDigitMonth = getMonthNumber(d).toString();
    if (twoDigitMonth.length < 2) {
        twoDigitMonth = '0' + twoDigitMonth;
    }
    return twoDigitMonth;
}

function getDayOfMonthNumber(d) {
    return d.getDate().toString();
}

function getTwoDigitDayOfMonth(d) {
    let twoDigitDay = getDayOfMonthNumber(d).toString();
    if (twoDigitDay.length < 2) {
        twoDigitDay = '0' + twoDigitDay;
    }
    return twoDigitDay;
}

// integer hours 0 - 23
function getHours(d) {
    return d.getHours();
}

function getTwoDigitHours(d) {
    let twoDigitHours = getHours(d).toString();
    if (twoDigitHours.length < 2) {
        twoDigitHours = '0' + twoDigitHours;
    }
    return twoDigitHours;
}

// integer minutes 0 - 59
function getMinutes(d) {
    return d.getMinutes();
}

function getTwoDigitMinutes(d) {
    let twoDigitMinutes = getMinutes(d).toString();
    if (twoDigitMinutes.length < 2) {
        twoDigitMinutes = '0' + twoDigitMinutes;
    }
    return twoDigitMinutes;
}

// integer seconds 0 - 59
function getSeconds(d) {
    return d.getSeconds();
}

function getTwoDigitSeconds(d) {
    let twoDigitSeconds = getSeconds(d).toString();
    if (twoDigitSeconds.length < 2) {
        twoDigitSeconds = '0' + twoDigitSeconds;
    }
    return twoDigitSeconds;
}

// integer milliseconds 0 - 999
function getMilliseconds(d) {
    return d.getMilliseconds();
}

function getThreeDigitMilliseconds(d) {
    let threeDigitMilliseconds = getMilliseconds(d).toString();
    if (threeDigitMilliseconds.length < 3) {
        threeDigitMilliseconds = '0' + threeDigitMilliseconds;
    }
    if (threeDigitMilliseconds.length < 3) {
        threeDigitMilliseconds = '0' + threeDigitMilliseconds;
    }
    return threeDigitMilliseconds;
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
        month = getTwoDigitMonth(d);
    }
    day = getTwoDigitDayOfMonth(d);
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
        { content: 'egyptian calendar introduced', start: '-002450-01-01', type: 'point' },
        { content: 'chinese calendar introduced', start: '-000771-01-01', type: 'point' },
        { content: 'numa roman calendar reform', start: '-000672-01-01', type: 'point' },
        { content: 'decree of canopus', start: '-000238-03-07', type: 'point' },
        { content: 'julian calendar introduced', start: '-000045-01-01', type: 'point' },
        { content: 'alexandrian calendar introduced', start: '-000025-01-01', type: 'point' },
        { content: 'gregorian calendar epoch', start: '-000000-01-01', type: 'point' },
        { content: 'sexagesimal minutes and seconds', start: '1000-01-01', type: 'point' },
        { content: 'copernicus says the earth orbits the sun', start: '1543-01-01', type: 'point' },
        { content: 'gregorian calendar introduced', start: '1582-10-15', type: 'point' },
        { content: 'greenwich observatory established', start: '1675-06-22', type: 'point' },
        { content: 'french republican calendar', start: '1793-11-24', end: '1806-01-01', type: 'point' },
        { content: 'greenwich time ball', start: '1833-01-01', type: 'point' },
        { content: 'greenwich mean time', start: '1847-01-01', type: 'point' },
        { content: 'international meridian conference', start: '1884-10-01', type: 'point' },
        { content: 'greenwich hourly signals', start: '1924-02-05', type: 'point' },
        { content: 'universal time established', start: '1928-01-01', type: 'point' },
        { content: 'atomic clocks', start: '1955-01-01', type: 'point' },
        { content: 'utc established', start: '1956-01-01', type: 'point' },
        { content: 'unix time epoch', start: '1970-01-01', type: 'point' },
        { content: 'unix time introduced', start: '1971-11-01', type: 'point' },
        { content: 'leap seconds introduced', start: '1972-01-01', type: 'point' },
        { content: 'iso 8601', start: '1988-01-01', type: 'point' },
        { content: 'year 2000 problem', start: '2000-01-01', type: 'point' },
        { content: 'choose your own calendar reform', start: '2022-10-21', type: 'point' },
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
    insertDateTimeInputs();
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
$body.on('input change', '.input-date, .input-time, select.timezone', updateDatetimeEvent);
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
