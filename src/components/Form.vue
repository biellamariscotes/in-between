<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <el-form
    ref="ruleFormRef"
    :model="registrationForm"
    :rules="rules"
    label-width="auto"
    class="demo-ruleForm"
    :label-position="labelPosition"
    :size="formSize"
    status-icon
    @submit.prevent="onSubmit"
  >
    <div class="item-wrapper">
      <el-form-item label="Name:" prop="name">
        <el-input size="small" v-model="registrationForm.name" />
      </el-form-item>

      <el-form-item label="Credits:" prop="credits">
        <el-input size="small" v-model.number="registrationForm.credits" />
      </el-form-item>
    </div>

    <div class="item-wrapper">
      <el-form-item label="Name:" prop="name">
        <el-input size="small" v-model="registrationForm.name" />
      </el-form-item>

      <el-form-item label="Credits:" prop="credits">
        <el-input size="small" v-model.number="registrationForm.credits" />
      </el-form-item>
    </div>

    <div class="item-wrapper">
      <el-form-item label="Name:" prop="name">
        <el-input size="small" v-model="registrationForm.name" />
      </el-form-item>

      <el-form-item label="Credits:" prop="credits">
        <el-input size="small" v-model.number="registrationForm.credits" />
      </el-form-item>
    </div>

    <div class="item-wrapper">
      <el-form-item label="Name:" prop="name">
        <el-input size="small" v-model="registrationForm.name" />
      </el-form-item>

      <el-form-item label="Credits:" prop="credits">
        <el-input size="small" v-model.number="registrationForm.credits" />
      </el-form-item>
    </div>

    <div class="btn-group">
      <Button btnType="submit" variant="secondary" class="next-btn">Start Game</Button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { ComponentSize, FormInstance, FormProps } from 'element-plus'
// import Button from '@/components/Button.vue'
import type { Player } from '@/interface/player'
import { rules } from '@/constants'
import { usePlayerRegistration } from '@/stores/player'

const labelPosition = ref<FormProps['labelPosition']>('left')
const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const playerRegistration = usePlayerRegistration()

const registrationForm = reactive<Player>({
  name: '',
  credits: null,
})

const resetForm = () => {
  registrationForm.name = ''
  registrationForm.credits = null
}

const onSubmit = async () => {
  try {
    const isValid = await ruleFormRef.value?.validate()
    if (isValid) {
      playerRegistration.registerPlayer({
        id: Math.floor(Math.random() * 10000),
        ...registrationForm,
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
  height: 140px;
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
