var tape = require('wrapping-tape');
var $ = require('jquery-browserify');

var MouseTracker = require('../');
var mousetracker;

// Setup and Teardown
var test = tape({
    setup: function(t) {
        document.write('<!doctype html><html><body><input type="checkbox"><br><button>Hi There</button></body></html>');
        mousetracker = new MouseTracker($, function(args) {
            return !true;
        });
        t.end();
    },
    teardown: function(t) {
        mousetracker.stop();
        t.end();
    }
});

test('click handling', function(t) {
    t.plan(3);
    mousetracker.start(callback);

    click($('button'), 6, 6);

    function callback(args) {
        t.equal(args.selector, 'body *:nth-child(3)', 'selectors are equal');
        t.equal(args.offsetX, 6, 'horizontal offset equal');
        t.equal(args.offsetY, 6, 'vertical offset equal');
        t.end();
    }
});

test('click trigger', function(t) {
    t.plan(3);

    $(document).on('click', callback);

    mousetracker.triggerClick($('button'), 6, 6);

    function callback(event) {
        t.equal(event.target, $('button')[0], 'clicked right element');
        t.equal(event.pageX, $('button').offset().left + 6, 'clicked right horizontal element offset');
        t.equal(event.pageY, $('button').offset().top + 6, 'clicked right vertical element offset');
        t.end();
    }
});

function click($element, offsetX, offsetY) {
    var offset = $element.offset();
    var event = $.Event("click", {
        which: 1,
        pageX: offset.left + offsetX,
        pageY: offset.top + offsetY
    });
    $element.trigger(event);
}