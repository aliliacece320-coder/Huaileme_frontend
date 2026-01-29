## 食物管理接口（`/api/foods`）

### 统一说明

- **Base URL**：`/api/foods`
- **通用响应结构**：`{ code: "000", data: <业务数据>, msg: "描述信息" }`
  - 成功：`code = "000"`，`data` 为下述结构之一；
  - 失败：`code` 为 3 位业务错误码（`1xx~5xx`），`data = null`。

---

### GET `/api/foods` —— 获取食物列表

- **Query 参数**
  - `storageStatus?`：`room|fridge|freezer|...`
  - `status?`：`active|consumed|wasted|deleted`
  - `keyword?`：名称模糊搜索
  - `category?`
  - `page?`：默认 `1`
  - `pageSize?`：默认 `20`
- **成功 data 结构**
  - `{ items: Food[], page: number, pageSize: number, total: number }`

---

### GET `/api/foods/:id` —— 获取食物详情

- **Path 参数**
  - `id`：食材 ID
- **成功 data 结构**
  - `Food & { lastAction?: { actionType, actionTime, score?, note? } }`

---

### POST `/api/foods` —— 创建食物

- **Body**
  - `name`（必填）
  - `expireDate`（必填，`YYYY-MM-DD`）
  - `storageStatus`（必填，`room|fridge|freezer`）
  - 可选：`brand`, `category`, `imageUrl`, `quantity`, `isLeftover`
- **成功 data 结构**
  - `{ id: number, message: string }`

---

### PUT `/api/foods/:id` —— 更新食物

- **Path 参数**
  - `id`：食材 ID
- **Body**
  - 与创建相同字段，均为可选（部分更新）
- **成功 data 结构**
  - `{ id: number, message: string }`

---

### DELETE `/api/foods/:id` —— 软删除食物

- **Path 参数**
  - `id`：食材 ID
- **成功 data 结构**
  - `{ id: number, message: string }`

---

### GET `/api/foods/risk/list` —— 风险食物列表

- **Query 参数**
  - `daysThreshold?`：默认 `3`
  - `includeLeftover?`：默认 `false`
- **成功 data 结构**
  - `{ urgentItems: Food[], urgentItemsCount: number, goodItemsCount: number }`

---

### GET `/api/foods/stats/summary` —— 首页统计摘要

- **Query 参数**
  - 无（基于当前家庭与当前月份）
- **成功 data 结构**
  - `{ healthScore, totalActive, urgentCount, goodCount, wastedThisMonth, consumedThisMonth }`

