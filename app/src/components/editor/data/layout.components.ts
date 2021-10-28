import {COLUMN, COMPONENT, DROP_ZONE, ROW} from "@/constants/index.ts";
import {nanoid} from 'nanoid';

interface RowLevel {
    id: string;
    type: string;
    children: ColumnLevel[];
}

interface ColumnLevel {
    id: string;
    type: string;
    children: ComponentLevel[];
}

interface ComponentLevel {
    id: string;
    type: string;
    as: string;
}

export const layout: Array<RowLevel> = [
    // ...
    {
        id: nanoid(),
        type: ROW,
        children: [
            {
                id: nanoid(),
                type: COLUMN,
                children: [
                    {
                        id: nanoid(),
                        type: DROP_ZONE,
                        as: 'DropZone',
                    },
                ]
            }
        ]
    },
    // ...
]

export const presetLayoutSchema = [
    {
        id: nanoid(),
        type: ROW,
        children: [
            {
                id: nanoid(),
                type: COLUMN,
                children: [
                    {
                        id: nanoid(),
                        type: COMPONENT,
                        as: 'FormNumber',
                    },
                    {
                        id: nanoid(),
                        type: COMPONENT,
                        as: 'FormText',
                    },
                ]
            }
        ]
    },
    {
        id: nanoid(),
        type: ROW,
        children: [
            {
                id: nanoid(),
                type: COLUMN,
                children: [
                    {
                        id: nanoid(),
                        type: COMPONENT,
                        as: 'FormNumber',
                    },
                    {
                        id: nanoid(),
                        type: COMPONENT,
                        as: 'FormText',
                    },
                    {
                        id: nanoid(),
                        type: COMPONENT,
                        as: 'FormFile',
                    },
                ]
            }
        ]
    },
    {
        id: nanoid(),
        type: ROW,
        children: [
            {
                id: nanoid(),
                type: COLUMN,
                children: [
                    {
                        id: nanoid(),
                        type: COMPONENT,
                        as: 'FormText',
                    },
                ]
            }
        ]
    },
]

// const createElement = ({as, placeholder}) => {
//     const properties = {
//         label: capitalize(as),
//         model: as?.length ? toCamelCaseString(as) : '',
//         component: toComponentName(as),
//         placeholder: !!placeholder,
//     }
//     return addProperties({as, properties})
// }
//
// const addProperties = ({as, properties}) => {
//     switch (as) {
//         case 'checklist':
//         case 'checkboxes':
//         case 'select':
//             properties = {...properties, options: []}
//             break
//         default:
//             properties = {
//                 ...properties,
//                 config: {
//                     placeholder: '',
//                     autocomplete: '',
//                     autocapitalize: '',
//                 }
//             }
//     }
//     return {
//         ...properties,
//         value: '',
//         meta: {
//             focused: false,
//             disabled: false,
//         },
//     }
// }