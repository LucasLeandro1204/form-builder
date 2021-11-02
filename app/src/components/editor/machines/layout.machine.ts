// @ts-nocheck
import {nanoid} from "nanoid";
import {assign, createMachine, interpret, send, sendParent} from 'xstate';
import {COLUMN, PSEUDO_COMPONENT, ROW} from "@/constants/index.ts";
import {layout, RowLevel} from "@/components/editor/data/layout.components";
import {get, isArray, isEqual, isNull, set, unset} from "lodash";
import {mutationSequenceMachine} from "@/components/editor/machines/mutationSequenceMachine";

interface LayoutContext {
    layout: Array<RowLevel>;
}

const createComponentElement = () => ({
    id: 999,
    type: PSEUDO_COMPONENT,
    as: 'LayoutComponentPlaceholder',
})

const createColumnElement = () => ({
    id: nanoid(),
    type: COLUMN,
    children: [
        {...createComponentElement()}
    ]
})

const createRowElement = () => ({
    id: nanoid(),
    type: ROW,
    children: [
        {...createColumnElement()}
    ]
})

/**
 * Use {context.path} to insert {context.element}
 *
 * @param context
 * @param event
 */
const insertElementAtPosition = (context, event) => {
    return new Promise((resolve) => {
        const {layout, path} = context
        const [row, column, component] = path
        const depth = path.length
        switch (depth) {
            case 1:
                layout.splice(row, 1, createRowElement())
                break;
            case 2:
                layout[row].children.splice(column, 0, createColumnElement())
                break;
            case 3:
                layout[row].children[column].children.splice(component, 0, createComponentElement())
                break;
        }
        resolve(layout)
    })
}

const removeComponent = (context, event) => {
    return new Promise((resolve, reject) => resolve(
            context.layout.map(row => ({
                    ...row,
                    children: row.children.map(column => ({
                        ...column,
                        children: column.children.map(component =>
                            component.id !== 999
                        )
                    }))
                }
            ))
            // resolve(context.layout)
        )
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
                        cond: 'draggingInside',
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
                            onDone: {
                                target: 'preparing',
                                actions: [
                                    assign({
                                        layout: (context, event) => event.data,
                                    })
                                ],
                            },
                        },
                    },
                    inserting: {
                        invoke: {
                            id: "inserting",
                            src: (context, _event) => insertElementAtPosition(context),
                            onDone: {
                                target: 'resolved',
                                actions: assign({
                                    layout: (context, _event) => context.layout
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
                //
                console.log('inside or outside? ', context.dragging)
            }),
        },
        guards: {

            draggingInside: (_context, event) => event.dragging === 'inside',

            draggingOutside: (context, event) => event.dragging === 'outside',

            canDrop: (context, _event) => (context.path && context.path.length),

            elementAlreadyExists: (context, _event) =>
                context.layout.some((row) =>
                    row.children.some((column) =>
                        column.children.some(
                            (component) => component.type === PSEUDO_COMPONENT
                        )
                    )
                ),
        },
    }
);