function capitalizeAll(s) {
    return `<span class="capitalizable">${s}</span>`;
}

function capitalizeFirst(s) {
//    console.log('capitalize first');
//    console.log(s);
    if (!s) {
        return s;
    }
    let pre = '';
    let first;
    let rest;
    if (s.startsWith('- ')) {
        pre = s.substring(0, 2);
        first = s[2];
        rest = s.substring(3);
    } else {
        first = s[0];
        rest = s.substring(1);
    }
    if ((first === first.toLowerCase()) && (first !== first.toUpperCase())) {
        return `${pre}<span class="capitalizable">${first}</span>${rest}`;
    } else if ((first !== first.toLowerCase()) && (first === first.toUpperCase())) {
        return `${pre}<span class="capitalizable">${first.toLowerCase()}</span>${rest}`;
    }
    return s;
}

function titleCase(s, allCaps, apostropheMap) {
    if (!s) {
        return '';
    }
    let exceptions = [
        'a',
        'above',
        'about',
        'across',
        'after',
        'against',
        'along',
        'among',
        'an',
        'and',
        'around',
        'as',
        'at',
        'because',
        'before',
        'behind',
        'below',
        'beneath',
        'beside',
        'between',
        'but',
        'by',
        'considering',
        'de',
        'down',
        'during',
        'except',
        'following',
        'for',
        'from',
        'inside',
        'instead',
        'into',
        'like',
        'near',
        'nor',
        'of',
        'off',
        'on',
        'outside',
        'over',
        'past',
        'since',
        'the',
        'through',
        'to',
        'toward',
        'under',
        'until',
        'up',
        'upon',
        'with',
        'within',
        'without'
    ];
    let pieces = s.split(' ');
    let results = [];
    const lastIndex = pieces.length - 1;
    let pieceIndex = 0;
    for(const piece of pieces) {
        if (piece) {
            if (allCaps && allCaps.includes(piece)) {
                results.push(capitalizeAll(piece));
            } else if ((pieceIndex !== 0) && (pieceIndex !== lastIndex) && exceptions && exceptions.includes(piece)) {
                results.push(piece);
            } else {
                results.push(capitalizeFirst(piece));
//                console.log(`title case  piece "${piece}"  capitalized ${capitalizeFirst(piece)}`);
            }
        }
        pieceIndex += 1;
    }
    return results.join(' ');
}

function replaceEye(match, p1, p2, p3, offset, string, groups) {
    return `${p1}<span class="capitalizable">${p2}</span>${p3}`;
}

function replaceCapitalizes(sentence, capitalizes, allCaps) {
//    console.log('replace capitalizes');
//    console.log(sentence);
    let result = sentence;
    let wordMatches = [...sentence.matchAll(/\w+/g)];
    wordMatches.reverse();
//    console.log(wordMatches);
//    let found_any = false;
    for (const wordMatch of wordMatches) {
        //        console.log(`${wordMatch}`);
        if (capitalizes.includes(wordMatch[0])) {
//            console.log(`${sentence} includes ${wordMatch[0]} at ${wordMatch.index}`);
            result = `${result.substring(0, wordMatch.index)}<span class="capitalizable">${result.substring(wordMatch.index, wordMatch.index + 1)}</span>${result.substring(wordMatch.index + 1, result.length)}`;
//            found_any = true;
        } else if (allCaps.includes(wordMatch[0])) {
            let capLength = allCaps[allCaps.indexOf(wordMatch[0])].length;
            result = `${result.substring(0, wordMatch.index)}<span class="capitalizable">${result.substring(wordMatch.index, wordMatch.index + capLength)}</span>${result.substring(wordMatch.index + capLength, result.length)}`;
//            found_any = true;
        }
    }
//    if (found_any) {
//        console.log(result);
//    }
    return result;
}

function capitalizeEyes(sentence) {
    let eyesRegex = /( )(i)( |,|<span .*<\/span>m |$)/g;
    return sentence.replaceAll(eyesRegex, replaceEye);
}

