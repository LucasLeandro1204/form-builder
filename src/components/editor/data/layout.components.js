import {randomNumber} from "../../../mixins";
import {COLUMN, COMPONENT, ROW} from "../../../constants";

export const layout = [
    {
        id: randomNumber(),
        type: ROW,
        children: [
            {
                id: randomNumber(),
                type: COLUMN,
                children: [
                    {
                        id: randomNumber(),
                        type: COMPONENT,
                        as: 'FormNumber',
                    },
                    {
                        id: randomNumber(),
                        type: COMPONENT,
                        as: 'FormText',
                    },
                ]
            }
        ]
    },
    {
        id: randomNumber(),
        type: ROW,
        children: [
            {
                id: randomNumber(),
                type: COLUMN,
                children: [
                    {
                        id: randomNumber(),
                        type: COMPONENT,
                        as: 'FormNumber',
                    },
                    {
                        id: randomNumber(),
                        type: COMPONENT,
                        as: 'FormText',
                    },
                    {
                        id: randomNumber(),
                        type: COMPONENT,
                        as: 'FormFile',
                    },
                ]
            }
        ]
    },
    {
        id: randomNumber(),
        type: ROW,
        children: [
            {
                id: randomNumber(),
                type: COLUMN,
                children: [
                    {
                        id: randomNumber(),
                        type: COMPONENT,
                        as: 'FormText',
                    },
                ]
            }
        ]
    },
]