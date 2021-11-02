<script setup>
import {mutationSequenceMachine} from "./machines/mutationSequenceMachine";
import {interpret} from 'xstate';
import {layout} from '@/components/editor/data/layout.components'

const service = interpret(mutationSequenceMachine, {devTools: true}).onTransition(state => {
  console.log('state', state)
  console.log('layout', layout)
}).start()

const filterDeep = (pred) => (obj) =>
    Object(obj) === obj
        ? Object.fromEntries(
            Object.entries(obj)
                .flatMap(([k, v]) => pred(v) ? [[k, filterDeep(pred)(v)]] : [])
        )
        : obj

const removeItem = (targetId, graph) =>
    filterDeep(({metadata: {id} = {}}) => id !== targetId)(graph)

const graph = {
  metadata: {id: "sms_in", type: "api", optionsDivId: "div_sms_in", options: {}},
  data: {
    true: {
      isEmpty1: {
        metadata: {id: "isEmpty1", type: "empty", optionsDivId: "div_isEmpty1", options: {}},
        data: {
          true: {sms1: {metadata: {id: "sms1", type: "api", optionsDivId: "div_sms1", options: {}}, data: {true: {}, false: !1}}},
          false: {
            dbInsert1: {
              metadata: {id: "dbInsert1", type: "dbInsert", optionsDivId: "div_dbInsert1", options: {}},
              data: {
                true: {sms2: {metadata: {id: "sms2", type: "api", optionsDivId: "div_sms2", options: {}}, data: {true: {}, false: !1}}},
                false: !1
              }
            }
          }
        }
      }
    }, false: !1
  }
}

console.log(removeItem('dbInsert1', graph))
console.log(removeItem('sms2', graph))

</script>

<template>
  <div>

  </div>
</template>

<style lang="scss">
@import "./src/scss/abstracts";

</style>