var domtalk = require('domtalk');

var MIN_MOVE = 3; // minimum pixels to move to count for mousemove

module.exports = MouseTracker;

function MouseTracker(jQuery, ignore) {
    if (!(this instanceof MouseTracker)) {
        return new MouseTracker(jQuery, ignore);
    }

    this.jQuery = jQuery;
    this.ignore = ignore;

    return this;
}

MouseTracker.prototype.start = function(clickCallback, mousemoveCallback) {
    var self = this;

    if (clickCallback) {
        self.jQuery(document).on('click', function() {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(clickCallback);

            clickHandler.apply(self, args);
        });
    }

    if (mousemoveCallback) {
        self.jQuery(document).on('mousemove', function() {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(mousemoveCallback);

            mousemoveHandler.apply(self, args);
        });
    }
}

MouseTracker.prototype.triggerClick = function(element, offsetX, offsetY) {
    var $el;

    // Check whether jQuery or DOM element
    if (element instanceof this.jQuery || (element[0] && element[0].nodeType === 1)) {
        $el = this.jQuery(element[0]);
    } else {
        $el = this.jQuery(element);
    }

    // Calculate where in the element to click
    var offset = $el.offset();
    var event = this.jQuery.Event("click", {
        which: 1,
        pageX: offset.left + offsetX,
        pageY: offset.top + offsetY
    });

    // Trigger event
    $el.trigger(event, ['_mousetrackerInternal']);
}

MouseTracker.prototype.stop = function() {
    this.jQuery(document).off('click');
    this.jQuery(document).off('mousemove');
}

function mousemoveHandler(callback, event) {
    if (Math.abs(this.lastMousemoveX - event.pageX) < MIN_MOVE && Math.abs(this.lastMousemoveY - event.pageY) < MIN_MOVE) {
        return;
    }

    var element = event.target;

    // If element is document, html, etc. then just send coordinates
    if (!element || this.ignore(element) || element === document || element === document.documentElement || element === document.body) {
        callback({
            top: event.pageY,
            left: event.pageX
        });
        return;
    }

    var $el = this.jQuery(element);
    var offset = $el.offset();

    callback({
        element: domtalk.getSelectorFromElement(element),
        top: event.pageY - offset.top,
        left: event.pageX - offset.left
    });
}

function clickHandler(callback, event, param) {
    // Programmatic Click
    if (param === '_mousetrackerInternal') {
        return;
    }

    var element = event.target;

    if (this.ignore(element)) {
        return;
    }

    var selector = domtalk.getSelectorFromElement(element);

    var offset = this.jQuery(element).offset();
    var offsetX = event.pageX - offset.left;
    var offsetY = event.pageY - offset.top;

    callback({
        selector: selector,
        offsetX: offsetX,
        offsetY: offsetY
    });
}