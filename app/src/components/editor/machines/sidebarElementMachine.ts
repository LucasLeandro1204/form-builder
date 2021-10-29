// @ts-nocheck
import {createMachine, assign, actions, send, sendParent} from "xstate";
import {isEqual, isNull} from 'lodash';

const MIN_DIST = Math.pow(10, 2);

interface Context {
    startX: number;
    startY: number;
    element: Element | null;
    closestElement: Element | null;
    pointerId: number;
    currentPointerPath: Array<number | string> | null
    previousPointerPath: Array<number | string> | null
}

type Path = Array<number | string> | null

interface IntersectionEvent {
    type: string;
    closestElement: Element | null,
    path: Path
}

interface DroppedEvent {
    type: string;
    clientX: number;
    clientY: number;
    deltaX: number;
    deltaY: number;
    path: Path;
}

type Event = PointerEvent;

type State =
    | { value: "init"; context: Context }
    | { value: "dragging"; context: Context }
    | { value: "canceled"; context: Context }
    | { value: "dropped"; context: Context };

function setCurrentPointerContext(context: Context, closestElement: Element) {
    context.closestElement = closestElement
    context.currentPointerPath = Array.from(closestElement.getAttribute('data-position')!.split(`-`))
}

function resetCurrentPointerContext(context: Context) {
    context.closestElement = null
    context.currentPointerPath = null
}

const dragMachine = createMachine<Context, Event, State>(
    {
        initial: "init",
        context: {
            startX: 0,
            startY: 0,
            pointerId: 0,
            element: null,
            closestElement: null,
            currentPointerPath: null,
            previousPointerPath: null,
        },
        invoke: {
            src: "capturePointer",
        },
        states: {
            init: {
                on: {
                    pointermove: {
                        target: 'dragging',
                    },
                    pointerup: {
                        target: 'canceled',
                        cond: 'pointerMatches',
                    },
                },
            },
            dragging: {
                on: {
                    pointerup: {
                        target: 'dropped',
                        cond: 'pointerMatches',
                    },
                    pointermove: [
                        {
                            target: 'dragging',
                            cond: 'previousAndCurrentPathAreEqual',
                            actions: [
                                'updateTransform',
                                'updateCurrentPointerPath',
                                'updatePreviousPointerPath',
                            ],
                        },
                        {
                            target: 'dragging',
                            cond: 'previousAndCurrentPathAreNotEqual',
                            actions: [
                                'updateTransform',
                                'updateCurrentPointerPath',
                                'updatePreviousPointerPath',
                                'respondIntersection',
                            ],
                        },
                    ]
                },
            },
            dropped: {
                type: 'final',
                entry: ['resetTransform', 'respondDropped'],
            },
            canceled: {
                type: 'final',
                entry: 'resetTransform',
            },
        },
    },
    {
        actions: {
            updatePreviousPointerPath: actions.assign({
                previousPointerPath: (context, event) => context.currentPointerPath
            }),
            updateCurrentPointerPath: (context, event: PointerEvent) => {
                const elementsFromPoint = document.elementsFromPoint(event.clientX, event.clientY)
                const closestElement = elementsFromPoint.find(el => el.hasAttribute('data-position'))
                closestElement ? setCurrentPointerContext(context, closestElement) : resetCurrentPointerContext(context)
            },
            updateTransform: (context: Context, event: Event) => requestAnimationFrame(() => context.element.style.transform =
                `translate3d(${event.clientX - context.startX}px,${event.clientY - context.startY}px, 0px)`),
            resetTransform: (context) => requestAnimationFrame(() =>
                context.element.style.transform = context.transform),
            respondIntersection: actions.sendParent((context: Context, event: IntersectionEvent) => ({
                type: "INTERSECTED",
                closestElement: context.closestElement,
                path: context.currentPointerPath
            })),
            respondDropped: actions.sendParent((context: Context, event: DroppedEvent) => ({
                type: "DROPPED",
                clientX: event.clientX,
                clientY: event.clientY,
                deltaX: event.clientX - context.startX,
                deltaY: event.clientY - context.startY,
                path: context.currentPointerPath
            })),
        },
        services: {
            capturePointer: (context: Context) => (sendParent) => {
                // sendParent could be used directly, but this improves stack traces.
                const handleEvent = (event: PointerEvent) => sendParent(event);
                context.element.setPointerCapture(context.pointerId);
                context.element.addEventListener("pointermove", handleEvent);
                context.element.addEventListener("pointerup", handleEvent);
                context.element.addEventListener('lostpointercapture', handleEvent);
                return () => {
                    context.element.releasePointerCapture(context.pointerId);
                    context.element.removeEventListener("pointermove", handleEvent);
                    context.element.removeEventListener("pointerup", handleEvent);
                    context.element.removeEventListener('lostpointercapture', handleEvent);
                };
            },
        },
        guards: {
            previousAndCurrentPathAreEqual: (ctx, _) => isEqual(ctx.currentPointerPath, ctx.previousPointerPath),
            previousAndCurrentPathAreNotEqual: (ctx, _) => !isEqual(ctx.currentPointerPath, ctx.previousPointerPath),
            currentPointerPathIsNull: (ctx, _) => isNull(ctx.currentPointerPath),
            pointerMatches: (ctx, event) => ctx.pointerId === event.pointerId,
            minimumDistance: (ctx, event) =>
                ctx.pointerId === event.pointerId &&
                Math.pow(event.clientX - ctx.startX, 2) +
                Math.pow(event.clientY - ctx.startY, 2) >
                MIN_DIST,
        },
    }
);

function dragData(_: unknown, event: PointerEvent) {
    const element = event.target as HTMLElement;
    return {
        element,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        transform: element.style.transform,
    };
}


// Sidebar Element Machine
// _______________________

interface SidebarElementContext {
    deltaX: number;
    deltaY: number;
}

type  SidebarElementEvent = PointerEvent;

type SidebarElementState =
    | { value: "idle"; context: Context }
    | { value: "dragging"; context: Context };

export const sidebarElementMachine = createMachine<SidebarElementContext, SidebarElementEvent, SidebarElementState>(
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
                    onDone: {
                        target: 'idle'
                    },
                },
                on: {
                    INTERSECTED: {
                        internal: true,
                        actions: [
                            (ctx, evt) => console.log('INTERSECTED', evt)
                        ],
                    },
                    DROPPED: {
                        target: 'dropped',
                        actions: [
                            (ctx, evt) => console.log('DROPPED', evt)
                        ]
                    },
                },
            },
            dropped: {
                actions: (context, event) => {
                    context.deltaX += event.deltaX;
                    context.deltaY += event.deltaY;
                },
                after: {
                    300: {
                        target: 'idle'
                    }
                }
            }
        },
    }
);