<template>
  <div class="bg-white min-h-screen min-h-[100dvh] font-display text-slate-800 flex flex-col">
    <nav class="sticky top-0 z-50 safe-top bg-white/90 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-slate-100">
      <button type="button" class="w-10 h-10 flex items-center justify-center rounded-full active:bg-slate-100 transition-colors" @click="$router.push('/')">
        <span class="material-symbols-outlined text-slate-700">arrow_back_ios_new</span>
      </button>
      <h1 class="text-[19px] font-bold tracking-normal">我的零浪费记录</h1>
      <button type="button" class="w-10 h-10 flex items-center justify-center rounded-full active:bg-slate-100 transition-colors" @click="calendarOpen = true">
        <span class="material-symbols-outlined text-slate-700">calendar_today</span>
      </button>
    </nav>

    <!-- 日历筛选弹层 -->
    <Teleport to="body">
      <Transition name="calendar-fade">
        <div v-if="calendarOpen" class="fixed inset-0 z-[100] flex items-end justify-center" @click.self="calendarOpen = false">
          <div class="absolute inset-0 bg-black/40" @click="calendarOpen = false"></div>
          <div class="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl safe-inset-bottom calendar-panel" @click.stop>
            <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 class="text-lg font-black text-slate-800">选择时间范围</h3>
              <button type="button" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100" @click="calendarOpen = false">
                <span class="material-symbols-outlined text-slate-500">close</span>
              </button>
            </div>
            <div class="p-5 space-y-4">
              <div class="grid grid-cols-3 gap-3">
                <button
                  v-for="preset in datePresets"
                  :key="preset.type"
                  type="button"
                  :class="[
                    'py-3 px-4 rounded-2xl text-sm font-bold transition-all border',
                    dateRange.type === preset.type ? 'bg-primary border-primary text-slate-900' : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                  ]"
                  @click="applyPreset(preset)"
                >
                  {{ preset.label }}
                </button>
              </div>
              <div class="border-t border-slate-100 pt-4">
                <p class="text-xs font-bold text-slate-400 mb-3">自定义范围</p>
                <div class="flex items-center gap-3">
                  <input
                    v-model="customStart"
                    type="date"
                    class="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800"
                  />
                  <span class="text-slate-400 text-sm">至</span>
                  <input
                    v-model="customEnd"
                    type="date"
                    class="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800"
                  />
                </div>
                <button
                  type="button"
                  class="mt-3 w-full py-3 rounded-2xl bg-primary text-slate-900 text-sm font-bold flex items-center justify-center gap-2"
                  @click="applyCustomRange"
                >
                  <span class="material-symbols-outlined text-lg">check_circle</span>
                  应用自定义范围
                </button>
              </div>
              <p class="text-slate-400 text-xs">当前筛选：{{ dateRangeLabel }}</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <main class="max-w-md mx-auto pb-32">
      <section class="px-6 pt-10 pb-6 text-center">
        <div class="relative w-56 h-28 mx-auto mb-6 overflow-hidden">
          <div class="absolute inset-0 border-[16px] border-slate-100 rounded-t-full"></div>
          <div
            class="absolute inset-0 border-[16px] border-primary rounded-t-full"
            :style="{
              clipPath: 'inset(0 0 0 0)',
              transform: `rotate(${165 + (stats?.eco_score ?? 92) * 1.5}deg)`,
              transformOrigin: 'center bottom',
            }"
          ></div>
          <div class="absolute bottom-0 left-0 right-0">
            <span class="text-5xl font-extrabold text-slate-900 leading-none">{{ stats?.eco_score ?? 92 }}</span>
            <span class="text-sm font-bold text-slate-400 block mt-1 tracking-tight">健康分</span>
          </div>
        </div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight mb-2">简直太棒啦！</h2>
        <p class="text-slate-500 text-sm font-medium">这个月你打败了 95% 的小伙伴哦。</p>
      </section>

      <section class="grid grid-cols-2 gap-4 px-4 py-2">
        <div class="bg-white border border-slate-100 shadow-sm p-5 rounded-2xl">
          <p class="text-xs font-bold text-slate-400 tracking-tight mb-1">健康分</p>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold text-[#20C997]">{{ stats?.eco_score ?? 92 }}</span>
            <span class="text-[11px] font-bold text-slate-400">{{ stats?.eco_level || '环保小达人' }}</span>
          </div>
        </div>
        <div class="bg-white border border-slate-100 shadow-sm p-5 rounded-2xl">
          <p class="text-xs font-bold text-slate-400 tracking-tight mb-1">浪费件数</p>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold text-[#FF6B6B]">{{ stats?.total_wasted ?? 0 }} 件</span>
          </div>
        </div>
      </section>

      <section class="px-4 py-4">
        <div class="bg-white border border-slate-100 shadow-sm p-6 rounded-3xl">
          <h3 class="text-lg font-bold text-slate-900 mb-6">浪费占比</h3>
          <div class="flex items-center gap-8">
            <div class="relative w-32 h-32 flex items-center justify-center">
              <div
                class="absolute inset-0 rounded-full border-[16px] border-transparent"
                :style="{
                  background: `conic-gradient(#00D1A0 0% ${stats?.consumed_percentage ?? 78}%, #FF6B6B ${stats?.consumed_percentage ?? 78}% 100%)`,
                  borderRadius: '50%',
                }"
              ></div>
              <div class="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                <span class="text-2xl font-extrabold text-slate-900">{{ stats?.consumed_percentage ?? 78 }}%</span>
                <span class="text-[10px] font-bold text-slate-400 tracking-tighter">新鲜分（光盘率）</span>
              </div>
            </div>
            <div class="flex flex-col gap-5 flex-1">
              <div class="flex items-center gap-3">
                <div class="w-3.5 h-3.5 rounded-full bg-primary shadow-sm shadow-primary/40"></div>
                <div class="flex-1">
                  <p class="text-sm font-bold leading-none text-slate-800">进肚子的</p>
                  <p class="text-xs text-slate-400 font-medium">{{ stats?.total_consumed ?? 0 }} 件食材</p>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-3.5 h-3.5 rounded-full bg-[#FF6B6B] shadow-sm shadow-[#FF6B6B]/40"></div>
                <div class="flex-1">
                  <p class="text-sm font-bold leading-none text-slate-800">扔掉的</p>
                  <p class="text-xs text-slate-400 font-medium">{{ stats?.total_wasted ?? 0 }} 件过期</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="py-6">
        <h3 class="text-lg font-bold px-5 mb-4 text-slate-900">我的荣誉勋章</h3>
        <div class="flex gap-4 overflow-x-auto px-5 no-scrollbar pb-4">
          <div
            v-for="b in badges"
            :key="b.id"
            :class="[
              'flex-shrink-0 w-32 p-5 rounded-3xl flex flex-col items-center text-center shadow-sm',
              b.unlocked ? 'bg-[#20C997]/5 border border-[#20C997]/10' : 'bg-white border border-slate-100'
            ]"
          >
            <div
              :class="[
                'w-14 h-14 rounded-full flex items-center justify-center mb-4',
                b.unlocked ? 'bg-[#20C997] text-white shadow-lg shadow-[#20C997]/30' : 'bg-slate-100 text-slate-400'
              ]"
            >
              <span class="material-symbols-outlined !text-3xl">{{ b.icon }}</span>
            </div>
            <p :class="['text-sm font-bold leading-tight', b.unlocked ? 'text-slate-900' : 'text-slate-500']">{{ b.name }}</p>
            <template v-if="b.unlocked">
              <p class="text-[10px] text-[#20C997] font-bold mt-1.5 uppercase">Lvl. {{ b.level }}</p>
            </template>
            <template v-else>
              <div v-if="b.progress != null" class="w-full h-1 bg-slate-100 rounded-full mt-2.5 overflow-hidden">
                <div class="bg-primary h-full" :style="{ width: `${b.progress}%` }"></div>
              </div>
              <p v-else class="text-[10px] text-slate-400 mt-1.5 font-bold uppercase tracking-wider">未解锁</p>
            </template>
          </div>
        </div>
      </section>
    </main>

    <div class="fixed bottom-24 left-0 right-0 px-6 max-w-md mx-auto z-40">
      <button
        type="button"
        class="w-full bg-primary text-white font-extrabold py-4 rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        @click="showToast('分享功能开发中...', 'info')"
      >
        <span class="material-symbols-outlined">share</span>
        把好成绩分享给朋友
      </button>
    </div>

    <NavBar current="stats" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getStatsOverview } from '@/api/stats'
