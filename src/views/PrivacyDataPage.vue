<template>
  <div class="min-h-screen min-h-[100dvh] pb-32 flex flex-col bg-background-light">
    <header class="sticky top-0 z-50 safe-top bg-white/80 backdrop-blur-md border-b border-slate-100 px-5 py-4 flex items-center justify-between">
      <button type="button" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors" @click="goBack">
        <span class="material-symbols-outlined text-slate-600">arrow_back_ios_new</span>
      </button>
      <h1 class="text-lg font-black tracking-tight text-slate-800">数据存储与同步</h1>
      <div class="w-10"></div>
    </header>

    <main class="flex-1 px-5 py-6 max-w-md mx-auto w-full">
      <section class="bg-white/90 rounded-3xl border border-slate-100 shadow-sm p-5 space-y-4">
        <p class="text-slate-600 text-sm leading-relaxed">
          本应用数据可在本地与云端同步。登录后，冰箱列表、统计与家庭数据将安全存储于服务器；未登录时仅保存在本设备。我们不会将您的数据用于广告或第三方共享。
        </p>
        <div class="pt-2 border-t border-slate-100">
          <p class="text-slate-500 text-xs">以上为演示说明，实际策略以产品为准。</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/settings/privacy')
}
</script>
