import _, {isArray} from "lodash";
import {layout} from "../components/editor/data/layout.components";

/**
 * Hashify
 * @param s
 */
export const hashify = s => s.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a
}, 0)

/**
 * findNestedObj
 * @param entireObj
 * @param keyToFind
 * @param valToFind
 * @returns {*}
 */
function findNestedObj(entireObj, keyToFind, valToFind) {
    let foundObj;
    JSON.stringify(entireObj, (_, nestedValue) => {
        if (nestedValue && nestedValue[keyToFind] === valToFind) {
            foundObj = nestedValue;
        }
        return nestedValue;
    });
    return foundObj;
}

/**
 * Debounce fn
 * @param fn
 * @param ms
 * @returns {(function(...[*]=): void)|*}
 */
export const debounce = (fn, ms = 0) => {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
};

/**
 * Generates a unique id.
 * @returns {string}
 */
export const generateUniqueID = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

/**
 * Checks if an element exists in the DOM (page)
 * @param node
 * @returns {boolean|boolean}
 */
export const existsInDOM = (node) => (node === document.body) ? false : document.body.contains(node);

/**
 * Not Null
 * @param value
 * @returns {boolean}
 */
export const notNull = (value) => !!(value !== null && value !== undefined)

/**
 * Is Object
 * @param obj
 * @returns {boolean}
 */
export const isObject = (obj) => !!(obj === Object(obj) && obj.constructor === Object);

/**
 * Is Empty
 * @param obj
 * @returns {boolean}
 */
export const isEmpty = (obj) => Object.keys(obj).length === 0

/**
 * Is String
 * @param value
 * @returns {boolean}
 */
export const isString = (value) => (typeof value === 'string')

/**
 * Delay
 * @param ms
 * @returns {Promise<unknown>}
 */
export const wait = ms => new Promise(resolve => setTimeout(resolve, ms));


/**
 * Random Integer
 * @param min
 * @param max
 * @returns {*}
 */
export const randomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Tests if a given string is written in uppercase.
 * @param str
 * @returns {boolean}
 */
export const isUpperCase = (str) => !/[a-z]/.test(str) && /[A-Z]/.test(str)

/**
 * Mocks an API-request
 * @returns {Promise<unknown>}
 */
export const fakeApiRequest = () => {
    return new Promise(resolve => setTimeout(() => resolve(true), 3000))
}

/**
 * Removes mulitiple properties from an object.
 * @param object
 * @param keys
 * @returns {T}
 */
export const removeProperties = (object, ...keys) => {
    return Object.entries(object).reduce((prev, [key, value]) =>
        ({...prev, ...(!keys.includes(key) && {[key]: value})}), {});
}


/**
 *
 * @param text
 * @param searchQuery
 * @returns {*}
 */
export function encapsulateMatches(text, searchQuery) {
    const matchExists = text.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchExists) return text
    const re = new RegExp(searchQuery, 'ig')
    return text.replace(re, matchedText => `<span class="invisible">${matchedText}</span>`)
}


/**
 * @param object
 * @returns {{}}
 */
export function removeUndefinedValues(object) {
    return Object.keys(object).reduce((acc, key) => {
        const _acc = acc;
        if (object[key] !== undefined && object[key]) _acc[key] = object[key];
        return _acc;
    }, {})
}


/**
 * @param string
 * @param newString
 * @returns {*}
 */
export function replaceFirstWhitespace(string, newString) {
    const replaceWith = newString ?? ''
    return string.replace(/ +/g, replaceWith)
}


/**
 * @param string
 * @returns {number}
 */
export function countWhitespaces(string) {
    return string.split(' ').length - 1
}


/**
 * @param str
 * @returns {*}
 */
export function countWords(str) {
    return str.split(' ').filter((n) => n !== '').length;
}


/**
 * @param array
 * @returns {*}
 */
export function stringify(array) {
    return array.reduce((pre, next) => pre + ' ' + next)
}


/**
 * @param array
 * @returns {*}
 */
export function everythingBetween(array) {
    array.splice(0, 1)
    array.splice(array.length - 1, 1)
    return stringify(array)
}


/**
 * Listener for keydown events on form fields
 *
 * @param event
 */
export const onFormKeydown = (event) => {
    const {key} = event
    switch (key) {
        case 'ArrowUp':
            focusTouchingInputField(event, 'prev')
            break;
        case 'ArrowDown':
            focusTouchingInputField(event, 'next')
            break;
    }
}
export const slugify = text =>
    text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')

/**
 * Focusses the next or previous input-field in order.
 * @param event
 * @param direction
 */
