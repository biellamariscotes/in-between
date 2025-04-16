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
    validate-on-rule-change="true"
    @submit.prevent="onSubmit"
  >
    <div v-for="(field, index) in dynamicInputFields" :key="index" class="item-wrapper">
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

    <div class="btn-group">
      <Button btnType="submit" variant="secondary" class="next-btn">Start Game</Button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ComponentSize, FormInstance, FormProps } from 'element-plus'
import type { Player } from '@/interface/player'
import { useRegistrationRule } from '@/composables/rules/useRegistrationRule'
import { usePlayerRegistration } from '@/stores/player'

const labelPosition = ref<FormProps['labelPosition']>('left')
const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const playerRegistration = usePlayerRegistration()

// Initialize dynamicInputFields as an array
const dynamicInputFields = ref<Player[]>(
  Array.from({ length: 6 }, () => ({ name: '', credits: null })),
)

const resetForm = () => {
  dynamicInputFields.value = dynamicInputFields.value.map(() => ({ name: '', credits: null }))
}

const onSubmit = async () => {
  try {
    const isValid = await ruleFormRef.value?.validate()
    if (isValid) {
      // Filter out empty entries
      const validPlayers = dynamicInputFields.value.filter(
        (player) => player.name && player.credits,
      )

      const playersData = JSON.stringify(validPlayers)

      // Save to local storage
      localStorage.setItem('players', playersData)

      // Register each valid player individually
      validPlayers.forEach((player) => {
        playerRegistration.registerPlayer({
          id: Math.floor(Math.random() * 10000),
          name: player.name,
          credits: player.credits,
        })
      })
      resetForm()
    }
  } catch (error) {
    console.error('Error during form submission:', error)
  }
}
</script>

<style lang="css" scoped>
.btn-group {
  display: flex;
  justify-content: center;
  align-items: center;
  grid-column: span 2;
}

.el-form {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  place-items: start center;
  gap: 2.5rem;
  padding: 2rem 4rem;
}

.item-wrapper {
  padding: 1rem 1.5rem;
  background-color: white;
  border-radius: 15px;
  height: 160px;
  width: 450px;
  max-width: 450px;
}

::v-deep .el-form-item.is-error .el-input__wrapper {
  box-shadow: none;
}

::v-deep .el-form-item__label {
  font-weight: 500;
  letter-spacing: 1.2px;
  font-size: 1.1125em;
  text-transform: uppercase;
  color: black;
}

::v-deep .el-input {
  max-width: 250px;
  width: 250px;
  border: none !important;
}

::v-deep .el-form-item__label-wrap {
  display: block;
}

::v-deep
  .el-form-item.is-required:not(.is-no-asterisk).asterisk-left
  > .el-form-item__label-wrap
  > .el-form-item__label:before {
  content: '' !important;
}

::v-deep .el-input__wrapper {
  padding: 0.2rem 0.5rem;
  border-bottom: 1px solid black;
  background: transparent;
  box-shadow: none;
  border-radius: 0;
}

::v-deep .el-input__inner {
  font-size: 1em;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1.2px;
}
</style>
