// Object.defineProperty(Array.prototype, 'first', {
//     value() {
//         return this.find(Boolean)
//     }
// });

/**
 *  Array.prototype.first
 * @param value
 * @returns {{value: (function(): *)}}
 */
Array.prototype.first = function () {
    return {
        value: () => this.find(Boolean)
    }
};

/**
 * Array.prototype.diff
 * @param a
 * @returns {*[]}
 */
Array.prototype.diff = function (a) {
    return this.filter(function (i) {
        return a.indexOf(i) < 0;
    });
};

/**
 * String.prototype.capitalize
 * @returns {string}
 */
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

/**
 * Array.prototype.contains
 * - loop through every item in array
 * - return true if current item == needle
 * @param needle
 * @returns {boolean}
 */
Array.prototype.contains = function (needle) {
    for (let i in this) {
        if (this[i] === needle) return true;
    }
    return false;
}