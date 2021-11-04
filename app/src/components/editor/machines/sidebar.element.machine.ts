// @ts-nocheck
import {assign, createMachine, sendParent} from "xstate";
import {isEqual, isNull} from 'lodash';
import {nanoid} from "nanoid";
import {elementsFromPoint} from "@/elementsFromPoint";

const MIN_DIST = Math.pow(10, 2);

export type Path = Array<[string, string, string]> | null;

interface Context {
    startX: number;
    startY: number;
    element: Element;
    component?: Element;
    componentPosition?: Path;
    // todo: rename to previousComponentPosition
    previousComponentPosition?: Path;
    pointerId: number;
    invocationId?: number;
}


export interface IntersectionEvent {
    type: string;
    // todo: rename to component
    component: Element,
    // todo: rename to component position
    position: Path
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

const closestElementFromPoint = (event: PointerEvent) =>
    elementsFromPoint(event.clientX, event.clientY)
        .find(el => el.hasAttribute('data-position'))


const setCurrentPointerContext = (context: Context, component: Element) => {
    context.component = component
    context.componentPosition = component.getAttribute('data-position')!.split(`-`)
    context.element?.setAttribute('data-current-path', context.componentPosition)
}

const resetCurrentPointerContext = (context: Context) => {
    context.component = null
    context.componentPosition = null
    context.element?.setAttribute('data-current-path', '')
}


const rect = (el) => el.getBoundingClientRect()

const dragMachine = createMachine<Context, Event, State>(
    {
        initial: "init",
        context: {
            startX: 0,
            startY: 0,
            pointerId: 0,
            element: null,
            component: undefined,
            componentPosition: undefined,
            previousComponentPosition: undefined,
            transform: '',
        },
        invoke: {
            src: "capturePointer",
        },
        states: {
            init: {
                entry: assign((context, _event) => ({
                    component: null,
                    componentPosition: null,
                    previousComponentPosition: null,
                    transform: context.element.style.transform,
                })),
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
            getElementBoundingBox: assign((context: Context, event: Event) => {
                const elCoords = rect(context.element)
                console.log(context, event, elCoords)
            }),
            updateTransform: (context: Context, event: Event) => requestAnimationFrame(() => context.element.style.transform =
                `${context.transform} translate3d(${event.clientX - context.startX}px,${event.clientY - context.startY}px, 0px)`),
            resetTransform: (context) => requestAnimationFrame(() => context.element.style.transform = context.transform),
            updateCurrentPointerPath: (context, event: PointerEvent) => {
                const closestComponent = closestElementFromPoint(event);
                closestComponent
                    ? setCurrentPointerContext(context, closestComponent)
                    : resetCurrentPointerContext(context)
            },
            updatePreviousPointerPath: assign({
                componentPosition: (context) => context.componentPosition
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
                pickedUpElement: event.target,
                component: context.component,
                position: context.componentPosition,
                dragging: context.componentPosition?.length ? 'inside' : 'outside',
                invocationId: context.invocationId,
            })),
            respondDropped: sendParent((context: Context, event: DroppedEvent) => ({
                type: "DROPPED",
                clientX: event.clientX,
                clientY: event.clientY,
                deltaX: event.clientX - context.startX,
                deltaY: event.clientY - context.startY,
                position: context.componentPosition,
                dragging: context.componentPosition?.length ? 'inside' : 'outside',
                invocationId: context.invocationId,
            })),
            respondCanceled: () => console.warn('respondCanceled')
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
            previousAndCurrentPathAreEqual: (ctx, _) => isEqual(ctx.componentPosition, ctx.previousComponentPosition),
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
                actions: 'getElementBoundingBox',
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
                    (ctx, evt) => console.log('dropped'),
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