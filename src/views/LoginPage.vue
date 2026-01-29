<template>
  <div class="min-h-screen min-h-[100dvh] flex flex-col bg-background-light safe-top safe-inset-bottom">
    <header class="flex items-center justify-between px-5 py-4">
      <button
        type="button"
        class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/60 transition-colors"
        @click="goBack"
      >
        <span class="material-symbols-outlined text-slate-600">close</span>
      </button>
      <span class="text-slate-400 text-sm font-bold">登录</span>
      <div class="w-10"></div>
    </header>

    <main class="flex-1 flex flex-col items-center justify-center px-6 py-10">
      <div class="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-primary/20 text-primary mb-8">
        <span class="material-symbols-outlined font-bold text-4xl">eco</span>
      </div>
      <h1 class="text-2xl font-black tracking-tight text-slate-800 mb-1" style="font-family: ZCOOL KuaiLe, cursive">坏了么</h1>
      <p class="text-slate-500 text-sm mb-10">登录后同步数据，管理家庭冰箱</p>

      <form class="w-full max-w-sm space-y-4" @submit.prevent="handleSubmit">
        <input
          v-model="form.username"
          type="text"
          placeholder="用户名"
          class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
        />
        <input
          v-model="form.password"
          type="password"
          placeholder="密码"
          class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
        />
        <button
          type="submit"
          class="w-full h-14 rounded-2xl bg-primary text-slate-900 font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
        >
          <span class="material-symbols-outlined font-bold">login</span>
          登录
        </button>
        <router-link
          :to="registerTo"
          class="w-full h-14 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-bold flex items-center justify-center gap-2 active:bg-slate-50 transition-colors"
        >
          <span class="material-symbols-outlined">person_add</span>
          注册新账号
        </router-link>
      </form>

      <router-link
        :to="redirectTo"
        class="mt-8 text-slate-500 text-sm font-bold hover:text-primary transition-colors"
      >
        暂不登录，返回首页
      </router-link>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login as apiLogin } from '@/api/auth'
import { showToast } from '@/utils/toast'

const route = useRoute()
const router = useRouter()
const form = ref({ username: '', password: '' })

const redirectTo = computed(() => (route.query.redirect ? { path: route.query.redirect } : { name: 'Home' }))
const registerTo = computed(() =>
  route.query.redirect ? { path: '/register', query: { redirect: route.query.redirect } } : { path: '/register' }
)

function goBack() {
  if (route.query.redirect) {
    router.replace(route.query.redirect)
  } else {
    router.replace({ name: 'Home' })
  }
}

async function doLogin() {
  if (!form.value.username?.trim() || !form.value.password) {
    showToast('请输入用户名和密码', 'error')
    return
  }
  try {
    await apiLogin(form.value.username.trim(), form.value.password)
    showToast('登录成功', 'success')
    const target = route.query.redirect || '/'
    router.replace(typeof target === 'string' ? target : '/')
  } catch (e) {
    showToast(e.message || '登录失败', 'error')
  }
}

function handleSubmit() {
  doLogin()
}
</script>
