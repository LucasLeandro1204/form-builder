<template>
  <Transition name="disabled">
<!--    <div v-if="!!(validation.errorMessage && validation.meta.touched)">-->
    <div v-if="!!(validation.errorMessage)">
    <span class="field-error-message">{{ validation.errorMessage }}</span>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'ErrorMessage',
  props: {
    validation: {
      type: Object,
      required: true,
    },
    focused: {
      type: Boolean,
      default: false,
    },
  },
  setup() {

  }
}
</script>

<style lang="scss" scoped>
* {
  width: 100%;
  text-align: left;
}
</style>
