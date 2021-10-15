<template>
<div v-for="(icon, i) in icons" :key="i" >
  <img :src="icon" alt=""/>
</div>
</template>
<script setup lang="ts">
import {icons} from "@/mixins/icons"

console.log(icons)

</script>
<style lang="scss">

img {
  height:60px;
  width: 60px;
}
</style>
