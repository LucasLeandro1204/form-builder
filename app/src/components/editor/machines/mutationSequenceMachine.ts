//@ts-nocheck
import {assign, createMachine} from "xstate";
import {nanoid} from "nanoid";
import {COLUMN, COMPONENT_PLACEHOLDER, ROW} from "@/constants";


async function sequence(...promiseCreators) {
    for (const promiseCreator of promiseCreators) {
        await promiseCreator()
    }
    return
}

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