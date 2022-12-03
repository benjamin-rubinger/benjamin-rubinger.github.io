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

function getDayNumber(d) {
    return d.getDate().toString();
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
    day = getDayNumber(d);
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
        { content: 'gregorian epoch', start: '0000-01-01', type: 'point' },
        { content: 'gregorian calendar introduced', start: '1582-10-15', type: 'point' },
        { content: 'greenwich observatory established', start: '1675-06-22', type: 'point' },
        { content: 'french revolutionary calendar', start: '1793-01-01', end: '1805-01-01' },
        { content: 'greenwich observatory daily signals began', start: '1833', type: 'point' },
        { content: 'greenwich observatory starts broadcasting hourly time signals', start: '1924-02-05', type: 'point' },
        { content: 'started writing choose your own calendar reform', start: '2022-10-21', type: 'point' },
    ];
    let index = 0;
    for (const item of items) {
        item.id = `timeline-item${index}`;
        // console.log(item);
        index += 1;
    }
    const ds = new vis.DataSet(items);
    const options = {};
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
