import { ref, onMounted, onUnmounted } from 'vue'

export function useTyping(texts: string[], typeSpeed = 100, deleteSpeed = 30, pauseTime = 2000) {
  const displayText = ref('')
  let textIndex = 0
  let charIndex = 0
  let isDeleting = false
  let timer: ReturnType<typeof setTimeout> | null = null

  function tick() {
    const currentText = texts[textIndex]

    if (!isDeleting) {
      displayText.value = currentText.substring(0, charIndex + 1)
      charIndex++

      if (charIndex === currentText.length) {
        timer = setTimeout(() => {
          isDeleting = true
          tick()
        }, pauseTime)
        return
      }
      timer = setTimeout(tick, typeSpeed)
    } else {
      displayText.value = currentText.substring(0, charIndex - 1)
      charIndex--

      if (charIndex === 0) {
        isDeleting = false
        textIndex = (textIndex + 1) % texts.length
      }
      timer = setTimeout(tick, deleteSpeed)
    }
  }

  onMounted(() => {
    tick()
  })

  onUnmounted(() => {
    if (timer) clearTimeout(timer)
  })

  return { displayText }
}
