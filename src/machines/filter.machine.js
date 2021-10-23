import {createMachine, assign, actions} from "xstate";

const {cancel, send} = actions;

const tastyPlants = [
    "seeds 🌱",
    "mushrooms 🍄",
    "nuts 🥜",
    "broccoli 🥦",
    "leafy greens🥬"
];

const sendSlowFilterEventAfterDelay = send("slowFilter", {
    delay: context => (context.isPhone ? 800 : 450),
    id: "debounced-filter"
});

// the unique id is used to cancel the event
const cancelSlowFilterEvent = cancel("debounced-filter");

export const filterMachine = createMachine({
    id: "filter-plants",
    context: {
        isPhone: false,
        input: "",
        /**
         * With no input, every plant will be listed initially
         */
        filtered: tastyPlants
    },
    type: "parallel",
    states: {


        apiClient: {
            initial: "idle",
            on: {
                slowFilter: {
                    target: ".filtering",
                    actions: () => console.log("Starting to filter now")
                }
            },
            states: {
                idle: {},
                gettingPointerPath: {
                    invoke: {
                        id: "long-filter-operation",
                        src: (context, event) => new Promise(resolve => resolve(tastyPlants.filter(plant => plant.includes(context.input)))),
                        onDone: {
                            target: "idle",
                            actions: assign({filtered: (context, event) => event.data})
                        }
                    }
                }
            }
        },


        plantList: {
            initial: "isShown",
            states: {
                isShown: {
                    on: {
                        hideList: {
                            target: "isHidden"
                        },
                        filter: {
                            actions: [
                                assign({input: (context, event) => event.input}),
                                cancelSlowFilterEvent,
                                sendSlowFilterEventAfterDelay
                            ]
                        }
                    }
                },
                isHidden: {
                    entry: cancelSlowFilterEvent
                }
            }
        }
    }
});
