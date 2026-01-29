<template>
  <div class="min-h-screen min-h-[100dvh] flex flex-col bg-background-light safe-top safe-inset-bottom">
    <header class="flex items-center justify-between px-5 py-4">
      <button
        type="button"
        class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/60 transition-colors"
        @click="goBack"
      >
        <span class="material-symbols-outlined text-slate-600">arrow_back_ios_new</span>
      </button>
      <span class="text-slate-400 text-sm font-bold">注册</span>
      <div class="w-10"></div>
    </header>

    <main class="flex-1 flex flex-col items-center justify-center px-6 py-10">
      <div class="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/20 text-primary mb-8">
        <span class="material-symbols-outlined font-bold text-4xl">person_add</span>
      </div>
      <h1 class="text-2xl font-black tracking-tight text-slate-800 mb-1" style="font-family: ZCOOL KuaiLe, cursive">注册新账号</h1>
      <p class="text-slate-500 text-sm mb-10">创建账号后即可登录，同步冰箱数据</p>

      <form class="w-full max-w-sm space-y-4" @submit.prevent="handleSubmit">
        <input
          v-model="form.username"
          type="text"
          placeholder="用户名"
          autocomplete="username"
          class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
        />
        <input
          v-model="form.password"
          type="password"
          placeholder="密码"
          autocomplete="new-password"
          class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
        />
        <input
          v-model="form.confirmPassword"
          type="password"
          placeholder="确认密码"
          autocomplete="new-password"
          class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
        />
        <button
          type="submit"
          :disabled="submitting"
          class="w-full h-14 rounded-2xl bg-primary text-slate-900 font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-60 disabled:pointer-events-none"
        >
          <span class="material-symbols-outlined font-bold">person_add</span>
          {{ submitting ? '注册中…' : '注册' }}
        </button>
      </form>

      <router-link
        :to="loginRoute"
        class="mt-8 text-slate-500 text-sm font-bold hover:text-primary transition-colors"
      >
        已有账号？去登录
      </router-link>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { register as apiRegister } from '@/api/auth'
import { TOKEN_KEY } from '@/utils/request'
import { showToast } from '@/utils/toast'

const route = useRoute()
const router = useRouter()
const form = ref({ username: '', password: '', confirmPassword: '' })
const submitting = ref(false)

const loginRoute = computed(() => {
  const redirect = route.query.redirect
  return redirect ? { path: '/login', query: { redirect } } : { path: '/login' }
})

function goBack() {
  const redirect = route.query.redirect
  if (redirect) {
    router.replace(typeof redirect === 'string' ? redirect : '/')
  } else {
    router.replace('/login')
  }
}

async function handleSubmit() {
  const { username, password, confirmPassword } = form.value
  if (!username?.trim()) {
    showToast('请输入用户名', 'error')
    return
  }
  if (!password) {
    showToast('请输入密码', 'error')
    return
  }
  if (password !== confirmPassword) {
    showToast('两次输入的密码不一致', 'error')
    return
  }
  submitting.value = true
  try {
    await apiRegister(username.trim(), password)
    if (typeof localStorage !== 'undefined') localStorage.removeItem(TOKEN_KEY)
    showToast('注册成功，请登录', 'success')
    router.replace(loginRoute.value)
  } catch (e) {
    showToast(e.message || '注册失败', 'error')
  } finally {
    submitting.value = false
  }
}
</script>
