<!-- Button Component
  A reusable button component with variant styling and event handling.

  Props:
    - btnType (optional): 'button' | 'submit' | 'reset' — Defaults to 'button'.
    - variant (optional): 'primary' | 'secondary' | 'danger' | 'delete' — Controls button styling.
    - disabled (optional): boolean — Disables button if true.

  Emits:
    - 'click': Triggered when the button is clicked (if not disabled).

  Features:
    - Dynamic classes based on variant and disabled state.

  Uses:
    - Default slot for button content.
-->

<template>
  <!-- Button Element -->
  <button :type="btnType" :class="classes" :disabled="disabled" @click="handleClick">
    <slot />
  </button>
</template>

<script setup lang="ts">
/**
 * Script setup section
 */
import { computed } from 'vue'

/**
 * Props
 */
const props = defineProps<{
  btnType?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger' | 'delete'
  disabled?: boolean
}>()

// ─────────────────────────────
// Computed Properties
// ─────────────────────────────

/**
 * Provides default value for btnType prop.
 */
const btnType = computed(() => props.btnType ?? 'button')

/**
 * Computes button CSS classes based on variant and disabled state.
 */
const classes = computed(() => {
  return [
    'my-button', // base class
    {
      'my-button--primary': !props.variant || props.variant === 'primary',
      'my-button--secondary': props.variant === 'secondary',
      'my-button--danger': props.variant === 'danger' || props.variant === 'delete',
    },
    { 'my-button--disabled': props.disabled },
  ]
})

// ─────────────────────────────
// Emits
// ─────────────────────────────

/**
 * Emits:
 * - 'click' event when button is clicked and not disabled.
 */
const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

/**
 * Handles button click events.
 * Emits 'click' only if button is not disabled.
 */
function handleClick(event: MouseEvent) {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>
<style scoped>
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
  border: 3px solid;
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

/* Add media queries for iPhone 14 Pro Max landscape format */
@media (max-width: 932px) and (max-height: 430px) {
  .my-button {
    padding: 0.5rem 1rem;
    font-size: 0.7rem;
  }
}
</style>
