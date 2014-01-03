var domtalk = require('domtalk');

module.exports = MouseTracker;

function MouseTracker(jQuery, ignore) {
    if (!(this instanceof MouseTracker)) {
        return new MouseTracker(jQuery, ignore);
    }

    this.jQuery = jQuery;
    this.ignore = ignore;

    return this;
}

MouseTracker.prototype.start = function(clickCallback) {
    var self = this;

    self.jQuery(document).on('click', function() {
        var args = Array.prototype.slice.call(arguments);
        args.unshift(self.ignore);
        args.unshift(clickCallback);

        clickHandler.apply(null, args);
    });
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
}

function clickHandler(callback, ignore, event, param) {
    // Programmatic Click
    if (param === '_mousetrackerInternal') {
        return;
    }

    var element = event.target;

    if (ignore(element)) {
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