var test = require('tape');

var MouseTracker = require('../index');

test('click handling', function(t) {
    setUpDocument();
    var checkbox = document.getElementsByTagName('input')[0];
    var button = document.getElementsByTagName('button')[0];

    // Set up mousetracker
    var mousetracker = new MouseTracker(function(args) {
        t.plan(3);
        t.equal(args.selector, 'body *:nth-child(3)', 'selectors are equal');
        t.equal(args.offsetX, 6, 'horizontal position correct');
        t.equal(args.offsetY, 6, 'vertical position correct');
        mousetracker.destroy();
        t.end();
    }, function(args) {
        return false;
    });

    click(button, 6, 6);
});

test('click triggering', function(t) {
    setUpDocument();
    var checkbox = document.getElementsByTagName('input')[0];
    var button = document.getElementsByTagName('button')[0];

    var mousetracker = new MouseTracker(function(args) {}, function(args) {
        return false;
    });

    var offset = getElementOffset(button);

    addEventListener('click', function(event) {
        t.plan(2);
        t.equal(event.clientX, offset.left + 12, 'horizontal click position');
        t.equal(event.clientY, offset.top + 12, 'vertical click position');
        mousetracker.destroy();
        t.end();
    });

    mousetracker.triggerClick(button, 12, 12);
});

function setUpDocument() {
    document.write('<!doctype html><html><body><input type="checkbox"><br><button>Hi There</button></body></html>');
}

function addEventListener(event, callback) {
    if (document.addEventListener) {
        document.addEventListener(event, callback, false);
    } else {
        document.attachEvent('on' + event, callback);
    }
}

function click(element, offsetX, offsetY) {
    mouseEvent(element, 'click', offsetX, offsetY);
}

function mouseEvent(el, type, cx, cy) {
    var evt;
    var elOffset = getElementOffset(el);
    var e = {
        bubbles: true,
        cancelable: (type != "mousemove"),
        view: window,
        detail: 0,
        clientX: elOffset.left + cx,
        clientY: elOffset.top + cy,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        button: 0,
        relatedTarget: undefined
    };
    if (typeof(document.createEvent) == "function") {
        evt = document.createEvent("MouseEvents");
        evt.initMouseEvent(type,
            e.bubbles, e.cancelable, e.view, e.detail,
            e.screenX, e.screenY, e.clientX, e.clientY,
            e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
            e.button, document.body.parentNode);
    } else if (document.createEventObject) {
        evt = document.createEventObject();
        for (prop in e) {
            evt[prop] = e[prop];
        }
        evt.button = {
            0: 1,
            1: 4,
            2: 2
        }[evt.button] || evt.button;
    }

    if (el.dispatchEvent) {
        el.dispatchEvent(evt);
    } else if (el.fireEvent) {
        el.fireEvent('on' + type, evt);
    }
}

function getElementOffset(elem) {
    var box = {
        top: 0,
        left: 0
    };

    var docElem = document.documentElement;

    if (elem.getBoundingClientRect) {
        box = elem.getBoundingClientRect();
    }

    return {
        top: box.top + window.pageYOffset - docElem.clientTop,
        left: box.left + window.pageXOffset - docElem.clientLeft
    }
}