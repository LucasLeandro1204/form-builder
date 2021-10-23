<template>
  <div>
    hey
    <input @input="event => send({ type: 'filter', input: event.target.value })" :value="state.context.input" placeholder="Filter plants .."/>
    <div v-for="(plant, index) in state.context.filtered" :key="index">
      <p>{{ plant }}</p>
    </div>
  </div>
</template>

<script setup>
import {useMachine} from "@xstate/vue";
import {filterMachine} from "./filter.machine";

const {state, send} = useMachine(filterMachine, {devTools: true});

</script>