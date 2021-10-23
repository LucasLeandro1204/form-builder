import {createMachine} from "xstate";

const handlerEchoCallback = (context, event) => {
    return (callback, onReceive) => {
        onReceive(e => {
            if (e.type === 'FOO') {
                callback('ECHO'); // call the 'ECHO' action
            }
        })
    }
}

const callbackMachine = createMachine({
    id: 'callbackMachine',
    initial: 'listening',
    states: {
        listening: {
            invoke: {
                src: handlerEchoCallback,
                id: 'handlerEchoCallback'
            },
            on: {
                SPEAK: {
                    actions: send('FOO', {
                        to: 'handlerEchoCallback'
                    })
                },
                ECHO: {
                    actions: (context, event) => {
                        console.log('echo', context, event);
                    }
                }
            }
        }
    }
})