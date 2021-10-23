import {icons} from '../../../mixins/icons'

const {
    attachments, checklist, date, datetime, dropdown, image,
    multiline, numbers, sections, singleline, slider, table,
    switchOutline
} = icons

export const sidebarComponents = [
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
                type: 'date',
                text: 'date',
                icon: date,
            },
            {
                type: 'datetime',
                text: 'date & time',
                icon: datetime,
            },
        ]
    },
    {
        legend: 'multi elements',
        type: 'multi',
        elements: [
            {
                type: 'switch',
                text: 'yes / no',
                icon: switchOutline,
            },
            {
                type: 'dropdown',
                text: 'dropdown',
                icon: dropdown,
            },
            {
                type: 'checkbox',
                text: 'checkbox',
                icon: checklist,
            },
            {
                type: 'checklist',
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
                type: 'attachment',
                text: 'attachments',
                icon: attachments,
            },
            {
                type: 'image',
                text: 'image',
                icon: image,
            },
            {
                type: 'slider',
                text: 'slider',
                icon: slider,
            },
        ]
    },
]
