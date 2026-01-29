<template>
  <div class="fixed bottom-0 left-0 w-full px-5 pt-12 pb-8 safe-bottom bg-gradient-to-t from-background-light via-background-light/95 to-transparent z-50">
    <div class="max-w-md mx-auto relative flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-2xl rounded-full border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
      <router-link
        to="/"
        class="flex flex-col items-center gap-1"
        :class="current === 'home' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'"
      >
        <span class="material-symbols-outlined font-bold" :style="current === 'home' ? iconFill : {}">home</span>
        <span class="text-[10px] font-black">首页</span>
      </router-link>
      <router-link
        to="/stats"
        class="flex flex-col items-center gap-1"
        :class="current === 'stats' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'"
      >
        <span class="material-symbols-outlined text-[24px]" :style="current === 'stats' ? iconFill : {}">savings</span>
        <span class="text-[10px] font-bold">统计</span>
      </router-link>
      <div class="absolute left-1/2 -translate-x-1/2 -top-10">
        <router-link
          to="/scanner"
          class="size-16 rounded-full bg-primary text-white shadow-[0_15px_35px_rgba(19,236,128,0.5)] flex items-center justify-center border-[5px] border-white active:scale-90 transition-all duration-200 block"
        >
          <span class="material-symbols-outlined text-3xl font-bold">qr_code_scanner</span>
        </router-link>
        <span class="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-400 w-max">扫一扫</span>
      </div>
      <div class="w-8"></div>
      <router-link
        to="/recipes"
        class="flex flex-col items-center gap-1"
        :class="current === 'recipes' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'"
      >
        <span class="material-symbols-outlined text-[24px]" :style="current === 'recipes' ? iconFill : {}">restaurant_menu</span>
        <span class="text-[10px] font-bold">菜谱</span>
      </router-link>
      <router-link
        to="/settings"
        class="flex flex-col items-center gap-1"
        :class="current === 'settings' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'"
      >
        <span class="material-symbols-outlined text-[24px]" :style="current === 'settings' ? iconFill : {}">settings</span>
        <span class="text-[10px] font-bold">设置</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  current: { type: String, default: '' },
})
const iconFill = { fontVariationSettings: "'FILL' 1" }
</script>