function contractions(sentence, apostropheMap) {
    const contractionMap = {
        'doesnt': 5,
        'dont': 3,
        'didnt': 4,
        'isnt': 3,
        'wasnt': 4,
        'arent': 4,
        'werent': 5,
        'hasnt': 4,
        'havent': 5,
        'hadnt': 4,
        'cant': 3,
        'couldnt': 6,
        'shant': 4,
        'shouldnt': 7,
        'wont': 3,
        'wouldnt': 6,
        'mightnt': 6,
        'mustnt': 5,
        'oughtnt': 6,
        'neednt': 5,
        'couldve': 5,
        'shouldve': 6,
        'wouldve': 5,
        'mightve': 5,
        'mustve': 4,
        'im': 1,
        'youre': 3,
        'shes': 3,
        'hes': 2,
//        'its': 2, // its it is problem
//        'were': 2, // were we are problem
        'theyre': 4,
        'ive': 1,
        'youve': 3,
        'weve': 2,
        'theyve': 4,
//        'ill': 1, // ill i will problem
        'youll': 3,
//        'hell': 2, // hell is probably more common than he'll?
//        'shell': 3,
        'itll': 2,
//        'well': 2,
        'theyll': 4,
        'id': 1,
        'youd': 3,
//        'shed': 3,
        'hed': 2,
        'itd': 2,
        'wed': 2,
        'theyd': 4,
        'thats': 4,
        'thatve': 4,
        'thatd': 4,
        'whichve': 5,
        'whos': 3,
        'whore': 3,
        'whove': 3,
        'whod': 3,
        'wholl': 3,
        'whats': 4,
        'whatre': 4,
        'whatll': 4,
        'wheres': 5,
        'whered': 5,
        'whens': 4,
        'whys': 3,
        'whyd': 3,
        'hows': 3,
        'heres': 4,
        'theres': 5,
        'therell': 5,
        'thered': 5,
        'someones': 7,
        'somebodys': 8,
//        'ones': 3, ambiguous. eg yes, but which ones?
        'nobodys': 6,
        'somethings': 9,
        'nothings': 7,
        'lets': 3,
        'maam': 2,
        'oclock': 1,
    };
    let result = sentence;
    let wordMatches = [...sentence.matchAll(/\w+/g)];
    wordMatches.reverse();
    let apostropheIndex;
    for (const wordMatch of wordMatches) {
//        console.log(`${wordMatch}`);
        apostropheIndex = -1;
        if (contractionMap.hasOwnProperty(wordMatch[0])) {
            apostropheIndex = contractionMap[wordMatch[0]];
        }
        if (apostropheMap.hasOwnProperty(wordMatch[0])) {
            apostropheIndex = apostropheMap[wordMatch[0]];
        }
        if (apostropheIndex > -1) {
            result = `${result.substring(0, wordMatch.index + apostropheIndex)}<span class="apostrophe">&apos;</span>${result.substring(wordMatch.index + apostropheIndex, result.length)}`;
        }
    }
    result = result.replaceAll('\'', '<span class="apostrophe">&apos;</span>');
    return result;
}

function sentenceCase(s, capitalizes, allCaps, apostropheMap) {
    let sentences = s.split('. ');
    let results = [];
    for (const sentence of sentences) {
        if (sentence) {
            let questions = sentence.split('? ');
            let resultQuestions = [];
            for (const question of questions) {
                if (question) {
                    let exclamations = question.split('! ');
                    let resultExclamations = [];
                    for (const exclamation of exclamations) {
                        let result = exclamation;
                        result = contractions(result, apostropheMap);
                        result = replaceCapitalizes(result, capitalizes, allCaps);
                        result = capitalizeFirst(result);
                        result = capitalizeEyes(result);
                        resultExclamations.push(result);
                    }
                    resultQuestions.push(resultExclamations.join('! '));
                }
            }
            results.push(resultQuestions.join('? '));
        }
    }
    return results.join('. ');
}

function navigationEntry($section) {
    // console.log('navigation entry');
    // console.log($section);
    const id = $section.attr('id');
    const key = $section.attr('data-key');
    const value = $section.attr('data-value');
    if (!value) {
        return $('');
    }
    if ($section[0].nodeName !== 'SECTION') {
        // console.log('navigation entry return early');
        if (id === 'book'){
            let v = 'top';
            if (value) {
                v = value;
            }
            const text = titleCase(value, [], {});
            const navigationId = `navigation-${id}`;
            const $root = $('<li>').addClass('navigation-entry').addClass(navigationId).attr('data-entry-id', id).html(text);
            const $result = $('<div>');
            $result.append($root);
            return $result;
        }
        return $('<div>');
    }

//    console.log(value);
    const navigationId = `navigation-${id}`;
    const text = capitalizeFirst(value);
    // todo apply the other capitalize functions, or refactor the capitalize functions so it is one call
    return $('<li>').addClass('navigation-entry').addClass(key).addClass(navigationId).attr('data-entry-id', id).html(text);
}

