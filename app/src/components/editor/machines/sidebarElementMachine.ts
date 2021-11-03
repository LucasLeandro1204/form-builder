// @ts-nocheck
import {assign, createMachine, sendParent} from "xstate";
import {isEqual, isNull} from 'lodash';
import {nanoid} from "nanoid";
import {elementsFromPoint} from "@/elementsFromPoint";

const MIN_DIST = Math.pow(10, 2);4

export type Path = Array<[string, string, string]>  | null;

interface Context {
    startX: number;
    startY: number;
    element: Element | null;
    closestElement?: Element;
    currentPointerPath?: Path;
    previousPointerPath?: Path;
    pointerId: number;
    invocationId?: number;
}


export interface IntersectionEvent {
    type: string;
    closestElement: Element,
    path: Path
}

export interface DroppedEvent {
    type: string;
    clientX: number;
    clientY: number;
    deltaX: number;
    deltaY: number;
    path: Path;
    transform: string;
}

interface respondIntersectionEvent extends IntersectionEvent {
    originalEvent: IntersectionEvent
}

type Event = PointerEvent;

type State =
    | { value: "init"; context: Context }
    | { value: "dragging"; context: Context }
    | { value: "canceled"; context: Context }
    | { value: "dropped"; context: Context };

function closestElementFromPoint(event: PointerEvent) {
    const closestElements = elementsFromPoint(event.clientX, event.clientY)
    return closestElements.find(el => el.hasAttribute('data-position'))
}

function setCurrentPointerContext(context: Context, closestElement: Element) {
    context.closestElement = closestElement
    context.currentPointerPath = closestElement.getAttribute('data-position')!.split(`-`)
    context.element?.setAttribute('data-current-path', context.currentPointerPath)
    // console.log(context.currentPointerPath)
}

function resetCurrentPointerContext(context: Context) {
    context.closestElement = null
    context.currentPointerPath = null
    context.element?.setAttribute('data-current-path', '')
}

const dragMachine = createMachine<Context, Event, State>(
    {
        initial: "init",
        context: {
            startX: 0,
            startY: 0,
            pointerId: 0,
            element: null,
            closestElement: undefined,
            currentPointerPath: undefined,
            previousPointerPath: undefined,
            transform: '',
        },
        invoke: {
            src: "capturePointer",
        },
        states: {
            init: {
                entry: assign({
                    closestElement: null,
                    currentPointerPath: null,
                    previousPointerPath: null,
                }),
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
                                // 'respondIntersection',
                            ],
                        },
                        {
                            target: 'dragging',
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
                entry: [
                    'updateCurrentPointerPath',
                    'resetTransform',
                    'resetInvocationId',
                    'respondDropped',
                ],
            },
            canceled: {
                type: 'final',
                entry: [
                    'updateCurrentPointerPath',
                    'resetTransform',
                    'resetInvocationId',
                ],
            },
        },
    },
    {
        actions: {
            updateTransform: (context: Context, event: Event) => requestAnimationFrame(() => context.element.style.transform =
                `translate3d(${event.clientX - context.startX}px,${event.clientY - context.startY}px, 0px)`),
            resetTransform: (context) => requestAnimationFrame(() => context.element.style.transform = context.transform),
            updateCurrentPointerPath: (context, event: PointerEvent) => {
                const closestElement = closestElementFromPoint(event);
                closestElement
                    ? setCurrentPointerContext(context, closestElement)
                    : resetCurrentPointerContext(context)
            },
            updatePreviousPointerPath: assign({
                previousPointerPath: (context) => context.currentPointerPath
            }),
            setInvocationId: assign({
                invocationId: () => nanoid(6)
            }),
            resetInvocationId: assign({
                invocationId: () => null
            }),
            respondIntersection: sendParent((context: Context, event: respondIntersectionEvent) => ({
                type: "INTERSECTED",
                originalEvent: event,
                typeofElement: event.target.getAttribute('data-type'),
                closestElement: context.closestElement,
                path: context.currentPointerPath,
                dragging: context.currentPointerPath?.length ? 'inside' : 'outside',
                invocationId: context.invocationId,
            })),
            respondDropped: sendParent((context: Context, event: DroppedEvent) => ({
                type: "DROPPED",
                clientX: event.clientX,
                clientY: event.clientY,
                deltaX: event.clientX - context.startX,
                deltaY: event.clientY - context.startY,
                path: context.currentPointerPath,
                dragging: context.currentPointerPath?.length ? 'inside' : 'outside',
                invocationId: context.invocationId,
            })),
            respondCanceled: () => console.log('respondCanceled')
        },
        services: {
            capturePointer: (context) => (sendParent) => {
                const handleEvent = (event: PointerEvent) => sendParent(event);
                context.element.setPointerCapture(context.pointerId);
                context.element.addEventListener("pointermove", handleEvent);
                context.element.addEventListener("pointerup", handleEvent);
                context.invocationId = nanoid(4);
                return () => {
                    context.element.releasePointerCapture(context.pointerId);
                    context.element.removeEventListener("pointermove", handleEvent);
                    context.element.removeEventListener("pointerup", handleEvent);
                    context.invocationId = null;
                };
            },
        },
        guards: {
            previousAndCurrentPathAreEqual: (ctx, _) => isEqual(ctx.currentPointerPath, ctx.previousPointerPath),
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
                    element: (context, event) => event.target,
                }),
                invoke: {
                    id: "drag",
                    src: dragMachine,
                    data: dragData,
                    onDone: 'idle',
                },
                on: {
                    INTERSECTED: {
                        actions: sendParent((context: Context, event: IntersectionEvent) => event)
                    },
                    DROPPED: {
                        target: 'dropped',
                    },
                },
            },
            dropped: {
                actions: [
                    sendParent((context: Context, event: IntersectionEvent) => event),
                    (context, event) => {
                        context.deltaX += event.deltaX;
                        context.deltaY += event.deltaY;
                    }
                ],
                after: {
                    300: {
                        target: 'idle'
                    }
                }
            }
        },
    }, {
        actions: {
            // ___
        }
    }
);