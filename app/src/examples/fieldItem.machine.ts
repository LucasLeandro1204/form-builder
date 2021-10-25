import {sendParent} from 'xstate';
import {createModel} from 'xstate/lib/model';
import {ActorRef} from "xstate/lib/types";

const fieldModel = createModel(
    {
        id: '',
        component: '',
        ref: null,
    },
    {
        events: {
            DELETE: () => ({}),
            EDIT: () => ({}),
            CHANGE: (value: string) => ({value}),
            COMMIT: () => ({}),
            BLUR: () => ({}),
            CANCEL: () => ({})
        }
    }
);

interface Field {
    id: string;
    component: string;
    ref: ActorRef<any>;
}

export const createFieldMachine = ({id, component, ref}: any) => {
    return fieldModel.createMachine(
        {
            id: 'field',
            initial: 'reading',
            context: {
                id,
                component,
                ref,
            },
            on: {
                DELETE: 'deleted'
            },
            states: {
                reading: {
                    on: {
                        EDIT: {
                            target: 'editing',
                            actions: 'focusInput'
                        }
                    }
                },
                dragging: {
                    on: {
                        CANCEL: {
                            target: 'reading'
                        }
                    }
                },
                editing: {
                    on: {
                        CHANGE: {
                            actions: fieldModel.assign((context, event: any) => ({
                                [event.property]: event.value
                            }))
                        },
                        COMMIT: {
                            target: 'reading',
                            actions: sendParent((context) => ({
                                type: 'FIELD.COMMIT',
                                field: context
                            })),
                        },
                        BLUR: {
                            target: 'reading',
                            actions: sendParent((context) => ({
                                type: 'FIELD.COMMIT',
                                field: context
                            }))
                        },
                    }
                },
                deleted: {
                    entry: sendParent((context) => ({
                        type: 'FIELD.DELETE',
                        id: context.id
                    }))
                }
            }
        },
        {
            actions: {
                commit: sendParent((context) => ({
                    type: 'FIELD.COMMIT',
                    field: context
                })),
                focusInput: () => {
                }
            }
        }
    );
};
