import {COLUMN, COMPONENT, DROP_ZONE, COMPONENT_PLACEHOLDER, ROW} from "@/constants/index.ts";
import {nanoid} from 'nanoid';
import {capitalize} from "lodash";
import {toCamelCaseString} from '@/mixins'
import {translateComponentName} from "@/components/editor/translateComponentName";

export interface RowLevel {
    id: string;
    type: string;
    children: ColumnLevel[];
}

export interface ColumnLevel {
    id: string;
    type: string;
    children: ComponentLevel[];
}

export interface ComponentLevel {
    id: string;
    type: string;
    as: string;
}

export const layout: Array<RowLevel> = [
    {
        id: nanoid(),
        type: ROW,
        children: [
            {
                id: nanoid(),
                type: COLUMN,
                children: [
                    // --> initial component
                    {
                        id: nanoid(),
                        type: COMPONENT,
                        as: 'FormText',
                    },
                    // initial component <--
                ]
            }
        ]
    },
]

export const createElement = (as: string) => {
    const properties = {
        label: capitalize(as),
        model: as?.length ? toCamelCaseString(as) : '',
        component: translateComponentName(as),
    }
    return addProperties({as, properties})
}

const addProperties = ({as, properties}: { as: string, properties: object }) => {
    switch (as) {
        case 'checklist':
        case 'checkboxes':
        case 'select':
            properties = {...properties, options: []}
            break
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
        meta: {
            focused: false,
            disabled: false,
        },
    }
}