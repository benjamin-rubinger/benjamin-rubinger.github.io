
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

function initializeAnimations() {
    stars(120, '.animation-container');
    // toggleAnimation($('.animation-container'));
}

const $animationsBody = $('body');
$(() => initializeAnimations());
$animationsBody.on('click', '.animation-container', function (e) {
    const $ac = $(e.currentTarget);
    toggleAnimation($ac);
});
