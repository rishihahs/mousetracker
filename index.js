// Attach event listeners
addEventListener('');

// Normalize event listener
function addEventListener(event, callback) {
    var eventFunction = document.addEventListener || document.attachEvent;
    eventFunction(event, callback);
}