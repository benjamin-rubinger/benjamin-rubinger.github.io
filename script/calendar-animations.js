
function stars(n, selector) {
    const $starSpace = $(`${selector} .stars`);
    for (let i = 0; i < n; i++) {
        const $star = $('<div>').addClass('stellar-body star star' + i);
        const diameter = Math.floor((Math.random() * 4) + 1);
        $star.css('width', diameter + 'px');
        $star.css('height', diameter + 'px');
        const left = Math.floor((Math.random() * (566 - (diameter * 2))) + diameter);
        const top = Math.floor((Math.random() * (566 - (diameter * 2))) + diameter);
        $star.css('left', left + 'px');
        $star.css('top', top + 'px');
        $starSpace.append($star);
    }
}

function toggleAnimation($animationContainer) {
    const $animations = $animationContainer.find('.animated');
    if ($animations.css('animation-play-state') === 'running') {
        $animations.css('animation-play-state', 'paused');
    } else {
        $animations.css('animation-play-state', 'running');
    }
}

// function setDark() {
//     $('body').addClass('dark').removeClass('light');
// }
//
// function setLight() {
//     $('body').addClass('light').removeClass('dark');
// }

// function timeline() {
//     const timelineContainer = $('.timeline')[0];
//
//     // create a dataset (allows two way data-binding)
//     const items = new vis.DataSet([
//         { id: 1, content: 'started writing choose your own calendar reform', start: '2022-10-21', type: 'point' },
//         { id: 2, content: 'gregorian calendar introduced', start: '1582-10-15', type: 'point' },
//         { id: 3, content: 'gregorian epoch', start: '0000-01-01', type: 'point' },
//         { id: 4, content: 'greenwich observatory established', start: '1675-06-22', type: 'point' },
//         { id: 5, content: 'greenwich observatory daily signals began', start: '1833', type: 'point' },
//         { id: 5, content: 'greenwich observatory starts broadcasting hourly time signals', start: '1924-02-05', type: 'point' },
//     ]);
//
//     // configuration for the timeline
//     const options = {};
//
//     // create a timeline
//     const timeline = new vis.Timeline(timelineContainer, items, options);
// }

function initializeAnimations() {
    stars(120, '.animation-container');
    // toggleAnimation($('.animation-container'));
    // timeline();
}

const $animationsBody = $('body');
$(() => initializeAnimations());
$animationsBody.on('click', '.animation-container', function (e) {
    const $ac = $(e.currentTarget);
    toggleAnimation($ac);
});
