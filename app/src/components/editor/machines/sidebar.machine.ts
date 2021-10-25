import {createMachine, assign, spawn, actions, send} from 'xstate'
import {sidebarComponents as components} from "../data/sidebar.components";
import {sidebarElementMachine} from "./sidebar.element.machine";

interface Components {
    elements: Array<object>
}

interface SidebarContext {
    components: Array<Components>
}

type InitialContext = SidebarContext & {
    components: Components[];
}

type LoadingContext = SidebarContext & {
    components: Components[];
}

type ReadyContext = SidebarContext & {
    components: Array<Components>
}

type InitialState = { value: 'loading'; context: InitialContext };
type LoadingState = { value: 'loading'; context: LoadingContext };
type ReadyState = { value: 'ready'; context: ReadyContext };

type SidebarState =
    | InitialState
    | LoadingState
    | ReadyState;

const pointerConfig = {
    initial: 'active',
    states: {
        active: {
            on: {
                DELEGATE_POINTER_EVENT: {
                    actions: [
                        actions.sendParent((context, event) => ({
                            type: "DELEGATE_POINTER_EVENT",
                            originalEvent: event,
                            originalContext: context
                        }))
                    ],
                }
            },
        },
    }
}

// @ts-ignore
export const sidebarMachine = createMachine<SidebarContext, SidebarState>({
    id: 'sidebar',
    initial: "loading",
    context: {
        components,
    },
    states: {
        loading: {
            always: 'ready',
            entry: assign({
                components: (context: SidebarContext) => context.components.map((component) => ({
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
                internal: {},
                external: {
                    ...pointerConfig
                }
            }
        },
    },
})
