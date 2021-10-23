import {assign, createMachine, send, spawn} from 'xstate';
import {sidebarMachine} from "./sidebar.machine";
import {layoutMachine} from "./layout.machine";

const pipelineMachineConfig = {
    initial: 'idle',
    states: {
        idle: {
            on: {
                pointerContext: {
                    target: 'dragging',
                }
            },
        },
        dragging: {
            on: {
                pointerContext: {
                    actions: [
                        () => console.log('pointerContext - app.machine'),
                        send((context, event) => ({
                            type: "pointerContext",
                            originalContext: context,
                            originalEvent: event,
                        }), {to: context => context.layout.ref})
                    ],
                },
            },
        },
    }
}

export const appMachine = createMachine({
        id: "app",
        initial: "loading",
        context: {
            sidebar: {},
            layout: {},
        },
        states: {
            loading: {
                always: 'ready',
                entry: assign({
                    sidebar: (context) => ({
                        ...context.sidebar,
                        ref: spawn(sidebarMachine)
                    }),
                    layout: (context) => ({
                        ...context.layout,
                        ref: spawn(layoutMachine)
                    })
                })
            },
            ready: {
                type: 'parallel',
                states: {
                    local: {
                        initial: 'idle',
                        states: {
                            idle: {
                                // local state
                            }
                        }
                    },
                    pipeline: {
                        ...pipelineMachineConfig
                    }
                },

            },
        },
    }
);

