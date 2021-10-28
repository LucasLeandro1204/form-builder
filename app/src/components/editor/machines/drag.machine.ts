import {actions, createMachine} from "xstate";

interface DragContext {
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

type DragEvent = PointerEvent;

type DragState =
    | { value: "init"; context: DragContext }
    | { value: "dragging"; context: DragContext }
    | { value: 'dropped'; context: DragContext }
    | { value: 'cancel'; context: DragContext };

const MIN_DIST = Math.pow(10, 2);

const sendEvent = (type: string, context: DragContext): SendEvent => ({
    type: type,
    element: context.element,
    pointerPath: context.pointerPath,
})

export const dragMachine = createMachine<DragContext, DragEvent, DragState>(
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
                            target: 'canceled',
                        },
                    ],
                    lostpointercapture: 'canceled',
                    sendPointerEvent: [
                        {
                            cond: 'canDrop',
                            actions: 'sendPointerEvent',
                        }
                    ],
                },
            },
            dropped: {
                type: 'final',
                entry: [
                    'sendDroppedEvent',
                    'setInitialPointerContext',
                ],
            },
            canceled: {
                type: 'final',
                entry: 'setInitialPointerContext',
            },
        }
    },
    {
        actions: {
            setPointerContext: (context, event) => {
                context.element.style.setProperty('--deltaX', `${event.clientX - context.startX}`)
                context.element.style.setProperty('--deltaY', `${event.clientY - context.startY}`)
                context.element.setAttribute('data-pointer-path', context.pointerPath)
            },
            setPointerPath: (context: DragContext, event: PointerEvent) => {
                const elementsFromPoint = document.elementsFromPoint(event.clientX, event.clientY)
                const closestElement = elementsFromPoint.find(el => el.hasAttribute('data-position'))
                if (closestElement) {
                    const closestElementDataPosition = closestElement.getAttribute('data-position')!
                    context.pointerPath = closestElementDataPosition.split(`-`)
                }
            },
            setInitialPointerContext: (context) => {
                context.element.style.setProperty('--deltaX', '0')
                context.element.style.setProperty('--deltaY', '0')
                context.element.setAttribute('data-pointer-path', ``)
                context.pointerPath = []
            },
            sendPointerEvent: actions.sendParent((context: DragContext) => sendEvent('DELEGATE_POINTER_EVENT', context)),
            sendDroppedEvent: actions.sendParent((context: DragContext) => sendEvent('DROPPED', context)),
        },
        services: {
            capturePointer: (context) => (sendParent) => {
                const handleEvent = (event: PointerEvent) => sendParent(event);
                context.element.setPointerCapture(context.pointerId);
                context.element.addEventListener("pointermove", handleEvent, {passive: true});
                context.element.addEventListener("pointerup", handleEvent, {passive: true});
                context.element.addEventListener('lostpointercapture', handleEvent, {passive: true});
                return () => {
                    context.element.releasePointerCapture(context.pointerId);
                    context.element.removeEventListener("pointermove", handleEvent);
                    context.element.removeEventListener("pointerup", handleEvent);
                    context.element.removeEventListener('lostpointercapture', handleEvent);
                };
            },
            pointerService: (context, event) => (callback) => {
                const id = setInterval(() => callback('DELEGATE_POINTER_EVENT'), 220);
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