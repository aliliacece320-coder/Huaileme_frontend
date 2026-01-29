<template>
  <div class="max-w-md mx-auto min-h-screen min-h-[100dvh] flex flex-col">
    <header class="sticky top-0 z-50 safe-top bg-white/80 backdrop-blur-md border-b border-slate-100 px-5 py-4 flex items-center justify-between">
      <button class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100" @click="goBack">
        <span class="material-symbols-outlined text-slate-600">arrow_back_ios_new</span>
      </button>
      <h1 class="text-lg font-black tracking-tight">我的账号与家庭</h1>
      <div class="w-10 h-10"></div>
    </header>

    <main class="flex-1 px-5 py-4 pb-28 space-y-5">
      <section class="bg-white/90 rounded-3xl border border-slate-100 shadow-sm p-4 space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-slate-400 tracking-widest">登录状态</p>
            <p v-if="authed" class="mt-1 text-base font-bold">已登录：{{ profile?.username }}</p>
            <p v-else class="mt-1 text-base font-bold">当前未登录</p>
          </div>
          <span v-if="authed" class="material-symbols-outlined text-primary text-2xl">verified_user</span>
          <span v-else class="material-symbols-outlined text-slate-300 text-2xl">lock_open</span>
        </div>
        <div v-if="!authed" class="mt-4">
          <router-link
            to="/login?redirect=/family"
            class="h-12 rounded-2xl bg-primary text-slate-900 text-sm font-bold flex items-center justify-center gap-2 w-full"
          >
            <span class="material-symbols-outlined text-lg">login</span>
            去登录
          </router-link>
        </div>
        <div v-else class="mt-3 flex items-center justify-between">
          <div class="text-xs text-slate-500">
            <p>昵称：{{ profile?.displayName || '未设置' }}</p>
            <p class="mt-0.5">用户 ID：{{ profile?.id }}</p>
          </div>
          <button class="h-9 px-4 rounded-full border border-slate-200 text-xs font-bold text-slate-500" @click="logout">退出登录</button>
        </div>
      </section>

      <section class="bg-white/90 rounded-3xl border border-slate-100 shadow-sm p-4 space-y-3">
        <div class="flex items-center justify-between mb-1">
          <div>
            <p class="text-xs font-bold text-slate-400 tracking-widest">当前家庭</p>
            <p v-if="family" class="mt-1 text-base font-bold">「{{ family.name }}」</p>
            <p v-else class="mt-1 text-base font-bold">暂无家庭信息</p>
          </div>
          <span class="material-symbols-outlined text-primary text-2xl">diversity_2</span>
        </div>
        <div v-if="family" class="text-xs text-slate-500 space-y-1">
          <p>家庭 ID：{{ family.id }}</p>
          <p>成员：{{ family.members?.length || 0 }} 人</p>
        </div>
        <form v-if="authed" class="mt-3 grid grid-cols-2 gap-2" @submit.prevent="joinFamily">
          <input
            v-model.number="familyForm.familyId"
            type="number"
            placeholder="输入家庭ID加入"
            class="text-xs rounded-2xl border border-slate-200 px-4 py-2 col-span-2"
          />
          <button
            type="submit"
            class="h-9 rounded-2xl bg-primary text-white text-xs font-bold flex items-center justify-center gap-1"
          >
            <span class="material-symbols-outlined text-sm">meeting_room</span> 加入家庭
          </button>
          <button
            type="button"
            class="h-9 rounded-2xl border border-slate-200 text-xs font-bold text-slate-500 flex items-center justify-center gap-1"
            @click="leaveFamily"
          >
            <span class="material-symbols-outlined text-sm">logout</span> 退出当前家庭
          </button>
        </form>
        <p v-else class="text-xs text-slate-400">登录后可查看和管理家庭信息。</p>
      </section>
    </main>

    <NavBar current="settings" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { logout as apiLogout } from '@/api/auth'
import { getUserProfile } from '@/api/user'
import { getFamily, joinFamily as apiJoinFamily, leaveFamily as apiLeaveFamily } from '@/api/family'
import { TOKEN_KEY } from '@/utils/request'
import { showToast } from '@/utils/toast'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const familyForm = ref({ familyId: '' })
const profile = ref(null)
const family = ref(null)
const authed = ref(!!(typeof localStorage !== 'undefined' && localStorage.getItem(TOKEN_KEY)))

async function loadProfileAndFamily() {
  if (!authed.value) return
  try {
    profile.value = await getUserProfile()
  } catch (e) {
    console.warn(e)
  }
  try {
    family.value = await getFamily()
  } catch (e) {
    console.warn(e)
  }
}

async function logout() {
  await apiLogout()
  authed.value = false
  profile.value = null
  family.value = null
  showToast('已退出登录', 'success')
}

async function joinFamily() {
  if (!familyForm.value.familyId) {
    showToast('请填写家庭ID', 'error')
    return
  }
  try {
    await apiJoinFamily(familyForm.value.familyId)
    showToast('加入家庭成功', 'success')
    await loadProfileAndFamily()
  } catch (e) {
    showToast(e.message || '加入家庭失败', 'error')
  }
}

async function leaveFamily() {
  try {
    await apiLeaveFamily()
    showToast('已退出当前家庭', 'success')
    await loadProfileAndFamily()
  } catch (e) {
    showToast(e.message || '操作失败', 'error')
  }
}

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

onMounted(() => {
  authed.value = !!(typeof localStorage !== 'undefined' && localStorage.getItem(TOKEN_KEY))
  loadProfileAndFamily()
})
</script>
