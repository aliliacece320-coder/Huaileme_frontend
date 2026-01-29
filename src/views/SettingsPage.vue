<template>
  <div class="min-h-screen min-h-[100dvh] pb-40 flex flex-col bg-background-light">
    <header class="sticky top-0 z-50 safe-top bg-white/80 backdrop-blur-md border-b border-slate-100 px-5 py-4 flex items-center justify-between">
      <div class="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/20 text-primary">
        <span class="material-symbols-outlined font-bold text-2xl">settings</span>
      </div>
      <h1 class="text-xl font-black tracking-tight text-slate-800 flex-1 ml-4">设置</h1>
      <div class="w-11"></div>
    </header>

    <main class="flex-1 px-5 py-6 pb-32 max-w-md mx-auto w-full">
      <section class="bg-white/90 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <router-link
          to="/family"
          class="flex items-center justify-between p-4 active:bg-slate-50/80 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span class="material-symbols-outlined text-primary text-xl">diversity_2</span>
            </div>
            <div class="text-left">
              <p class="text-slate-800 font-bold">账号与家庭</p>
              <p class="text-slate-400 text-xs mt-0.5">登录、注册、家庭管理</p>
            </div>
          </div>
          <span class="material-symbols-outlined text-slate-300">chevron_right</span>
        </router-link>

        <router-link
          to="/settings/notifications"
          class="flex items-center justify-between p-4 active:bg-slate-50/80 transition-colors border-t border-slate-100"
        >
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span class="material-symbols-outlined text-primary text-xl">notifications</span>
            </div>
            <div class="text-left">
              <p class="text-slate-800 font-bold">通知设置</p>
              <p class="text-slate-400 text-xs mt-0.5">提醒、推送偏好</p>
            </div>
          </div>
          <span class="material-symbols-outlined text-slate-300">chevron_right</span>
        </router-link>

        <router-link
          to="/settings/privacy"
          class="flex items-center justify-between p-4 active:bg-slate-50/80 transition-colors border-t border-slate-100"
        >
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span class="material-symbols-outlined text-primary text-xl">shield</span>
            </div>
            <div class="text-left">
              <p class="text-slate-800 font-bold">隐私与安全</p>
              <p class="text-slate-400 text-xs mt-0.5">数据与权限</p>
            </div>
          </div>
          <span class="material-symbols-outlined text-slate-300">chevron_right</span>
        </router-link>

        <router-link
          to="/settings/about"
          class="flex items-center justify-between p-4 active:bg-slate-50/80 transition-colors border-t border-slate-100"
        >
          <div class="flex items-center gap-3">
            <div class="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span class="material-symbols-outlined text-primary text-xl">info</span>
            </div>
            <div class="text-left">
              <p class="text-slate-800 font-bold">关于我们</p>
              <p class="text-slate-400 text-xs mt-0.5">版本与介绍</p>
            </div>
          </div>
          <span class="material-symbols-outlined text-slate-300">chevron_right</span>
        </router-link>
      </section>
    </main>

    <NavBar current="settings" />
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
</script>
