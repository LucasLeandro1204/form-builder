// @ts-nocheck
export function elementsFromPoint(x, y): Element[] {
    let elements = [],
        previousPointerEvents = [],
        current,
        i,
        d;

    // chrome supports this (and future un-prefixed IE/Edge hopefully)
    if (typeof (<any>document).elementsFromPoint === "function")
        return Array.prototype.slice.call((<any>document).elementsFromPoint(x, y));

    // IE11/10 should support this
    if (typeof document.msElementsFromPoint === "function")
        return Array.prototype.slice.call(document.msElementsFromPoint(x, y));

    // get all elements via elementFromPoint, and remove them from hit-testing in order
    while ((current = document.elementFromPoint(x, y)) && elements.indexOf(current) === -1) {

        // push the element and its current style
        elements.push(current);
        previousPointerEvents.push({
            value: current.style.getPropertyValue('pointer-events'),
            priority: current.style.getPropertyPriority('pointer-events')
        });

        // add "pointer-events: none", to get to the underlying element
        current.style.setProperty('pointer-events', 'none', 'important');
    }

    // restore the previous pointer-events values
    for (i = previousPointerEvents.length; d == previousPointerEvents[--i];) {
        elements[i].style.setProperty('pointer-events', d.value ? d.value : '', d.priority);
    }

    // return our results
    return elements;
}