import { showToast } from '@/utils/toast'
import NavBar from '@/components/NavBar.vue'

const stats = ref(null)
const badges = ref([])

const calendarOpen = ref(false)
const customStart = ref('')
const customEnd = ref('')

function getMonthStartEnd(offsetMonths = 0) {
  const d = new Date()
  d.setMonth(d.getMonth() + offsetMonths)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  const start = new Date(d)
  d.setMonth(d.getMonth() + 1)
  d.setDate(0)
  d.setHours(23, 59, 59, 999)
  const end = new Date(d)
  return { start, end }
}

const dateRange = ref({ type: 'month', label: '本月', ...getMonthStartEnd(0) })
const datePresets = [
  { type: 'month', label: '本月', ...getMonthStartEnd(0) },
  { type: 'lastMonth', label: '上月', ...getMonthStartEnd(-1) },
  {
    type: 'last3Months',
    label: '近3月',
    get start() {
      return getMonthStartEnd(-2).start
    },
    get end() {
      return getMonthStartEnd(0).end
    },
  },
]

function formatDate(d) {
  if (!d) return ''
  const x = typeof d === 'string' ? new Date(d) : d
  return `${x.getFullYear()}.${String(x.getMonth() + 1).padStart(2, '0')}.${String(x.getDate()).padStart(2, '0')}`
}

