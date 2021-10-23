<template>
  <fieldset class="field-wrapper checkbox clear-top">
    <div class="control">
      <div v-if="options && options.length"
           class="field-checkbox">
        <label class="smart-placeholder ">{{ labelName }}</label>
        <div v-for="(option, idx) in optionsList" :key="idx"
             :class="{'checked': modelValue.toLowerCase() === option.toLowerCase()}"
             class="checkbox-item">
          <input @input="update($event.target.checked)"
                 :checked=" modelValue.toLowerCase() === option.toLowerCase()"
                 :name="uuid"
                 v-bind="config"
                 type="checkbox"
                 class="input checkbox">
          <label class="custom-checkbox">
            {{ option }}
          </label>
        </div>
      </div>
      <div v-else class="field-checkbox">
        <div class="checkbox-item">
          <input @input="update($event.target.checked)"
                 :name="uuid"
                 :checked="modelValue"
                 v-bind="config"
                 type="checkbox"
                 class="input checkbox">
          <label class="custom-checkbox">
            {{ labelName }}
          </label>
        </div>
      </div>
    </div>
  </fieldset>
</template>

<script>
import {computed, ref} from "vue";

export default {
  name: 'FormCheckbox',
  setup(props, context) {
    const value = ref(props.modelValue)
    const checkedValue = ref(props.checkedValue)
    const labelName = computed(() => props.label.capitalize())
    const optionsList = props.options.every(option =>  option.capitalize())

    const update = (value) => {
      context.emit('update:modelValue', value)
    }
    return {
      update,
      value,
      checkedValue,
      labelName,
      optionsList
    }
  },
  props: {
    uuid: {
      type: Number,
      default: 0,
    },
    modelValue: {
      required: true
    },
    model: {
      type: String,
      required: true,
    },
    checkedValue: {
      required: false,
      type: [String, Boolean]
    },
    label: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
    config: {
      type: Object,
      default: () => ({
        type: 'checkbox',
        disabled: false,
      })
    },
    validation: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
