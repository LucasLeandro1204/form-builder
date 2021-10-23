import {createMachine, actions, assign} from "xstate";

const {cancel} = actions

export const testMachine = createMachine({
    id: 'test-machine',
    states: {
        filtering: {
            on: {
                APPLY_FILTER: {
                    target: 'filtered',
                    actions: assign({
                        filter: (_context, {filter}) => filter
                    }),
                },
            },
        },
        filtered: {},
    },
    on: {
        FILTER: {
            target: 'filtering',
            actions: [
                cancel('debounce-filter'),
                send((context, {filter}) => ({
                        type: 'APPLY_FILTER',
                        filter,
                    }), {
                        delay: 300,
                        id: 'debounce-filter',
                    }
                ),
            ],
        },
    },
})
// itemsService: (context, event) => (cb, onReceive) => {
//     onReceive((event) => {
//         console.log('event')
//         if (event.type === '') {
//
//         }
//     })
// },