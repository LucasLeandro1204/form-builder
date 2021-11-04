// @ts-nocheck
import {assign, createMachine} from 'xstate';
import {COLUMN, COMPONENT_PLACEHOLDER, ROW} from "@/constants/index.ts";
import {layout, RowLevel} from "@/components/editor/data/layout.components";

interface LayoutContext {
    layout: Array<RowLevel>;
}

const createRowColumnComponentPlaceholder = (context) => {
    return {
        id: context.invocationId,
        type: ROW,
        children: [
            {...createColumnComponentPlaceholder(context)}
        ]
    }
}

const createColumnComponentPlaceholder = (context) => {
    return {
        id: context.invocationId,
        type: COLUMN,
        children: [
            {...createComponentPlaceholder(context)}
        ]
    }
}

const createComponentPlaceholder = (context) => {
    return {
        id: context.invocationId,
        type: COMPONENT_PLACEHOLDER,
        as: 'LayoutComponentPlaceholder',
    }
}

/**
 * Use {context} to insert {element} at {position}
 *
 * @param context
 * @param event
 */
const insertElementAtPosition = (context, event) => {
    return new Promise((resolve) => {
        const {layout, position} = context
        const layoutDataset = [...layout]
        if (position && position.length) {
            const [row, column, component] = position
            switch (position.length) {
                case 1:
                    layoutDataset.splice(row, 0, createRowColumnComponentPlaceholder(context))
                    break;
                case 2:
                    layoutDataset?.[row]?.children.splice(column, 0, createColumnComponentPlaceholder(context))
                    break;
                case 3:
                    layoutDataset?.[row]?.children[column]?.children.splice(component, 0, createComponentPlaceholder(context))
                    break;
            }
        }
        resolve(layoutDataset)
    })
}

/**
 * Use {context} to remove {component} from {layout} by {id}
 *
 * 1. Remove rows that are created by the placeholder
 * 2. Remove columns that are created by the placeholder
 * 3. Remove the placeholder
 *
 * @param context
 * @param _event
 */
const removeComponent = (context, _event) => {
    return new Promise(resolve => {
        resolve(
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
        )
    })
}

/**
 * Layout Machine
 */
export const layoutMachine = createMachine<LayoutContext>(
    {
        id: 'layoutMachine',
        initial: 'idle',
        context: {
            layout: layout,
        },
        states: {
            idle: {
                on: {
                    INTERSECTED: {
                        actions: 'assignIntersectionEventToContext',
                        target: 'updating',
                    },
                    DROPPED: {
                        actions: 'assignIntersectionEventToContext',
                        target: 'dropped',
                    }
                },
            },
            dropped: {
                actions: [
                    (ctx, evt) => {
                        console.log('DROPPED -', evt.type, ctx, evt)
                    },
                ]
            },
            updating: {
                initial: 'preparing',
                states: {
                    preparing: {
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
                            id: 'removing',
                            src: (context, event) =>
                                removeComponent(context, event),
                            onDone: {
                                target: 'inserting',
                                actions: 'assignLayout',
                            },
                        },
                    },
                    inserting: {
                        invoke: {
                            id: "inserting",
                            src: (context, event) =>
                                insertElementAtPosition(context, event),
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
                onDone: 'delayedReset',
            },
            delayedReset: {
                after: {
                    100: {
                        target: 'idle'
                    }
                }
            },
        },
    },
    {
        actions: {
            assignLayout: assign({
                layout: (context, event) => event.data,
            }),
            hydrateLayout: assign({
                layout: (context) =>
                    context.layout.map(row => ({
                        ...row,
                        children: row.children
                            .map(column => ({
                                ...column,
                                children: column.children
                                    .map(component => ({
                                        ...component
                                    })),
                            })),
                    })),
            }),
            assignIntersectionEventToContext: assign((context, event) => {
                    context.position = event.position
                    context.dragging = event.dragging
                    context.pickedUpElement = event.pickedUpElement
                    context.component = event.component
                    context.originalEvent = event.originalEvent
                    context.invocationId = event.invocationId
                }),
        },
        guards: {
            draggingInside: (_context, event) => (event.dragging === 'inside'),
            draggingOutside: (context, event) => (event.dragging === 'outside'),
            canDrop: (context, _event) => (context?.position?.length),
            alreadyInserted: (context, _event) =>
                context.layout.some(row =>
                    row.children.some(column =>
                        column.children.some(component =>
                            component.id === context.invocationId))
                ),
        },
    }
);