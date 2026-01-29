import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { TOKEN_KEY } from '@/utils/request'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY))
  const profile = ref(null)
  const family = ref(null)

  const isLoggedIn = computed(() => !!token.value)

  function setToken(t) {
    token.value = t
    if (t) localStorage.setItem(TOKEN_KEY, t)
    else localStorage.removeItem(TOKEN_KEY)
  }

  function setProfile(p) {
    profile.value = p
  }

  function setFamily(f) {
    family.value = f
  }

  function clear() {
    token.value = null
    profile.value = null
    family.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  return {
    token,
    profile,
    family,
    isLoggedIn,
    setToken,
    setProfile,
    setFamily,
    clear,
  }
})
