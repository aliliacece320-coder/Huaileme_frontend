## 图片处理接口（`/api/images`）

### 统一说明

- **Base URL**：`/api/images`
- **通用响应结构**：`{ code: "000", data: <业务数据>, msg: "描述信息" }`
  - 成功：`code = "000"`；
  - 失败：`code` 为 3 位业务错误码（`1xx~5xx`），`data = null`。

---

### POST `/api/images/optimize` —— 食材图片 AI 优化

- **Body**
  - `imageUrl`（必填）：原始图片地址
  - `foodId?`：关联的食材 ID
- **成功 data 结构**
  - `{ foodId?: number, originalImageUrl: string, optimizedImageUrl: string }`

