<script setup lang="ts">
import {onMounted, ref} from "vue";
import {interpret} from "xstate";
import {appMachine} from '@/components/editor/machines/app.machine'
import Header from "@/components/editor/header/Header.vue";
import Sidebar from '@/components/editor/sidebar/Sidebar.vue'
import Layout from "@/components/editor/layout/Layout.vue";
import Sort from '@/components/editor/Sort.vue'

import {inspect} from '@xstate/inspect'
import Dragging from "../examples/Dragging.vue";

// inspect({
//   iframe: false
// })

const devTools = true

const service = interpret(appMachine, {devTools})

const {state, send} = service.start()

const current = ref(state.context)

onMounted(() => {
  const app = document.querySelector('#app')

  service.onTransition((state, event) => {
    current.value = state.context
  })
})
</script>

<template>
  <div class="editor-app-layout">
    <Header/>

    <Sidebar :actor-ref="state.context.sidebar.ref"/>

    <Layout :actor-ref="state.context.layout.ref"/>

  </div>
</template>

<style lang="scss">
@import "./src/scss/abstracts";

.editor-app-layout {

  .editor-layout-control {
    left: $off-canvas-width-xl;
    top: $app-header-height;
    width: calc(100% - #{$off-canvas-width-xl});

    @include set-breakpoint(tablet, down) {
      left: $off-canvas-width-md;
      width: calc(100% - #{$off-canvas-width-md});
    }

    @include set-breakpoint(smartphone, down) {
      left: $off-canvas-width-sm;
      width: calc(100% - #{$off-canvas-width-sm});
    }

    @include set-breakpoint(mobile, down) {
      left: $off-canvas-width-xsm;
      width: calc(100% - #{$off-canvas-width-xsm});
    }
  }
}
</style>