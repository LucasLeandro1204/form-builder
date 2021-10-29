<script setup>
import {onMounted, ref} from "vue";
import {interpret} from "xstate";
import Sidebar from '@/components/editor/sidebar/Sidebar.vue'
import Layout from "@/components/editor/layout/Layout.vue";
import {appMachine} from '@/components/editor/machines/app.machine'

const devTools = true

const service = interpret(appMachine, {devTools})

const {state, send} = service.start()

const current = ref(state.context)

onMounted(() => {
  service.onTransition((state, event) => {
    if (state.changed) {
      current.value = state.context
    }
  })
})
</script>

<template>
  <div class="editor-app-layout">
    <Sidebar :actor-ref="state.context.sidebar.ref"/>
    <Layout :actor-ref="state.context.layout.ref"/>
  </div>
</template>

<style lang="scss">
@import "./src/scss/abstracts";

$off-canvas-width-xl: rem-calc(320);
$off-canvas-width-md: rem-calc(280);
$off-canvas-width-sm: rem-calc(240);
$off-canvas-width-xsm: rem-calc(200);

.editor-app-layout {
  display: grid;
  grid-template-columns: $off-canvas-width-md 1fr;
  position: relative;
  min-height: 100vh;
  background: #F9F9F9;
  overflow: hidden;
  width: 100%;

  @include set-breakpoint(tablet, down) {
    grid-template-columns:$off-canvas-width-md 1fr;
  }

  @include set-breakpoint(smartphone, down) {
    grid-template-columns: $off-canvas-width-sm 1fr;
  }
}
</style>