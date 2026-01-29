<template>
  <div class="bg-[#f6f8f7] min-h-screen min-h-[100dvh] flex flex-col">
    <div class="relative z-50 safe-top flex items-center bg-transparent p-4 pb-2 justify-between">
      <router-link to="/" class="text-slate-900 flex size-12 shrink-0 items-center">
        <div class="p-2 rounded-full bg-white/60 backdrop-blur-md">
          <span class="material-symbols-outlined cursor-pointer">close</span>
        </div>
      </router-link>
      <h2 class="text-slate-900 text-lg font-bold leading-tight tracking-tight flex-1 text-center">AI 智能扫码录入</h2>
      <div class="flex w-12 items-center justify-end">
        <button class="flex size-12 items-center justify-center rounded-full bg-white/60 backdrop-blur-md text-slate-900 shadow-sm">
          <span class="material-symbols-outlined">flashlight_on</span>
        </button>
      </div>
    </div>

    <div class="relative flex-1 flex flex-col items-center justify-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img
          alt="食品保质期扫描"
          class="w-full h-full object-cover contrast-[1.05]"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuArYRimNecEj3W2aQgoRRC-kbu1-xklMJZm8nvkkXuf5X7A-K3ctvw4DnZ28L6vuTwFvfZc9s7gYcN0ZhOXYuZ4_91qzytjaiIZSj_crseLgipozF8itBSa6upkCACsmvASvljuX9xzm670dLtNdShuC2aYbcIYd4vXTTay68lZxB03jsGYIYm1YPYkBJW2gOdau5_cmbUoqxj0COSDOaUeuRBBvoBOYgA4tYvuDh4qp-OYT_orfirnU1LwSeD9h1l9Jsux25fZ_nUK"
          @error="onBgImgError"
        />
        <div class="absolute inset-0 bg-[radial-gradient(circle, transparent 40%, rgba(255,255,255,0.4) 100%)]"></div>
      </div>
      <div class="relative z-10 flex flex-col items-center">
        <div class="w-48 h-48 border-4 border-primary rounded-full flex items-center justify-center relative shadow-[0_0_20px_2px_rgba(19,236,128,0.4)]">
          <div class="absolute inset-0 border border-primary/40 rounded-full scale-110"></div>
        </div>
        <div class="mt-8 flex gap-3 p-1">
          <div class="flex h-12 shrink-0 items-center justify-center gap-x-2 rounded-2xl bg-white/80 backdrop-blur-md px-5 border border-white/50 shadow-xl">
            <span class="material-symbols-outlined text-primary font-bold">verified</span>
            <p class="text-slate-900 text-base font-bold">发现日期：{{ expireDisplay }}</p>
          </div>
        </div>
        <p class="text-slate-700 text-sm font-semibold mt-4 bg-white/60 backdrop-blur-md px-6 py-2 rounded-full border border-white/40 shadow-sm">
          请将保质期对准圆圈中心
        </p>
      </div>
    </div>

    <div class="relative z-10 flex items-center justify-center gap-8 p-4 pb-6">
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="onImageSelect"
      />
      <button
        type="button"
        class="flex shrink-0 items-center justify-center rounded-full size-12 bg-white/60 backdrop-blur-md text-slate-700 border border-white/50"
        @click="triggerFileInput"
      >
        <span class="material-symbols-outlined">image</span>
      </button>
      <button
        type="button"
        class="flex shrink-0 items-center justify-center rounded-full size-20 bg-primary/20 border-4 border-white/80 p-1 shadow-lg"
        @click="startScan"
      >
        <div class="bg-primary rounded-full w-full h-full flex items-center justify-center shadow-inner">
          <span class="material-symbols-outlined text-white font-bold text-3xl">camera</span>
        </div>
      </button>
      <button
        type="button"
        class="flex shrink-0 items-center justify-center rounded-full size-12 bg-white/60 backdrop-blur-md text-slate-700 border border-white/50"
        @click="startBarcodeScan"
      >
        <span class="material-symbols-outlined">barcode_scanner</span>
      </button>
    </div>

    <div class="relative z-[60] flex flex-col justify-end items-stretch">
      <div class="flex flex-col items-stretch bg-white/80 backdrop-blur-2xl rounded-t-[40px] border-t border-white/60 pb-10 px-6 safe-inset-bottom shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div class="flex h-10 w-full items-center justify-center">
          <div class="h-1.5 w-14 rounded-full bg-slate-200"></div>
        </div>
        <div class="space-y-6 pt-2">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-[11px] font-extrabold text-primary uppercase tracking-widest mb-1">这是什么？</h3>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary" style="font-variation-settings: 'FILL' 1">lunch_dining</span>
                <span class="text-2xl font-bold text-slate-900 tracking-tight">{{ recognized?.name || '希腊酸奶 - 有机' }}</span>
              </div>
            </div>
            <button type="button" class="p-2.5 rounded-2xl bg-slate-100/80 text-slate-500 border border-slate-200/50" @click="showToast('编辑功能开发中', 'info')">
              <span class="material-symbols-outlined text-xl">edit_note</span>
            </button>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-slate-50/80 p-4 rounded-[24px] border border-slate-100">
              <p class="text-[11px] text-slate-400 font-bold mb-1 tracking-wider">啥时候过期？</p>
              <p class="text-lg font-bold text-slate-900">{{ expireDisplay }}</p>
            </div>
            <div class="bg-primary/5 p-4 rounded-[24px] border border-primary/10">
              <p class="text-[11px] text-primary/70 font-bold mb-1 tracking-wider">还能吃多久</p>
              <p class="text-lg font-bold text-slate-900">{{ daysLeftText }}</p>
            </div>
          </div>
          <div>
            <p class="text-[11px] text-slate-400 font-bold mb-3 tracking-wider">住哪儿？（常温/冷藏/冷冻）</p>
            <div class="flex gap-2">
              <button
                v-for="opt in storageOpts"
                :key="opt.value"
                :class="[
                  'flex-1 flex flex-col items-center justify-center gap-1.5 p-3.5 rounded-[22px] border',
                  storageStatus === opt.value
                    ? 'border-2 border-primary bg-primary text-white shadow-lg shadow-primary/20'
                    : 'border-slate-200 bg-white text-slate-400'
                ]"
                @click="storageStatus = opt.value"
              >
                <span class="material-symbols-outlined" :style="storageStatus === opt.value ? iconFillStyle : {}">{{ opt.icon }}</span>
                <span class="text-[11px] font-bold">{{ opt.label }}</span>
              </button>
            </div>
          </div>
          <button
            type="button"
            class="w-full h-15 py-4 bg-primary text-white font-bold text-lg rounded-[22px] flex items-center justify-center gap-3 shadow-xl shadow-primary/25 active:scale-95 transition-transform"
            @click="saveFood"
          >
            <span class="material-symbols-outlined font-bold">save_as</span>
            记下来
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { recognizeFood, saveScannedFood } from '@/api'
import { showToast, showLoading, hideLoading } from '@/utils/toast'

