/**
 * Managing form validation rules for registration.
 *
 * @returns {Object} - An object containing the form validation rules for `name` and `credits`.
 */

import { reactive } from 'vue'
import type { FormRules, FormItemRule } from 'element-plus'

// ─────────────────────────────
// Types
// ─────────────────────────────

type ValidatorCallback = (error?: Error) => void
type ValidatorRule = FormItemRule & {
  validator?: (rule: FormItemRule, value: number, callback: ValidatorCallback) => void
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
      validator: (rule: FormItemRule, value: number, callback: ValidatorCallback) => {
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
