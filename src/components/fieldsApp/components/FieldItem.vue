<template>
  <li :class="{editing: state.matches('editing')}">
    <div class="label-group">
      {{label}}
    </div>
    <div class="input-group">
      <input @input="send({ type: 'CHANGE', property: 'label', value: $event.target.value })"
             @keypress.enter="send('COMMIT')"
             @blur="send('BLUR')"
             type="text"
             ref="inputRef"/>
    </div>
    <div class="button-group">
      <button @click="send('EDIT')">Edit</button>
      <button @click="send('DELETE')">Delete</button>
    </div>
  </li>
</template>

<script setup lang="ts">
import {ActorRef} from 'xstate/lib/types'
import {useActor} from '@xstate/vue'
import {defineProps, computed, ref} from 'vue'

const props = defineProps<{
  todoRef: ActorRef<any>
}>();

const {state, send} = useActor(props.todoRef)

const label = computed(() => state.value.context.label)

</script>
