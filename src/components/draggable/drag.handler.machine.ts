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
    element: HTMLElement | any;
    pointerPath: Array<string>;
}

type Event = PointerEvent;

type State =
    | { value: "init"; context: Context }
    | { value: "dragging"; context: Context }
    | { value: "drop"; context: Context };

const sendEvent = (type: string, context: Context): SendEvent => ({
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
        states: {
            dragging: {
                invoke: [
                    {src: 'capturePointer'},
                    {src: 'delegatePointer'},
                ],
                on: {
                    pointermove: {
                        cond: 'pointerMatches',
                        actions: [
                            'setPointerContext',
                            'setPointerPath'
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
                    lostpointercapture: 'cancel',
                    DELEGATE_POINTER_EVENTS: [
                        {
                            cond: 'canDrop',
                            actions: 'delegatePointerEvents',
                        }
                    ],
                },
            },
            dropped: {
                type: 'final',
                entry: [
                    'sendDroppedEvent',
                    'clearPointerContext',
                ],
            },
            cancel: {
                type: 'final',
                entry: 'clearPointerContext',
            },
        }
    },
    {
        actions: {
            setPointerContext: (context, event) => {
                context.element.style.setProperty('--draggingX', `${event.clientX - context.startX}`)
                context.element.style.setProperty('--draggingY', `${event.clientY - context.startY}`)
                context.element.setAttribute('data-pointer-path', context.pointerPath)
            },
            setPointerPath: (context: Context, event: PointerEvent) => {
                const elementsFromPoint = document.elementsFromPoint(event.clientX, event.clientY)
                const closestElement = elementsFromPoint.find(el => el.hasAttribute('data-position'))
                if (!closestElement) return context.pointerPath = []
                const closestDataPositionAttribute = closestElement.getAttribute('data-position') ?? ''
                return context.pointerPath = closestDataPositionAttribute.split(`-`)
            },
            clearPointerContext: (context) => {
                context.element.style.setProperty('--draggingX', '0')
                context.element.style.setProperty('--draggingY', '0')
                context.pointerPath = []
            },
            delegatePointerEvents: actions.sendParent(
                (context: Context) => sendEvent('DELEGATE_POINTER_EVENTS', context)),
            sendDroppedEvent: actions.sendParent(
                (context: Context) => sendEvent('DROPPED', context)),
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
            delegatePointer: (context, event) => (callback) => {
                const id = setInterval(() => callback('DELEGATE_POINTER_EVENTS'), 380);
                return () => clearInterval(id);
            },
        },
        guards: {
            canDrop: (context) => Boolean(context.pointerPath && context.pointerPath.length),
            pointerMatches: (context, event) => context.pointerId === event.pointerId,
            minimumDistance: (context, event) => context.pointerId === event.pointerId &&
                Math.pow(event.clientX - context.startX, 2) +
                Math.pow(event.clientY - context.startY, 2) >
                MIN_DIST
        },
    }
)