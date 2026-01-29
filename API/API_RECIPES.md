## 菜谱推荐接口（`/api/recipes`）

### 统一说明

- **Base URL**：`/api/recipes`
- **通用响应结构**：`{ code: "000", data: <业务数据>, msg: "描述信息" }`
  - 成功：`code = "000"`；
  - 失败：`code` 为 3 位业务错误码（`1xx~5xx`），`data = null`。

---

### POST `/api/recipes/recommend` —— 获取推荐菜谱

- **Body**
  - `mode`：`"manual" | "auto"`
  - `selectedFoodIds?`: `string[]`，`mode = "manual"` 时使用
  - `daysThreshold?`: `number`，默认 `3`
- **成功 data 结构**
  - `{ recipes: Recipe[] }`

---

### POST `/api/recipes/:id/complete` —— 完成菜谱（批量标记已烹饪）

- **Path 参数**
  - `id`：菜谱 ID（可为虚拟）
- **Body**
  - `foodIds`: `string[]`
  - `rating?`: `number`
  - `note?`: `string`
- **成功 data 结构**
  - `{ recipeId: number, updatedFoods: number[], message: string }`

