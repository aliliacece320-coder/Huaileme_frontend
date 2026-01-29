# 坏了么 - Vue 3 移动端

基于现有 HTML 原型与 API 文档构建的 Vue 3 (Vite + Pinia) 移动端项目。

## 技术栈

- Vue 3 (Composition API + `<script setup>`)
- Vite 5
- Vue Router 4
- Pinia
- Axios
- Tailwind CSS

## 目录结构

```
src/
├── api/          # 按 API 文档生成的请求模块（auth, user, family, foods, recipes, scan, images, stats, foodActions）
├── views/        # 页面组件（由 views/*.html 转换）
├── components/   # 公共组件（如 NavBar）
├── utils/        # request.js（Axios 封装）、toast 等
├── router/       # Vue Router 配置
└── stores/       # Pinia stores
```

## 路由与页面

| 路径 | 页面 | 对应原型 |
|------|------|----------|
| `/` | 首页风险看板 | huaileme_home_risk_dashboard_code.html |
| `/stats` | 零浪费统计报告 | zero_waste_statistics_report_code.html |
| `/scanner` | AI 智能扫码 | ai_smart_scanner_entry_code.html |
| `/recipes` | 清库存菜谱 | ai_fridge_clearing_recipes_code.html |
| `/family` | 账号与家庭 | user_family_center_code.html |
| `/fridge` | 虚拟冰箱 | interactive_virtual_fridge_view_code.html |
| `/item/:id` | 食物详情与操作 | item_details_action_screen_code.html |

## 开发与构建

```bash
npm install
npm run dev    # 开发服务器 http://localhost:5173
npm run build  # 生产构建
npm run preview # 预览构建结果
```

## API 代理

开发时 `/api` 会代理到 `http://localhost:3000`，可在 `vite.config.js` 的 `server.proxy` 中修改。

## 环境说明

- 请求 BaseURL：`/api`
- 统一响应格式：`{ code, data, msg }`，成功时 `code === '000'`
- Token 存于 `localStorage`，键名 `huaileme_auth_token`，请求头自动附带 `Authorization: Bearer <token>`
