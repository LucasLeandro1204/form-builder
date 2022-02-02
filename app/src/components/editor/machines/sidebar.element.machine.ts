// @ts-nocheck

import {assign, createMachine, send, sendParent} from "xstate";
import {isEqual} from 'lodash';
import {nanoid} from "nanoid";
import {MIN_DIST} from "@/constants";
import {elementsFromPoint} from "@/mixins/polyfills/elementsFromPoint";

export type componentPosition = Array<[string, string, string]> | null;

interface Context {
    startX: number;
    startY: number;
    element: Element;
    component?: Element;
    componentPosition?: componentPosition;
    previousComponentPosition?: componentPosition;
    pointerId: number;
    invocationId?: number;
}

export interface IntersectionEvent {
    type: string;
    component: Element,
    position: componentPosition
}

export interface DroppedEvent {
    type: string;
    clientX: number;
    clientY: number;
    position: componentPosition;
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


const closestElementFromPoint = (event: PointerEvent) => {
    return elementsFromPoint(event.clientX, event.clientY)
        .find(el => el.hasAttribute('data-position'))
}

const setComponentPositionContext = (context: Context, component: Element) => {
    context.component = component
    context.componentPosition = component.getAttribute('data-position')!.split(`-`)
    context.element?.setAttribute('data-current-path', context.componentPosition)
}

const resetComponentPositionContext = (context: Context) => {
    context.component = null
    context.componentPosition = null
    context.element?.setAttribute('data-current-path', '')
}

const dragMachine = createMachine<Context, Event, State>(
    {
        initial: "init",
        context: {
            startX: 0,
            startY: 0,
            pointerId: 0,
            transform: '',
            element: null,
            component: undefined,
            componentPosition: undefined,
            previousComponentPosition: undefined,
        },
        invoke: {
            src: 'capturePointer',
        },
        states: {
            init: {
                entry: [
                    'clearContext',
                    'inheritElementTransform',
                ],
                on: {
                    pointermove: {
                        target: 'dragging',
                    },
                    pointerup: {
                        target: 'canceled',
                        cond: 'pointerMatches',
                    },
                },
                exit: [
                    'setInvocationId',
                ],
            },
            dragging: {
                on: {
                    pointerup: {
                        target: 'dropped',
                        cond: 'pointerMatches',
                    },
                    pointermove: [
                        {
                            tag: 'outside',
                            target: 'dragging',
                            cond: 'positionsMatch',
                            actions: [
                                'updateTransform',
                                'updateComponentPosition',
                                'saveComponentPosition',
                            ],
                        },
                        {
                            tag: 'inside',
                            target: 'dragging',
                            actions: [
                                'updateTransform',
                                'updateComponentPosition',
                                'saveComponentPosition',
                                'respondIntersection',
                            ],
                        },
                    ]
                },
            },
            dropped: {
                type: 'final',
                entry: [
                    'resetTransform',
                    'respondDropped'
                ],
            },
            canceled: {
                type: 'final',
                entry: [
                    'updateComponentPosition',
                    'resetTransform',
                ],
            },
        },
    },
    {
        actions: {
            clearContext: assign((context, _event) => ({
                invocationId: null,
                component: null,
                componentPosition: null,
                previousComponentPosition: null,
            })),
            respondIntersection: sendParent((context: Context, event: respondIntersectionEvent) => ({
                type: 'INTERSECTED',
                clientX: event.clientX,
                clientY: event.clientY,
                element: event.target,
                component: context.component,
                position: context.componentPosition,
                invocationId: context.invocationId,
            })),
            respondDropped: sendParent((context: Context, event: DroppedEvent) => ({
                type: 'DROPPED',
                clientX: event.clientX,
                clientY: event.clientY,
                element: event.target,
                component: context.component,
                position: context.componentPosition,
                invocationId: context.invocationId,
            })),
            respondCanceled: sendParent((context: Context) => ({
                type: 'CANCELED',
                invocationId: context.invocationId,
            })),
            saveComponentPosition: assign({
                previousComponentPosition: (context) => context.componentPosition
            }),
            setInvocationId: assign({
                invocationId: () => nanoid()
            }),
            inheritElementTransform: assign({
                transform: (context, _event) => context.element.style.transform
            }),
            updateTransform: (context: Context, event: Event) => {
                window.requestAnimationFrame(() =>
                    context.element.style.transform = `${context.transform}
                     translate(${event.clientX - context.startX}px,
                               ${event.clientY - context.startY}px)`)
            },
            resetTransform: (context) => {
                window.requestAnimationFrame(() =>
                    context.element.style.transform = context.transform)
            },
            updateComponentPosition: (context, event: PointerEvent) => {
                const closestComponent = closestElementFromPoint(event);
                closestComponent
                    ? setComponentPositionContext(context, closestComponent)
                    : resetComponentPositionContext(context)
            },
        },
        services: {
            capturePointer: (context) => (sendParent) => {
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
            positionsMatch: (ctx, _) => isEqual(ctx.componentPosition, ctx.previousComponentPosition),
            pointerMatches: (ctx, event) => ctx.pointerId === event.pointerId,
            minimumDistance: (ctx, event) => Math.pow(event.clientX - ctx.startX, 2) +
                Math.pow(event.clientY - ctx.startY, 2) > MIN_DIST,
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

interface SidebarElementContext {
    deltaX: number;
    deltaY: number;
}

type SidebarElementEvent = PointerEvent;

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
                entry: 'resetContext',
                on: {
                    pointerdown: "dragging",
                },
            },
            dragging: {
                entry: 'assignElement',
                invoke: {
                    id: "drag",
                    src: dragMachine,
                    data: dragData,
                    onDone: 'idle',
                },
                on: {
                    INTERSECTED: {
                        actions: 'intersected',
                    },
                    DROPPED: {
                        target: 'dropped',
                    },
                },
            },
            dropped: {
                entry: 'dropped',
                after: {
                    200: {
                        target: 'idle',
                    }
                }
            },
        },
    }, {
        actions: {
            intersected: sendParent((context: Context, event: IntersectionEvent) => event),
            dropped: sendParent((context: Context, event: IntersectionEvent) => event),
            assignElement: assign({
                element: (context, event) => event.target,
            }),
            resetContext: assign({
                element: null,
                deltaX: 0,
                deltaY: 0,
            }),
            updateDelta: assign((context, event) => {
                context.deltaX += event.deltaX;
                context.deltaY += event.deltaY;
            }),
        }
    }
);

