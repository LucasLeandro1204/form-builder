import {createMachine, actions} from 'xstate';
import {draggableHandlerMachine} from "@/components/draggable/draggable.handler.machine";

interface Context {
    element: HTMLElement | any;
    pointerId: number;
    startX: number;
    startY: number;
}

interface DraggableObserverContext {
    startX: number;
    startY: number;
}

type DraggableObserverEvent = PointerEvent;

type DraggableObserverState  =
    | { value: "idle"; context: Context }
    | { value: "dragging"; context: Context };

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

export const draggableObserverMachine = createMachine<DraggableObserverContext, DraggableObserverEvent, DraggableObserverState>(
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
                    src: draggableHandlerMachine,
                    data: dragData,
                    onDone: 'idle',
                },
                on: {
                    DELEGATE_POINTER_EVENTS: {
                        actions: [
                            actions.sendParent(
                                (context, event) =>
                                    sendEvent('DELEGATE_POINTER_EVENTS', context, event)),
                        ]
                    },
                    DROPPED: {
                        actions: [
                            actions.sendParent(
                                (context, event) =>
                                    sendEvent('DROPPED', context, event)),
                        ]
                    },
                },
            },
        },
    },
);