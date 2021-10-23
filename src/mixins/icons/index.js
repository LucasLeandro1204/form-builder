const dashifyCamelcase = camelCased => {
    let dashed = ``
    camelCased.split(``).map(ch => dashed += ch.toUpperCase() === ch ? `-${ch.toLowerCase()}` : ch)
    return dashed
}

const fileNamesWithoutExtension = [
    'info', 'question', 'search', 'sections', 'table',
    'singleline', 'multiline', 'numbers', 'image', 'slider', 'attachments',
    'date', 'datetime', 'switchOutline', 'dropdown', 'checkbox', 'checklist',
    'close', 'caretDown', 'switchOutline',
]

export const icons = fileNamesWithoutExtension.reduce((acc, fileName) => {
    acc[fileName] = new URL(`/assets/icons/editor/${dashifyCamelcase(fileName)}.svg`, import.meta.url);
    return acc;
}, {})

