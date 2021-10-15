import {sendParent} from 'xstate';
import {createModel} from 'xstate/lib/model';

const fieldModel = createModel(
    {
        id: '',
        component: '',
        label: '',
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
    label: string;
}

export const createFieldMachine = ({id, component, label}: Field) => {
    return fieldModel.createMachine(
        {
            id: 'field',
            initial: 'reading',
            context: {
                id,
                component,
                label,
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
                            actions: fieldModel.assign((context, event) => ({
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
