<template>
  <div class="backdrop">
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="registrationForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="Name:" prop="name">
        <el-input v-model="registrationForm.name" />
      </el-form-item>

      <el-form-item label="Credits:" prop="credits">
        <el-input v-model="registrationForm.credits" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'

interface RegistrationRule {
  name: string
  credits: number
}

const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const registrationForm = reactive<RegistrationRule>({
  name: '',
  credits: 0,
})

const rules = reactive<FormRules<RegistrationRule>>({
  name: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, message: 'Length should be 3 and above', trigger: 'blur' },
  ],
  credits: [
    { required: true, message: 'Please input Credit Score', trigger: 'blur' },
    { min: 100, message: 'Credit should be 100 and above', trigger: 'blur' },
    { type: 'number', message: 'Credit must be a number' },
  ],
})
</script>

<style lang="css" scoped>
.backdrop :deep(.el-form-item__label) {
  color: white !important;
}
</style>
