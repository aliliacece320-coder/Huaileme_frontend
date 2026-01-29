<template>
  <div class="min-h-screen min-h-[100dvh] pb-40 flex flex-col">
    <header class="sticky top-0 z-50 safe-top bg-white/60 backdrop-blur-xl border-b border-white/20">
      <div class="flex items-center p-5 pb-3 justify-between">
        <div class="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/20 text-primary">
          <span class="material-symbols-outlined font-bold text-2xl">eco</span>
        </div>
        <h2 class="text-2xl font-black flex-1 ml-4 text-slate-900 tracking-wide" style="font-family: ZCOOL KuaiLe, cursive">快过期啦</h2>
        <div class="flex gap-2">
          <div class="size-11 rounded-full bg-cover bg-center border-2 border-white shadow-md" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDJA-qq50001FMFD4UAXt3BcLpC2G7NSWTHbtUIxJ6L8pBb8sZmzqUTnrsDk_jupjp_9HxpMSrmplXsL6Ci8gtGuJwGUrHR6qI0bCQEHJs8A2RckS0fqh_B35ftoUqK33aOD8clPw_412RnuX7-LhU-tV9y3SVx1m5HL5MWFMYN-dXduN6XR36bHKKQ5vg26Ljw-oEz43GqNitnjpFOHvWB2CCxSp9G3u5jxGPwxIsfTrVy1ONSL_Wxzu8DLg3c3SMSD_71hnm0Mv2L')"></div>
        </div>
      </div>
      <div class="px-5 py-3 pt-0">
        <div class="relative flex items-center">
          <span class="material-symbols-outlined absolute left-4 text-slate-400 text-xl">search</span>
          <input
            v-model="searchKeyword"
            class="w-full bg-slate-100/60 border-none rounded-2xl py-3 pl-11 pr-4 text-sm focus:ring-4 focus:ring-primary/10 placeholder:text-slate-400"
            placeholder="找找冰箱里有什么？"
            type="text"
          />
        </div>
      </div>
    </header>

    <div class="px-5 py-4">
      <div class="flex gap-4">
        <div class="flex flex-1 flex-col gap-1 rounded-3xl p-5 bg-white/80 border border-slate-50 shadow-sm">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-accent-coral text-[20px]" style="font-variation-settings: 'FILL' 1">warning</span>
            <p class="text-accent-coral text-[11px] font-black tracking-widest">急需消灭</p>
          </div>
          <p class="text-3xl font-black leading-tight mt-1 text-slate-900">{{ urgentCount }}</p>
          <p class="text-slate-400 text-xs font-bold">件食物告急</p>
        </div>
        <div class="flex flex-1 flex-col gap-1 rounded-3xl p-5 bg-white/80 border border-slate-50 shadow-sm">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-[20px]" style="font-variation-settings: 'FILL' 1">check_circle</span>
            <p class="text-primary text-[11px] font-black tracking-widest">状态新鲜</p>
          </div>
          <p class="text-3xl font-black leading-tight mt-1 text-slate-900">{{ freshCount }}</p>
          <p class="text-slate-400 text-xs font-bold">件还能再放放</p>
        </div>
      </div>
    </div>

    <div class="flex gap-3 px-5 py-2 overflow-x-auto no-scrollbar">
      <button
        v-for="loc in locationFilters"
        :key="loc.key"
        :class="[
          'flex h-11 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-all',
          currentLocation === loc.key
            ? 'bg-primary text-white shadow-lg shadow-primary/30'
            : 'bg-white border border-slate-100 shadow-sm text-slate-600'
        ]"
        @click="selectLocation(loc)"
      >
        <span v-if="loc.icon" class="material-symbols-outlined text-[20px]" :class="currentLocation === loc.key ? 'text-white' : 'text-slate-400'">{{ loc.icon }}</span>
        <p class="text-sm font-bold">{{ loc.label }}</p>
      </button>
    </div>

    <div class="mt-6">
      <div class="flex items-center justify-between px-6 mb-4">
        <h3 class="text-xl font-black tracking-tight text-slate-900">腐败风险提醒</h3>
        <router-link to="/fridge" class="text-primary text-sm font-bold bg-primary/10 px-3 py-1 rounded-full">查看全部</router-link>
      </div>
      <div class="space-y-4 px-5">
        <template v-if="riskFoods.length">
          <div
            v-for="food in riskFoods"
            :key="food.id"
            :class="[
              'rounded-3xl p-4 flex gap-4 cursor-pointer hover:scale-[1.02] transition-transform bg-white/70 backdrop-blur border',
              riskClass(food).border
            ]"
            @click="goToDetail(food.id)"
          >
            <div
              class="w-22 h-22 rounded-2xl bg-cover bg-center shrink-0 border border-white shadow-sm"
              :style="{ backgroundImage: `url('${food.imageUrl || food.image_url || 'https://via.placeholder.com/100'}')` }"
            ></div>
            <div class="flex flex-col flex-1 justify-between py-1">
              <div>
                <div class="flex justify-between items-start">
                  <h4 class="font-bold text-base text-slate-900">{{ food.name }}</h4>
                  <span :class="[riskClass(food).text, 'text-[10px] font-black px-2 py-0.5 rounded-lg', riskClass(food).bg]">{{ riskClass(food).textLabel }}</span>
                </div>
                <div class="flex items-center gap-1.5 text-slate-400 text-xs mt-1.5">
                  <span class="material-symbols-outlined text-[16px]">location_on</span>
                  <span class="font-bold">{{ storageLabel(food.storageStatus) }} • {{ food.category || '未分类' }}</span>
                </div>
              </div>
              <div class="mt-3">
                <div class="flex justify-between items-end mb-1.5">
                  <span :class="['text-sm font-black', riskClass(food).text]">还能放 {{ Math.max(0, food.daysLeft ?? food.days_left ?? 0) }} 天</span>
                  <span class="text-[10px] text-slate-400 font-black">{{ food.freshnessScore ?? food.freshness_percentage ?? 0 }}% 新鲜度</span>
                </div>
                <div class="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    :class="['h-full rounded-full', riskClass(food).bar]"
                    :style="{ width: `${food.freshnessScore ?? food.freshness_percentage ?? 0}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <p v-else class="text-center text-slate-400 py-8">暂无食物数据</p>
      </div>
    </div>

    <NavBar current="home" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getFoodStatsSummary, getRiskFoods, getFoods } from '@/api'
