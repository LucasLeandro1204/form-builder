// @ts-nocheck
import {assign, createMachine, send, cancel} from 'xstate';
import {COLUMN, COMPONENT, COMPONENT_PLACEHOLDER, ROW} from "@/constants/index.ts";
import {layout, RowLevel} from "@/components/editor/data/layout.components";
import {translateComponentName, translateComponentType} from "@/mixins/utils/translateComponentName";
import {capitalize} from "lodash";
import {nanoid} from "nanoid";

import {drawPoint} from '@/mixins'

interface LayoutContext {
    layout: Array<RowLevel>;
    clientPosition: Object<{ x: number, y: number }>
}

const invokeMap = (map: object) =>
    Object.keys(Object.fromEntries(Object.entries(map)
        .filter(([_key, value]) => value)))

const elRect = (el) => el.getBoundingClientRect()

const elRectCenter = (el) => {
    const rect = elRect(el)
    return [rect.left + rect.width / 2, rect.top + rect.height / 2]
}

const createRow = (context) => ({
    id: context.invocationId,
    type: ROW,
    children: [{
        ...createColumn(context)
    }]
})

const createColumn = (context) => ({
    id: context.invocationId,
    type: COLUMN,
    children: [{
        ...createPlaceholder(context)
    }]
})

const createPlaceholder = (context) => ({
    id: context.invocationId,
    type: COMPONENT_PLACEHOLDER,
    as: 'LayoutPlaceholder',
})

const componentFactory = (_context, event) => {
    const {element} = event
    const type = element.getAttribute('data-type')
    return {
        type: COMPONENT,
        id: nanoid(),
        as: translateComponentName(type),
        inputType: translateComponentType(type),
        label: capitalize(type),
    }
}

export const layoutMachine = createMachine<LayoutContext>({
        id: 'layoutMachine',
        initial: 'ready',
        context: {
            layout,
            delay: 0,
        },
        on: {
            'DELAY.UPDATE': {
                actions: 'updateDelayDuration'
            },
            DROPPED: {
                actions: 'assignEventToPrivateContext',
                target: 'dropped',
            },
        },
        states: {
            ready: {
                on: {
                    INTERSECTED: [
                        {
                            target: 'updating',
                            actions: [
                                'assignEventToPrivateContext',
                                'drawPoint'
                            ],
                        },
                    ],
                }
            },
            updating: {
                initial: 'evaluating',
                states: {
                    evaluating: {
                        always: [
                            {
                                target: 'removing',
                                cond: 'alreadyInserted',
                            },
                            {
                                target: 'inserting',
                            },
                        ]
                    },
                    removing: {
                        invoke: {
                            id: 'remove',
                            src: 'removeComponentById',
                            onDone: {
                                target: 'inserting',
                                actions: 'assignLayout',
                            },
                        },
                    },
                    inserting: {
                        invoke: {
                            id: 'insert',
                            src: 'insertComponentAtPosition',
                            onDone: {
                                target: 'finished',
                                actions: 'assignLayout',
                            },
                        },
                    },
                    finished: {
                        type: 'final',
                    },
                },
                onDone: 'resetting',
            },
            dropped: {
                invoke: {
                    id: 'drop',
                    src: 'commitComponentAtPosition',
                    onDone: {
                        actions: 'assignLayout',
                        target: 'resetting',
                    },
                },
            },
            resetting: {
                after: {
                    RESET_DELAY: {
                        target: 'ready'
                    }
                }
            },
        },
    },
    {
        delays: {
            RESET_DELAY: (context) => context.delay * 1
        },
        guards: {
            dropAllowed: (context, _event) => (context?.position?.length),
            alreadyInserted: (context, _event) => context.layout.some(row =>
                row.children.some(column => column.children.some(component =>
                    component.id === context.invocationId))),
        },
        actions: {
            drawPoint: (context, _event) => {
                console.log(context)
                const point = document.createElement('div')
                const color = '#FFFFFF'
                const text = '!'
                const pointSize = '1em'
                point.style.position = 'absolute'
                point.style.left = `${context.clientX}px`
                point.style.top = `${context.clientY}px`
                point.style.width = pointSize
                point.style.height = pointSize
                point.style.zIndex = '9999'
                point.style.borderRadius = '50%'
                point.style.backgroundColor = `${color}`
                point.style.transform = 'scale(0)'
                point.style.transition = 'all ease 320ms'
                point.textContent = text
                point.classList.add('point')
                document.body.appendChild(point)
                setTimeout(() =>
                    point.style.transform = 'scale(1)', 0)
                setTimeout(() => {
                    point.style.transform = 'scale(0)'
                    setTimeout(() =>
                        document.body.removeChild(point), 300)
                }, 1500)
            },
            updateDelayDuration: assign({
                delay: (_context, event) => event.value
            }),
            assignEventToPrivateContext: assign((context, event) => {
                Object.keys(event).forEach((key) => context[key] = event[key])
            }),
            assignLayout: assign({
                layout: (context, event) => event.data,
            }),
            hydrateLayout: assign({
                layout: (context) =>
                    context.layout.map(row => ({
                        ...row,
                        children: row.children.map(column => ({
                            ...column,
                            children: column.children.map(component => ({
                                ...component
                            })),
                        })),
                    })),
            }),
        },
        services: {
            insertComponentAtPosition: (context, _event) => new Promise((resolve) => {
                const {layout, position, clientX, clientY} = context
                const layoutDataset = [...layout]
                const [centerX, centerY] = elRectCenter(context.component)
                const [intersectedX, intersectedY] = invokeMap({
                    'right': Boolean(clientX > centerX),
                    'left': Boolean(clientX < centerX),
                    'top': Boolean(clientY < centerY),
                    'bottom': Boolean(clientY > centerY),
                })
                const [row, column, component] = position
                let insertAt: number, insertElement: object
                switch (position.length) {
                    case 1:
                        insertAt = intersectedY === 'bottom' ? (row + 1) : row
                        insertElement = createRow(context)
                        layoutDataset.splice(insertAt, 0, insertElement)
                        break;
                    case 2:
                        insertAt = intersectedX === 'right' ? (column + 1) : column
                        insertElement = createColumn(context)
                        layoutDataset?.[row]?.children.splice(insertAt, 0, insertElement)
                        break;
                    case 3:
                        insertAt = intersectedY === 'bottom' ? (component + 1) : component
                        insertElement = createPlaceholder(context)
                        layoutDataset?.[row]?.children[column]?.children.splice(insertAt, 0, insertElement)
                        break;
                }
                resolve(layoutDataset)
            }),
            commitComponentAtPosition: (context, event) => new Promise(resolve => resolve(
                [...context.layout]
                    .map(row => ({
                        ...row,
                        id: row.id === context.invocationId
                            ? nanoid()
                            : row.id
                    }))
                    .map(row => ({
                        ...row,
                        children: row.children.map(column => ({
                            ...column,
                            children: column.children.map(component => ({
                                ...componentFactory(context, event),
                                id: component.id === context.invocationId
                                    ? nanoid()
                                    : component.id
                            }))
                        }))
                    }))
            )),
            removeComponentById: (context, _event) => new Promise(resolve => resolve(
                [...context.layout]
                    .filter(row => row.id !== context.invocationId)
                    .map(row => ({
                        ...row,
                        children: row.children
                            .filter(column => column.id !== context.invocationId)
                    }))
                    .map(row => ({
                        ...row,
                        children: row.children
                            .map(column => ({
                                ...column,
                                children: column.children
                                    .filter(component => component.id !== context.invocationId)
                            }))
                    }))
            )),
        },
    }
);
