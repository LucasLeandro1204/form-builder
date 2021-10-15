<template>
  <main :data-state="state.toStrings()">
    <header>
      <h1>Fields</h1>
      <div class="button-group">
        <button @click="send({ type: 'NEW.FIELD.COMMIT', as: 'text'})">ADD TEXT</button>
        <button @click="send({ type: 'NEW.FIELD.COMMIT', as: 'section'})">ADD SECTION</button>
        <button @click="send({ type: 'NEW.FIELD.COMMIT', as: 'row'})">ADD ROW</button>
      </div>
    </header>
    <section>
      <ul>
        <FieldItem v-for="fieldItem in fields"
                  :key="fieldItem.id"
                  :todo-ref="fieldItem.ref"/>
      </ul>
    </section>
  </main>
</template>
<script setup lang="ts">
import FieldItem from './components/FieldItem.vue';
import {fieldsMachine} from './machines/fields.machine';
import {useMachine} from '@xstate/vue';
import {computed} from 'vue';

const {state, send} = useMachine(fieldsMachine, {devTools: true});

const fields = computed(() => state.value.context.fields);
const field = computed(() => state.value.context.field);
</script>

<style lang="scss">

</style>