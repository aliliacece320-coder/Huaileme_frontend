## 扫码识别接口（`/api/scan`）

### 统一说明

- **Base URL**：`/api/scan`
- **通用响应结构**：`{ code: "000", data: <业务数据>, msg: "描述信息" }`
  - 成功：`code = "000"`；
  - 失败：`code` 为 3 位业务错误码（`1xx~5xx`），`data = null`。

---

### POST `/api/scan/recognize` —— 识别食物

- **Body**
  - 至少提供以下之一：
    - `imageBase64`
    - `imageUrl`
    - `barcode`
  - 其他：
    - `storageStatus?`: `room|fridge|freezer`
- **成功 data 结构**
  - `{ name, brand, category, expireDate, confidence, candidates: any[], ocrRawText, tips: string[] }`

---

### POST `/api/scan/save` —— 保存识别结果为食物

- **Body**
  - `name`（必填）
  - `expireDate`（必填，`YYYY-MM-DD`）
  - `storageStatus`（必填）
  - 可选：`brand`, `category`, `imageUrl`
- **成功 data 结构**
  - `{ id: number, message: string }`

