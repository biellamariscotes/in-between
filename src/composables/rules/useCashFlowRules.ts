import { reactive } from 'vue'
import type { FormRules, FormItemRule } from 'element-plus'


type ValidatorCallback = (error?: Error) => void
type ValidatorRule = FormItemRule & {
  validator?: (rule: FormItemRule, value: number, callback: ValidatorCallback) => void
}


export const useCashFlowRules = reactive<FormRules>({
  credits: [
    { type: 'number', message: 'Credit must be a number' },
    {
      validator: (rule: FormItemRule, value: number, callback: ValidatorCallback) => {
        if (value === null || value < 200) {
          callback(new Error('Credit should be 200 and above'))
        } else if (value > 100000000 || !Number.isFinite(value)) {
          callback(new Error('Credit should be a finite number and less than 1,000,000,000'))
        } else {
          callback()
        }
      },
      trigger: 'change',
    } as ValidatorRule,
  ],
})


