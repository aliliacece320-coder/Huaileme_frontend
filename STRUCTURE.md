# 坏了么 (huaileme-mobile) 项目结构说明

## 根目录总览

```
Bad？_v1.1/
├── index.html              # 应用入口 HTML，Vite 从这里加载
├── package.json            # 依赖与脚本
├── package-lock.json       # 依赖锁文件
├── vite.config.js          # Vite 配置（代理、别名、构建）
├── tailwind.config.js      # Tailwind CSS 配置
├── postcss.config.js       # PostCSS 配置
├── .gitignore              # Git 忽略规则（node_modules、dist、.env 等）
│
├── README.md               # 仓库简介（可作 GitHub 描述）
├── README_VUE.md           # Vue 项目说明（技术栈、路由、开发命令）
├── STRUCTURE.md            # 本文件：项目结构说明
├── REPORT.md               # 生产前审计报告（英文）
├── REPORT_zh.md            # 生产前审计报告（中文）
│
├── src/                    # 前端源码（Vue 应用）
├── public/                 # 静态资源（原样拷贝到构建产物）
├── API/                    # 后端 API 文档（Markdown）
├── views/                  # [遗留] HTML 原型页，已被 src/views/*.vue 替代
├── dist/                   # [构建产物] npm run build 生成，已被 .gitignore 忽略
└── node_modules/           # [依赖] npm install 生成，已被 .gitignore 忽略
```

---

## src/ 源码结构

```
src/
├── main.js                 # 应用入口：挂载 Vue、Router、Pinia
├── App.vue                 # 根组件：路由出口、全局样式与安全区
│
├── api/                    # 接口请求模块（与 API/ 文档对应）
│   ├── index.js            # 统一导出
│   ├── auth.js             # 登录、注册、登出
│   ├── user.js             # 用户资料
│   ├── family.js           # 家庭与成员
│   ├── foods.js            # 食物列表、详情、风险、统计
│   ├── foodActions.js      # 食物增删改、丢弃等
│   ├── recipes.js          # 菜谱推荐
│   ├── scan.js             # 扫码识别
│   ├── images.js           # 图片优化
│   └── stats.js            # 零浪费统计
│
├── router/
│   └── index.js            # 路由表与鉴权
│
├── stores/
│   ├── index.js            # Pinia 实例
│   └── user.js             # 用户状态（token、profile、family）
│
├── utils/
│   ├── index.js            # 工具导出
│   ├── request.js          # Axios 封装、拦截器、Token
│   └── toast.js            # 提示与 Loading
│
├── components/
│   ├── .gitkeep            # 保留空目录（现已有 NavBar.vue）
│   └── NavBar.vue          # 底部导航栏
│
└── views/                  # 页面组件（懒加载）
    ├── HomeRiskDashboard.vue           # 首页风险看板 /
    ├── ZeroWasteStatisticsReport.vue   # 零浪费统计 /stats
    ├── AiSmartScannerEntry.vue         # AI 扫码 /scanner
    ├── AiFridgeClearingRecipes.vue     # 清库存菜谱 /recipes
    ├── InteractiveVirtualFridgeView.vue # 虚拟冰箱 /fridge
    ├── ItemDetailsActionScreen.vue     # 食物详情 /item/:id
    ├── UserFamilyCenter.vue            # 账号与家庭 /family
    ├── SettingsPage.vue                # 设置 /settings
    ├── NotificationSettingsPage.vue    # 通知设置 /settings/notifications
    ├── PrivacySecurityPage.vue         # 隐私与安全 /settings/privacy
    ├── PrivacyDataPage.vue             # 数据存储 /settings/privacy/data
    ├── AboutUsPage.vue                 # 关于我们 /settings/about
    ├── LoginPage.vue                   # 登录 /login
    └── RegisterPage.vue               # 注册 /register
```

---

## API/ 文档目录

| 文件 | 说明 |
|------|------|
| API_SPEC.md | 通用规范（BaseURL、鉴权、响应格式） |
| API_FOODS.md | 食物相关接口 |
| API_RECIPES.md | 菜谱相关接口 |
| API_STATS.md | 统计相关接口 |
| API_SCAN.md | 扫码识别 |
| API_IMAGES.md | 图片优化 |
| API_FAMILY.md | 家庭与成员 |
| API_SETTINGS.md | 设置相关 |

---

## 其他目录说明

- **public/**  
  - `api-client.js`：仅被 `views/*.html` 原型引用；Vue 应用使用 `src/api/*.js`，运行时不依赖此文件。

- **views/**（根目录下）  
  - 7 个 `*_code.html`：早期 HTML 原型，功能已由 `src/views/*.vue` 实现，可保留作参考或删除。

- **dist/**  
  - 由 `npm run build` 生成，已通过 `.gitignore` 排除，无需提交。

- **node_modules/**  
  - 由 `npm install` 生成，已通过 `.gitignore` 排除。

---

## 脚本与入口

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发服务器 http://localhost:5173 |
| `npm run build` | 生产构建，输出到 `dist/` |
| `npm run preview` | 预览构建结果 |

入口：`index.html` → `/src/main.js` → `App.vue` + `router`。
