import {createMachine, actions} from 'xstate';
import {dragMachine} from "@/components/editor/machines/drag.machine";

interface SidebarContext {
    element: HTMLElement | any;
    pointerId: number;
    startX: number;
    startY: number;
}

type SidebarElementEvent = {
    type: string;
    originalEvent: object;
    originalContext: object;
}

/*

interface SidebarElementContext {
    startX: number;
    startY: number;
}

type SidebarElementState =
    | { value: "idle"; context: SidebarContext }
    | { value: "dragging"; context: SidebarContext }
    | { value: "dropped"; context: SidebarContext };
*/

const dragData = (_: unknown, event: PointerEvent) => ({
    element: event.target as HTMLElement,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
})

const sendEvent = (type: string, context: object, event: any) => ({
    type: type,
    originalEvent: event,
    originalContext: context
})

// @ts-ignore
export const sidebarElementMachine = createMachine(
    {
        id: "drag-observer",
        initial: "idle",
        context: {
            startX: 0,
            startY: 0,
        },
        states: {
            idle: {
                on: {
                    pointerdown: "dragging",
                },
            },
            dragging: {
                invoke: {
                    id: "pointerCapture",
                    src: dragMachine,
                    data: dragData,
                    onDone: 'idle',
                },
                // @ts-ignore
                on: {
                    DELEGATE_POINTER_EVENT: {
                        actions: [actions.sendParent((context: SidebarContext, event: SidebarElementEvent) =>
                            sendEvent('DELEGATE_POINTER_EVENT', context, event))]
                    },
                    DROPPED: {
                        target: 'dropped',
                    },
                },
            },
            dropped: {
                // @ts-ignore
                actions: [actions.sendParent((context: SidebarContext, event: SidebarElementEvent) =>
                    sendEvent('DROPPED', context, event))],
                after: {
                    500: 'idle'
                },
            }
        },
    },
);
