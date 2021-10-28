// @ts-nocheck
import {assign, createMachine, send, spawn} from 'xstate';
import {sidebarMachine} from "./sidebar.machine";
import {layoutMachine} from "./layout.machine";

const pointerPipe = {
    initial: 'active',
    states: {
        active: {
            on: {
                DELEGATE_POINTER_EVENT: {
                    actions: [
                        send((context, event) => ({
                            type: "DELEGATE_POINTER_EVENT",
                            originalContext: context,
                            originalEvent: event,
                        }), {to: context => context.layout.ref})
                    ],
                }
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
                entry: {
                    actions: [
                        (ctx, evt) => document.ondragstart = () => false
                    ]
                },
                states: {
                    internal: {},
                    external: {
                        ...pointerPipe
                    }
                },
            },
        },
    }
);

