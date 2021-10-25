import {assign, createMachine} from 'xstate';

export interface DebounceMachineContext {
    action?: () => void;
}

export type DebounceMachineEvent = {
    type: 'GO';
    action: () => void;
};

const debounceMachine = createMachine<DebounceMachineContext,
    DebounceMachineEvent>(
    {
        id: 'debounce',
        initial: 'idle',
        states: {
            idle: {
                on: {
                    GO: {
                        actions: 'assignActionToContext',
                        target: 'debouncing',
                    },
                },
            },
            debouncing: {
                on: {
                    GO: {
                        actions: 'assignActionToContext',
                        target: 'debouncing',
                    },
                },
                after: {
                    120: {
                        target: 'idle',
                        actions: 'performAction',
                    },
                },
            },
        },
    },
    {
        actions: {
            // @ts-ignore
            clearAction: assign({
                action: undefined,
            }),
            assignActionToContext: assign((context, event) => {
                return {
                    action: event.action,
                };
            }),
            performAction: (context) => {
                // @ts-ignore
                return context.action();
            },
        }
    },
);

export default debounceMachine;
