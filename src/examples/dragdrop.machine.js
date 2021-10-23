import {createMachine, assign} from 'xstate'

export const dragdropMachine = createMachine({
    id: 'dragdrop-machine',
    initial: "idle",
    context: {
        draggingX: 0,
        draggingY: 0,
        pointerX: 0,
        pointerY: 0,
        pathFromPoint: [],
    },
    states: {
        idle: {
            id: "idle",
            entry: assign({
                draggingX: 0,
                draggingY: 0,
            }),
            on: {
                pointerdown: {
                    target: "dragging",
                    actions: assign({
                        pointerX: (context, event) => event.clientX,
                        pointerY: (context, event) => event.clientY
                    })
                }
            }
        },
        dragging: {
            initial: "outside",
            states: {
                outside: {
                    entry: assign({
                        draggingX: 0,
                        draggingY: 0,
                        pathFromPoint: [],
                    }),
                    on: {
                        pointerenter: {
                            target: "inside",
                        },
                        pointerup: {
                            target: "#idle"
                        }
                    }
                },
                inside: {
                    on: {
                        pointerleave: {
                            target: 'outside'
                        },
                        pointerup: {
                            target: "#dropped"
                        }
                    }
                }
            },
            on: {
                pointermove: {
                    internal: true,
                    actions: assign({
                        draggingX: (context, event) => event.clientX - context.pointerX,
                        draggingY: (context, event) => event.clientY - context.pointerY,
                        pathFromPoint: (context, event) => {
                            const closestElementFromPoint = document.elementsFromPoint(event.clientX, event.clientY)
                                .filter(el => el.classList.contains('draggable')).first()
                            return closestElementFromPoint ? closestElementFromPoint.dataset.position.split(' ') : []
                        },
                    })
                }
            }
        },
        dropped: {
            id: "dropped",
            after: {
                750: "idle"
            }
        }
    }
});

