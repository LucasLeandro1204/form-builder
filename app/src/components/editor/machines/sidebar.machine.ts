// @ts-nocheck
import {createMachine, assign, spawn, send, sendParent} from 'xstate'
import {sidebarElements as components, sidebarElements as Components} from "../data/sidebar.elements";
import {IntersectionEvent, sidebarElementMachine} from "@/components/editor/machines/sidebar.element.machine";

export const sidebarMachine = createMachine({
    id: 'sidebar',
    initial: "loading",
    context: {
        components: components,
    },
    states: {
        loading: {
            always: 'ready',
            entry: assign({
                components: (context) => context.components.map((component) => ({
                    ...component,
                    elements: component.elements.map(element => ({
                        ...element,
                        ref: spawn(sidebarElementMachine)
                    }))
                }))
            })
        },
        ready: {
            type: 'parallel',
            states: {
                master: {},
                external: {
                    on: {
                        INTERSECTED: {
                            actions: sendParent((context, event: IntersectionEvent) => event)
                        },
                        DROPPED: {
                            actions: [
                                (ctx, evt) => console.log('dropped'),
                                sendParent((context, event: IntersectionEvent) => event),
                            ]
                        },
                    },
                }
            }
        },
    },
})
