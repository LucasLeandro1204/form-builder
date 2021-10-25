import {COLUMN, COMPONENT, ROW} from "@/constants/index.ts";
import {nanoid} from 'nanoid';

export const layout = [
    {
        id: nanoid(),
        type: ROW,
        children: [
            {
                id: nanoid(),
                type: COLUMN,
                children: [
                    {
                        id: nanoid(),
                        type: COMPONENT,
                        as: 'FormNumber',
                    },
                    {
                        id: nanoid(),
                        type: COMPONENT,
                        as: 'FormText',
                    },
                ]
            }
        ]
    },
    {
        id: nanoid(),
        type: ROW,
        children: [
            {
                id: nanoid(),
                type: COLUMN,
                children: [
                    {
                        id: nanoid(),
                        type: COMPONENT,
                        as: 'FormNumber',
                    },
                    {
                        id: nanoid(),
                        type: COMPONENT,
                        as: 'FormText',
                    },
                    {
                        id: nanoid(),
                        type: COMPONENT,
                        as: 'FormFile',
                    },
                ]
            }
        ]
    },
    {
        id: nanoid(),
        type: ROW,
        children: [
            {
                id: nanoid(),
                type: COLUMN,
                children: [
                    {
                        id: nanoid(),
                        type: COMPONENT,
                        as: 'FormText',
                    },
                ]
            }
        ]
    },
]