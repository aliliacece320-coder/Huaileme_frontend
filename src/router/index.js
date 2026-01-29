import { createRouter, createWebHistory } from 'vue-router'
import { TOKEN_KEY } from '@/utils/request'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeRiskDashboard.vue'),
    meta: { title: '快过期啦' },
  },
  {
    path: '/stats',
    name: 'Stats',
    component: () => import('@/views/ZeroWasteStatisticsReport.vue'),
    meta: { title: '我的零浪费记录' },
  },
  {
    path: '/scanner',
    name: 'Scanner',
    component: () => import('@/views/AiSmartScannerEntry.vue'),
    meta: { title: 'AI 智能扫码录入' },
  },
  {
    path: '/recipes',
    name: 'Recipes',
    component: () => import('@/views/AiFridgeClearingRecipes.vue'),
    meta: { title: '消灭库存大作战' },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/SettingsPage.vue'),
    meta: { title: '设置' },
  },
  {
    path: '/settings/notifications',
    name: 'NotificationSettings',
    component: () => import('@/views/NotificationSettingsPage.vue'),
    meta: { title: '通知设置' },
  },
  {
    path: '/settings/privacy',
    name: 'PrivacySecurity',
    component: () => import('@/views/PrivacySecurityPage.vue'),
    meta: { title: '隐私与安全' },
  },
  {
    path: '/settings/privacy/data',
    name: 'PrivacyData',
    component: () => import('@/views/PrivacyDataPage.vue'),
    meta: { title: '数据存储与同步' },
  },
  {
    path: '/settings/about',
    name: 'AboutUs',
    component: () => import('@/views/AboutUsPage.vue'),
    meta: { title: '关于我们' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterPage.vue'),
    meta: { title: '注册' },
  },
  {
    path: '/family',
    name: 'Family',
    component: () => import('@/views/UserFamilyCenter.vue'),
    meta: { title: '我的账号与家庭' },
  },
  {
    path: '/fridge',
    name: 'Fridge',
    component: () => import('@/views/InteractiveVirtualFridgeView.vue'),
    meta: { title: '我的虚拟小冰箱' },
  },
  {
    path: '/item/:id',
    name: 'ItemDetail',
    component: () => import('@/views/ItemDetailsActionScreen.vue'),
    meta: { title: '宝贝详情' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫：基础鉴权 + 防止未登录用户在受保护页产生「来回跳」体验
router.beforeEach((to, from, next) => {
  const isAuthed = typeof localStorage !== 'undefined' && !!localStorage.getItem(TOKEN_KEY)

  // 受保护路由但未登录时，一律回首页，用 replace 避免历史栈形成死循环
  if (to.meta?.requiresAuth && !isAuthed) {
    if (from.name === 'Home' || !from.name) {
      next({ name: 'Home', replace: true })
    } else {
      next({ name: 'Home', replace: true })
    }
    return
  }

  next()
})

router.afterEach((to) => {
  if (to.meta?.title && typeof document !== 'undefined') {
    document.title = `${to.meta.title} - 坏了么`
  }
})

export default router
