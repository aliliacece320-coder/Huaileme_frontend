<template>
  <div class="min-h-screen min-h-[100dvh] pb-32 flex flex-col bg-background-light">
    <header class="sticky top-0 z-50 safe-top bg-white/80 backdrop-blur-md border-b border-slate-100 px-5 py-4 flex items-center justify-between">
      <button type="button" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors" @click="goBack">
        <span class="material-symbols-outlined text-slate-600">arrow_back_ios_new</span>
      </button>
      <h1 class="text-lg font-black tracking-tight text-slate-800">隐私与安全</h1>
      <div class="w-10"></div>
    </header>

    <main class="flex-1 px-5 py-6 max-w-md mx-auto w-full">
      <p class="text-slate-500 text-sm mb-4">数据与权限</p>
      <section class="bg-white/90 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <button
          type="button"
          class="w-full flex items-center justify-between p-4 active:bg-slate-50/80 transition-colors border-b border-slate-100"
          @click="router.push('/settings/privacy/data')"
        >
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span class="material-symbols-outlined text-primary text-xl">folder</span>
            </div>
            <div class="text-left">
              <p class="text-slate-800 font-bold">数据存储与同步</p>
              <p class="text-slate-400 text-xs mt-0.5">本地与云端数据说明</p>
            </div>
          </div>
          <span class="material-symbols-outlined text-slate-300">chevron_right</span>
        </button>
        <div class="flex items-center justify-between p-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span class="material-symbols-outlined text-primary text-xl">camera</span>
            </div>
            <div class="text-left">
              <p class="text-slate-800 font-bold">相机与相册</p>
              <p class="text-slate-400 text-xs mt-0.5">扫码、选图所需权限</p>
            </div>
          </div>
          <span class="text-slate-400 text-xs">已授权</span>
        </div>
        <button
          type="button"
          class="w-full flex items-center justify-between p-4 active:bg-slate-50/80 transition-colors"
          @click="showToast('清除缓存为演示功能', 'info')"
        >
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span class="material-symbols-outlined text-primary text-xl">delete_sweep</span>
            </div>
            <div class="text-left">
              <p class="text-slate-800 font-bold">清除缓存</p>
              <p class="text-slate-400 text-xs mt-0.5">释放本地存储空间</p>
            </div>
          </div>
          <span class="material-symbols-outlined text-slate-300">chevron_right</span>
        </button>
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { showToast } from '@/utils/toast'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/settings')
}
</script>
