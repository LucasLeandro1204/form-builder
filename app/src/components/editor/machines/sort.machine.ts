// @ts-nocheck
import {assign, createMachine} from 'xstate';

export interface SortMachineContext {
    dataList: Data[];
    itemBeingHeld?: {
        startIndex: number;
        currentIndex: number;
    };
}

interface Data {
    id: number;
}

export type SortMachineEvent =
    | {
    type: 'DROP';
}
    | {
    type: 'DRAG_REACHED_INTERSECTION';
    index: number;
}
    | {
    type: 'PICK_UP';
    index: number;
};
// | {
//     type: "UP_ARROW";
//   }
// | {
//     type: "DOWN_ARROW";
//   };

const sortMachine = createMachine<SortMachineContext,
    SortMachineEvent>(
    {
        id: 'sortMachine',
        initial: 'idle',
        context: {
            dataList: [
                {
                    id: 0,
                    name: 'jesse'
                },
                {
                    id: 1,
                    name: 'joshua',
                },
                {
                    id: 2,
                    name: 'jaap'
                },
            ],
        },
        states: {
            idle: {
                on: {
                    PICK_UP: {
                        target: 'dragging',
                        actions: ['assignPickedUpItemToContext'],
                    },
                },
            },
            dragging: {
                on: {
                    DROP: {
                        target: 'idle',
                        actions: [
                            'rearrangeListBasedOnIndex',
                            'removeItemBeingHeldFromContext',
                        ],
                    },
                    DRAG_REACHED_INTERSECTION: {
                        actions: ['assignCurrentPositionToContext'],
                    },
                },
            },
        },
    },
    {
        actions: {
            assignPickedUpItemToContext: assign((context, event) => {
                // if (event.type !== 'PICK_UP') return {};
                return {
                    itemBeingHeld: {
                        currentIndex: event.index,
                        startIndex: event.index,
                    },
                };
            }),
            removeItemBeingHeldFromContext: assign((context) => {
                return {
                    itemBeingHeld: undefined,
                };
            }),
            rearrangeListBasedOnIndex: assign((context, event) => {
                if (event.type !== 'DROP') return {};

                const newDataList = [...context.dataList];

                newDataList.splice(context.itemBeingHeld.startIndex, 1);
                newDataList.splice(context.itemBeingHeld.currentIndex, 0,
                    context.dataList[context.itemBeingHeld.startIndex],);
                context.dataList = newDataList
            }),
            assignCurrentPositionToContext: assign((context, event) => {
                if (event.type !== 'DRAG_REACHED_INTERSECTION') return {};
                context.itemBeingHeld = {
                    ...context.itemBeingHeld,
                    currentIndex: event.index,
                }
            }),
        },
    },
);

export default sortMachine;
