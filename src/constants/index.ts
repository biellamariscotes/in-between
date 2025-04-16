import type { Player } from '@/interface/player'
import type { FormRules } from 'element-plus'
import { reactive } from 'vue'

export const rules = reactive<FormRules<Player>>({
  name: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, message: 'Length should be 3 and above', trigger: 'blur' },
  ],
  credits: [
    { required: true, message: 'Please input Credit Score', trigger: 'blur' },
    { type: 'number', message: 'Credit must be a number' },
    {
      validator: (rule, value, callback) => {
        if (value === null || value < 100) {
          callback(new Error('Credit should be 100 and above'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})
