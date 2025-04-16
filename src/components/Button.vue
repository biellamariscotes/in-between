<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <button :type="btnType" :class="classes" :disabled="disabled" @click="handleClick">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// define props btnType controls button behavior
// variant controls the style, and disabled is optional
const props = defineProps<{
  btnType?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger' | 'delete'
  disabled?: boolean
}>()

// provide default value for btnType
const btnType = computed(() => props.btnType ?? 'button')

// compute CSS classes based on the variant prop.
const classes = computed(() => {
  return [
    'my-button', // base button class
    {
      'my-button--primary': !props.variant || props.variant === 'primary',
      'my-button--secondary': props.variant === 'secondary',
      'my-button--danger': props.variant === 'danger' || props.variant === 'delete',
    },
    // optionally add styles for disabled
    { 'my-button--disabled': props.disabled },
  ]
})

// setup event emitter
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

function handleClick(event: MouseEvent) {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style lang="css" scoped>
.my-button {
  padding: 0.8rem 1.8rem;
  border: none;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
}

.my-button--secondary {
  background-color: black;
  color: white;
  border-radius: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;
  border: 5px solid;
  border-image: linear-gradient(
    180deg,
    #ffb53d 0%,
    #000000 49.99%,
    #ffffff 50%,
    #865200 75%,
    #765c33 87.5%
  );
  border-image-slice: 1;

  /* Clip to match rounded border */
  clip-path: inset(0 round 10px);
}
</style>
