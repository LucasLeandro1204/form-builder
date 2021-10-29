// @ts-nocheck
import {createMachine, assign, spawn, actions, send} from 'xstate'
import {sidebarElements as components} from "../data/sidebarElements";
import {sidebarElementMachine} from "@/components/editor/machines/sidebarElementMachine";

export const sidebarMachine = createMachine({
    id: 'sidebar',
    initial: "loading",
    context: {
        components,
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
                    on: {},
                }
            }
        },
    },
})
