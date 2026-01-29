<template>
  <div class="min-h-screen min-h-[100dvh] flex flex-col bg-[#fffcf9] text-slate-800">
    <header class="sticky top-0 z-50 safe-top bg-[#fffcf9]/90 backdrop-blur-md px-5 py-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="bg-[#10b981]/10 p-2 rounded-xl">
          <span class="material-symbols-outlined text-[#10b981] text-2xl">kitchen</span>
        </div>
        <h1 class="text-xl font-black tracking-tight text-slate-800">坏了么</h1>
      </div>
      <div class="flex items-center gap-1">
        <router-link to="/stats" class="p-2.5 rounded-full hover:bg-orange-50 text-slate-400 transition-colors flex items-center justify-center">
          <span class="material-symbols-outlined">history</span>
        </router-link>
        <router-link to="/family" class="p-2.5 rounded-full hover:bg-orange-50 text-slate-400 transition-colors flex items-center justify-center">
          <span class="material-symbols-outlined">settings</span>
        </router-link>
      </div>
    </header>

    <main class="flex-1 flex flex-col px-5 pb-32">
      <div class="mt-4 text-center">
        <h2 class="text-slate-800 text-xl font-bold mb-1">我的虚拟小冰箱</h2>
        <h4 class="text-[#94a3b8] text-[11px] font-bold leading-normal tracking-widest uppercase">冰箱保鲜指数</h4>
        <div class="mt-2 text-4xl font-black text-slate-800">{{ healthPercent }}<span class="text-[#10b981] text-2xl ml-0.5">%</span></div>
        <div class="mt-6 flex justify-around bg-white/60 border border-orange-100/50 p-5 rounded-3xl shadow-sm">
          <div class="flex flex-col items-center">
            <span class="text-xl font-bold text-slate-800">{{ totalCount }}</span>
            <span class="text-[11px] text-[#94a3b8] font-medium mt-1">库存宝贝</span>
          </div>
          <div class="w-px h-8 bg-slate-100 self-center"></div>
          <div class="flex flex-col items-center">
            <span class="text-xl font-bold text-[#f43f5e]">{{ urgentCount }}</span>
            <span class="text-[11px] text-[#94a3b8] font-medium mt-1">赶快吃完</span>
          </div>
          <div class="w-px h-8 bg-slate-100 self-center"></div>
          <div class="flex flex-col items-center">
            <span class="text-xl font-bold text-[#10b981]">{{ consumedCount }}</span>
            <span class="text-[11px] text-[#94a3b8] font-medium mt-1">光盘行动</span>
          </div>
        </div>
      </div>

      <div class="flex py-6">
        <div class="flex h-12 flex-1 items-center justify-center rounded-2xl bg-slate-100/80 p-1.5 gap-1">
          <label
            v-for="z in zones"
            :key="z.value"
            :class="[
              'flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-xl px-2 text-sm font-bold transition-all',
              currentZone === z.value ? 'bg-white text-[#10b981] shadow-sm' : 'text-slate-500'
            ]"
          >
            <span class="truncate">{{ z.label }}</span>
            <input v-model="currentZone" type="radio" :value="z.value" class="sr-only" name="zone" />
          </label>
        </div>
      </div>

      <div class="flex-1 relative min-h-[40vh] rounded-[3rem] bg-white border-[10px] border-slate-50 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-blue-50/20 to-transparent opacity-40"></div>
        <div
          v-for="zone in zones"
          :key="zone.value"
          v-show="currentZone === zone.value"
          class="relative w-full h-full flex flex-col justify-end pb-5 px-6"
        >
          <div class="absolute top-3 left-6 text-[11px] text-slate-300 font-bold tracking-wider">{{ zone.label }}</div>
          <div v-if="zoneFoods(zone.value).length" class="flex gap-6 z-10 mb-2 flex-wrap">
            <div
              v-for="food in zoneFoods(zone.value)"
              :key="food.id"
              class="group/item relative cursor-pointer"
              @click="goToDetail(food.id)"
            >
              <div
                :class="[
                  'w-16 h-16 rounded-full flex items-center justify-center border transform active:scale-90 transition-transform',
                  riskStyle(food).bg,
                  riskStyle(food).border
                ]"
              >
                <span :class="['material-symbols-outlined text-3xl', riskStyle(food).text]">{{ getFoodIcon(food.category) }}</span>
              </div>
              <span :class="['absolute -top-1 -right-1 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg', riskStyle(food).badge]">
                {{ riskStyle(food).label }}
              </span>
            </div>
          </div>
          <div
            v-else
            class="flex-1 flex items-center justify-center text-slate-400 text-xs font-bold tracking-wider pb-4"
          >
            该区域暂无食物
          </div>
        </div>
      </div>

      <div class="mt-10">
        <div class="flex items-center justify-between mb-4 px-1">
          <h3 class="text-slate-800 text-lg font-bold">新鲜速览</h3>
          <router-link to="/" class="text-[#10b981] text-sm font-bold">去看看全部</router-link>
        </div>
        <div v-if="freshPreview.length" class="grid grid-cols-2 gap-4">
          <div
            v-for="(food, i) in freshPreview"
            :key="food.id || i"
            class="group relative bg-white flex flex-col gap-3 rounded-[1.75rem] justify-end p-4 aspect-[4/3] border border-slate-100 shadow-sm overflow-hidden"
            :style="{
              backgroundImage: `linear-gradient(0deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.2) 60%), url('${food.image_url || food.imageUrl || 'https://via.placeholder.com/200'}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }"
          >
            <div>
              <p class="text-slate-800 text-sm font-bold leading-tight">{{ food.name }}</p>
              <p :class="[(food.days_left ?? food.daysLeft) <= 1 ? 'text-[#f43f5e]' : 'text-[#10b981]', 'text-[10px] font-bold']">
                {{ (food.days_left ?? food.daysLeft) <= 1 ? '快喝掉吧' : '非常新鲜' }} · 剩{{ food.days_left ?? food.daysLeft ?? 0 }}天
              </p>
            </div>
          </div>
        </div>
        <p v-else class="text-center text-slate-400 text-xs py-6">当前区域暂无可展示的食物</p>
      </div>
    </main>

    <NavBar />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getFoods, getFoodStatsSummary } from '@/api'
import { showToast } from '@/utils/toast'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const currentZone = ref('Cooling')
const foods = ref([])
const summary = ref({})

const zones = [
  { value: 'Cooling', label: '保鲜层' },
  { value: 'Freezing', label: '冷冻室' },
  { value: 'Pantry', label: '小零食区' },
]

const totalCount = computed(() => foods.value.length)
const urgentCount = computed(() => foods.value.filter((f) => (f.days_left ?? f.daysLeft ?? 0) <= 3).length)
const consumedCount = computed(() => summary.value?.consumedThisMonth ?? 0)
const healthPercent = computed(() => {
  const t = totalCount.value
  const u = urgentCount.value
  return t ? Math.round(((t - u) / t) * 100) : 85
})

function zoneFoods(zone) {
  const list = foods.value
  if (zone === 'Cooling') return list.filter((f) => (f.storage_location === '冷藏室' || f.storageStatus === 'fridge'))
  if (zone === 'Freezing') return list.filter((f) => (f.storage_location === '冷冻室' || f.storageStatus === 'freezer'))
  return list.filter((f) => (f.storage_location === '储藏柜' || f.storageStatus === 'room'))
}

const freshPreview = computed(() => zoneFoods(currentZone.value).slice(0, 2))

function getFoodIcon(cat) {
  const m = { 肉类: 'restaurant', 蔬菜: 'nutrition', 水果: 'eco', 奶制品: 'local_drink', 蛋白质: 'egg', 豆制品: 'inventory_2' }
  return m[cat] || 'lunch_dining'
}

function riskStyle(food) {
  const d = food.days_left ?? food.daysLeft ?? 0
  if (d < 0) return { bg: 'bg-[#fff1f2]', border: 'border-[#f43f5e]/10', text: 'text-[#f43f5e]', badge: 'bg-[#f43f5e]', label: '已过期' }
  if (d <= 1) return { bg: 'bg-[#fff1f2]', border: 'border-[#f43f5e]/10', text: 'text-[#f43f5e]', badge: 'bg-[#f43f5e]', label: '剩1天啦' }
  if (d <= 3) return { bg: 'bg-[#fffbeb]', border: 'border-[#f59e0b]/10', text: 'text-[#f59e0b]', badge: 'bg-[#f59e0b]', label: '3天内' }
  return { bg: 'bg-[#ecfdf5]', border: 'border-[#10b981]/10', text: 'text-[#10b981]', badge: 'bg-[#10b981]', label: `还剩${d}天` }
}

function goToDetail(id) {
  router.push({ name: 'ItemDetail', params: { id: String(id) } })
}

onMounted(async () => {
  try {
    const [list, s] = await Promise.all([getFoods({ status: 'active' }), getFoodStatsSummary().catch(() => ({}))])
    foods.value = Array.isArray(list?.items) ? list.items : []
    summary.value = s
  } catch (e) {
    showToast('加载失败', 'error')
  }
})
</script>
