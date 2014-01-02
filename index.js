var domtalk = require('domtalk');

module.exports = function(clickCallback, ignored) {
    var mousetracker = new MouseTracker(clickCallback, ignored);

    // Attach event listeners
    addEventListener('click', function(e) {
        mousetracker.clickHandler(e);
    });

    return mousetracker;
}

function MouseTracker(clickCallback, ignored) {
    this.clickCallback = clickCallback;
    this.ignored = ignored;
    this.userClick = true;

    for (var i = 0; i < 2; i++) {
        if (typeof arguments[i] !== 'function') {
            throw "Argument " + i + " is not a function"
        }
    }

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
        var posX = event.pageX - elementOffset.left;
        var posY = event.pageY - elementOffset.top;

        this.clickCallback({
            selector: selector,
            offsetX: posX,
            offsetY: posY
        });
    },

    triggerClick: function(element) {
        this.userClick = false;
        if (typeof element.click === 'function') {
            element.click();
        } else {
            var event = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });

            element.dispatchEvent(event);
        }
    }
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