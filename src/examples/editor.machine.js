import {assign, createMachine} from 'xstate'

export const createEditorMachine = createMachine({
    id: 'editor-machine',
    initial: 'loading',
    states: {
        loading: {
            always: [
                {target: 'ready', cond: 'hasActiveSession'},
                {target: 'create'},
            ]
        },
        create: {
            entry: assign({
                name: '',
                description: '',
            }),
            exit: assign({
                name: undefined,
                description: undefined,
            }),
            on: {
                'NAME.COMMIT': {
                    actions: assign({name: (_, event) => event.value}),
                    internal: true,
                },
                'DESCRIPTION.COMMIT': {
                    actions: assign({description: (_, event) => event.value}),
                    internal: true,
                },
                START: {
                    target: 'ready',
                    cond: (context) => context.name.length > 2,
                },
            },
        },
        ready: {
            id: 'ready',
            initial: 'editing',
            states: {
                editing: {
                    on: {
                        SWITCH_TO_PREVIEW: {
                            target: 'viewing'
                        },
                    },
                },
                viewing: {
                    on: {
                        SWITCH_TO_EDITOR: {
                            target: 'editing'
                        }
                    }
                },
            },
        },
    },
}, {
    guards: {
        hasActiveSession: (ctx, evt) => true,
    },
})