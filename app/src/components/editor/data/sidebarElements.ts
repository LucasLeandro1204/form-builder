import {icons} from '@/mixins/icons'

const {
    attachments, checklist, date, datetime, dropdown, image,
    multiline, numbers, sections, singleline, slider, table,
    switchOutline
} = icons

type Element = {
    as: string;
    label: string;
    icon: URL;
}

interface SidebarElements {
    legend: string;
    type: string;
    elements: Array<Element>
}

export const sidebarElements: Array<SidebarElements> = [
    {
        legend: 'layout elements',
        type: 'layout',
        elements: [
            {
                as: 'section',
                label: 'section',
                icon: sections,
            },
            {
                as: 'table',
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
                icon: singleline,
            },
            {
                label: 'multiline',
                as: 'multiline',
                icon: multiline,
            },
            {
                label: 'number',
                as: 'single line',
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
            },
            {
                label: 'date & time',
                icon: datetime,
                as: 'datetime',

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
            },
            {
                as: 'dropdown',
                label: 'dropdown',
                icon: dropdown,
            },
            {
                as: 'checkbox',
                label: 'checkbox',
                icon: checklist,
            },
            {
                as: 'checklist',
                label: 'checklist',
                icon: checklist,
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
            },
            {
                as: 'image',
                label: 'image',
                icon: image,
            },
            {
                as: 'slider',
                label: 'slider',
                icon: slider,
            },
        ]
    },
]
