import {createMachine, assign, spawn, actions} from 'xstate'
import {sidebarComponents as components} from "../data/sidebar.components";
import {draggableObserverMachine} from "../../draggable/draggable.observer.machine";

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
                        ref: spawn(draggableObserverMachine)
                    }))
                }))
            })
        },
        ready: {
            on: {
                pointermove: {
                    actions: [
                        () => console.log('pointermove - sidebar.machine'),
                        actions.sendParent((context, event) => ({
                            type: "pointermove",
                            originalEvent: event,
                            originalContext: context
                        }))
                    ],
                }
            },
        },
    },
})
