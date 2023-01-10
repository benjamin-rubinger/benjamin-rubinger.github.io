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

function getUnixTimeString(d) {
    const unixTimeMilliseconds = d.getTime();
    const unixTimeSeconds = Math.floor(unixTimeMilliseconds / 1000).toString();
    return unixTimeSeconds;
}

function formatUnixTime(d) {
    const $unixTime = $('p.unix-time');
    const unixTimeString = getUnixTimeString(d);
    $unixTime.text(unixTimeString);
}

function gregorianToJulianDayNumber(d) {
    const unixTimeMilliseconds = d.getTime();
    const jdn = (unixTimeMilliseconds / 86400000 + unixEpoch()).toFixed(8); // convert from unix time to julian day number with millisecond precision
    return jdn;
}

function formatJulianDays(d) {
    const jdn = gregorianToJulianDayNumber(d);
    const $julianDays = $('p.julian-days');
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

function formatOrdinalDate(d) {
    const $ordinalDate = $('p.ordinal-date');
    const yearNumber = getYearNumber(d);
    const ordinalDay = gregorianToOrdinalNumber(d);
    const ordinalDateString = `${yearNumber.toString()} ${ordinalDay.toString()}`;
    $ordinalDate.text(ordinalDateString);
}

function formatProposal(d) {
    const $myProposedCalendar = $('p.my-proposed-calendar');
    const proposalString = getProposalString(d);
    $myProposedCalendar.text(proposalString);
}

function getDatetime() {
    const $datetimeContainer = $('.datetime-container').first();
    const dateString = $datetimeContainer.find('.input-date').val();
    const timeString = $datetimeContainer.find('.input-time').val();
    const offsetString = $datetimeContainer.find('select.timezone').val();
    return isoToDate(dateString, timeString, offsetString);
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
    formatOrdinalDate(d);
    formatProposal(d);
}

function setDatetime(dateString, timeString, offsetString) {
    $('.input-date').val(dateString);
    $('.input-time').val(timeString);
    $('select.timezone').val(offsetString);
    formatDatetime(dateString, timeString, offsetString);
}

function updateDatetime($datetimeContainer) {
    // console.log('update datetime');
    const dateString = $datetimeContainer.find('.input-date').val();
    // console.log(dateString);
    const timeString = $datetimeContainer.find('.input-time').val();
    // console.log(timeString);
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

function noLeapDay(year) {
    return false;
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
    if ((monthNumber === 1) || (monthNumber === 3) || (monthNumber === 5) || (monthNumber === 7) || (monthNumber === 8) || (monthNumber === 10) || (monthNumber === 12)) {
        return 31;
    } else if (monthNumber === 2) {
        if (isLeapYear) {
            return 29;
        } else {
            return 28;
        }
    }
    return 30;
}

function unixEpoch() {
    return 2440587.5;
}

function gregorianEpoch() {
    return '+000000';
}

function getFractionalDay(d) {
    let d2 = new Date(d);
    d2.setMinutes(d2.getMinutes() + d2.getTimezoneOffset()); // add back the timezone?
    const hourSeconds = getHours(d2) * 3600;
    const minuteSeconds = getMinutes(d2) * 60;
    const secondSeconds = getSeconds(d2);
    const milliseconds = getMilliseconds(d2) / 1000;
    const fractionalDay = ((hourSeconds + minuteSeconds + secondSeconds + milliseconds) / 86400);
    // console.log(`hours ${getHours(d2)}  minutes ${getMinutes(d2)}  seconds ${getSeconds(d2)}  milliseconds ${getMilliseconds(d2)}  fractionalDays ${fractionalDay}`);
    return fractionalDay;
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
    // console.log(`year ${givenYear}  month ${givenMonth}  given day ${getDayOfMonthNumber(d)}  day in month ${dayOfMonth}`);

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
    const fractionalDays = getFractionalDay(d) - 0.5; // jdn new day time is half a day different from gregorian new day time
    const result = yearDays + monthDays + dayDays + fractionalDays;

    console.log(`trivial ${trivial}`);
    console.log(`wikipedia ${wikipedia}`);
    console.log(`manual ${result}`);
    return result;
}

function gregorianToOrdinalNumber(d) {
    // console.log('gregorian to ordinal');
    const givenYear = getYearNumber(d) * 1;
    const givenMonth = getMonthNumber(d) * 1;
    const dayOfMonth = getDayOfMonthNumber(d) * 1;
    // console.log(`year ${givenYear}  month ${givenMonth}  given day ${getDayOfMonthNumber(d)}  day in month ${dayOfMonth}`);
    const isLeapYear = gregorianLeapDay(givenYear);
    // console.log(`is given year a leap year ${isLeapYear}`);
    let monthDays = 0;
    for (let m = 1; m < givenMonth; m++) {
        monthDays += daysPerMonth(m, isLeapYear);
    }
    const ordinal = monthDays + dayOfMonth;
    // console.log(`month days ${monthDays}  day days ${dayOfMonth}  ordinal days ${ordinal}`);
    return ordinal;
}

function gregorianToJulian(d) {
    const julianCalendarEpochYear = 0;
    // const julianCalendarEpochMonth = 1;
    // const julianCalendarEpochDay = 1;

    const givenYear = getYearNumber(d) * 1;
    // const givenMonth = getMonthNumber(d) * 1;
    // const dayOfMonth = getDayOfMonthNumber(d) * 1;
    // console.log(`year ${givenYear}  month ${givenMonth}  given day ${getDayOfMonthNumber(d)}  day in month ${dayOfMonth}`);
    // console.log(`year ${givenYear}`);

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
    const ordinalDays = gregorianToOrdinalNumber(d);
    const totalDays = yearDays + ordinalDays + 1;
    // console.log(`year days ${yearDays}  ordinal days ${ordinalDays}  total days ${totalDays}`);
    let julianCalendarYear = 0;
    let julianCalendarMonth = 1;
    let julianCalendarDay = 1;
    let day = totalDays;
    while (day > 0) {
        // console.log(`day ${day}  julianCalendarYear ${julianCalendarYear}  julianCalendarMonth ${julianCalendarMonth}  julianCalendarDay ${julianCalendarDay}`);
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
    // console.log(`result string ${yearString}-${julianCalendarMonth}-${julianCalendarDay}`);

    const result = new Date(resultString);
    // console.log(`result ${result}`);
    return result;
}

function gregorianToAny(d, calendarData) {
    console.log(`gregorian to ${calendarData['name']}`);
    console.log(calendarData);
    // given gregorian date
    const givenYear = getYearNumber(d) * 1;
    // const givenMonth = getMonthNumber(d) * 1;
    // const dayOfMonth = (getDayOfMonthNumber(d) * 1) - 1;
    const ordinalDays = gregorianToOrdinalNumber(d);
    // console.log(`year ${givenYear}  month ${givenMonth}  given day ${getDayOfMonthNumber(d)}  day in month ${dayOfMonth}  day in year ${ordinalDays}`);

    // epoch year
    let calendarEpochString = calendarData['epoch'];
    if (calendarEpochString === 'regnal') { // we have to ignore regnal eras and treat the year the same as gregorian
        calendarEpochString = gregorianEpoch();
    }
    let calendarEpoch = new Date(calendarEpochString);
    // console.log(`epoch ${calendarEpochString}  calendarEpoch ${calendarEpoch}`);
    const epochYear = getYearNumber(calendarEpoch);
    // console.log(`epoch year ${epochYear}`);

    // leap day function
    const leapDayRatio = +calendarData['leap day ratio'];
    // console.log(`leap day ratio ${leapDayRatio}`);
    let leapDay = noLeapDay;
    if (leapDayRatio === 0.25) {
        leapDay = julianLeapDay;
    } else if (leapDayRatio === 0.2425) {
        leapDay = gregorianLeapDay;
    } else if (leapDayRatio === 0.2422) {
        leapDay = betterLeapDay;
    }

    // elapsed years and leap days
    let years = givenYear - epochYear;
    let leapYearCount = 0;
    for (let year = epochYear; year < givenYear; year++) {
        if (leapDay(year)) {
            leapYearCount += 1;
        }
    }
    // console.log(`leap year days ${leapYearCount}`);

    // new year day offset
    const newYearDay = +calendarData['new year day'] - 1;
    // console.log(`new year day offset ${newYearDay}`);

    // total days
    const commonYearDays = 365 * years;
    const yearDays = commonYearDays + leapYearCount;
    const totalDays = yearDays - newYearDay + ordinalDays + 1;
    // console.log(`year days ${yearDays}  total days ${totalDays}`);

    const fractionalDay = getFractionalDay(d);
    const newDayFraction = newDayStringToDecimal(calendarData['new day time']);
    // console.log(`fractional day ${fractionalDay}  new day fraction ${newDayFraction}`);
    const total = totalDays + fractionalDay - newDayFraction;
    console.log(`total time in days ${total}`);

    let result = {
        'day': '',
        'hour': '',
        'millisecond': '',
        'minute': '',
        'month': '',
        'name': calendarData['name'],
        'ordinal': '',
        'second': '',
        'week': '',
        'weekday': '',
        'year': '',
    };
    const calendarType = calendarData['type'];
    let yearLength = 0;
    let monthLength = 29.53;
    const leapMonthRatio = calendarData['leap month ratio'];
    let remaining = total;
    if (calendarType === 'lunar') {
        yearLength = 354.36;
    } else if (calendarType === 'lunisolar') {
        yearLength = 354.36 + (10.88 * leapMonthRatio);
    } else if (calendarType === 'solar') {
        yearLength = 365 + leapDayRatio;
        if (calendarData['month length'] === 'varies') {
            // it varies
        } else if (calendarData['month length'].length > 0) {
            monthLength = +calendarData['month length'];
        }
    }

    // years and ordinal days
    if (yearLength > 0) {
        const yearFloat = remaining / yearLength;
        const ordinalFloat = remaining % yearLength;
        const yearCount = Math.floor(yearFloat);
        remaining -= yearCount * yearLength;
        result['year'] = yearCount;

        const ordinalCount = Math.floor(ordinalFloat);
        result['ordinal'] = ordinalCount;
    }

    // months and day of month
    if ((calendarData['months'].length > 0) && (monthLength > 0)) {
        if ((calendarType === 'solar') && (calendarData['month length'] === 'varies')) {
            console.log('oh no');
        } else {
            const monthFloat = remaining / monthLength;
            const dayOfMonthFloat = remaining % monthLength;
            const monthCount = Math.floor(monthFloat);
            remaining -= monthCount * monthLength;
            result['month'] = monthCount;

            // weeks and weekdays
            const weekLength = +calendarData['week length'];
            if (weekLength > 0) {
                const weekFloat = remaining / weekLength;
                const weekCount = Math.floor(weekFloat);
                result['week'] = weekCount;

                const weekdayFloat = remaining % weekLength;
                const weekdayCount = Math.floor(weekdayFloat);
                result['weekday'] = weekdayCount;
            }

            const dayOfMonthCount = Math.floor(dayOfMonthFloat);
            remaining -= dayOfMonthCount;
            result['day'] = dayOfMonthCount;
        }
    } else {
        result['day'] = result['ordinal'];
        remaining -= result['ordinal'];
    }

    if (remaining >= 1) {
        console.log(`oh no the remaining is longer than a day ${remaining}`);
    }

    const hoursPerDay = +calendarData['hours per day'];
    if (hoursPerDay > 0) {
        const hoursFloat = remaining * hoursPerDay;
        const hoursCount = Math.floor(hoursFloat);
        result['hour'] = hoursCount;
        remaining -= hoursCount / hoursPerDay;

        const minutesPerHour = +calendarData['minutes per hour'];
        if (minutesPerHour > 0) {
            const minutesPerDay = minutesPerHour * hoursPerDay;
            const minutesFloat = remaining * minutesPerDay;
            const minutesCount = Math.floor(minutesFloat);
            result['minute'] = minutesCount;
            remaining -= minutesCount / minutesPerDay;

            const secondsPerMinute = +calendarData['seconds per minute'];
            if (secondsPerMinute > 0) {
                const secondsPerDay = secondsPerMinute * minutesPerDay;
                const secondsFloat = remaining * secondsPerDay;
                const secondsCount = Math.floor(secondsFloat);
                result['second'] = secondsCount;
                remaining -= secondsCount / secondsPerDay;

                const millisecondsPerDay = secondsPerDay * 1000;
                const millisecondsFloat = remaining * millisecondsPerDay;
                const millisecondsCount = Math.floor(millisecondsFloat);
                result['millisecond'] = millisecondsCount;
            }
        }
    }

    return result;
}

function convertCalendar() {
    const $convertCalendar = $('.convert-calendar');
    const calendarName = spaceToCamel($convertCalendar.val());
    const calendarData = fetchLocal(calendarName);
    const d = getDatetime();
    const datetimeData = gregorianToAny(d, calendarData);
    console.log(datetimeData);
    const datetimeString = formatDate(calendarData, datetimeData);
    console.log(datetimeString);
    if (calendarName === 'julian') {
        const julianDate = gregorianToJulian(d);
        console.log(`julian date ${julianDate}`);
    } else if (calendarName === 'julianDay') {
        const jdn = gregorianToJulianDayNumber(d);
        console.log(`jdn ${jdn}`);
    } else if (calendarName === 'proposal') {
        const proposal = getProposalString(d);
        console.log(`proposal ${proposal}`);
    } else if (calendarName === 'unixTime') {
        const unixTime = getUnixTimeString(d);
        console.log(`unix time ${unixTime}`);
    }
}

function setCalendar(calendarName) {
    const $convertCalendar = $('.convert-calendar');
    $convertCalendar.val(calendarName);
}

function getProposalString(d) {
    let year = getYearNumber(d) * 1 + 10000;
    const gregorianOrdinal = gregorianToOrdinalNumber(d);
    const newYearOffset = 266;
    let ordinalOffset = gregorianOrdinal - newYearOffset;
    if (ordinalOffset >= 0) {
        year += 1;
    }
    const hasLeapDay = gregorianLeapDay(year);
    let modulo = 365;
    if (hasLeapDay) {
        modulo += 1;
    }
    let ordinal = (ordinalOffset + modulo) % modulo;
    const fraction = getFractionalDay(d);
    const ordinalTime = (ordinal + fraction).toFixed(8);
    const result = `${year} ${ordinalTime}`;
    return result;
}


function spaceToDash(s) {
    return s.replaceAll(' ', '-');
}

// from https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
function spaceToCamel(s) {
    return s.toLowerCase().replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) => idx === 0 ? ltr : ltr.toUpperCase()).replace(/\s+/g, '');
}

function setData($e, data) {
    for (const [key, value] of Object.entries(data)) {
        $e.attr(`data-${spaceToDash(key)}`, value);
    }
}

function renderCalendarData(calendar) {
    const keys = ['name', 'type', 'introduced', 'by', 'community', 'based on', 'epoch', 'leap day ratio', 'leap month ratio', 'month length', 'week length', 'hours per day', 'minutes per hour', 'notes'];
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

function newDayStringToDecimal(nds) {
    if (nds === 'sunrise') {
        return 0.25;
    } else if (nds === 'midday') {
        return 0.5;
    } else if (nds === 'sunset') {
        return 0.75;
    }
    return 0.0;
}

function getYearNumber(d) {
    return d.getFullYear() * 1;
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

function zeroPad(s, places) {
    let result = s;
    while (result.length < places) {
        result = '0' + result;
    }
    return result;
}

function truncate(s, length) {
    if (s.length <= length) {
        return s;
    }
    let result = s;
    return result.substring(result.length - length, result.length);
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

function formatDate(calendarData, datetimeData) {
    const df = calendarData['date format'];
    let result = '';
    let year = datetimeData['year'].toString();
    let month = datetimeData['month'].toString();
    let week = datetimeData['week'].toString();
    let weekday = datetimeData['weekday'].toString();
    let day = datetimeData['day'].toString();
    let hour = datetimeData['hour'].toString();
    let minute = datetimeData['minute'].toString();
    let second = datetimeData['second'].toString();
    let subsecond = datetimeData['millisecond'].toString();
    if (df.indexOf('yyyy') >= 0) {
        year = zeroPad(year, 4);
    } else if (df.indexOf('yy') >= 0) {
        year = truncate(zeroPad(year, 2), 2);
    }
    if (df.indexOf('mmmm') >= 0) {
        const months = calendarData['months'].split(',');
        month = months[datetimeData['month']];
    } else if (df.indexOf('mmm') >= 0) {
        // uh oh
    } else if (df.indexOf('mm') >= 0) {
        month = zeroPad(month, 2);
    }
    if (df.indexOf('ee') >= 0) {
        weekday = zeroPad(weekday, 2);
    } else if (df.indexOf('eee') >= 0) {
        const weekdays = calendarData['weekdays'].split(',');
        weekday = weekdays[datetimeData['weekday']];
    }
    if (df.indexOf('dd') >= 0) {
        day = zeroPad(day, 2);
    }
    if (df.indexOf('hh') >= 0) {
        hour = zeroPad(hour, 2);
    }
    if (df.indexOf('ii') >= 0) {
        minute = zeroPad(minute, 2);
    }
    if (df.indexOf('ss') >= 0) {
        second = zeroPad(second, 2);
    }
    if (df.indexOf('uuu') >= 0) {
        subsecond = zeroPad(subsecond, 3);
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
        } else if (char === 'w') {
            result += week;
            week = '';
        } else if (char === 'e') {
            result += weekday;
            weekday = '';
        } else if (char === 'h') {
            result += hour;
            hour = '';
        } else if (char === 'i') {
            result += minute;
            minute = '';
        } else if (char === 's') {
            result += second;
            second = '';
        } else if (char === 'u') {
            result += subsecond;
            subsecond = '';
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
        { content: 'julian day epoch', start: '-004713-11-24', type: 'point' },
        { content: 'hebrew anno mundi epoch', start: '-003761-01-01', type: 'point' },
        { content: 'beginning of recorded history', start: '-003500-01-01', type: 'point' },
        { content: 'egyptian calendar introduced', start: '-002450-01-01', type: 'point' },
        { content: 'hebrew exodus epoch', start: '-001313-01-01', type: 'point' },
        { content: 'chinese calendar introduced', start: '-000771-01-01', type: 'point' },
        { content: 'numa roman calendar reform', start: '-000672-01-01', type: 'point' },
        { content: 'selucid epoch', start: '-000310-01-01', type: 'point' },
        { content: 'decree of canopus', start: '-000238-03-07', type: 'point' },
        { content: 'julian calendar introduced', start: '-000045-01-01', type: 'point' },
        { content: 'coptic calendar introduced', start: '-000025-01-01', type: 'point' },
        { content: 'gregorian epoch', start: '-000000-01-01', type: 'point' },
        { content: 'destruction of the second temple epoch', start: '+000070-01-01', type: 'point' },
        { content: 'sexagesimal minutes and seconds', start: '+001000-01-01', type: 'point' },
        { content: 'copernicus says the earth orbits the sun', start: '+001543-01-01', type: 'point' },
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

// 1 Ꜣḫt,2 Ꜣḫt,3 Ꜣḫt,4 Ꜣḫt,1 Prt,2 Prt,3 Prt,4 Prt,1 Šmw,2 Šmw,3 Šmw,4 Šmw
function egyptianJson() {
    return '{"based on":"mesopotamian","by":"","community":"egypt","date format":"y mmmm d hh ii ss.uuu","hours per day":24,"intercalary days":5,"introduced":"-002450","epoch":"regnal","leap day ratio":0,"leap month ratio":0,"minutes per hour":"","month length":"30","months":"Akhet Thoth,Akhet Phaophi,Akhet Athyr,Akhet Choiak,Peret Tybi,Peret Mechir,Peret Phamenoth,Peret Pharmuthi,Shemu Pachons,Shemu Payni,Shemu Epiphi,Shemu Mesore","name":"egyptian","new day time":"sunrise","new year day":254,"notes":"exactly 365 days a year, shifts through the seasons on the sothic cycle","type":"solar","week length":10}';
}

function frenchRepublicanJson() {
    return '{"based on":"egyptian","by":"","community":"france","date format":"y mmmm w e.hiissuuu","hours per day":10,"intercalary days":5,"introduced":"1793-10","epoch":"1792-09-22","leap day ratio":0.2425,"leap month ratio":0,"minutes per hour":100,"month length":"30","months":"Vendémiaire,Brumaire,Frimaire,Nivôse,Pluviôse,Ventôse,Germinal,Floréal,Prairial,Messidor,Thermidor,Fructidor","name":"french republican","new day time":"midnight","new year day":265,"seconds per minute":100,"notes":"","type":"solar","week length":10}';
}

function julianJson() {
    return '{"based on":"roman,egyptian","by":"julius caesar","community":"roman empire","hours per day":24,"intercalary days":0,"introduced":"-000045-01-01T00:00:00Z","epoch":"regnal","leap day ratio":0.25,"leap month ratio":0,"minutes per hour":"60","month length":"varies","months":"january,february,march,april,may,june,july,august,september,october,november,december","name":"julian","new day time":"midday","new year day":1,"notes":"two sets of 12 hours with am and pm","type":"solar","week length":7}';
}

function julianDayJson() {
    return '{"based on":"","by":"joseph scalinger","community":"astronomers","date format":"d.hiissuuu","hours per day":10,"intercalary days":0,"introduced":"+001583","epoch":"-004714-11-24T12:00:00Z","leap day ratio":0,"leap month ratio":0,"minutes per hour":100,"month length":"","months":"","name":"julian day","new day time":"midday","new year day":1,"notes":"","seconds per minute":100,"type":"other","week length":""}';
}

function gregorianJson() {
    return '{"based on":"julian","by":"pope gregory xiii","community":"catholic church","hours per day":24,"intercalary days":0,"introduced":"1582-10-15T00:00:00Z","epoch":"000000","leap day ratio":0.2425,"leap month ratio":0,"minutes per hour":60,"month length":"varies","months":"january,february,march,april,may,june,july,august,september,october,november,december","name":"gregorian","new day time":"midnight","new year day":1,"notes":"two sets of 12 hours with am and pm, timezones, daylight savings time","seconds per minute":60,"type":"solar","week length":7,"weekdays":"monday,tuesday,wednesday,thursday,friday,saturday,sunday"}';
}

function romanJson() {
    return '{"based on":"","by":"numa pompilius","community":"roman empire","hours per day":24,"intercalary days":0,"introduced":"-000700-01-01T00:00:00Z","epoch":"regnal","leap day ratio":0.25,"leap month ratio":0,"minutes per hour":60,"month length":"varies","months":"january,february,march,april,may,june,july,august,september,october,november,december","name":"roman","new day time":"midday","new year day":1,"notes":"two sets of 12 hours with am and pm","type":"lunar","week length":9}';
}

function proposalJson() {
    return '{"based on":"french republican","by":"benjamin rubinger","community":"","date format":"yyyy ddd.hiissuuu","hours per day":10,"intercalary days":0,"introduced":"2022-10-21","epoch":"-010001-09-22","leap day ratio":0.2422,"leap month ratio":0,"minutes per hour":100,"month length":"","months":"","name":"proposal","new day time":"midnight","new year day":265,"notes":"","seconds per minute":100,"type":"solar","week length":""}';
}

function unixTimeJson() {
    return '{"based on":"","by":"unix engineers","community":"unix","date format":"s.u","hours per day":1,"intercalary days":0,"introduced":"+001583","epoch":"-004714-11-24T12:00:00Z","leap day ratio":0,"leap month ratio":0,"minutes per hour":1,"month length":"","months":"","name":"unix time","new day time":"midnight","new year day":"","notes":"","seconds per minute":86400,"type":"other","week length":""}';
}

function fetchLocal(calendarName) {
    let calendarJson;
    if (calendarName === 'egyptian') {
        calendarJson = egyptianJson();
    } else if (calendarName === 'frenchRepublican') {
        calendarJson = frenchRepublicanJson();
    } else if (calendarName === 'julian') {
        calendarJson = julianJson();
    } else if (calendarName === 'julianDay') {
        calendarJson = julianDayJson();
    } else if (calendarName === 'gregorian') {
        calendarJson = gregorianJson();
    } else if (calendarName === 'proposal') {
        calendarJson = proposalJson();
    } else if (calendarName === 'roman') {
        calendarJson = romanJson();
    } else if (calendarName === 'unixTime') {
        calendarJson = unixTimeJson();
    }
    // console.log(calendarJson);
    const calendarData = JSON.parse(calendarJson);
    // console.log(calendarData);
    return calendarData;
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
    // setCalendar('your custom calendar');
//    setCalendar('french republican');
    setCalendar('julian day');
    convertCalendar();
    setCalendar('unix time');
    convertCalendar();
    setCalendar('proposal');
    convertCalendar();
}

const $body = $('body');
$(() => initialize());
$body.on('input change blur', '.input-date, .input-time, select.timezone', updateDatetimeEvent);
$body.on('input change blur', '.convert-calendar', convertCalendar);
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
