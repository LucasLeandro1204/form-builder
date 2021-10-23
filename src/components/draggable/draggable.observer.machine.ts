import {createMachine, actions} from 'xstate';
import {draggableHandlerMachine} from "@/components/draggable/draggable.handler.machine";

interface Context {
    element: HTMLElement | any;
    pointerId: number;
    startX: number;
    startY: number;
}

interface ParentContext {
    startX: number;
    startY: number;
}

type ParentEvent = PointerEvent;

type ParentState =
    | { value: "idle"; context: Context }
    | { value: "dragging"; context: Context };

interface SendPipelineEvent {
    type: string,
    originalEvent: Event,
    originalContext: Object,
}

const dragData = (_: unknown, event: PointerEvent) => ({
    element: event.target as HTMLElement,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
})

const sendPipelineEvent = (type, context, event): SendPipelineEvent => ({
    type: type,
    originalEvent: event,
    originalContext: context
})

export const draggableObserverMachine = createMachine<ParentContext, ParentEvent, ParentState>(
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
                    pointerContext: {
                        actions: [
                            () => console.log('pointerContext - draggable.observer.machine'),
                            actions.sendParent(
                                (context, event) => sendPipelineEvent('pointerContext', context, event)),
                        ]
                    },
                    dropped: {
                        actions: [
                            () => console.log('dropped - draggable.observer.machine'),
                            actions.sendParent(
                                (context, event) => sendPipelineEvent('dropped', context, event)),
                        ]
                    },
                },
            },
        },
    },
);