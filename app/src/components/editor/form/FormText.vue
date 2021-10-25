<template>
  <fieldset class="field-wrapper"
            :class="validationClasses()">
    <div class="form-text">
      <FormLabel :for="uuid" :label="label"/>
      <div class="control" :class="validationClasses()">
        <input @input="onInput"
               @focus="onFocus"
               @blur="onBlur"
               :type="field.type"
               :value="field.value"
               :id="field.uuid"
               :name="field.name"
               :placeholder="field.placeholder"
               :disabled="field.disabled"
               :class="{'disabled': field.disabled}"
               class="input input-text"/>
<!--        <FieldFeedbackVisual :class-list="validationClasses()"/>-->
      </div>
<!--      <ErrorMessage :validation="validation"/>-->
<!--      <PasswordAdditions @togglePassword="togglePassword"-->
<!--                         :initial-type="initialType"-->
<!--                         :type="field.type"-->
<!--                         :value="field.value"/>-->
    </div>
  </fieldset>
</template>

<script>
import {computed, reactive, ref, unref} from "vue";
import FormLabel from "./FormLabel.vue";
// import ErrorMessage from "@/components/editor/FieldErrorMessage.vue"
// import FieldFeedbackVisual from "@/components/editor/FieldVisualFeedback.vue";
// import PasswordAdditions from "@/components/form/helpers/FieldPasswordAdditions.vue";

export default {
  emits: ['update:modelValue', 'focus', 'blur'],
  components: {
    // PasswordAdditions,
    // FieldFeedbackVisual,
    FormLabel,
    // ErrorMessage
  },
  setup(props, context) {

    const config = unref(props.config)
    const useValidation = unref(props.useValidation)
    const validation = unref(props.validation)
    const initialType = config.type

    const field = reactive({
      uuid: props.uuid,
      type: config.type,
      label: props.label,
      name: props.model,
      value: props.value || '',
      disabled: !!(context.attrs.disabled || config.readonly || config.disabled),
      placeholder: computed(() => field.focused ? '' : config.placeholder ? config.placeholder : field.label),
      focused: false,
    })

    const settings = reactive({
      labelAlwaysVisible: true,
      animationsEnabled: false,
    })

    const validationClasses = () => {
      return {
        'focused': !!field.focused,
        'invalid': !!(props.validation?.errorMessage && props.validation?.meta.touched),
        'has-tooltip': !!props.tooltip?.text,
        'label-visible': !!settings.labelAlwaysVisible,
        'animation-disabled': !settings.animationsEnabled,
        'disabled': !!field.disabled,
        ...props.validation.meta
      }
    }

    const onFocus = () => {
      context.emit('focus', field)
      field.focused = true
    }

    const onBlur = () => {
      if (useValidation) validation.setTouched(true)
      context.emit('blur', field)
      field.focused = false
    }

    const togglePassword = (event) => {
      field.type = event ? 'password' : 'text'
    }

    const onInput = (event) => {
      field.value = event.target.value
      context.emit('update:modelValue', event.target.value)
    }

    return {
      field,
      initialType,
      onInput,
      onFocus,
      onBlur,
      validationClasses,
      togglePassword,
    };
  },
  props: {
    uuid: {
      type: Number,
      default: 0,
    },
    model: {
      required: true,
    },
    value: {
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    validation: {
      type: Object,
      default: () => ({}),
    },
    tooltip: {
      type: Object,
      default: () => ({text: ''}),
    },
    config: {
      type: Object,
      default: () => ({
        placeholder: '',
        autocomplete: 'on',
        type: 'text',
        disabled: false,
      })
    },
    useValidation: {
      type: Boolean,
      default: () => false
    }
  },
};
</script>
