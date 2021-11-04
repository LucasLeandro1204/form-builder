import {icons} from '@/mixins/icons'
import {COMPONENT_PLACEHOLDER} from "@/constants";

const {
    attachments, checklist, date, datetime, dropdown, image,
    multiline, numbers, sections, singleline, slider, table,
    switchOutline
} = icons

export type SidebarElement = {
    type: string;
    as: string;
    label: string;
    icon: URL;
}

export interface SidebarElements {
    legend: string;
    type: string;
    elements: Array<SidebarElement>
}


export const sidebarElements: Array<SidebarElements> = [
    {
        legend: 'layout elements',
        type: 'layout',
        elements: [
            {
                as: 'section',
                type: COMPONENT_PLACEHOLDER,
                label: 'section',
                icon: sections,
            },
            {
                as: 'table',
                type: COMPONENT_PLACEHOLDER,
                label: 'table',
                icon: table,
            },
        ]
    },
    {
        legend: 'text elements',
        type: 'text',
        elements: [
            {
                label: 'single line',
                as: 'single line',
                type: COMPONENT_PLACEHOLDER,
                icon: singleline,
            },
            {
                label: 'multiline',
                as: 'multiline',
                type: COMPONENT_PLACEHOLDER,
                icon: multiline,
            },
            {
                label: 'number',
                as: 'single line',
                type: COMPONENT_PLACEHOLDER,
                icon: numbers,
            },
        ]
    },
    {
        legend: 'date elements',
        type: 'date',
        elements: [
            {
                label: 'date',
                icon: date,
                as: 'date',
                type: COMPONENT_PLACEHOLDER,
            },
            {
                label: 'date & time',
                icon: datetime,
                as: 'datetime',
                type: COMPONENT_PLACEHOLDER,
            },
        ]
    },
    {
        legend: 'multi elements',
        type: 'multi',
        elements: [
            {
                as: 'switch',
                label: 'yes / no',
                icon: switchOutline,
                type: COMPONENT_PLACEHOLDER,
            },
            {
                as: 'dropdown',
                label: 'dropdown',
                icon: dropdown,
                type: COMPONENT_PLACEHOLDER,
            },
            {
                as: 'checkbox',
                label: 'checkbox',
                icon: checklist,
                type: COMPONENT_PLACEHOLDER,
            },
            {
                as: 'checklist',
                label: 'checklist',
                icon: checklist,
                type: COMPONENT_PLACEHOLDER,
            },
        ]
    },
    {
        legend: 'media elements',
        type: 'media',
        elements: [
            {
                as: 'attachment',
                label: 'attachments',
                icon: attachments,
                type: COMPONENT_PLACEHOLDER,
            },
            {
                as: 'image',
                label: 'image',
                icon: image,
                type: COMPONENT_PLACEHOLDER,
            },
            {
                as: 'slider',
                label: 'slider',
                icon: slider,
                type: COMPONENT_PLACEHOLDER,
            },
        ]
    },
]