function applyPreset(preset) {
  const start = preset.start
  const end = preset.end
  dateRange.value = { type: preset.type, label: preset.label, start, end }
  calendarOpen.value = false
  showToast(`已切换为「${preset.label}」`, 'success')
}

function applyCustomRange() {
  if (!customStart.value || !customEnd.value) {
    showToast('请选择开始和结束日期', 'error')
    return
  }
  const start = new Date(customStart.value)
  const end = new Date(customEnd.value)
  if (start > end) {
    showToast('开始日期不能晚于结束日期', 'error')
    return
  }
  dateRange.value = { type: 'custom', label: '自定义', start, end }
  calendarOpen.value = false
  showToast('已应用自定义范围', 'success')
}

const dateRangeLabel = computed(() => {
  const r = dateRange.value
  if (!r.start || !r.end) return '本月'
  return `${formatDate(r.start)} 至 ${formatDate(r.end)}`
})

const iconMap = {
  fridge_guardian: 'shield_with_heart',
  clearance_master: 'psychology',
  food_hero: 'eco',
  smart_shopper: 'shopping_basket',
}

async function loadStats() {
  try {
    const s = await getStatsOverview()
    stats.value = {
      eco_score: s.ecoScore ?? 92,
      eco_level: s.ecoLevel ?? '环保小达人',
      total_consumed: s.totalConsumed ?? 0,
      total_wasted: s.totalWasted ?? 0,
      consumed_percentage: Math.round((s.cleanPlateRate ?? 0) * 100) || 78,
      clean_plate_rate: s.cleanPlateRate,
    }
    showToast('数据加载成功', 'success')
  } catch (e) {
    showToast('加载统计失败', 'error')
  }
}

async function loadBadges() {
  try {
    const list = [
      { id: 'fridge_guardian', name: '冰箱守护者', unlocked: true, level: 4 },
      { id: 'clearance_master', name: '清仓小能手', unlocked: false, progress: 30 },
      { id: 'food_hero', name: '节粮小英雄', unlocked: true, level: 2 },
      { id: 'smart_shopper', name: '精明小买手', unlocked: false, progress: 60 },
    ]
    badges.value = list.map((b) => ({ ...b, icon: iconMap[b.id] || 'star' }))
  } catch (e) {
    console.warn(e)
  }
}

onMounted(() => {
  loadStats()
  loadBadges()
})
</script>

<style scoped>
.calendar-fade-enter-active,
.calendar-fade-leave-active {
  transition: opacity 0.25s ease;
}
.calendar-fade-enter-active .calendar-panel,
.calendar-fade-leave-active .calendar-panel {
  transition: transform 0.25s ease;
}
.calendar-fade-enter-from,
.calendar-fade-leave-to {
  opacity: 0;
}
.calendar-fade-enter-from .calendar-panel,
.calendar-fade-leave-to .calendar-panel {
  transform: translateY(100%);
}
</style>
