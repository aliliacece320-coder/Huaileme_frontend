<template>
  <div class="relative flex min-h-screen min-h-[100dvh] w-full flex-col overflow-x-hidden bg-white">
    <div class="fixed top-0 left-0 right-0 z-50 safe-top flex w-full items-center justify-between p-4">
      <button type="button" class="flex size-10 items-center justify-center rounded-full bg-white/85 backdrop-blur border border-black/5 shadow-sm" @click="$router.push('/')">
        <span class="material-symbols-outlined text-slate-800 text-[20px]">arrow_back_ios_new</span>
      </button>
      <h2 class="text-slate-800 text-lg font-bold tracking-tight truncate max-w-[50vw]">{{ food?.name || '宝贝详情' }}</h2>
      <button type="button" class="flex size-10 items-center justify-center rounded-full bg-white/85 backdrop-blur border border-black/5 shadow-sm" @click="showToast('更多功能开发中', 'info')">
        <span class="material-symbols-outlined text-slate-800">more_horiz</span>
      </button>
    </div>

    <div class="relative h-[48vh] min-h-[200px] w-full bg-white">
      <div
        class="h-full w-full bg-cover bg-center"
        :style="{ backgroundImage: `url('${food?.imageUrl || food?.image_url || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZiPWW4O7LNWoZmONFo2Ijs-fLb_M9doEJL3ccAYVMc4GQyXdvKAj2zgnYHM9vb72C_RIPa_Mjrdgj-h10GR5JmBf04_O34TsxAgTDErxpuFTsK-j87uKbAtyYitDWeFi-oPFQGWwUOpBXzelzK6IoRRZrdUT_yrLWvyhgSqz0NgcPWgP4H6VHg3xsMFSB3a9yHkZ2WmIYQExpx6g0YbtC-RoElW5zYlZR9Uq9aF6LoqTEvinS88jIPltNxAQsa8DUPbgJiJBAt64r'}')` }"
      ></div>
      <div class="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/40 to-transparent"></div>
      <div class="absolute bottom-6 left-4 right-4">
        <div class="bg-white/95 backdrop-blur-md flex items-center justify-between p-5 rounded-2xl shadow-xl border border-black/5">
          <div class="flex flex-col">
            <span class="text-primary text-xs font-bold uppercase tracking-widest">时光在流逝</span>
            <h1 class="text-2xl font-extrabold mt-1 text-slate-800">{{ timeText }}</h1>
          </div>
          <div class="relative flex items-center justify-center size-16">
            <svg class="size-full -rotate-90">
              <circle class="text-gray-100" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" stroke-width="5"></circle>
              <circle
                class="text-primary"
                cx="32"
                cy="32"
                fill="transparent"
                r="28"
                stroke="currentColor"
                stroke-dasharray="175.9"
                :stroke-dashoffset="circleOffset"
                stroke-linecap="round"
                stroke-width="5"
              ></circle>
            </svg>
            <span class="absolute text-xs font-bold text-slate-800">{{ freshness }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 px-4 pb-44 bg-white rounded-t-[32px] -mt-4 relative z-10">
      <div class="grid grid-cols-2 gap-3 mt-8">
        <div class="bg-[#F8FAF9] p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div class="bg-primary/10 size-8 rounded-lg flex items-center justify-center mb-3 text-[#0ccb6d]">
            <span class="material-symbols-outlined text-xl">home_pin</span>
          </div>
          <p class="text-slate-500 text-xs">它住在这里</p>
          <p class="font-bold text-slate-800">{{ storageLabel }} - {{ food?.category || '未分类' }}</p>
        </div>
        <div class="bg-[#F8FAF9] p-4 rounded-2xl border border-gray-100 shadow-sm">
          <div class="bg-primary/10 size-8 rounded-lg flex items-center justify-center mb-3 text-[#0ccb6d]">
            <span class="material-symbols-outlined text-xl">favorite</span>
          </div>
          <p class="text-slate-500 text-xs">相遇的日子</p>
          <p class="font-bold text-slate-800">{{ addedDate }}</p>
        </div>
      </div>

      <div class="mt-8">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-slate-800 text-xl font-extrabold tracking-tight">宝贝新鲜度</h3>
          <span class="text-[#0ccb6d] text-[10px] font-bold bg-primary/10 px-2 py-1 rounded-full uppercase tracking-wider">小助手预测</span>
        </div>
        <div class="bg-[#F8FAF9] p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div class="flex items-baseline gap-2 mb-4">
            <span class="text-4xl font-extrabold text-slate-800 tracking-tighter">{{ freshness }}%</span>
            <span class="text-red-500 text-sm font-semibold">变淡了一点点</span>
          </div>
        </div>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 p-6 pt-6 safe-inset-bottom bg-white/80 backdrop-blur-xl border-t border-gray-100 z-50">
      <p class="text-center text-[11px] font-bold text-slate-500 mb-4 tracking-[0.2em] uppercase">它的最后归宿</p>
      <div class="flex gap-3">
        <button
          type="button"
          class="flex-[1.2] bg-primary text-slate-800 h-14 rounded-2xl font-bold flex flex-col items-center justify-center transition-transform active:scale-95 shadow-lg shadow-primary/20"
          @click="performAction('consume')"
        >
          <span class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px] font-bold">celebration</span>
            吃掉啦
          </span>
          <div class="flex items-center gap-1 mt-0.5">
            <span class="text-[9px] font-medium opacity-70">吃后感:</span>
            <div class="flex gap-0.5">
              <span class="material-symbols-outlined text-[10px] fill-1 text-slate-800">star</span>
              <span class="material-symbols-outlined text-[10px] fill-1 text-slate-800">star</span>
              <span class="material-symbols-outlined text-[10px] fill-1 text-slate-800">star</span>
              <span class="material-symbols-outlined text-[10px] fill-1 text-slate-800">star</span>
              <span class="material-symbols-outlined text-[10px] fill-1 text-slate-800/20">star</span>
            </div>
          </div>
        </button>
        <button
          type="button"
          class="flex-1 border-2 border-gray-100 bg-white h-14 rounded-2xl font-bold flex items-center justify-center gap-2 text-red-400 active:bg-gray-50 transition-colors"
          @click="performAction('waste')"
        >
          <span class="material-symbols-outlined text-red-400 text-[20px]">heart_broken</span>
          忍痛扔掉
        </button>
        <button
          type="button"
          class="size-14 bg-[#F8FAF9] border border-gray-100 rounded-2xl flex items-center justify-center text-slate-800 active:bg-gray-100"
          @click="optimizeImage"
        >
          <span class="material-symbols-outlined">auto_fix_high</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getFood } from '@/api/foods'
