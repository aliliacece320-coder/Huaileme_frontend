<template>
  <div class="min-h-screen min-h-[100dvh] pb-32 flex flex-col bg-background-light">
    <header class="sticky top-0 z-50 safe-top bg-white/80 backdrop-blur-md border-b border-slate-100 px-5 py-4 flex items-center justify-between">
      <button type="button" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors" @click="goBack">
        <span class="material-symbols-outlined text-slate-600">arrow_back_ios_new</span>
      </button>
      <h1 class="text-lg font-black tracking-tight text-slate-800">通知设置</h1>
      <div class="w-10"></div>
    </header>

    <main class="flex-1 px-5 py-6 max-w-md mx-auto w-full">
      <p class="text-slate-500 text-sm mb-4">提醒、推送偏好</p>
      <section class="bg-white/90 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div class="flex items-center justify-between p-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary text-xl">notifications_active</span>
            <div class="text-left">
              <p class="text-slate-800 font-bold">过期提醒</p>
              <p class="text-slate-400 text-xs mt-0.5">快过期的食物推送通知</p>
            </div>
          </div>
          <button
            type="button"
            :class="['w-12 h-7 rounded-full transition-colors', pushExpiry ? 'bg-primary' : 'bg-slate-200']"
            @click="pushExpiry = !pushExpiry"
          >
            <span class="block w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform" :class="pushExpiry ? 'translate-x-6' : 'translate-x-1'"></span>
          </button>
        </div>
        <div class="flex items-center justify-between p-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary text-xl">campaign</span>
            <div class="text-left">
              <p class="text-slate-800 font-bold">每日摘要</p>
              <p class="text-slate-400 text-xs mt-0.5">冰箱状态每日推送</p>
            </div>
          </div>
          <button
            type="button"
            :class="['w-12 h-7 rounded-full transition-colors', pushDaily ? 'bg-primary' : 'bg-slate-200']"
            @click="pushDaily = !pushDaily"
          >
            <span class="block w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform" :class="pushDaily ? 'translate-x-6' : 'translate-x-1'"></span>
          </button>
        </div>
        <div class="flex items-center justify-between p-4">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary text-xl">volume_up</span>
            <div class="text-left">
              <p class="text-slate-800 font-bold">声音与振动</p>
              <p class="text-slate-400 text-xs mt-0.5">通知声音、振动开关</p>
            </div>
          </div>
          <button
            type="button"
            :class="['w-12 h-7 rounded-full transition-colors', soundOn ? 'bg-primary' : 'bg-slate-200']"
            @click="soundOn = !soundOn"
          >
            <span class="block w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform" :class="soundOn ? 'translate-x-6' : 'translate-x-1'"></span>
          </button>
        </div>
      </section>
      <p class="text-slate-400 text-xs mt-4 px-1">以上为演示选项，实际生效需接入系统推送能力。</p>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const pushExpiry = ref(true)
const pushDaily = ref(true)
const soundOn = ref(true)

function goBack() {
  if (window.history.length > 1) router.back()
  else router.replace('/settings')
}
</script>
