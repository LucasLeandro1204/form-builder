// @ts-nocheck
import {createMachine, assign} from 'xstate';

import {randomInteger, wait} from '@/mixins'

const fetchData = async (URL: string) => {
    await wait(1000);
    return new Promise((resolve, reject) => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${randomInteger(1, 150)}?limit=1`)
            .then(response => response.json())
            .then(data => resolve(data))
            .catch(err => reject(err.response))
    })
}

const fetchMachine = createMachine({
    id: 'fetch',
    initial: 'initial',
    context: {
        data: undefined,
        error: undefined,
    },
    states: {
        initial: {
            on: {
                FETCH: 'loading',
            },
        },
        ready: {
            on: {
                FETCH: 'loading',
            },
        },
        loading: {
            entry: assign({
                data: (context, _event) => context.data || [],
                error: (_context, _event) => undefined,
            }),
            invoke: {
                id: 'getData',
                src: (_context, _event) => fetchData(),
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
                750: 'ready',
            },
        },
        failure: {
            on: {
                RETRY: 'loading',
            },
        },
    },
});

export default fetchMachine;
