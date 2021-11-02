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

const createRowElement = () => ({
    id: nanoid(),
    type: ROW,
    children: [{
        id: nanoid(),
        type: COLUMN,
        children: [
            {...createComponentElement()}
        ]
    }]
})

const createColumnElement = () => ({
    id: nanoid(),
    type: COLUMN,
    children: [
        {...createComponentElement()}
    ]
})

const createComponentElement = () => ({
    id: 999,
    type: PSEUDO_COMPONENT,
    as: 'PseudoLayoutComponent',
})

const insertElementAtPosition = (context, event) => {
    return new Promise((resolve) => {
        const {layout} = context
        const {path} = event
        if ((!path || (path && !path.length))) resolve(context.layout)
        const [row, column, component] = path
        switch (path.length) {
            case 1:
                layout.splice(row, 0, createRowElement())
                break;
            case 2:
                layout[row].children.splice(column, 0, createColumnElement())
                break;
            case 3:
                layout[row].children[column].children.splice(component, 0, createComponentElement())
                break;
            default:
                layout.push(createRowElement())
        }
        resolve(layout)
    })
}

const removePseudoElement = (context, event) => {
    return new Promise((resolve, reject) => {
        const _layout = context.layout.map(row => ({
                ...row,
                children: row.children.map(column => ({
                    ...column,
                    children: column.children.filter(component => {
                            console.log(component, component.id === 999)
                            return component.id !== 999
                        }
                    )
                }))
            }
        ))
        console.log(_layout)
        resolve(_layout)
    })
}

const getDropPositionData = (context, data = {}) => {
    context.layout.forEach((row, rowIndex) => {
        if ((!row.children || (row.children && !row.children.length))) {
            Object.assign(data, {
                parentPath: `layout`,
                childIndex: rowIndex
            })
        }
        row.children.forEach((column, columnIndex) => {
            if ((!column.children || (column.children && !column.children.length))) {
                Object.assign(data, {
                    parentPath: `layout[${rowIndex}].children`,
                    childIndex: columnIndex
                })
            }
        })
    })
    return data;
}

const findExactElementPath = (context) => {
    let unsetPath = ``
    context.layout.forEach((row, rowIndex) => {
        if ((!row.children || (row.children && !row.children.length))) {
            return unsetPath = `layout[${rowIndex}]`
        }
        row.children.forEach((column, columnIndex) => {
            if ((!column.children || (column.children && !column.children.length))) {
                return unsetPath = `layout[${rowIndex}].children[${columnIndex}]`
            }
        })
    })
    return unsetPath;
}

const rect = (el: any) => el.getBoundingClientRect();

const center = (el: any) => {
    const elRect = rect(el);
    return [elRect.left + elRect.width / 2, elRect.top + elRect.height / 2];
};

export const layoutMachine = createMachine<LayoutContext>(
    {
        id: 'layoutMachine',
        initial: 'initial',
        context: {
            layout: layout,
            initialLayout: null,
            // will be inherited from intersection-event
            // path: null,
            // closestElement: null,
            // typeofElement: null,
            // invocationId: null,
            // originalEvent: null,
        },
        states: {
            initial: {
                id: 'initial',
                on: {
                    INTERSECTED: [
                        {
                            cond: 'initialLayoutIsNull',
                            actions: 'setInitialLayout',
                        },
                        {
                            entry: 'inheritIntersectionEventAsContext',
                            target: 'updating',
                            actions: (ctx, evt) => {
                                console.log('intersected')
                            }
                        },
                    ]
                },
            },
            updating: {
                initial: 'preparing',
                states: {
                    preparing: {
                        entry: 'inheritIntersectionEventAsContext',
                        always: [
                            {
                                target: 'removing',
                                cond: 'elementAlreadyAdded',
                                actions: (_ctx, _evt) => console.log('choose removing', _ctx, _evt)
                            },
                            {
                                target: 'inserting',
                                actions: (_ctx, _evt) => console.log('choose inserting', _ctx, _evt)
                            },
                        ]
                    },
                    removing: {
                        entry: (_ctx, _evt) => console.log('entry removing', _ctx, _evt),
                        invoke: {
                            id: 'removing',
                            src: (context, event) => removePseudoElement(context, event),
                            onDone: {
                                target: 'preparing',
                                // entry: assign({
                                //     layout: (context, event) => event.data,
                                // }),
                                actions: [
                                    (_ctx, _evt) => console.log('removing.actions.onDone', _ctx, _evt),
                                    assign({
                                        layout: (context, event) => event.data,
                                    })
                                ],
                            },
                            onError: {
                                actions: [
                                    (_ctx, _evt) => console.log('removing.actions.onError', _ctx, _evt),
                                ]
                            },
                        },
                        exit: (_ctx, _evt) => console.log('exit removing', _ctx, _evt),
                    },
                    inserting: {
                        entry: (context, event) => {
                            console.log('entry inserting', context, event)
                        },
                        invoke: {
                            id: "inserting",
                            src: (context, event) => insertElementAtPosition(context, event),
                            onDone: {
                                target: 'resolved',
                                actions: [(context, event) => console.log('inserting.actions.onDone', context, event), assign({
                                    layout: (context, event) => event.data,
                                })],
                            },
                            onError: {
                                actions: (_ctx, _evt) => console.log('removing.actions.onError', _ctx, _evt),
                            },
                        },
                        exit: (_ctx, _evt) => console.log('exit inserting', _ctx, _evt)
                    },
                    resolved: {
                        type: 'final',
                    },
                },
                onDone: 'finished',
            },
            finished: {
                after: {
                    200: {
                        target: '#initial'
                    }
                }
            },
        },
    },
    {
        actions: {
            setInitialLayout: assign({
                initialLayout: (context, event) => context.layout,
            }),

            finishUpdate: assign((context, event) => {
                const {parentPath, childIndex} = getDropPositionData(context);
                // >> Console Logs
                console.log(
                    "context",
                    context.layout,
                    "parentPath",
                    parentPath,
                    "childIndex",
                    childIndex
                );
                // << Console Logs
            }),

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

            inheritIntersectionEventAsContext: assign((context, event) => {
                // Object.keys(event).forEach((key) => (context[key] = event[key]))
                const {path, dragging, typeofElement, closestElement, invocationId, originalEvent} = event
                context.path = path
                context.dragging = dragging
                context.typeofElement = typeofElement
                context.closestElement = closestElement
                context.invocationId = invocationId
                context.originalEvent = originalEvent
            }),

        },
        guards: {
            initialLayoutIsNull: (context, event) => {
                return isNull(context.initialLayout)
            },

            intersectedInside: (context, event) => {
                console.log(event.dragging === 'inside')
                return context.dragging === 'inside'
            },

            intersectedOutside: (context, event) => {
                return context.dragging === 'outside'
            },

            canDrop: (context, _event) => (context.path && context.path.length),

            closestElementNotNull: (context, event) => (event.closestElement),

            needsCleanup: (context, event) =>
                (context.dragging === 'outside' ||
                    (context.dragging === 'inside' &&
                        context.layout.some((row) =>
                            row.children.some((column) =>
                                column.children.some((component) => component.type === PSEUDO_COMPONENT))
                        ))),

            elementAlreadyAdded: (context, _event) =>
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