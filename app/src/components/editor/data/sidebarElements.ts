import {icons} from '@/mixins/icons'
import {PSEUDO_COMPONENT} from "@/constants";

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
                type: PSEUDO_COMPONENT,
                label: 'section',
                icon: sections,
            },
            {
                as: 'table',
                type: PSEUDO_COMPONENT,
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
                type: PSEUDO_COMPONENT,
                icon: singleline,
            },
            {
                label: 'multiline',
                as: 'multiline',
                type: PSEUDO_COMPONENT,
                icon: multiline,
            },
            {
                label: 'number',
                as: 'single line',
                type: PSEUDO_COMPONENT,
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
                type: PSEUDO_COMPONENT,
            },
            {
                label: 'date & time',
                icon: datetime,
                as: 'datetime',
                type: PSEUDO_COMPONENT,
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
                type: PSEUDO_COMPONENT,
            },
            {
                as: 'dropdown',
                label: 'dropdown',
                icon: dropdown,
                type: PSEUDO_COMPONENT,
            },
            {
                as: 'checkbox',
                label: 'checkbox',
                icon: checklist,
                type: PSEUDO_COMPONENT,
            },
            {
                as: 'checklist',
                label: 'checklist',
                icon: checklist,
                type: PSEUDO_COMPONENT,
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
                type: PSEUDO_COMPONENT,
            },
            {
                as: 'image',
                label: 'image',
                icon: image,
                type: PSEUDO_COMPONENT,
            },
            {
                as: 'slider',
                label: 'slider',
                icon: slider,
                type: PSEUDO_COMPONENT,
            },
        ]
    },
]
