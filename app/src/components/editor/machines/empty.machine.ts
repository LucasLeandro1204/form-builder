//@ts-nocheck
import {assign, createMachine} from "xstate";

const createRemovePromise = (context, event) => new Promise(resolve => {
    console.log('createRemovePromise init', context, event)
    resolve(true)
})

const createAppendPromise = (context, event) => new Promise(resolve => {
    console.log('createAppendPromise init', context, event)
    resolve(true)
})

export const emptyMachine = createMachine({
    id: 'empty-machine',
    initial: 'loading',
    context: {},
    states: {
        loading: {
            target: 'ready'
        },
        ready: {},
    }
}, {
    actions: {},
    guards: {},
})