import { onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

type StyleFile = 'gameZone.css' | 'landing.css' | 'home.css' | 'registration.css'

/**
 * Custom composable to manage dynamic style loading based on route metadata.
 *
 * @param {StyleFile | undefined} initialStyle - Optional initial style to load
 */
export const useDynamicStyle = (initialStyle?: StyleFile) => {
  const route = useRoute()

  // Function to load style file dynamically
  const loadStyle = (styleFile: StyleFile) => {
    const existingStyle = document.getElementById('dynamic-style')
    if (existingStyle) {
      existingStyle.remove()
    }

    if (styleFile) {
      const link = document.createElement('link')
      link.id = 'dynamic-style'
      link.rel = 'stylesheet'
      link.href = `/src/assets/styles/${styleFile}`
      document.head.appendChild(link)
    }
  }

  // Watch for route changes and load the corresponding style
  const stopWatch = watch(
    () => route.meta?.style as StyleFile | undefined, // assertion: meta.style is of type StyleFile or undefined
    (newStyle: StyleFile | undefined) => {
      if (newStyle) {
        loadStyle(newStyle)
      }
    },
    { immediate: true },
  )

  // Load the initial style if provided
  if (initialStyle) {
    loadStyle(initialStyle)
  }

  // Cleanup watch on component unmount
  onUnmounted(() => {
    stopWatch()
  })
}
