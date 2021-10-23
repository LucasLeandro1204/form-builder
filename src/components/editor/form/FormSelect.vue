<template>
  <label :for="uuid" v-html="label"/>
  <select :value="modelValue"
          :required="required"
          :id="uuid"
          @input="update($event.target.value)">
    <option v-if="!disableNoSelection">
      Kies uit één van de opties
    </option>
    <option v-for="option in options"
            :key="option"
            :value="option"
            :selected="option === modelValue">
      {{ option }}
    </option>
  </select>
</template>

<script>
export default {
  props: {
    modelValue: {required: true},
    required: {
      type: Boolean,
      default: false,
    },
    config: {
      type: Object,
      default: () => {
      },
    },
    uuid: {
      type: Number,
      default: 0,
    },
    label: {type: String, required: true},
    options: {type: Array, required: true},
    disableNoSelection: {type: Boolean, default: false},
    validations: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
  },
  methods: {
    update(value) {
      this.$emit("update:modelValue", value);
    },
  },
};
</script>
