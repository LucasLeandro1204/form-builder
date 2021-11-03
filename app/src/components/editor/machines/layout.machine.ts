// @ts-nocheck
import {nanoid} from "nanoid";
import {assign, createMachine, interpret, send, sendParent} from 'xstate';
import {COLUMN, COMPONENT_PLACEHOLDER, ROW} from "@/constants/index.ts";
import {layout, RowLevel} from "@/components/editor/data/layout.components";
import {removeDuplicates} from '@/mixins';

interface LayoutContext {
    layout: Array<RowLevel>;
}

const createRowColumnComponentPlaceholder = (context, _event) => ({
    id: 999, // context.invocationId
    type: ROW,
    children: [
        {...createColumnComponentPlaceholder(context, _event)}
    ]
})

const createColumnComponentPlaceholder = (context, _event) => ({
    id: 999, // context.invocationId
    type: COLUMN,
    children: [
        {...createComponentPlaceholder(context, _event)}
    ]
})

const createComponentPlaceholder = (context, _event) => ({
    id: 999, // context.invocationId
    type: COMPONENT_PLACEHOLDER,
    as: 'LayoutComponentPlaceholder',
})


/**
 * Use {context.path} to insert {context.element}
 *
 * @param context
 * @param event
 */
const insertElementAtPosition = (context, event) => {
    console.log('insertElementAtPosition - event', event)
    return new Promise((resolve) => {
        const {layout, path} = context
        const layoutDataset = [...layout]
        if (path && path.length) {
            const [row, column, component] = path
            switch (path.length) {
                case 1:
                    layoutDataset.splice(row, 0, createRowColumnComponentPlaceholder())
                    break;
                case 2:
                    layoutDataset?.[row]?.children.splice(column, 0, createColumnComponentPlaceholder())
                    break;
                case 3:
                    layoutDataset?.[row]?.children[column]?.children.splice(component, 0, createComponentPlaceholder())
                    break;
            }
        }
        resolve(layoutDataset)
    })
}

const removeComponent = (context, event) => {
    return new Promise((resolve, reject) => {
            const invocationId = event.invocationId
            let layoutDataset = [...context.layout]

            // 1. Filter all rows that are created by a new component
            // 2. Filter all columns that are created by a new component
            // 3. Filter all new components
            layoutDataset = layoutDataset
                .filter(row => row.id !== (999 || invocationId))

            // Filter all columns that are created by a new component
            layoutDataset = layoutDataset
                .map(row => ({
                    ...row,
                    children: row.children
                        .filter(column => column.id !== (999 || invocationId))
                }))

            // Filter all new components
            layoutDataset = layoutDataset
                .map(row => ({
                    ...row,
                    children: row.children
                        .map(column => ({
                            ...column,
                            children: column.children
                                .filter(component => component.id !== (999 || invocationId))
                        }))
                }))


            const cleanedDataset = removeDuplicates(layoutDataset, ({id}) => id)
            console.log(cleanedDataset)
            resolve(cleanedDataset)
        }
    )
}

export const layoutMachine = createMachine<LayoutContext>(
    {
        id: 'layoutMachine',
        initial: 'initial',
        context: {
            layout: layout,
            // will be inherited from intersection-event
            path: null,
            closestElement: null,
            typeofElement: null,
            itemBeingHeld: null,
            invocationId: null,
            originalEvent: null,
        },
        states: {
            initial: {
                id: 'initial',
                on: {
                    INTERSECTED: {
                        actions: 'assignIntersectionEventToContext',
                        target: 'updating',
                    },
                },
            },
            updating: {
                initial: 'preparing',
                states: {
                    preparing: {
                        always: [
                            {
                                target: 'removing',
                                cond: 'elementAlreadyExists',
                            },
                            {
                                target: 'inserting',
                            },
                        ]
                    },
                    removing: {
                        invoke: {
                            id: 'removing',
                            src: (context, event) => removeComponent(context, event),
                            data: {
                                id: (_ctx, event) => event.invocationId,
                            },
                            onDone: {
                                target: 'inserting',
                                actions: assign({
                                    layout: (context, event) => [...new Set([...event.data])],
                                }),
                            },
                        },
                    },
                    inserting: {
                        invoke: {
                            id: "inserting",
                            src: (context, event) => insertElementAtPosition(context, event),
                            onDone: {
                                target: 'resolved',
                                actions: assign({
                                    layout: (context, event) => event.data
                                }),
                            },
                        },
                    },
                    resolved: {
                        type: 'final',
                    },
                },
                onDone: 'finished',
            },
            finished: {
                after: {
                    0: {
                        target: '#initial'
                    }
                }
            },
        },
    },
    {
        actions: {

            hydrateLayout: assign({
                layout: (context) =>
                    context.layout.map((row) => ({
                        ...row,
                        children: row.children.map((column) => ({
                            ...column,
                            children: column.children.map((component) => ({...component})),
                        })),
                    })),
            }),

            assignIntersectionEventToContext: assign((context, event) => {
                context.path = event.path
                context.dragging = event.dragging
                context.typeofElement = event.typeofElement
                context.closestElement = event.closestElement
                context.invocationId = event.invocationId
                context.originalEvent = event.originalEvent
            }),
        },
        guards: {

            draggingInside: (_context, event) => event.dragging === 'inside',

            draggingOutside: (context, event) => event.dragging === 'outside',

            canDrop: (context, _event) => context.path && context.path.length,

            elementAlreadyExists: (context, _event) =>
                context.layout.some((row) =>
                    row.children.some((column) =>
                        column.children.some(
                            (component) => component.type === COMPONENT_PLACEHOLDER
                        )
                    )
                ),
        },
    }
);