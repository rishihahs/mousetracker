var domtalk = require('domtalk');

module.exports = MouseTracker;

function MouseTracker(clickCallback, ignored) {
    if (!(this instanceof MouseTracker)) {
        return new MouseTracker(clickCallback, ignored);
    }

    this.clickCallback = clickCallback;
    this.ignored = ignored;
    this.userClick = true;

    for (var i = 0; i < 2; i++) {
        if (typeof arguments[i] !== 'function') {
            throw "Argument " + i + " is not a function"
        }
    }

    // Attach event listeners
    var self = this;
    addEventListener('click', function(e) {
        self.clickHandler(e);
    });

    return this;
}

MouseTracker.prototype = {
    clickHandler: function(event) {
        // if click is not programmatic
        if (!this.userClick) {
            this.userClick = true;
            return;
        }

        var element = event.target;

        // Check if element is ignored
        if (this.ignored(element)) {
            return;
        }

        // Get the element's selector from domtalk
        var selector = domtalk.getSelectorFromElement(element);

        // Calculate the mouse position relative to the element
        var elementOffset = getElementOffset(element);
        console.log(elementOffset);
        console.log(event.pageX);
        var posX = event.pageX - Math.floor(elementOffset.left);
        var posY = event.pageY - Math.floor(elementOffset.top);

        this.clickCallback({
            selector: selector,
            offsetX: posX,
            offsetY: posY
        });
    },

    triggerClick: function(element, offsetX, offsetY) {
        this.userClick = false;
        dispatchEvent(element, mouseEvent('click', offsetX, offsetY), 'click');
    }
}

function mouseEvent(type, cx, cy) {
    var evt;
    var e = {
        bubbles: true,
        cancelable: (type != "mousemove"),
        view: window,
        detail: 0,
        clientX: cx,
        clientY: cy,
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
    return evt;
}

function dispatchEvent(el, evt, type) {
    if (el.dispatchEvent) {
        el.dispatchEvent(evt);
    } else if (el.fireEvent) {
        el.fireEvent('on' + type, evt);
    }
    return evt;
}

// Get element offset
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

// Normalize event listener
function addEventListener(event, callback) {
    var eventFunction;
    var eventName = event;

    if (document.addEventListener) {
        eventFunction = document.addEventListener;
    } else {
        eventFunction = document.attachEvent;
        eventName = 'on' + eventName;
    }

    eventFunction(eventName, callback);
}