export const focusTouchingInputField = (event, direction = 'next') => {
    const fromElement = event.target
    const elements = document.querySelectorAll('input:not([readonly]):not([disabled]):not(.disabled)')
    const inputElements = [...elements]
    const currentIndex = inputElements.indexOf(fromElement)
    const isPrev = direction === 'prev'
    const isNext = direction === 'next'
    if (isPrev && currentIndex !== 0) {
        inputElements[currentIndex < inputElements.length - 1 ? currentIndex - 1 : 0].focus()
    } else if (isNext && currentIndex !== inputElements.length - 1) {
        inputElements[currentIndex < inputElements.length - 1 ? currentIndex + 1 : 0].focus()
    } else {
        if (process && process?.env.NODE_ENV !== 'production') {
            console.warn(`Warning: there is no field to go ${isPrev ? 'backwards' : 'forwards'} to.`)
        }
    }
}


/**
 * @param fullName
 * @returns {{middleNames: string, firstName: string, lastName: string, fullName: {length}, classified: string}}
 */
export function parseName(fullName) {
    let firstName = ''
    let middleNames = ''
    let lastName = ''
    let classified = ''
    if (fullName && typeof fullName === 'string' && fullName.length) {
        const wordsArray = fullName.split(' ')
        const wordsNum = countWords(fullName)
        if (wordsNum >= 1) firstName = wordsArray.first()
        if (wordsNum >= 2) lastName = wordsArray[wordsArray.length - 1]
        if (wordsNum >= 3) middleNames = everythingBetween(wordsArray)
        classified = wordsNum >= 4 ? '✔ voornaam | ✔ tussenvoegsel | ✔ achternaam'
            : wordsNum === 3 ? '✔ voornaam | ✔ tussenvoegsel | ✔ achternaam'
                : wordsNum === 2 ? '✔ voornaam | ✔ achternaam'
                    : wordsNum === 1 ? '✔ voornaam' : ''
    }
    return {
        firstName,
        middleNames,
        lastName,
        fullName,
        classified
    }
}


// util function to convert the input to string type
const convertToString = (input) => {
    if (input) {
        if (typeof input === "string") {
            return input
        }
        return String(input)
    }
    return ''
}


// convert string to words
export const toWords = (input) => {
    input = convertToString(input);
    const regex = /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g;
    return input.match(regex);
}


// convert the input array to camel case
export const toCamelCase = (inputArray) => {
    let result = "";
    for (let i = 0, len = inputArray.length; i < len; i++) {
        let currentStr = inputArray[i];
        let tempStr = currentStr.toLowerCase();
        if (i !== 0) {
            // convert first letter to upper case (the word is in lowercase)
            tempStr = tempStr.substr(0, 1).toUpperCase() + tempStr.substr(1);
        }
        result += tempStr;
    }
    return result;
}


// this function call all other functions
export const toCamelCaseString = (input) => {
    let words = toWords(input)
    return toCamelCase(words)
}

/**
 * Listen to data-state changes
 * on DOM element with Mutation Observer
 * @param elementSelector
 */
export function dataStateMutationObserver(elementSelector,) {
    const app = document.querySelector(elementSelector)
    const observer = new MutationObserver(mutations =>
        mutations.map(mutation => mutation.target.dataset.state))
    observer.observe(app, {attributes: true})
}

/**
 * Example of use
 * const id = 999
 * const hasChildren = layout.some(row => nodeWithIdHasChildren(row.children, 999))
 * console.log(hasChildren)
 *
 * @param children
 * @param id
 * @returns {boolean|*}
 */
export function nodeWithIdHasChildren(children, id) {
    for (const child of children) {
        // If this child node matches supplied id, then check to see if
        // it has data in it's children array and return true/false accordinly
        if (child.id === id) {
            return Array.isArray(child.children) && child.children.length > 0;
        } else {
            const result = nodeWithIdHasChildren(child.children, id);
            // If result returned from this recursion branch is not undefined
            // then assume it's true or false from a node matching the supplied
            // id. Pass the return result up the call stack
            if (result !== undefined) {
                return result
            }
        }
    }
}

export const drawPoint = (x, y, color = 'black', timeout = 5000, text = 'enter', size = '2.5em') => {
    const point = document.createElement('div')
    const pointSize = size
    point.style.position = 'absolute'
    point.style.left = `${x}px`
    point.style.top = `${y}px`
    point.style.width = pointSize
    point.style.height = pointSize
    point.style.zIndex = '9999'
    point.style.borderRadius = '50%'
    point.style.backgroundColor = `${color}`
    point.style.transform = 'scale(0)'
    point.style.transition = 'all ease 320ms'
    point.textContent = text
    point.classList.add('point')
    document.body.appendChild(point)

    setTimeout(() =>
        point.style.transform = 'scale(1)', 0)

    setTimeout(() => {
        point.style.transform = 'scale(0)'
        setTimeout(() =>
            document.body.removeChild(point), 300)
    }, timeout)
}

