// @ts-nocheck
import {assign, createMachine, send, spawn} from 'xstate';
import {sidebarMachine} from "./sidebar.machine";
import {layoutMachine} from "./layout.machine";

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
                    master: {},
                    external: {
                        on: {
                            INTERSECTED: {
                                actions: send((context, event) => event,
                                    {to: context => context.layout.ref}),
                            },
                            DROPPED: {
                                actions: send((context, event) => event,
                                    {to: context => context.layout.ref}),
                            },
                        }
                    }
                },
            },
        },
    }
);

