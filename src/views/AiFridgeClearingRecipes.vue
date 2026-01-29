<template>
  <div class="max-w-[480px] mx-auto min-h-screen min-h-[100dvh] flex flex-col bg-white shadow-sm relative">
    <div class="sticky top-0 z-50 safe-top bg-white/80 backdrop-blur-md px-4 py-3 flex items-center justify-between">
      <button type="button" class="flex items-center justify-center w-10 h-10 -ml-2" @click="$router.push('/')">
        <span class="material-symbols-outlined text-[28px] text-slate-800">chevron_left</span>
      </button>
      <div class="flex flex-col items-center">
        <h2 class="text-slate-800 text-lg font-bold leading-tight">坏了么</h2>
        <div class="flex items-center gap-1">
          <span class="size-1.5 rounded-full bg-primary"></span>
          <p class="text-[10px] text-primary font-bold tracking-[0.05em]">AI 智能清库</p>
        </div>
      </div>
      <div class="flex items-center justify-center w-10 h-10 -mr-2">
        <button class="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
          <span class="material-symbols-outlined text-[22px]">auto_fix_high</span>
        </button>
      </div>
    </div>

    <div class="px-5 pt-6 pb-2">
      <div class="flex justify-between items-center">
        <h3 class="text-slate-800 text-2xl font-bold tracking-tight">消灭库存大作战</h3>
        <button type="button" class="text-primary text-sm font-bold px-2 py-1" @click="toggleSelectAll">全选</button>
      </div>
      <p class="text-slate-500 text-sm mt-1">选几个快坏掉的，AI 帮你变美味</p>
    </div>

    <div class="flex gap-2.5 px-5 py-4 overflow-x-auto no-scrollbar">
      <template v-if="availableFoods.length">
        <button
          v-for="food in availableFoods"
          :key="food.id"
          :class="[
            'food-item flex h-11 shrink-0 items-center gap-x-2 rounded-2xl px-4 shadow-lg transition-transform active:scale-95 cursor-pointer',
            selectedIds.includes(food.id) ? 'bg-primary text-white' : 'bg-[#f8faf9] border border-gray-100 text-slate-500'
          ]"
          type="button"
          @click="toggleFood(food.id)"
        >
          <span class="material-symbols-outlined text-[20px]">{{ getFoodIcon(food.category) }}</span>
          <p class="text-sm font-bold">
            {{ food.name }}
            ({{ (food.days_left ?? food.daysLeft) === 0 ? '今日到期' : `${food.days_left ?? food.daysLeft}天后过期` }})
          </p>
          <span
            v-if="selectedIds.includes(food.id)"
            class="material-symbols-outlined text-[18px]"
            style="font-variation-settings: 'FILL' 1"
            >check_circle</span
          >
        </button>
      </template>
      <div
        v-else
        class="flex items-center justify-center w-full py-6 text-slate-400 text-sm bg-slate-50/80 rounded-3xl border border-dashed border-slate-200"
      >
        暂无需要清理的库存食材
      </div>
    </div>

    <div class="px-5 pt-4 pb-2 flex items-center gap-2.5">
      <div class="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
        <span class="material-symbols-outlined text-primary text-[20px]">temp_preferences_custom</span>
      </div>
      <h3 class="text-slate-800 text-lg font-bold">这几道菜最合适：</h3>
    </div>

    <div class="flex flex-col gap-5 p-5 pb-32">
      <template v-if="selectedIds.length">
        <template v-if="recipes.length">
          <div
            v-for="r in recipes"
            :key="r.id"
            class="rounded-[2.5rem] overflow-hidden flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 bg-white/70 backdrop-blur"
          >
            <div
              class="relative h-56 w-full bg-center bg-cover"
              :style="{ backgroundImage: `url('${r.image_url || r.imageUrl || 'https://via.placeholder.com/400'}')` }"
            >
              <div
                class="absolute top-4 left-4 bg-primary text-white px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-primary/30"
              >
                <span class="material-symbols-outlined text-[14px] font-bold">favorite</span>
                适配度 {{ r.match_score ?? r.matchScore ?? 90 }}%
              </div>
            </div>
            <div class="p-5 flex flex-col gap-4">
              <div>
                <h4 class="text-slate-800 text-xl font-bold">{{ r.title || r.name }}</h4>
                <div class="flex gap-4 mt-2">
                  <span class="text-slate-500 text-xs font-bold flex items-center gap-1">
                    <span class="material-symbols-outlined text-[16px] text-primary">schedule</span>
                    {{ r.estimatedTime ?? r.cooking_time ?? 30 }} 分钟
                  </span>
                  <span class="text-slate-500 text-xs font-bold flex items-center gap-1">
                    <span class="material-symbols-outlined text-[16px] text-primary">sentiment_satisfied</span>
                    {{ r.difficulty || '简单易上手' }}
                  </span>
                </div>
              </div>
              <div class="flex flex-col gap-1.5">
                <span class="text-[11px] text-primary font-bold uppercase tracking-wider">还要准备：</span>
                <p class="text-slate-500 text-sm leading-relaxed">{{ r.description || '库存食材即可' }}</p>
              </div>
              <div class="flex items-center justify-between pt-1">
                <div class="flex -space-x-2.5">
                  <div
                    v-for="(ing, i) in (r.ingredients || []).slice(0, 4)"
                    :key="i"
                    class="w-9 h-9 rounded-full border-2 border-white bg-primary/20 flex items-center justify-center shadow-sm"
                  >
                    <span class="material-symbols-outlined text-[18px] text-primary">{{
                      getFoodIcon(typeof ing === 'object' ? ing.name : ing)
                    }}</span>
                  </div>
                </div>
                <button
                  type="button"
                  class="bg-primary hover:bg-primary/90 text-white px-6 h-12 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
                  @click="completeRecipe(r.id)"
                >
                  <span class="material-symbols-outlined text-[20px]">check</span>
                  我做完了
                </button>
              </div>
            </div>
          </div>
        </template>
        <p v-else class="text-center text-slate-400 py-8">当前食材暂时没有合适的菜谱推荐</p>
      </template>
      <p v-else class="text-center text-slate-500 py-8">请先选择食物</p>
    </div>

    <div class="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[400px] px-6 z-40">
      <button
        type="button"
        class="w-full bg-slate-800 text-white h-16 py-4 rounded-full font-bold shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
        @click="loadRecipes"
      >
        <span class="material-symbols-outlined text-primary">auto_awesome</span>
        换一批灵感
      </button>
    </div>

    <NavBar current="recipes" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { getFoods, getRecipeRecommendations, completeRecipe as apiCompleteRecipe } from '@/api'