/**
 * UNTESTED
 * @param parent
 */
function removeLevelWithoutChildren(parent) {
    if (!parent.children)
        return;
    let i = 0;
    while (i < parent.children.length) {
        const data = parent.children[i].data;
        if (typeof data !== "undefined") {
            // remove child - could save it in _children if you wanted to ever put it back
            const child = parent.children.splice(i, 1);
            // length of child list reduced, i points to the next child
        } else {
            // not a bye - recurse
            removeLevelWithoutChildren(parent.children[i]);
            // all the child's bye's are removed so go to the next child
            i++;
        }
    }
}


/**
 * Custom filter method to flatten a deeply nested array of objects.
 * - serves as an extension of lodash flatMapDeep
 * @param array
 * @returns {(*|unknown[])[]|*}
 */
export const flattenNestedArray = (array) => {
    const member = {...array};
    delete member.children;
    return !array.children || !array.children.length
        ? member
        : [member, _.flatMapDeep(array.children, flattenNestedArray)];
}

export const addDataAttributes = (elements, state) =>
    isArray(elements)
        ? elements.map(el => el.setAttribute('data-state', state))
        : elements.setAttribute('data-state', state)


export const removeDataAttributes = (elements, state) =>
    elements.map(el => el.removeAttribute('data-state', state))


/**
 * Instead of describing the filters with arrays (or limited objects),
 * just describe them with a function predicate.,See the docs and tests here: file-filterplainarray-js.,
 * The signature of the filters arguments is the following:,
 * In plain array i can easily modify that structure below:
 * @param arr
 * @param filters
 * @returns {Object[]}
 */
export const multiFilter = (arr, filters) => {
    const filterKeys = Object.keys(filters);
    return arr.filter(eachObj => {
        return filterKeys.every(eachKey => {
            if (!filters[eachKey].length) {
                return true; // passing an empty filter means that filter is ignored.
            }
            return filters[eachKey].includes(eachObj[eachKey]);
        });
    });
};

/**
 * Object Deep Filter
 *
 * (targetId, data) => filterDeep(({parentObject: {id} = {}}) => id !== targetId)(data)
 *
 * @param pred
 * @returns {function(*=): {[p: string]: any}|any}
 */
const filterDeep = (pred) => (obj) =>
    Object(obj) === obj
        ? Object.fromEntries(
            Object.entries(obj)
                .flatMap(([k, v]) => pred(v) ? [[k, filterDeep(pred)(v)]] : [])
        )
        : obj


const findArrayPathData = (context, data = {}) => {
    context.layout.forEach((row, rowIndex) => {
        if ((!row.children || (row.children && !row.children.length))) {
            Object.assign(data, {
                parentPath: `layout`,
                childIndex: rowIndex
            })
        }
        row.children.forEach((column, columnIndex) => {
            if ((!column.children || (column.children && !column.children.length))) {
                Object.assign(data, {
                    parentPath: `layout[${rowIndex}].children`,
                    childIndex: columnIndex
                })
            }
        })
    })
    return data;
}

const findArrayPath = (context) => {
    let unsetPath = ``
    context.layout.forEach((row, rowIndex) => {
        if ((!row.children || (row.children && !row.children.length))) {
            return unsetPath = `layout[${rowIndex}]`
        }
        row.children.forEach((column, columnIndex) => {
            if ((!column.children || (column.children && !column.children.length))) {
                return unsetPath = `layout[${rowIndex}].children[${columnIndex}]`
            }
        })
    })
    return unsetPath;
}

/**
 * Removes duplicates from array by key
 * @param data
 * @param key
 * @returns {V[]}
 */
export function removeDuplicates(data, key) {
    return [
        ...new Map(data.map(item => [key(item), item])).values()
    ]
}

/**
 * getBoundingClientRect
 *
 * @param el
 * @returns {DOMRect}
 */
export const rect = (el) => el.getBoundingClientRect();

/**
 * Get center coordinates HTML Element
 * @param el
 * @returns {*[]}
 */
export const center = (el) => {
    const elRect = rect(el);
    return [elRect.left + elRect.width / 2, elRect.top + elRect.height / 2];
}

/**
 * setElementDataAttribute
 * @param el
 * @param value
 */
export const setElementDataAttribute = (el, value) =>
    addDataAttributes(el, value)

/**
 * obscureEmail
 * @param email
 * @returns {`${string}${string}@${*}`}
 */
const obscureEmail = (email) => {
    const [name, domain] = email.split('@');
    return `${name[0]}${new Array(name.length).join('*')}@${domain}`;
};

    /**
     * takeTruthyValues
     * @param objectMap
     * @returns {string[]}
     */
    export const takeTruthyValues = (objectMap) =>
        Object.keys(Object.fromEntries(Object.entries(objectMap)
            .filter(([_key, value]) => value)))