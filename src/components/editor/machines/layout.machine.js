import {assign, createMachine} from 'xstate';
import {layout} from "../data/layout.components";
import {flatMapDeep, capitalize} from "lodash"
import {flattenNestedArray, randomNumber, toCamelCaseString} from "../../../mixins";

const toComponentName = (as) => {
    let component
    const componentMap = {
        'legend': () => component = 'FormLegend',
        'text': () => component = 'FormText',
        'number': () => component = 'FormNumber',
        'color': () => component = 'FormColor',
        'file': () => component = 'FormFile',
        'radio': () => component = 'FormRadio',
        'checkbox': () => component = 'FormCheckbox',
        'checklist': () => component = 'FormChecklist',
        'select': () => component = 'FormSelect',
        'section': () => component = `SchemaForm`,
        'default': () => component = `${as}`
    }
    return (componentMap[as] || componentMap['default'])()
}

const createElement = ({as}) => {
    const properties = {
        label: capitalize(as),
        model: as?.length ? toCamelCaseString(as) : '',
        component: toComponentName(as),
    }
    return addProperties({as, properties})
}

const rowElement = (element) => ({
    id: randomNumber(),
    type: 'row',
    children: [{
        id: randomNumber(),
        type: 'column',
        children: [
            {
                id: randomNumber(),
                type: 'component',
                ...createElement(element),
            }
        ]
    }]
})

const columnElement = (element) => ({
    id: randomNumber(),
    type: 'column',
    children: [
        {
            id: randomNumber(),
            type: 'component',
            ...createElement(element),
        }
    ]
})

const componentElement = (element) => ({
    id: element.id,
    type: 'component',
    ...createElement(element),
})

const addProperties = ({as, properties}) => {
    switch (as) {
        case 'section':
            properties = {...properties, schema: []}
            break;
        case 'select':
            properties = {...properties, options: []}
            break;
        default:
            properties = {
                ...properties,
                config: {
                    placeholder: '',
                    autocomplete: '',
                    autocapitalize: '',
                }
            }
    }
    return {
        ...properties,
        value: '',
        meta: {
            focused: false,
            disabled: false,
        },
    }
}

export const layoutMachine = createMachine({
        id: "layout",
        initial: "loading",
        context: {
            layout,
            previousPath: []
        },
        states: {
            loading: {
                always: 'ready',
                entry: assign({
                    layout: (context) => context.layout.map(row => ({
                        ...row,
                        children: row.children.map(column => ({
                            ...column,
                            children: column.children.map(component => ({
                                ...component,
                            }))
                        }))
                    }))
                })
            },
            ready: {
                on: {
                    pointerContext : {
                        actions: [
                            () => console.log('pointerContext - layout.machine'),
                            'handlePointermove',
                            'setPreviousPath',
                        ],
                        exit: {
                            actions: 'clearPreviousPath'
                        }
                    },
                }
            },
        }
    },
    {
        actions: {
            clearPreviousPath: assign((context) => {
                context.previousPath = []
            }),
            setPreviousPath: assign((context, event) => {
                context.previousPath = event.originalEvent.originalEvent.originalEvent.pointerPath
            }),
            handlePointermove: assign((context, event) => {
                const {layout, previousPath} = context
                const {originalEvent} = event.originalEvent.originalEvent
                const {pointerPath: path, element} = originalEvent

                const layoutFlatten = flatMapDeep(layout, flattenNestedArray)
                const layoutComponents = layoutFlatten.filter(obj => obj.type === 'component')
                const isUnique = layoutComponents.every(el => el.id !== element.id)
                const samePath = Number(previousPath) === Number(path)
                const differentPath = Boolean(path && !samePath)

                const canDrop = Boolean(isUnique && differentPath)


                if (differentPath) {

                    const [rowIndex, columnIndex, componentIndex] = path

                    const currentElement = layoutFlatten.some(obj => obj.id === element.id)

                    if (currentElement) {
                        // console.log(layout, currentElement)
                        // const unsetPath = `layout[${path[0]}].children[${path[1]}].children[${path[2]}]`
                        // unset(layout, unsetPath)
                    }

                    switch (path.length) {
                        case 1:
                            layout.splice(rowIndex, 0, rowElement(element))
                            break;
                        case 2:
                            layout[rowIndex].children.splice(columnIndex, 0, columnElement(element))
                            break;
                        case 3:
                            layout[rowIndex].children[columnIndex].children.splice(componentIndex, 0, componentElement(element))
                            break;
                    }

                }
            })
        }
    }
);

// function delNestedItem(a, dm) {
//     var i = 0;
//     while (i < dm.length - 1) a = a[dm[i++]].array;
//     a.splice(dm[i], 1);
// }

//     console.log('_')
//     console.log('isUnique', isUnique)
//     console.log('samePath', samePath)
//     console.log('differentPath', differentPath)
//     console.log('canDrop', canDrop)
//     console.log('_')

// const findNestedIndexPath = (array, currentElement) => {
//     return array.forEach((row, index) => {
//         return row.children.map((column, idx) => {
//             const currentElementIndex = column.children.findIndex(component => component.id === currentElement.id)
//             return [index, idx, currentElementIndex]
//         })
//     })
// }