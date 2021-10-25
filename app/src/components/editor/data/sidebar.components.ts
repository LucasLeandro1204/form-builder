import {icons} from '@/mixins/icons'

const {
    attachments, checklist, date, datetime, dropdown, image,
    multiline, numbers, sections, singleline, slider, table,
    switchOutline
} = icons

type Element = {
    text: string;
    as: string;
    icon: URL;
}

interface SidebarComponents {
    legend: string;
    type: string;
    elements: Array<Element>
}

export const sidebarComponents: Array<SidebarComponents> = [
    {
        legend: 'layout elements',
        type: 'layout',
        elements: [
            {
                text: 'section',
                as: 'section',
                icon: sections,
            },
            {
                text: 'table',
                as: 'table',
                icon: table,
            },
        ]
    },
    {
        legend: 'text elements',
        type: 'text',
        elements: [
            {
                text: 'single line',
                as: 'single line',
                icon: singleline,
            },
            {
                text: 'multiline',
                as: 'multiline',
                icon: multiline,
            },
            {
                text: 'number',
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
                text: 'date',
                icon: date,
                as: 'date',
            },
            {
                text: 'date & time',
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
                text: 'yes / no',
                icon: switchOutline,
            },
            {
                as: 'dropdown',
                text: 'dropdown',
                icon: dropdown,
            },
            {
                as: 'checkbox',
                text: 'checkbox',
                icon: checklist,
            },
            {
                as: 'checklist',
                text: 'checklist',
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
                text: 'attachments',
                icon: attachments,
            },
            {
                as: 'image',
                text: 'image',
                icon: image,
            },
            {
                as: 'slider',
                text: 'slider',
                icon: slider,
            },
        ]
    },
]
