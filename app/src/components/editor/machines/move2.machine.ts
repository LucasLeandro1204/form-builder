// @ts-nocheck
import {assign, createMachine} from 'xstate';

export interface DragAndDropMachineContext {
    dataList: Data[];
    itemBeingHeld?: {
        startIndexPath: number;
        currentIndexPath: number;
    };
}

interface Data {
    id: number;
}

export type DragAndDropMachineEvent =
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

const dragAndDropMachine = createMachine<DragAndDropMachineContext,
    DragAndDropMachineEvent>(
    {
        id: 'dragAndDrop',
        initial: 'idle',
        context: {
            dataList: [
                {
                    id: 0,
                    type: 'row',
                    children: [
                        {
                            id: 11,
                            type: 'column',
                            children: [
                                {
                                    id: 111,
                                    type: 'component',
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 1,
                    type: 'row',
                    children: [
                        {
                            id: 222,
                            type: 'column',
                            children: [
                                {
                                    id: 2222,
                                    type: 'component',
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 2,
                    type: 'row',
                    children: [
                        {
                            id: 333,
                            type: 'column',
                            children: [
                                {
                                    id: 3333,
                                    type: 'component',
                                }
                            ]
                        }
                    ]
                },
            ],
        },
        states: {
            idle: {
                on: {
                    INTERSECTED: {
                        target: 'dragging',
                        actions: ['assignPickedUpItemToContext'],
                    },
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
                if (event.type !== 'PICK_UP') return {};
                return {
                    itemBeingHeld: {
                        currentIndexPath: event.path,
                        startIndexPath: event.path,
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


                const removeItem = () => {
                    const startDepth = context.itemBeingHeld.startIndexPath.length
                    const [row, column, component] = context.itemBeingHeld.startIndexPath
                    switch (startDepth) {
                        case 1:
                            newDataList.splice(
                                context.itemBeingHeld.startIndexPath[row],
                                1);
                            break;
                        case 2:
                            newDataList.splice(
                                context.itemBeingHeld.startIndexPath[column],
                                1);
                            break;
                        case 3:
                            newDataList.splice(
                                context.itemBeingHeld.startIndexPath[component],
                                1);
                            break;
                    }
                }

                const addItem = () => {
                    const currentDepth = context.itemBeingHeld.currentIndexPath.length
                    const [row, column, component] = context.itemBeingHeld.startIndexPath
                    switch (currentDepth) {
                        case 1:
                            newDataList.splice(
                                context.itemBeingHeld.currentIndexPath[row], 0,
                                context.dataList[context.itemBeingHeld.startIndexPath[row]]);
                            break;
                        case 2:
                            newDataList.splice(
                                context.itemBeingHeld.currentIndexPath[column], 0,
                                context.dataList[context.itemBeingHeld.startIndexPath[row]]
                                    .children[context.itemBeingHeld.startIndexPath[column]]);
                            break;
                        case 3:
                            newDataList.splice(
                                context.itemBeingHeld.currentIndexPath[row].children[column].children, 0,
                                context.dataList[context.itemBeingHeld.startIndexPath[row]]
                                    .children[context.itemBeingHeld.startIndexPath[column]]
                                    .children[context.itemBeingHeld.startIndexPath[component]]);
                            break;
                    }
                }

                removeItem()
                console.log('removed', newDataList)
                addItem()
                console.log('added', newDataList)

                return {
                    dataList: newDataList,
                };
            }),
            assignCurrentPositionToContext: assign((context, event) => {
                if (event.type !== 'DRAG_REACHED_INTERSECTION') return {};
                return {
                    itemBeingHeld: {
                        ...context.itemBeingHeld,
                        currentIndexPath: event.index,
                    },
                };
            }),
        },
    },
);

export default dragAndDropMachine;
