<script setup>
import {mutationSequenceMachine} from "./machines/mutationSequenceMachine";
import {interpret} from 'xstate';
import {layout} from '@/components/editor/data/layout.components'

const service = interpret(mutationSequenceMachine, {devTools: true}).onTransition(state => {
  console.log('state', state)
  console.log('layout', layout)
}).start()

</script>

<template>
  <div>

  </div>
</template>

<style lang="scss">
@import "./src/scss/abstracts";

</style>