// @ts-nocheck

import {createMachine, assign, actions} from "xstate";
import {transform} from "lodash";

const MIN_DIST = Math.pow(10, 2);

interface Context {
    element: HTMLElement;
    pointerId: number;
    startX: number;
    startY: number;
    transform: string;
}

type Event = PointerEvent;

type State =
    | { value: "init"; context: Context }
    | { value: "dragging"; context: Context }
    | { value: "canceled"; context: Context }
    | { value: "dropped"; context: Context };


const rect = el => el.getBoundingClientRect();

const rectCenter = el => {
    const elRect = rect(el);
    return [elRect.left + elRect.width / 2, elRect.top + elRect.height / 2];
};

const dragMachine = createMachine<Context, Event, State>(
    {
        initial: "init",
        context: {
            startX: 0,
            startY: 0,
            pointerId: 0,
            element: null,
            transform: null,
            raf: null
        },
        invoke: {
            src: "capturePointer",
        },
        states: {
            init: {
                on: {
                    pointermove: {
                        target: "dragging",
                    },
                    pointerup: {
                        target: "canceled",
                        cond: "pointerMatches",
                    },
                },
            },
            dragging: {
                on: {
                    pointerup: {
                        target: "dropped",
                        cond: "pointerMatches",
                    },
                    pointermove: {
                        target: "dragging",
                        cond: "pointerMatches",
                        actions: ["updateTransform", 'updatePointerPath']
                    },
                },
            },
            dropped: {
                type: "final",
                entry: ["clearTransform", "respondDropped"],
            },
            canceled: {
                type: "final",
                entry: "clearTransform",
            },
        },
    },
    {
        actions: {
            updatePointerPath: (context: DragContext, event: PointerEvent) => {
                const elementsFromPoint = document.elementsFromPoint(event.clientX, event.clientY)
                const closestElement = elementsFromPoint.find(el => el.hasAttribute('data-position'))
                closestElement
                    ? context.pointerPath = Array.from(closestElement.getAttribute('data-position').split(`-`))
                    : context.pointerPath = []
            },
            streamTransform: (context, event) => (sendParent) => sendParent(event),
            updateTransform: (context, event) =>
                context.raf = requestAnimationFrame(() => context.element.style.transform =
                    `${context.transform} translate3d(${event.clientX - context.startX}px,${event.clientY - context.startY}px, 0px)`),
            clearTransform: (context) => {
                context.raf = requestAnimationFrame(() => context.element.style.transform = context.transform)
            },
            respondDropped: actions.sendParent((context, event) => ({
                type: "DROPPED",
                deltaX: event.clientX - context.startX,
                deltaY: event.clientY - context.startY,
            })),
        },
        services: {
            observePointerPath: (context, event) => {

            },
            capturePointer: (context) => (sendParent) => {
                // sendParent could be used directly, but this improves stack traces.
                const handleEvent = (event: PointerEvent) => sendParent(event);
                context.element.setPointerCapture(context.pointerId);
                context.element.addEventListener("pointermove", handleEvent);
                context.element.addEventListener("pointerup", handleEvent);
                return () => {
                    context.element.releasePointerCapture(context.pointerId);
                    context.element.removeEventListener("pointermove", handleEvent);
                    context.element.removeEventListener("pointerup", handleEvent);
                };
            },
        },
        guards: {
            pointerMatches: (ctx, e) => ctx.pointerId === e.pointerId,
            minimumDistance: (ctx, e) =>
                ctx.pointerId === e.pointerId &&
                Math.pow(e.clientX - ctx.startX, 2) +
                Math.pow(e.clientY - ctx.startY, 2) >
                MIN_DIST,
        },
    }
);

function dragData(_: unknown, e: PointerEvent) {
    const element = e.target as HTMLElement;
    return {
        element,
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        transform: element.style.transform,
    };
}

// Parent State Machine
interface ParentContext {
    deltaX: number;
    deltaY: number;
}

type ParentEvent = PointerEvent;

type ParentState =
    | { value: "idle"; context: Context }
    | { value: "dragging"; context: Context };

export const elementDraggingMachine = createMachine<ParentContext, ParentEvent, ParentState>(
    {
        id: "sidebarElement",
        initial: "idle",
        context: {
            element: null,
            deltaX: 0,
            deltaY: 0,
        },
        states: {
            idle: {
                entry: assign({
                    element: null,
                    deltaX: 0,
                    deltaY: 0,
                }),
                on: {
                    pointerdown: "dragging",
                },
            },
            dragging: {
                entry: assign({
                    element: (context, event) => event.target
                }),
                invoke: {
                    id: "drag",
                    src: dragMachine,
                    data: dragData,
                    onDone: "idle",
                },
                on: {
                    DROPPED: {
                        target: 'dropped'
                    },
                    pointermove: {
                        actions: (ctx, evt) => console.log('pointerenter')
                    }
                },
            },
            dropped: {
                actions: (context, event: any) => {
                    context.deltaX += event.deltaX;
                    context.deltaY += event.deltaY;
                    // context.element.style.left = `${context.deltaX}px`;
                    // context.element.style.top = `${context.deltaY}px`;
                },
                after: {
                    280: {
                        target: 'idle'
                    }
                }
            }
        },
    }
);