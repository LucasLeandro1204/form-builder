<script setup lang="ts">
import {ActorRef} from 'xstate/lib/types'
import {useActor} from '@xstate/vue'
import {defineProps, computed, ref} from 'vue'

const props = defineProps<{
  fieldRef: ActorRef<any>
}>();

const {state, send} = useActor(props.fieldRef)

const label = computed(() => state.value.context.label)

</script>

<template>
  <li :class="{editing: state.matches('editing')}">
    <div class="input-group">
      <div v-if="state.context.type === 'column'">
        <div>
          {{state.context.column}}
        </div>
      </div>
      <div v-else-if="state.context.type === 'row'">
        <div v-for="col in state.context.rows">
          {{ col }}
        </div>
      </div>

    </div>
    <div class="button-group">
      <button @click="send('EDIT')">Edit</button>
      <button @click="send('DELETE')">Delete</button>
    </div>
  </li>
</template>


<!--      <input @input="send({ type: 'CHANGE', property: 'label', value: $event.target.value })"-->
<!--             @keypress.enter="send('COMMIT')"-->
<!--             @blur="send('BLUR')"-->
<!--             type="text"-->
<!--             ref="inputRef"/>-->