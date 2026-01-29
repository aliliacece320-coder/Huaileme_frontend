## 统计接口（`/api/stats`）

### 统一说明

- **Base URL**：`/api/stats`
- **通用响应结构**：`{ code: "000", data: <业务数据>, msg: "描述信息" }`
  - 成功：`code = "000"`；
  - 失败：`code` 为 3 位业务错误码（`1xx~5xx`），`data = null`。

---

### GET `/api/stats/foods/near-expiry-count` —— 近 N 天临期食材数量

- **Query 参数**
  - `days?`：整数，默认 `3`
- **成功 data 结构**
  - `{ nearExpiryCount: number }`

---

### GET `/api/stats/foods/fresh-count` —— 当前新鲜食材数量

- **Query 参数**
  - 无
- **成功 data 结构**
  - `{ freshCount: number }`

---

### GET `/api/stats/foods/wasted-count` —— 指定时间内浪费食材数量

- **Query 参数**
  - `from`：`YYYY-MM-DD`
  - `to`：`YYYY-MM-DD`
- **成功 data 结构**
  - `{ wastedCount: number }`
 - **逻辑说明**
   - 统计 `foods` 表中 `status = 'wasted'` 且 `wasted_at` 落在 `[from, to]` 区间内的记录数量。

---

### GET `/api/stats/foods/consumed-count` —— 指定时间内消耗食材数量

- **Query 参数**
  - `from`：`YYYY-MM-DD`
  - `to`：`YYYY-MM-DD`
- **成功 data 结构**
  - `{ consumedCount: number }`
 - **逻辑说明**
   - 统计 `foods` 表中 `status = 'consumed'` 且 `consumed_at` 落在 `[from, to]` 区间内的记录数量。

---

### GET `/api/stats/overview` —— 统计概览（环保分 & 月度报告）

- **Query 参数**
  - `month?`：`YYYY-MM`，默认当前月
- **成功 data 结构**
  - `{ month, ecoScore, ecoLevel, totalConsumed, totalWasted, cleanPlateRate }`

