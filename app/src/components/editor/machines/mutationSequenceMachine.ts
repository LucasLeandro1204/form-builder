//@ts-nocheck
import {assign, createMachine} from "xstate";
import {nanoid} from "nanoid";
import {COLUMN, PSEUDO_COMPONENT, ROW} from "@/constants";


async function sequence(...promiseCreators) {
    for (const promiseCreator of promiseCreators) {
        await promiseCreator()
    }
    return
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
    as: 'LayoutComponent',
})

const insertElementAtPosition = (context, event) => {
    return new Promise((resolve) => {
        const {layout} = context
        const {path} = event
        if (((!path) || (path && !path.length))) {
            resolve(true)
        }
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
        }
        resolve(layout)
    })
}

const removeElementFromPosition = (context, event) =>
    context.layout.map(row => ({
            ...row,
            children: row.children.map(column => ({
                ...column,
                children: column.children.filter(component =>
                    component.type !== PSEUDO_COMPONENT)
            }))
        }
    ))


const createRemovePromise = (context, event) => new Promise(resolve => {
    console.log('createRemovePromise init', context, event)
    resolve(removeElementFromPosition(context, event))
})

const createAppendPromise = (context, event) => new Promise(resolve => {
    console.log('createAppendPromise init', context, event)
    resolve(insertElementAtPosition(context, event))
})

export const mutationSequenceMachine = createMachine({
    id: 'mutation-sequence-machine',
    initial: 'loading',
    context: {
        data: undefined,
        error: undefined,
    },
    states: {
        loading: {
            invoke: {
                id: 'startSequence',
                src: () => sequence(createRemovePromise, createAppendPromise),
                onDone: {
                    target: 'success',
                    actions: assign({
                        data: (_context, event) => event.data,
                    }),
                },
                onError: {
                    target: 'failure',
                    actions: assign({
                        data: (_context, _event) => undefined,
                        error: (_context, event) => event.data,
                    }),
                },
            },
        },
        success: {
            after: {
                500: 'finished',
            },
        },
        failure: {
            on: {
                RETRY: 'loading',
            },
        },
        finished: {
            type: 'final',
            actions: (ctx, evt) => console.log(ctx, evt)
        }

    }
}, {
    actions: {},
    guards: {},
})