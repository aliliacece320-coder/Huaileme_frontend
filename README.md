# 坏了么 · Huaileme Frontend

> 面向移动端的冰箱与食物管理应用，少浪费、更安心。

**坏了么（huaileme-mobile）** 帮助用户掌握家中食物状态、及时消耗临近过期食材，减少浪费。使用 Vue 3 + Vite 构建，支持首页风险看板、AI 扫码录入、清库存菜谱推荐、零浪费统计与家庭账号等功能。

---

## 功能概览

| 模块 | 说明 |
|------|------|
| **首页风险看板** | 按新鲜度/临期/已过期查看食物，一目了然 |
| **AI 智能扫码** | 扫码录入食材，自动识别并加入冰箱 |
| **清库存菜谱** | 根据现有食材推荐菜谱，消灭库存 |
| **零浪费统计** | 统计节省与浪费趋势，激励可持续习惯 |
| **虚拟冰箱** | 按区域管理食物，可视化查看 |
| **账号与家庭** | 登录/注册、家庭成员、多端同步 |

---

## 技术栈

| 类别 | 技术 | 说明 |
|------|------|------|
| 框架 | Vue 3 | Composition API + `<script setup>` |
| 构建 | Vite 5 | 开发服务器与生产构建 |
| 路由 | Vue Router 4 | 懒加载、鉴权 |
| 状态 | Pinia | 用户/登录状态 |
| 请求 | Axios | 封装于 `src/utils/request.js`，统一拦截与 Token |
| 样式 | Tailwind CSS | 工具类 + 安全区适配 |

---

## 快速开始

### 环境要求

- Node.js 16+
- npm 或 pnpm

### 安装与运行

```bash
# 克隆仓库后进入项目目录
cd Huaileme_frontend

# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev
```

浏览器访问 **http://localhost:5173** 即可预览。若需对接后端，请先启动后端服务（默认 `http://localhost:3000`），前端会将 `/api` 请求代理到该地址。

### 构建与预览

```bash
npm run build    # 生产构建，输出到 dist/
npm run preview  # 本地预览构建结果
```

---

## 项目结构

完整目录树与说明见 **[STRUCTURE.md](./STRUCTURE.md)**。

```
src/
├── api/          # 接口模块（auth、foods、recipes、scan、stats 等）
├── views/        # 页面组件（首页、扫码、菜谱、设置等）
├── components/   # 公共组件（底部导航 NavBar）
├── utils/        # 请求封装、Toast、工具方法
├── router/       # 路由与鉴权
└── stores/       # Pinia 状态（用户/家庭）
```

根目录下 **API/** 为后端接口文档（Markdown），与 `src/api/*.js` 对应。

---

## 路由与页面

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页风险看板 | 按风险等级查看食物 |
| `/stats` | 零浪费统计 | 节省/浪费趋势与勋章 |
| `/scanner` | AI 智能扫码 | 扫码录入食材 |
| `/recipes` | 清库存菜谱 | 根据食材推荐菜谱 |
| `/fridge` | 虚拟冰箱 | 按区域管理食物 |
| `/family` | 账号与家庭 | 登录/注册、家庭成员 |
| `/item/:id` | 食物详情 | 单条食物的操作与编辑 |
| `/settings` | 设置 | 通知、隐私、关于我们等子页 |

底部导航固定五栏：首页、零浪费、扫码、菜谱、设置；虚拟冰箱与账号家庭可从首页或设置进入。

---

## 环境与接口说明

| 项 | 说明 |
|------|------|
| 请求 BaseURL | `/api`（开发时由 Vite 代理到后端） |
| 代理目标 | 默认 `http://localhost:3000`，可通过环境变量 `VITE_API_PROXY_TARGET` 覆盖 |
| 响应格式 | `{ code, data, msg }`，成功时 `code === '000'` |
| 鉴权 | Token 存于 `localStorage`，键名 `huaileme_auth_token`，请求头自动附带 `Authorization: Bearer <token>` |

更多接口定义见 **API/** 目录下的 `API_SPEC.md` 及各模块文档。

---

## 相关文档

- **[STRUCTURE.md](./STRUCTURE.md)** — 完整项目结构说明
- **[report.md](./report.md)** — 生产前审计与修复小结
- **API/** — 后端接口文档（`API_SPEC.md`、`API_FOODS.md`、`API_RECIPES.md` 等）

---

## 许可证

本项目为私有仓库，仅供学习与内部使用。
