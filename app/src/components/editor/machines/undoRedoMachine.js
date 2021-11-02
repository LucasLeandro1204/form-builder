// /*
// import React from "react";
// import {createMachine, assign} from "xstate";
//
// const editorMachine = createMachine(
//     {
//         id: "editor",
//         context: {
//             items: [],
//             past: [],
//             future: []
//         },
//         on: {
//             TOGGLE_MODE: "turbo",
//             ADD_SHAPE: {
//                 actions: ["updatePast", "addShape"]
//             }
//             DELETE_SHAPE: {
//                 actions: ["updatePast", "deleteShape"]
//             },
//             UNDO: {
//                 actions: ["undo"]
//             },
//             REDO: {
//                 actions: ["redo"]
//             }
//         }
//     },
//     {
//         actions: {
//             addShape: assign({
//                 items: (ctx, e) => [...ctx.items, e.shape]
//             }),
//             deleteShape: assign({
//                 items: (ctx, e) => [
//                     ...ctx.items.slice(0, e.index),
//                     ...ctx.items.slice(e.index + 1)
//                 ]
//             }),
//             updatePast: assign({
//                 past: ctx => [...ctx.past, ctx.items],
//                 future: []
//             }),
//             undo: assign(ctx => {
//                 const previous = ctx.past[ctx.past.length - 1];
//                 const newPast = ctx.past.slice(0, ctx.past.length - 1);
//                 return {
//                     past: newPast,
//                     items: previous,
//                     future: [ctx.items, ...ctx.future]
//                 };
//             }),
//             redo: assign(ctx => {
//                 const next = ctx.future[0];
//                 const newFuture = ctx.future.slice(1);
//                 return {
//                     past: [...ctx.past, ctx.items],
//                     items: next,
//                     future: newFuture
//                 };
//             })
//         }
//     }
// );
//
// const Circle = props => (
//     <Box
//         as="button"
//         bg="green.500"
//         borderRadius="50%"
//         mx="auto"
//         height={80}
//         width={80}
//         {...props}
//     />
// );
// const Square = props => (
//     <Box as="button" mx="auto" bg="red.500" height={80} width={80} {...props} />
// );
//
// export default function App() {
//     const [state, send] = useMachine(editorMachine);
//
//     const {items, future, past} = state.context;
//
//     return (
//         <ThemeProvider>
//             <ColorModeProvider>
//                 <CSSReset/>
//                 <Box
//                     display="flex"
//                     height="100vh"
//                     width="100vw"
//                     alignItems="center"
//                     justifyContent="center"
//                     flexDir="column"
//                     p={10}>
//                     <SimpleGrid
//                         minHeight={400}
//                         minChildWidth="80px"
//                         spacing={4}
//                         width="full"
//                         maxWidth="md"
//                         justifyContent="center">
//                         {items.map((shape, index) =>
//                             shape === "circle" ? (
//                                 <Circle
//                                     key={index}
//                                     onClick={() => send("DELETE_SHAPE", {index})}
//                                 />
//                             ) : (
//                                 <Square
//                                     key={index}
//                                     onClick={() => send("DELETE_SHAPE", {index})}
//                                 />
//                             )
//                         )}
//                     </SimpleGrid>
//                     <ButtonGroup pt={20} spacing={4}>
//                         <Button
//                             variantColor="red"
//                             onClick={() => send("ADD_SHAPE", {shape: "square"})}
//                         >
//                             {state.matches("turbo") && "Add 3 Squares"}
//                             {state.matches("normal") && "Add Square"}
//                         </Button>
//                         <Button
//                             variantColor="green"
//                             onClick={() => send("ADD_SHAPE", {shape: "circle"})}
//                         >
//                             {state.matches("turbo") && "Add 3 Circles"}
//                             {state.matches("normal") && "Add Circle"}
//                         </Button>
//                         <Button
//                             leftIcon="arrow-back"
//                             variantColor="teal"
//                             disabled={past.length <= 0}
//                             onClick={() => send("UNDO")}
//                         >
//                             Undo
//                         </Button>
//                         <Button
//                             rightIcon="arrow-forward"
//                             variantColor="teal"
//                             disabled={future.length <= 0}
//                             onClick={() => send("REDO")}
//                         >
//                             Redo
//                         </Button>
//                     </ButtonGroup>
//                     <Box pt={4}>
//                         <Button
//                             size="lg"
//                             variantColor="blue"
//                             onClick={() => send("TOGGLE_MODE")}
//                         >
//                             {state.matches("turbo") && "Switch to Normal"}
//                             {state.matches("normal") && "Switch to Turbo"}
//                         </Button>
//                     </Box>
//                 </Box>
//             </ColorModeProvider>
//         </ThemeProvider>
//     );
// }
// */
