function dashToSpace(s) {
    return s.replaceAll('-', ' ');
}

function navigationEntry($section) {
    // console.log('navigation entry');
    // console.log($section);
    if ($section[0].nodeName !== 'SECTION') {
        // console.log('navigation entry return early');
        return $('<ul>');
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
    const $navigation = generateNavigationForSection($article);
    $navigationContainer.empty().append($navigation);
}

function formatDateTime() {
    console.log("format date time");
    const dateString = $('input.date').val();
    console.log(dateString);
    const timeString = $('input.time').val();
    console.log(timeString);
    const offsetString = $('select.timezone').val();
    console.log(offsetString);
    const dateTimeString = dateString + 'T' + timeString + offsetString;
    let d = new Date(dateTimeString);
    console.log(d);
    const localeString = d.toString();
    $('.datetime-formats .default').text(localeString);
    const isoString = d.toISOString(); // this isnt good enough because it converts to utc
    $('.datetime-formats .iso8601').text(isoString);
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
    console.log(offset);
    $('select.timezone').val(offset);
    formatDateTime();
}

function stars(n) {
    const $starSpace = $('.sundial-space .stars');
    for (let i = 0; i < n; i++) {
        const $star = $('<div>').addClass('stellar-body star star' + i);
        const diameter = Math.floor((Math.random() * 4) + 1);
        $star.css('width', diameter + 'px');
        $star.css('height', diameter + 'px');
        const left = Math.floor((Math.random() * (400 - (diameter * 2))) + diameter);
        const top = Math.floor((Math.random() * (400 - (diameter * 2))) + diameter);
        $star.css('left', left + 'px');
        $star.css('top', top + 'px');
        $starSpace.append($star);
    }
}

function toggleSundial() {
    const $sundialAnimations = $('.sundial-space .sun, .sundial-space .earth-day, .sundial-space .shadow');
    if ($sundialAnimations.css('animation-play-state') === 'running') {
        $sundialAnimations.css('animation-play-state', 'paused');
    } else {
        $sundialAnimations.css('animation-play-state', 'running');
    }
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

function initialize() {
    setNow();
    stars(80);
    toggleSundial();
    generateNavigation();
    registerObservers();
}

const $body = $('body');
$(() => initialize());
$body.on('input change', 'input.date, input.time, select.timezone', formatDateTime);
$body.on('click', '.sundial-space', toggleSundial);
$body.on('click', 'button.now', setNow);
$body.on('click', 'button.dark', setDark);
$body.on('click', 'button.light', setLight);
$body.on('click', 'button.bigger', bigger);
$body.on('click', 'button.smaller', smaller);
$body.on('click', 'button.capitalize', capitalize);
$body.on('click', 'button.decapitalize', decapitalize);
$body.on('click', 'button.apostrophes', apostrophes);
$body.on('click', 'button.deapostrophe', deapostrophe);