function generateNavigationForSection($section) {
//     console.log('generate navigation for section');
//     console.log($section[0]);
    let $navigationSection = navigationEntry($section);
    // console.log($navigationSection);
    const $childSections = $section.children("section");
    if ($childSections.length > 0) {
        const $childContainer = $('<ul>');
        $childSections.each(function(_i) {
            let $childNavigation = generateNavigationForSection($(this));
            $childContainer.append($childNavigation);
        });
        $navigationSection.append($childContainer);
    }
    return $navigationSection;
}

function generateNavigation() {
    const $article = $('div#book');
    const $navigation = generateNavigationForSection($article).unwrap();
    const $navigationContainer = $('nav.article .navigation-container');
    $navigationContainer.empty().append($navigation).show();
    $('button.navigation-collapse, button.navigation-expand').show();
}

function setDark() {
    $('body').addClass('dark').removeClass('light');
    $('button.dark').hide();
    $('button.light').show();
}

function setLight() {
    $('body').addClass('light').removeClass('dark');
    $('button.light').hide();
    $('button.dark').show();
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
//    $('.apostrophe').html('&apos;');
    $('.apostrophe').show();
}

function deapostrophe() {
    $('button.deapostrophe').removeClass('deapostrophe').addClass('apostrophes').html("apostrophe&apos;s");
//    $('.apostrophe').text('');
    $('.apostrophe').hide();
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

function changeBook() {
    loadBook('index.book');
//    $('nav.article .navigation-container').hide();
//    $('div#book').hide();
//    $('button.navigation-collapse, button.navigation-expand').hide();
//    $('div#books').show();
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

function dashToSpace(s) {
    return s.replaceAll('-', ' ');
}

function spaceToDash(s) {
    return s.replaceAll(' ', '-');
}

// from https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
function spaceToCamel(s) {
    return s.toLowerCase().replace(/(?:^\w|[A-Z]|\b\w)/g, (ltr, idx) => idx === 0 ? ltr : ltr.toUpperCase()).replace(/\s+/g, '');
}

function cleanId(s) {
    let result = spaceToDash(s);
    return result.replaceAll(/[^\w\d-]/g, '');
}


function setData($e, data) {
    for (const [key, value] of Object.entries(data)) {
        $e.attr(`data-${spaceToDash(key)}`, value);
    }
}

function fetchJsonData(name) {
    console.log('fetch json data');
    const path = `json/${name}.json`;
    console.log(path);
    fetch(path)
        .then(response => response.json())
        .then(json => console.log(json));
}

async function basicFetchBook(name) {
//    console.log('fetch book');
    const path = `book/${name}`;
//    console.log(path);
    const response = await fetch(path, { cache: "no-store" });
    return await response.text();
}

function fetchBook(name, f) {
    basicFetchBook(name).then((bookString) => {
        const result = bookString.split('\n');
        f(result);
    });
}

function logBook(lines) {
    for (const line of lines) {
        console.log(line);
    }
}

function stripSecondaryDomain(domain) {
    let result = domain;
    const dotCount = (domain.match(/\./g) || []).length;
    if (dotCount > 1) {
        result = result.substring(result.indexOf('.') + 1, result.length);
    }
//    console.log(`strip secondary domain  domain ${domain}  result ${result}`);
    return result;
}

function lastPathName(url) {
    let result = url.pathname;
    if (result && (result.indexOf('/') >= 0)) {
        result = result.substring(result.lastIndexOf('/') + 1, result.length);
    }
    return result;
}

function replaceApostropheEntities(s) {
    return s.replaceAll('%27s', '<span class="apostrophe">&apos;</span>s');
}

function plainDomOnComplete(selector) {
//    console.log(`plain dom on complete ${selector}`);
    const $e = $(selector);
    const cls = $e.attr('data-writing-dom-class');
    $e.removeClass(cls);
    $e.removeAttr('data-writing-dom-class');
}

if (!URL.canParse) {
    console.log('polyfilling url can parse');
    URL.canParse = function(url) {
        if (!url) {
            return false;
        }
        const urlString = String(url);
        try {
            return !!new URL(urlString);
        } catch (error) {
            return false;
        }
    }
}

function renderBook(lines) {
//    console.log(`render book  lines length ${lines.length}`);
    // logBook(lines);
    const $book = $('div#book').attr('data-value', null);
    $book.empty();
    const keySet = {
        'all caps': '',
        'apostrophize': '',
        'author': null,
        'bold': 'b',
        'by': 'p',
        'capitalize': '',
        'chapter': 'section',
        'class': 'div',
        'column0': 'div',
        'column1': 'div',
        'column2': 'div',
        'column3': 'div',
        'column4': 'div',
        'column5': 'div',
        'css': '',
        'dom': 'div',
        'grid2': 'div',
        'grid3': 'div',
        'grid4': 'div',
        'grid5': 'div',
        'grid6': 'div',
        'image': 'img',
        'italic': 'i',
        'js': '',
        'line': 'hr',
        'link': 'div',
        'page title': null,
        'pre': 'pre',
        'quote': 'blockquote',
        'section': 'section',
        'subsection': 'div',
        'subtitle': 'i',
        'title': 'h1',
        'underline': 'u',
        // todo figure tag and figcaption
        // todo consider horizontal rule, divider
    };

    const brands = {
        'twitter.com': 'x-twitter',  // https://github.com/FortAwesome/Font-Awesome/issues/19925
        'wikipedia.org': 'wikipedia-w',
        'x.com': 'x-twitter',
        'youtube.com': 'youtube',
        'youtu.be': 'youtube',
    }

    const httpLinkRegex = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;\(\))]*[-A-Z0-9+&@#\/%=~_|\(\)])/gim;  // added permission for parends in urls, from https://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links?noredirect=1&lq=1
    const $lines = [];
    let $currentSection = null;
    let $currentGrid = null;
    let $currentPre = null;
    let line_number = 0;
    let capitalizes = [];
    let allCaps = [];
    let apostropheMap = {};
    let is_link = false;

    for (const line of lines) {
        if (!line) {
            continue;
        }
        const firstColon = line.indexOf(':');
        const key = line.substring(0, firstColon);
        let value = line.substring(firstColon + 1, line.length).trim();
        is_link = false;
//        console.log(`key "${key}"  value "${value}"  current section ${$currentSection && $currentSection.attr('id')}`);
        let $line;
        let tag = 'p';
        if (keySet.hasOwnProperty(key)) {
            tag = keySet[key];
        } else if (key) {
            value = line;
        }
        if ((key === 'author') || (key === 'by')) {
            value = 'by ' + value;
        }
        if (key === 'comment') {
            continue;
        }
        if (key === 'css') {
//            console.log(`fetch css ${value}`);
            const head  = document.getElementsByTagName('head')[0];
            const linkCss = document.createElement('link');
            linkCss.type = 'text/css';
            linkCss.rel = 'stylesheet';
//            link.onload = () => resolve();
//            link.onerror = () => reject();
            linkCss.href = value;
            head.appendChild(linkCss);
            continue;
        }
        if (key === 'js') {
//            console.log(`fetch js ${value}`);
            const head = document.getElementsByTagName('head')[0];
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = value;

            // then bind the event to the callback function 
            // there are several events for cross browser compatibility
            script.onreadystatechange = function() {
                console.log(`script ready ${value}`);
            };
            script.onload = function() {
                console.log(`script ready ${value}`);
            };

            // fire the loading
            head.appendChild(script);
            continue;
        }
        if (key === 'link') {
            let text = value;
            let bookName = '';
//            let is_local = false;
            if (text.startsWith('#')) {
//                is_local = true;
                text = text.substring(1);
                bookName = text;
                if (bookName.indexOf('#') >= 0) {
                    bookName = bookName.substring(0, bookName.indexOf('#'));
                }
            }
            if (text.indexOf('.') >= 0) {
                text = text.substring(0, text.indexOf('.'));
            }
            if (text.indexOf('#') >= 0) {
                text = text.substring(0, text.indexOf('#'));
            }
//            if (is_local) {
            text = titleCase(text);
//            }
            let cls = '';
            if (bookName) {
                cls = `class="book" data-name="${bookName}" `;
            }
            value = `<a ${cls}href="${value}">${text}</a>`;

        }
        if (key === 'page title') {
            document.title = value;
            continue;
        }
        if (key === 'todo') {
            console.log(value);
            continue;
        }
        if (key === 'all caps') {
            allCaps.push(value);
//            console.log('all caps');
//            console.log(allCaps);
            continue;
        }
        if (key === 'capitalize') {
            capitalizes.push(value);
//            console.log('capitalizes');
//            console.log(capitalizes);
            continue;
        }
        if (key === 'apostrophize') {
            const apostropheIndex = value.indexOf('\'');
            const word = value.replace('\'', '');
            apostropheMap[word] = apostropheIndex;
//            console.log('apostrophize');
//            console.log(apostropheMap);
            continue;
        }
        if (key === 'title') {
            $book.attr('data-value', value);
        }

        let urlMatches = [...value.matchAll(httpLinkRegex)];
        if ((urlMatches.length > 0) && (key !== 'image')) {
            for (const urlMatch of urlMatches) {
//                console.log('url match');
//                console.log(urlMatch);
                //                const urlLength = urlMatch[0].length;
                if (URL.canParse(urlMatch[0])) {
                    is_link = true;
                    const url = new URL(urlMatch[0]);
                    let domain = stripSecondaryDomain(url.hostname);
                    //                    console.log(`url hostname ${domain}`);
                    let brand = '';
                    if (brands.hasOwnProperty(domain)) {
                        brand = `<i class="fa-brands fa-${brands[domain]} fa-sm"></i> `;
                    }
                    let linkDescriptionHtml = value.substring(0, urlMatch.index);
                    if (!linkDescriptionHtml) {
                        if (domain === 'wikipedia.org') {
                            linkDescriptionHtml = lastPathName(url).toLowerCase();
                        } else {
                            linkDescriptionHtml = domain.replaceAll(/\.\w+/g, '');
                        }
                    }
                    if (linkDescriptionHtml) {
                        linkDescriptionHtml = linkDescriptionHtml.replaceAll('_', ' ');
                        linkDescriptionHtml = titleCase(linkDescriptionHtml, allCaps);
                        linkDescriptionHtml = replaceApostropheEntities(linkDescriptionHtml);
                    }
                    value = `${brand}<a href="${urlMatch[0]}">${linkDescriptionHtml}</a>`;
                    break;
                }
            }
        }
        if ((key === 'author') || (key === 'by') || (key === 'title')) {
            value = titleCase(value, allCaps, apostropheMap);
        } else if ((key === 'chapter') || (key === 'class') || (key === 'section') || (key === 'subsection') || (key === 'dom') || (key === 'image') || (is_link)) {
            // dont modify value yet
        } else {
            value = sentenceCase(value, capitalizes, allCaps, apostropheMap);
        }
        // todo convert dash lists to ul, maybe nested ul
        $line = $(`<${tag}>`);
        if ((key === 'chapter') || (key === 'section') || (key === 'subsection')) {
            let myCleanId = cleanId(value);
            $line.attr('id', myCleanId);
            $line.attr('data-value', value);
            $line.attr('data-key', key);
            let level = 2;
            if (key === 'section') {
                level = 3;
            } else if (key === 'subsection') {
                level = 4;
            }
            let $heading = $(`<h${level}>`).html(titleCase(value, allCaps));
            $line.append($heading);
            $currentSection = $line;
        } else if (key === 'class') {
            $line.addClass(value);
        } else {
            $line.html(value);
        }
        if (key === 'subtitle') {
            let $lineOuter = $('<h2>');
            $lineOuter.append($line)
            $line = $lineOuter;
        }
        if (key === 'dom') {
            $line.html('');
            const cls = `writing-dom${line_number}`;
            $line.addClass(cls);
            $line.attr('data-writing-dom-class', cls);
//            console.log(line);
            plainDomFetch(value, `div.${cls}`, plainDomOnComplete);
        }
        if ((key === 'grid2') || (key === 'grid3') || (key === 'grid4') || (key === 'grid5') || (key === 'grid6') || (key === 'column0') || (key === 'column1') || (key === 'column2') || (key === 'column3') || (key === 'column4') || (key === 'column5')) {
            $line.addClass(key);
        }
        if (key === 'image') {
            $line.html('');
            const firstSpaceIndex = value.indexOf(' ');
            if (firstSpaceIndex < 0) {
                $line.attr('src', value);
            } else {
                $line.attr('src', value.substring(0, firstSpaceIndex));
                $line.attr('alt', value.substring(firstSpaceIndex + 1));
            }
        }
        if ((key === 'chapter') || (key === 'section') || (key === 'subsection') || ($currentSection === null)) {
            if ($currentGrid !== null) {
                $lines.push($currentGrid);
                $currentGrid = null;
            }
            if ($currentPre !== null) {
                $lines.push($currentPre);
                $currentPre = null;
            }
            $lines.push($line);
        } else if ($currentGrid !== null) {
            $currentGrid.append($line);
        } else if ($currentPre !== null) {
            $currentPre.append(`${line}\n`);
        } else {
            $currentSection.append($line);
        }
        
        if ((key === 'grid2') || (key === 'grid3') || (key === 'grid4') || (key === 'grid5') || (key === 'grid6')) {
            $currentGrid = $line;
        }
        if (key === 'pre') {
            $currentPre = $line;
        }
        line_number += 1;
    }
//    if ((key !== 'chapter') && ($currentSection !== null)) {
//        $lines.push($line);
//    }
    $book.append($lines);
    generateNavigation();
    registerObservers();
    capitalize();
    apostrophes();
    let hash = decodeURI(window.location.hash.substring(1));
    if (hash) {
        if (hash.indexOf('#') >= 0) {
            const id = hash.substring(hash.indexOf('#'));
            console.log(id);
            const $entry = $(`${id}`);
            if ($entry.length > 0) {
                $entry[0].scrollIntoView({'behavior': 'instant', 'block': 'start'});
            } else {
                $('#book')[0].scrollIntoView({'behavior': 'instant', 'block': 'start'});
            }
        } else {
            $('#book')[0].scrollIntoView({'behavior': 'instant', 'block': 'start'});
        }
    } else {
        $('#book')[0].scrollIntoView({'behavior': 'instant', 'block': 'start'});
    }
}

function loadBook(name) {
    console.log(`load book  name ${name}`);
    if (!name) {
        return;
    }
//    $('div#books').hide();
//    $('div#book').show();
    fetchBook(name, renderBook);
}

function loadBookEvent(event) {
    const $target = $(event.currentTarget);
//    console.log($target);
    const name = $target.attr('data-name');
    loadBook(name);
}

//function listBooks(books) {
//    const $books = $('ul.books');
//    $books.empty();
//    for (const book of books) {
//        if (!book) {
//            continue;
//        }
//        const $book = $('<li>').addClass('book');
//        const bookUri = encodeURI(book);
////        console.log(`book uri ${bookUri}`);
//        const withoutExtension = book.substring(0, book.indexOf('.'));
//        const $bookLink = $('<a>').attr('href', `#${bookUri}`).text(withoutExtension);
//        $book.append($bookLink);
//        setData($book, {'name': bookUri});
//        $books.append($book);
//    }
////    let hash = decodeURI(window.location.hash.substring(1));
//////    console.log(`window location hash ${hash}`);
////    if (hash && books.includes(hash)) {
////        loadBook(hash);
////    }
//}

function scrollToEntry(event) {
    const $target = $(event.target);
    const id = $target.attr('data-entry-id');
    console.log(`scroll to entry id ${id}`);
    const $entry = $(`#${id}`);
    $entry[0].scrollIntoView({'behavior': 'instant', 'block': 'start'});
}

function initializeWriting() {
    const $body = $('body');
    $body.on('click', 'button.dark', setDark);
    $body.on('click', 'button.light', setLight);
    $body.on('click', 'button.bigger', bigger);
    $body.on('click', 'button.smaller', smaller);
    $body.on('click', 'button.capitalize', capitalize);
    $body.on('click', 'button.decapitalize', decapitalize);
    $body.on('click', 'button.apostrophes', apostrophes);
    $body.on('click', 'button.deapostrophe', deapostrophe);
    $body.on('click', 'button.change-book', changeBook);
    $body.on('click', 'button.navigation-collapse', navigationCollapse);
    $body.on('click', 'button.navigation-expand', navigationExpand);
    $body.on('click', '.book', loadBookEvent);
    $body.on('click', '.navigation-entry', scrollToEntry);
//    registerObservers();
    let hash = decodeURI(window.location.hash.substring(1));
    //    console.log(`window location hash ${hash}`);
    if (hash) {
        loadBook(hash);
    } else {
//        fetchBook('index.book', listBooks);
        loadBook('index.book');
    }
}

$(() => initializeWriting());