import { performFoodAction } from '@/api/foodActions'
import { optimizeImage as apiOptimizeImage } from '@/api/images'
import { showToast, showLoading, hideLoading } from '@/utils/toast'

const route = useRoute()
const router = useRouter()
const foodId = route.params.id
const food = ref(null)

const freshness = computed(() => food.value?.freshnessScore ?? food.value?.freshness_percentage ?? 75)

const timeText = computed(() => {
  const days = food.value?.daysLeft ?? food.value?.days_left
  if (days == null) {
    const exp = food.value?.expireDate ?? food.value?.expire_date
    if (!exp) return '还能陪你 -- 天'
    const d = Math.ceil((new Date(exp) - new Date()) / (1000 * 60 * 60 * 24))
    if (d < 0) return '已过期'
    if (d === 0) return '今日到期'
    return `还能陪你 ${d} 天`
  }
  if (days < 0) return '已过期'
  if (days === 0) return '今日到期'
  return `还能陪你 ${days} 天`
})

const circleOffset = computed(() => {
  const c = 2 * Math.PI * 28
  return c - (freshness.value / 100) * c
})

const storageLabel = computed(() => {
  const s = food.value?.storageStatus ?? food.value?.storage_location
  const m = { fridge: '冷藏', freezer: '冷冻', room: '常温' }
  return m[s] || s || '冰箱 - 第一层'
})

const addedDate = computed(() => {
  const d = food.value?.createdAt ?? food.value?.created_at ?? food.value?.added_date
  if (!d) return '2023年10月24日'
  const x = new Date(d)
  return `${x.getFullYear()}年${x.getMonth() + 1}月${x.getDate()}日`
})

async function loadFood() {
  if (!foodId) {
    showToast('食物ID不存在', 'error')
    setTimeout(() => router.push('/'), 2000)
    return
  }
  try {
    showLoading('加载中...')
    food.value = await getFood(foodId)
    hideLoading()
  } catch (e) {
    hideLoading()
    showToast('加载失败', 'error')
    setTimeout(() => router.push('/'), 2000)
  }
}

async function performAction(action) {
  if (!food.value) return
  if (action === 'waste' && !confirm('确定要扔掉这个食物吗？')) return
  try {
    showLoading('处理中...')
    await performFoodAction(foodId, {
      actionType: action === 'consume' ? 'consume' : 'waste',
      score: action === 'consume' ? 4 : undefined,
      note: undefined,
    })
    hideLoading()
    showToast(action === 'consume' ? '已标记为已消费！' : '已标记为已浪费', 'success')
    setTimeout(() => router.push('/'), 1500)
  } catch (e) {
    hideLoading()
    showToast('操作失败', 'error')
  }
}

async function optimizeImage() {
  if (!food.value?.imageUrl && !food.value?.image_url) {
    showToast('暂无可优化的图片', 'error')
    return
  }
  try {
    showLoading('图片优化中...')
    const res = await apiOptimizeImage({
      imageUrl: food.value.image_url || food.value.imageUrl,
      foodId,
    })
    hideLoading()
    if (res?.optimizedImageUrl) {
      food.value = { ...food.value, image_url: res.optimizedImageUrl, imageUrl: res.optimizedImageUrl }
      showToast('图片已优化', 'success')
    } else {
      showToast('未返回优化结果', 'info')
    }
  } catch (e) {
    hideLoading()
    showToast('图片优化失败', 'error')
  }
}

onMounted(loadFood)
</script>
