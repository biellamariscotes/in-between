/**
 * Fetch data from the specified API endpoint.
 * This function uses the Fetch API to retrieve data
 * and updates the `data` variable with the response.
 *
 * @param {string} dataFilePath - The filepath of the constant data.
 * @returns {Promise<void>} - A promise that resolves when the data is fetched.
 */

import { ref, onMounted } from 'vue'

export function useDataFetcher<T>(dataFilePath: string) {
  const data = ref<T | null>(null)

  const fetchData = async () => {
    try {
      const response = await fetch(dataFilePath)
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }
      data.value = await response.json()
    } catch (error) {
      console.error(error)
    }
  }

  onMounted(fetchData)

  return {
    data,
  }
}
