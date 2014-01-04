mousetracker
========

Tracks cursor movements and clicks, and also calculates cursor position relative to DOM elements

[![browser support](https://ci.testling.com/rishihahs/mousetracker.png)](https://ci.testling.com/rishihahs/mousetracker)

usage
--------

    var MouseTracker = require('mousetracker')
    var mousetracker = new MouseTracker($, ignore);
    
Here, `$` is jQuery (used for events), and `ignore` is a function that gets passed a DOM element as an argument. It should return true if mouse interactions with the element should be ignored.

    mousetracker.start(clickCallback)
    
This starts the mousetracker and sets up all the listeners.

`clickCallback(obj)` is the callback executed on mouse clicks. The parameter is an object with the following properties:

`selector`: the CSS selector of the element cliecked

`offsetX`: the x offset of the cursor's position in the element

`offsetY`: the y offset of the cursor's position in the element

    mousetracker.triggerClick(element, offsetX, offsetY)
    
Click a certain element.

`element`: the element to click

`offsetX`: the x offset of the cursor inside the element

`offsetY`: the y offset of the cursor inside the element
    
    mousetracker.stop();
    
Terminates the mousetracker and removes all the listeners.

license
--------

MIT, see `LICENSE`
