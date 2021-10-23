import {actions, createMachine} from "xstate";

const MIN_DIST = Math.pow(10, 2);

interface Context {
    startX: number;
    startY: number;
    pointerId: number;
    pointerPath: Array<any>;
    element: HTMLElement | any;
}

interface SendEvent {
    type: string;
    context: Context;
    event: Event;
}

type Event = PointerEvent;

type State =
    | { value: "init"; context: Context }
    | { value: "dragging"; context: Context }
    | { value: "drop"; context: Context };


const findPointerPath = (event: PointerEvent, context: Context) => {
    const elementsFromPoint = document.elementsFromPoint(event.clientX, event.clientY)
    if (!elementsFromPoint || (elementsFromPoint && !elementsFromPoint.length)) return context.pointerPath
    const closestElement = elementsFromPoint.find(el => el.hasAttribute('data-position'))
    if (!closestElement || (closestElement && !closestElement.dataset)) return context.pointerPath
    return closestElement.dataset.position.split(`-`) || []
}

const sendEvent = (type, context): SendEvent => ({
    type: type,
    element: context.element,
    pointerPath: context.pointerPath,
})

export const draggableHandlerMachine = createMachine<Context, Event, State>(
    {
        id: 'drag-handler',
        initial: 'dragging',
        context: {
            startX: 0,
            startY: 0,
            pointerId: 0,
            pointerPath: [],
            element: undefined,
        },
        invoke: {
            src: 'capturePointer',
        },
        states: {
            dragging: {
                on: {
                    pointermove: {
                        cond: 'pointerMatches',
                        actions: [
                            'setPointerContext',
                            'sendPointerContext',
                        ]
                    },
                    pointerup: [
                        {
                            cond: 'canDrop',
                            target: 'dropped',
                        },
                        {
                            target: 'cancel',
                        },
                    ],
                    lostpointercapture: {
                        target: 'cancel',
                    }
                },
            },
            dropped: {
                type: "final",
                entry: [
                    'sendDropped',
                    'clearPointerContext',
                ],
            },
            cancel: {
                type: "final",
                entry: [
                    'clearPointerContext',
                ],
            },
        }
    },
    {
        actions: {
            setPointerContext: (context, event) => {
                context.element.style.setProperty('--draggingX', `${event.clientX - context.startX}`)
                context.element.style.setProperty('--draggingY', `${event.clientY - context.startY}`)
                context.pointerPath = findPointerPath(event, context)
            },
            clearPointerContext: (context) => {
                context.element.style.setProperty('--draggingX', '0')
                context.element.style.setProperty('--draggingY', '0')
                context.pointerPath = []
            },
            sendPointerContext: actions.sendParent(
                (context: Context) => sendEvent('pointerContext', context)),
            sendDropped: actions.sendParent(
                (context: Context) => sendEvent('dropped', context)),
        },
        services: {
            capturePointer: (context) => (sendParent) => {
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
            canDrop: (context) => !!context.pointerPath && context.pointerPath.length,
            pointerMatches: (context, event) => context.pointerId === event.pointerId,
            minimumDistance: (context, event) => context.pointerId === event.pointerId &&
                Math.pow(event.clientX - context.startX, 2) +
                Math.pow(event.clientY - context.startY, 2) >
                MIN_DIST
        },
    }
)