import { showToast, showLoading, hideLoading } from '@/utils/toast'
import NavBar from '@/components/NavBar.vue'

const availableFoods = ref([])
const selectedIds = ref([])
const recipes = ref([])

function getFoodIcon(cat) {
  const m = { 肉类: 'restaurant', 蔬菜: 'nutrition', 水果: 'eco', 奶制品: 'local_drink', 蛋白质: 'egg', 豆制品: 'inventory_2' }
  return m[cat] || 'restaurant'
}

function toggleFood(id) {
  const i = selectedIds.value.indexOf(id)
  if (i > -1) selectedIds.value.splice(i, 1)
  else selectedIds.value.push(id)
  loadRecipes()
}

function toggleSelectAll() {
  if (selectedIds.value.length === availableFoods.value.length) {
    selectedIds.value = []
  } else {
    selectedIds.value = availableFoods.value.map((f) => f.id)
  }
  loadRecipes()
}

async function loadUrgentFoods() {
  try {
    showLoading('加载中...')
    const res = await getFoods({ status: 'active' })
    const list = Array.isArray(res?.items) ? res.items : []
    const urgent = list.filter((f) => {
      const d = f.days_left ?? f.daysLeft ?? 0
      return d >= 0 && d <= 3
    })
    availableFoods.value = urgent
    if (urgent.length >= 2 && !selectedIds.value.length) {
      selectedIds.value = urgent.slice(0, 2).map((f) => f.id)
    }
    await loadRecipes()
    hideLoading()
  } catch (e) {
    hideLoading()
    showToast('加载失败', 'error')
  }
}

async function loadRecipes() {
  if (!selectedIds.value.length) {
    recipes.value = []
    return
  }
  try {
    showLoading('AI正在推荐菜谱...')
    const data = await getRecipeRecommendations({ mode: 'manual', selectedFoodIds: selectedIds.value })
    recipes.value = data?.recipes ?? []
    hideLoading()
    if (recipes.value.length) showToast(`为您推荐了 ${recipes.value.length} 道菜`, 'success')
  } catch (e) {
    hideLoading()
    showToast('加载菜谱失败', 'error')
  }
}

async function completeRecipe(recipeId) {
  if (!selectedIds.value.length) {
    showToast('请先选择食物', 'error')
    return
  }
  try {
    showLoading('正在保存...')
    await apiCompleteRecipe(recipeId, { foodIds: selectedIds.value })
    hideLoading()
    showToast('菜谱完成！食物已标记为已消费', 'success')
    selectedIds.value = []
    setTimeout(loadUrgentFoods, 1500)
  } catch (e) {
    hideLoading()
    showToast('操作失败', 'error')
  }
}

onMounted(loadUrgentFoods)
</script>
