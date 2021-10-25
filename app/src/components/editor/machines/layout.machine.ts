// @ts-nocheck
import {nanoid} from "nanoid";
import {assign, createMachine} from 'xstate';
import {capitalize, flatMapDeep, isEqual} from "lodash"
import {flattenNestedArray, toCamelCaseString} from "@/mixins";
import {COLUMN, COMPONENT, ROW} from "@/constants/index.ts";
import {layout} from "@/components/editor/data/layout.components";

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

const createRowElement = (element, placeholder) => ({
    id: nanoid(),
    as: ROW,
    children: [{
        id: nanoid(),
        as: COLUMN,
        children: [{...createComponentElement(element, placeholder)}]
    }]
})

const createColumnElement = (element, placeholder) => ({
    id: nanoid(),
    as: COLUMN,
    children: [{...createComponentElement(element, placeholder)}]
})

const createComponentElement = (element, placeholder) => ({
    id: nanoid(),
    as: COMPONENT,
    ...createElement(element, placeholder),
})


const createElement = ({as, placeholder}) => {
    const properties = {
        label: capitalize(as),
        model: as?.length ? toCamelCaseString(as) : '',
        component: toComponentName(as),
        placeholder: !!placeholder,
    }
    return addProperties({as, properties})
}

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


// const createPlaceholderElement = (currentPath = [], layout, element) => {
//     let newPlaceholderElement
//
//     if (currentPath.length) {
//         const [rowIndex, columnIndex, componentIndex] = currentPath
//         switch (currentPath.length) {
//             case 1:
//                 layout.splice(rowIndex, 0, createRowElement(element))
//                 break;
//             case 2:
//                 layout[rowIndex].children.splice(columnIndex, 0, createColumnElement(element))
//                 break;
//             case 3:
//                 layout[rowIndex].children[columnIndex].children.splice(componentIndex, 0, createComponentElement(element))
//                 break;
//         }
//     }
//     return newPlaceholderElement
// }


const commitCreatePlaceholderElement = (currentPath = [], layout, element) => {
    if (currentPath.length) {
        const [rowIndex, columnIndex, componentIndex] = currentPath
        switch (currentPath.length) {
            case 1:
                layout.splice(rowIndex, 0, createRowElement(element, true))
                break;
            case 2:
                layout[rowIndex].children.splice(columnIndex, 0, createColumnElement(element, true))
                break;
            case 3:
                layout[rowIndex].children[columnIndex].children.splice(componentIndex, 0, createComponentElement(element, true))
                break;
        }
    }
}

const pointerShiftStates = {
    initial: 'active',
    states: {
        active: {
            on: {
                DELEGATE_POINTER_EVENT: {
                    actions: [
                        'respondPointerPath',
                        'setPreviousPath',
                    ],
                },
            },
        },
    }
}


interface LayoutContext {
    layout: Array<{ children: Array<{ children: Array<{}> }> }>;
    previousPath: Array<[number, number, number]>
}

export const layoutMachine = createMachine<LayoutContext>({
        id: "layout",
        initial: "loading",
        context: {
            layout: layout,
            previousPath: []
        },
        states: {
            loading: {
                always: 'ready',
                entry: 'hydrateLayout'
            },
            ready: {
                type: 'parallel',
                states: {
                    internal: {
                        initial: 'idle',
                        states: {
                            idle: {}
                        },
                        on: {},
                    },
                    external: {
                        ...pointerShiftStates
                    }
                },
            },
        }
    },
    {
        actions: {
            respondPointerPath: assign((context: any, event) => {
                const {layout, previousPath} = context
                const {originalEvent} = event.originalEvent.originalEvent
                const {pointerPath: currentPath, element} = originalEvent
                const layoutFlatten = flatMapDeep(layout, flattenNestedArray)
                const samePath = isEqual(previousPath, currentPath)
                const layoutComponents = layoutFlatten.filter(obj => obj.type === 'as')
                const exists = layoutComponents.some(el => el.id === element.id)
                // if (exists || samePath) return
                // Step 1
                if (exists) {
                    console.log('REMOVE')
                }
                // Step 2
                if (!exists) {
                    console.log('ADD')
                    commitCreatePlaceholderElement(currentPath, layout, element);
                }
            }),

            resetPreviousPath: assign((context) => {
                context.previousPath = []
            }),
            setPreviousPath: assign((context, event) => {
                context.previousPath = event.originalEvent.originalEvent.originalEvent.pointerPath
            }),
            hydrateLayout: assign({
                layout: (context) => context.layout.map(row => ({
                    ...row,
                    children: row.children.map(column => ({
                        ...column,
                        children: column.children.map(component => ({
                            ...component,
                        }))
                    }))
                }))
            }),
        },
    }
);