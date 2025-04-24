<!-- PlayerRegistrationForm Component
  Handles player registration with dynamic form fields based on player count.
  
  Props:
    None - Uses localStorage for player count configuration.
  
  Features:
    - Dynamic form fields generation based on player count.
    - Form validation using Element Plus rules.
    - Responsive layout with special handling for odd number of players.
    - Player data persistence using store.
  
  Uses:
    - Element Plus form components.
    - Vue Router for navigation.
    - Player registration store for state management.
    - Custom validation rules.
-->

<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-form
    ref="ruleFormRef"
    :model="dynamicInputFields"
    :rules="useRegistrationRule"
    label-width="auto"
    class="demo-ruleForm"
    :label-position="labelPosition"
    :size="formSize"
    status-icon
    @submit.prevent="onSubmit"
  >
    <!-- Dynamic Player Input Fields -->
    <div
      v-for="(field, index) in dynamicInputFields"
      :key="index"
      :class="['item-wrapper', isLastInOddArray(index) ? 'center-item' : '']"
    >
      <el-form-item
        :label="'Name:'"
        :prop="'[' + index + '].name'"
        :rules="useRegistrationRule.name"
      >
        <el-input size="small" v-model="dynamicInputFields[index].name" />
      </el-form-item>

      <el-form-item
        :label="'Credits:'"
        :prop="'[' + index + '].credits'"
        :rules="useRegistrationRule.credits"
      >
        <el-input size="small" v-model.number="dynamicInputFields[index].credits" />
      </el-form-item>
    </div>

    <!-- Form Controls -->
    <div class="btn-group">
      <Button btnType="submit" variant="secondary">Start Game</Button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
/**
 * Script setup section
 */
import { ref } from 'vue'
import type { ComponentSize, FormInstance, FormProps } from 'element-plus'
import type { Player } from '@/interface/player'
import { useRegistrationRule } from '@/composables/rules/useRegistrationRule'
import { usePlayerRegistration } from '@/stores/player'
import { useRouter } from 'vue-router'

/**
 * Form configuration
 */
const labelPosition = ref<FormProps['labelPosition']>('left')
const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()

/**
 * Store and router
 */
const playerRegistration = usePlayerRegistration()
const router = useRouter()

/**
 * Initialize dynamic form fields
 */
const numberOfPlayers = Number(localStorage.getItem('playerCount')) || 0

// Initialize dynamicInputFields as an array
const dynamicInputFields = ref<Player[]>(
  Array.from({ length: numberOfPlayers }, () => ({ name: '', credits: null })),
)

// ─────────────────────────────
// Form Methods
// ─────────────────────────────

/**
 * Handles form submission with validation
 * Registers valid players and navigates to game zone
 */
const onSubmit = async () => {
  try {
    const isValid = await ruleFormRef.value?.validate()
    if (isValid) {
      // Filter out empty entries
      const validPlayers = dynamicInputFields.value.filter(
        (player) => player.name && player.credits,
      )

      // Clear existing players first
      playerRegistration.clearPlayers()

      // Register each valid player individually
      validPlayers.forEach((player) => {
        playerRegistration.registerPlayer({
          id: Math.floor(Math.random() * 10000),
          name: player.name,
          credits: player.credits,
        })
      })
      // Reset the form fields
      ruleFormRef.value?.resetFields()

      // Go to GameZone
      router.push('/game-zone')
    }
  } catch (error) {
    console.error('Error during form submission:', error)
  }
}

/**
 * Determines if the item is the last one in an odd-length array
 * Used for special styling of the last item when there's an odd number of players
 */
const isLastInOddArray = (index: number): boolean => {
  return dynamicInputFields.value.length % 2 !== 0 && index === dynamicInputFields.value.length - 1
}
</script>
