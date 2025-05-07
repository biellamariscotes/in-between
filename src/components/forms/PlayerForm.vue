<template>
  <div class="form-container">
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
      <el-row :gutter="15" class="form-row">
        <template v-for="(field, index) in dynamicInputFields" :key="index">
          <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8" class="form-col">
            <div class="item-wrapper">
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
          </el-col>
        </template>
      </el-row>
    </el-form>

    <div class="btn-group">
      <Button btnType="submit" variant="secondary" @click="onSubmit">Continue</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ComponentSize, FormInstance, FormProps } from 'element-plus'
import type { Player } from '@/interface/player'
import { useRegistrationRule } from '@/composables/rules/useRegistrationRule'
import { usePlayerRegistration } from '@/stores/player'
import { useRouter } from 'vue-router'

const labelPosition = ref<FormProps['labelPosition']>('left')
const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const playerRegistration = usePlayerRegistration()
const router = useRouter()

const numberOfPlayers = Number(localStorage.getItem('playerCount')) || 0

// Initialize dynamicInputFields as an array
const dynamicInputFields = ref<Player[]>(
  Array.from({ length: numberOfPlayers }, () => ({ name: '', credits: null })),
)

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
</script>

<style lang="css" scoped>
.demo-ruleForm {
  overflow-y: auto;
  height: auto;
  max-height: calc(100vh - 120px); /* Adjust based on your header height */
  width: 100%;
  padding: 2rem;
}

.form-row {
  width: 100%;
  margin: 0;
  overflow-y: visible;
}

.form-col {
  padding-bottom: 20px;
}

.item-wrapper {
  padding: 1rem 1.5rem;
  background-color: white;
  border-radius: 15px;
  height: auto;
  min-height: 160px;
  width: 100%;
}

.form-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: calc(100vh - 100px);
  overflow: hidden;
  width: 100%;
}

.btn-group {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 1rem 0;
  width: 100%;
  position: sticky;
  bottom: 0;
  z-index: 5;
  margin-top: 10px;
}

/* Small screens (sm breakpoint) - ensure scrollable */
@media (max-width: 768px) {
  .demo-ruleForm {
    padding: 1rem;
    max-height: calc(100vh - 100px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .form-row {
    flex: 1;
    width: 100%;
    overflow-y: visible;
  }

  .item-wrapper {
    padding: 1rem;
    min-height: 140px;
    width: 100%;
  }

  :deep(.el-input) {
    max-width: 100%;
  }

  .btn-group {
    position: sticky;
    bottom: 0;
    z-index: 5;
    padding: 0.75rem 0;
    width: 100%;
  }
}

/* For landscape mobile */
@media (max-width: 932px) and (max-height: 430px) {
  .demo-ruleForm {
    padding: 0.75rem;
    max-height: calc(100vh - 60px);
    overflow-y: auto;
    width: 100%;
  }
  
  .form-row {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  
  /* Override the el-col default breakpoints for landscape mode */
  :deep(.el-col-xs-24) {
    width: 50% !important;
    max-width: 50% !important;
    flex: 0 0 50% !important;
  }
  
  .form-col {
    width: 50% !important;
    max-width: 50% !important;
    flex: 0 0 50% !important;
    padding: 0 8px 15px;
  }
  
  .item-wrapper {
    padding: 0.75rem;
    min-height: 110px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  :deep(.el-form-item) {
    margin-bottom: 8px;
  }
  
  :deep(.el-form-item__label) {
    font-size: 0.85em;
    padding-bottom: 2px;
  }
  
  :deep(.el-input__inner) {
    font-size: 0.85em;
  }
  
  :deep(.el-input) {
    max-width: 100%;
  }
  
  .btn-group {
    position: sticky;
    bottom: 0;
    z-index: 5;
    padding: 0.5rem 0;
  }
}

/* Extra small screens like small phones */
@media (max-width: 480px) {
  .demo-ruleForm {
    padding: 0.75rem;
  }
  
  .item-wrapper {
    padding: 0.75rem;
    min-height: 130px;
  }
  
  :deep(.el-form-item__label) {
    font-size: 0.9em;
  }
}

:deep(.el-form-item.is-error .el-input__wrapper) {
  box-shadow: none;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  letter-spacing: 1.2px;
  font-size: 1.1125em;
  text-transform: uppercase;
  color: black;
}

:deep(.el-input) {
  max-width: 250px;
  width: 100%;
  border: none !important;
}

:deep(.el-form-item__label-wrap) {
  display: block;
}

:deep(
  .el-form-item.is-required:not(.is-no-asterisk).asterisk-left
    > .el-form-item__label-wrap
    > .el-form-item__label:before
) {
  content: '' !important;
}

:deep(.el-input__wrapper) {
  padding: 0.2rem 0.5rem;
  border-bottom: 1px solid black;
  background: transparent;
  box-shadow: none;
  border-radius: 0;
}

:deep(.el-input__inner) {
  font-size: 1em;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1.2px;
}
</style>