const router = useRouter()
const fileInputRef = ref(null)
const recognized = ref(null)
const isScanning = ref(false)
const storageStatus = ref('fridge')
const iconFillStyle = { fontVariationSettings: "'FILL' 1" }

const storageOpts = [
  { value: 'room', label: '常温', icon: 'thermostat' },
  { value: 'fridge', label: '冷藏', icon: 'kitchen' },
  { value: 'freezer', label: '冷冻', icon: 'ac_unit' },
]

const fallbackBg =
  'https://via.placeholder.com/800x600.png?text=Bad%E4%BA%86%E5%90%97+-+Image+Unavailable'

function onBgImgError(e) {
  if (e?.target && e.target.src !== fallbackBg) {
    e.target.src = fallbackBg
  }
}

const expireDisplay = computed(() => {
  const d = recognized.value?.expireDate || recognized.value?.expiry_date
  return d ? d.replace(/-/g, '/') : '2026/05/20'
})

const daysLeftText = computed(() => {
  const d = recognized.value?.expireDate || recognized.value?.expiry_date
  if (!d) return '-- 天'
  const days = Math.ceil((new Date(d) - new Date()) / (1000 * 60 * 60 * 24))
  return `${Math.max(0, days)} 天`
})

function triggerFileInput() {
  fileInputRef.value?.click()
}

function onImageSelect(e) {
  const file = e.target.files?.[0]
  if (!file || !file.type.startsWith('image/')) return
  const reader = new FileReader()
  reader.onload = async () => {
    const dataUrl = reader.result
    const base64 = typeof dataUrl === 'string' && dataUrl.startsWith('data:') ? dataUrl.split(',')[1] : dataUrl
    if (!base64) return
    try {
      showLoading('正在识别...')
      const result = await recognizeFood({ imageBase64: `data:${file.type};base64,${base64}`, storageStatus: storageStatus.value })
      recognized.value = result
      hideLoading()
      showToast('识别成功！', 'success')
    } catch (err) {
      hideLoading()
      showToast('识别失败，请重试', 'error')
    }
  }
  reader.readAsDataURL(file)
  e.target.value = ''
}

async function simulateScan() {
  try {
    showLoading('正在识别...')
    const result = await recognizeFood({ imageUrl: '' })
    recognized.value = result
    hideLoading()
    showToast('识别成功！', 'success')
  } catch (e) {
    hideLoading()
    showToast('识别失败，请重试', 'error')
  }
}

function startScan() {
  if (isScanning.value) return
  isScanning.value = true
  showToast('请将摄像头对准食物', 'info')
  setTimeout(async () => {
    await simulateScan()
    isScanning.value = false
  }, 2000)
}

function startBarcodeScan() {
  if (isScanning.value) return
  isScanning.value = true
  showToast('请扫描条形码', 'info')
  setTimeout(async () => {
    await simulateScan()
    isScanning.value = false
  }, 1500)
}

async function saveFood() {
  if (!recognized.value) {
    showToast('请先识别食物', 'error')
    return
  }
  try {
    showLoading('正在保存...')
    await saveScannedFood({
      name: recognized.value.name,
      expireDate: recognized.value.expireDate || recognized.value.expiry_date,
      storageStatus: storageStatus.value,
      brand: recognized.value.brand || '',
      category: recognized.value.category || '',
      imageUrl: recognized.value.image_url || recognized.value.imageUrl || '',
    })
    hideLoading()
    showToast('保存成功！', 'success')
    setTimeout(() => router.push('/'), 1500)
  } catch (e) {
    hideLoading()
    showToast('保存失败，请重试', 'error')
  }
}

onMounted(() => {
  simulateScan()
})
</script>
