// useNotification.ts
import { ElNotification } from 'element-plus'

interface NotificationOptions {
  title: string
  message: string
  type?: 'success' | 'warning' | 'info' | 'error'
}

export function useNotification() {
  const showNotification = ({ title, message, type = 'success' }: NotificationOptions) => {
    ElNotification({
      title,
      message,
      type,
    })
  }

  return {
    showNotification,
  }
}
