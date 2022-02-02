<script setup>
import sortMachine from './machines/sort.machine'
import {interpret} from "xstate";

import {inspect} from '@xstate/inspect'
import {computed, onMounted, ref, unref} from "vue";

inspect({iframe: false})

const devTools = true

const service = interpret(sortMachine, {devTools})

const {state, send} = service.start()

const currentState = ref(state.value)
const context = ref(state.context)

service.onTransition(state => {
  if (state.changed) {
    context.value = state.context
  }
})

const dataList = computed(() => context.value.dataList)

onMounted(() => {
  const body = document.body
  const datalist = document.querySelectorAll('.list-item')

  const handleDragstart = (event) => send({type: 'PICK_UP', index: event.target.dataset.index})
  const handleDragover = (event) => send({type: 'DRAG_REACHED_INTERSECTION', index: event.target.dataset.index})

  datalist.forEach(element => {
    element.addEventListener('dragstart', handleDragstart)
    element.addEventListener('dragover', handleDragover)
  })

  body.addEventListener('dragend', (event) => send({type: 'DROP', event}))
})

// send('PICK_UP')
// send('DROP')
// send('DRAG_REACHED_INTERSECTION')
</script>

<template>
  <div class="editor-layout-sort">
    <div>
      <pre>
       {{dataList}}
      </pre>
    </div>
    <div>
      <ul>
        <li v-for="(item, i) in dataList" :key="i" :data-index="i"
            class="list-item" draggable="true">
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
@import "./src/scss/abstracts";

.editor-layout-sort {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100%;

  > * {
    width: 100%;
  }
}

.list-item {
  padding: 1em 2em;
  border: solid rem-calc(1) #ccc;
  margin: 2px;
  cursor: grab;
  user-select: none;

  &:nth-child(even) {
    background-color: #fafafa;
  }
}
</style>