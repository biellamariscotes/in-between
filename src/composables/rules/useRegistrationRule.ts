import { reactive } from 'vue'
import type { FormRules, RuleItem } from 'element-plus'

// This makes TypeScript understand the validator function
type ValidatorCallback = (error?: Error) => void
type ValidatorRule = RuleItem & {
  validator?: (rule: any, value: any, callback: ValidatorCallback) => void
}

export const useRegistrationRule = reactive<FormRules>({
  name: [
    { required: true, message: 'Please input Activity name', trigger: 'change' },
    { min: 3, message: 'Length should be 3 and above', trigger: 'change' },
  ],
  credits: [
    { required: true, message: 'Please input Credit Score', trigger: 'change' },
    { type: 'number', message: 'Credit must be a number' },
    {
      validator: (rule: any, value: any, callback: ValidatorCallback) => {
        if (value === null || value < 100) {
          callback(new Error('Credit should be 100 and above'))
        } else {
          callback()
        }
      },
      trigger: 'change',
    } as ValidatorRule,
  ],
})
