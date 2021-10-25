import {assign, createMachine, send, spawn} from 'xstate';
import {sidebarMachine} from "./sidebar.machine";
import {layoutMachine} from "./layout.machine";

interface AppContext {
    sidebar: object;
    layout: object;
}

const delegatePointerConfig = {
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
                            // @ts-ignore
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
                        // @ts-ignore
                        ...context.sidebar,
                        ref: spawn(sidebarMachine)
                    }),
                    layout: (context) => ({
                        // @ts-ignore
                        ...context.layout,
                        ref: spawn(layoutMachine)
                    })
                })
            },
            ready: {
                type: 'parallel',
                states: {
                    internal: {},
                    external: {
                        ...delegatePointerConfig
                    }
                },
            },
        },
    }
);

