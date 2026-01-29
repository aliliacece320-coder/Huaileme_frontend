<template>
  <div class="min-h-screen min-h-[100dvh] pb-32 flex flex-col bg-background-light">
    <header class="sticky top-0 z-50 safe-top bg-white/80 backdrop-blur-md border-b border-slate-100 px-5 py-4 flex items-center justify-between">
      <button type="button" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors" @click="goBack">
        <span class="material-symbols-outlined text-slate-600">arrow_back_ios_new</span>
      </button>
      <h1 class="text-lg font-black tracking-tight text-slate-800">关于我们</h1>
      <div class="w-10"></div>
    </header>

    <main class="flex-1 px-5 py-6 max-w-md mx-auto w-full">
      <p class="text-slate-500 text-sm mb-4">版本与介绍</p>
      <section class="bg-white/90 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="p-6 text-center">
          <div class="size-20 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
            <span class="material-symbols-outlined text-primary text-4xl">eco</span>
          </div>
          <h2 class="text-xl font-black text-slate-800 mb-1" style="font-family: ZCOOL KuaiLe, cursive">坏了么</h2>
          <p class="text-slate-500 text-sm">让冰箱里的每一口都不浪费</p>
          <p class="text-primary font-bold text-sm mt-4">v1.0.0</p>
        </div>
        <div class="border-t border-slate-100 p-4 space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-slate-500">版本号</span>
            <span class="text-slate-800 font-bold">1.0.0</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-500">更新日期</span>
            <span class="text-slate-800 font-bold">2025-01</span>
          </div>
        </div>
      </section>
      <section class="mt-6 bg-white/90 rounded-3xl border border-slate-100 shadow-sm p-5">
        <h3 class="text-slate-800 font-bold mb-3">产品介绍</h3>
        <p class="text-slate-500 text-sm leading-relaxed">
          「坏了么」帮助你管理冰箱库存、记录保质期，通过 AI 扫码与智能清库推荐，减少食物浪费。支持家庭共享、零浪费统计与勋章激励，让节约成为习惯。
        </p>
      </section>
      <section class="mt-6 bg-white/90 rounded-3xl border border-slate-100 shadow-sm p-5">
        <h3 class="text-slate-800 font-bold mb-3">联系我们</h3>
        <p class="text-slate-500 text-sm">反馈与建议：欢迎通过应用内反馈或官方渠道联系我们。</p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/settings')
}
</script>