import { showToast } from '@/utils/toast'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const searchKeyword = ref('')
const currentLocation = ref('全部物品')
const stats = ref({ urgentCount: 0, goodCount: 0 })
const riskFoods = ref([])

const locationFilters = [
  { key: '全部物品', label: '全部物品', icon: null },
  { key: '冷藏室', label: '冷藏室', icon: 'kitchen' },
  { key: '储藏柜', label: '储藏柜', icon: 'inventory_2' },
  { key: '冷冻室', label: '冷冻室', icon: 'ac_unit' },
]

const urgentCount = computed(() => stats.value.urgentCount ?? 0)
const freshCount = computed(() => stats.value.goodCount ?? 0)

function storageLabel(s) {
  const m = { fridge: '冷藏室', freezer: '冷冻室', room: '储藏柜' }
  return m[s] || s || ''
}

function riskClass(food) {
  const days = food.days_left ?? food.daysLeft ?? 0
  const fresh = food.freshness_percentage ?? food.freshnessScore ?? 0
  if (days < 0 || fresh < 20) {
    return {
      text: 'text-accent-coral',
      bg: 'bg-accent-coral/15',
      bar: 'bg-accent-coral',
      border: 'border-l-[6px] border-l-accent-coral/60',
      textLabel: '快坏了！',
    }
  }
  if (days < 3 || fresh < 50) {
    return {
      text: 'text-orange-400',
      bg: 'bg-orange-400/15',
      bar: 'bg-orange-400',
      border: '',
      textLabel: '建议快吃',
    }
  }
  return {
    text: 'text-primary',
    bg: 'bg-primary/15',
    bar: 'bg-primary',
    border: '',
    textLabel: '挺新鲜的',
  }
}

function selectLocation(loc) {
  currentLocation.value = loc.key
  fetchList()
}

async function loadStats() {
  try {
    const s = await getFoodStatsSummary()
    stats.value = {
      urgentCount: s.urgentCount ?? 0,
      goodCount: s.goodCount ?? 0,
      healthScore: s.healthScore ?? 0,
      totalActive: s.totalActive ?? 0,
    }
  } catch (e) {
    showToast('加载统计失败: ' + (e.message || ''), 'error')
  }
}

async function fetchList() {
  try {
    if (searchKeyword.value.trim()) {
      const res = await getFoods({ keyword: searchKeyword.value.trim(), status: 'active' })
      riskFoods.value = Array.isArray(res?.items) ? res.items : []
      return
    }
    if (currentLocation.value === '全部物品') {
      const data = await getRiskFoods()
      riskFoods.value = data?.urgentItems ?? []
      return
    }
    const storageMap = { 冷藏室: 'fridge', 冷冻室: 'freezer', 储藏柜: 'room' }
    const storage = storageMap[currentLocation.value]
    const res = await getFoods({ status: 'active', storageStatus: storage })
    riskFoods.value = Array.isArray(res?.items) ? res.items : []
  } catch (e) {
    showToast('加载失败', 'error')
    riskFoods.value = []
  }
}

function goToDetail(id) {
  router.push({ name: 'ItemDetail', params: { id: String(id) } })
}

let searchDebounce
watch(searchKeyword, () => {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(fetchList, 300)
})

onMounted(async () => {
  await loadStats()
  await fetchList()
  showToast('数据加载成功！', 'success')
})
</script>
