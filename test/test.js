var tape = require('wrapping-tape');
var $ = require('jquery');

var MouseTracker = require('../');
var mousetracker;

// Setup and Teardown
var test = tape({
    setup: function() {
        document.write('<!doctype html><html><body><input type="checkbox"><br><button>Hi There</button></body></html>');
        mousetracker = new MouseTracker($);
    },
    teardown: function() {
        mousetracker.destroy();
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
    }
});

function click($element, offsetX, offsetY) {
    var offset = $element.offset();
    var event = jQuery.Event("click", {
        which: 1,
        pageX: offset.left + offsetX,
        pageY: offset.top + offsetY
    });
    $element.trigger(event);
}