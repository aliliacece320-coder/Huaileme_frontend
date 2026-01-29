## 设置与偏好接口（`/api/settings`）

> 说明：本文件为「设置相关新功能」与「零浪费统计日历筛选」的后端与数据表草案设计，供后续实现参考。

### 统一说明

- **Base URL**：`/api/settings`
- **通用响应结构**：`{ code: "000", data: <业务数据>, msg: "描述信息" }`
  - 成功：`code = "000"`；
  - 失败：`code` 为 3 位业务错误码（`1xx~5xx`），`data = null`。

---

### GET `/api/settings/notifications` —— 获取当前用户通知偏好

- **前置条件**
  - 已登录（由认证中间件注入 `userId`）
- **成功 data 结构**
  - ```ts
    {
      userId: number
      expiryReminderEnabled: boolean        // 过期提醒推送开关
      dailySummaryEnabled: boolean         // 每日冰箱摘要推送
      soundEnabled: boolean                // 通知声音 / 震动
      updatedAt: string                    // ISO 时间
    }
    ```
- **逻辑说明**
  - 若 `user_notification_settings` 表中不存在当前用户记录：
    - 使用系统默认值创建一条记录（如：`expiryReminderEnabled = true`，`dailySummaryEnabled = true`，`soundEnabled = true`）。
    - 返回新创建的默认配置。

---

### PUT `/api/settings/notifications` —— 更新当前用户通知偏好

- **前置条件**
  - 已登录
- **Body**
  - ```ts
    {
      expiryReminderEnabled?: boolean
      dailySummaryEnabled?: boolean
      soundEnabled?: boolean
    }
    ```
  - 所有字段均为**可选**，后端应做「部分更新」：
    - 仅更新 Body 中出现的字段，其余保持不变。
- **成功 data 结构**
  - ```ts
    {
      userId: number
      expiryReminderEnabled: boolean
      dailySummaryEnabled: boolean
      soundEnabled: boolean
      updatedAt: string
      message: string        // 例如："preferences updated"
    }
    ```
- **错误码示例**
  - `401`：未登录或 token 失效。

---

### POST `/api/settings/cache/clear` —— 清除当前用户在服务端的缓存（演示功能）

- **说明**
  - 对应「隐私与安全」页中的「清除缓存」按钮。
  - 真实产品中可视需求选择是否落地实现；当前作为演示接口设计。
- **前置条件**
  - 已登录
- **Body**
  - 可为空，或预留扩展字段：
  - ```ts
    {
      scope?: "all" | "stats" | "images"   // 可选，默认 "all"
    }
    ```
- **成功 data 结构**
  - ```ts
    {
      clearedScopes: string[]              // 实际清除的缓存 scope 列表
      message: string
    }
    ```
- **逻辑说明**
  - 后端可根据实现清除：
    - 与当前 `userId` 相关的统计缓存；
    - 与家庭相关的聚合缓存；
    - 其他需要的 Redis / 内存缓存等。
  - 若实际没有启用缓存，可直接返回 `clearedScopes: []` 与提示文案。

---

## 零浪费统计日历筛选扩展（基于 `/api/stats`）

> 对现有 `API_STATS.md` 的补充说明，用于支持零浪费记录页上的「日历筛选」能力。

### 统一说明

- **Base URL**：`/api/stats`
- **通用响应结构**：同 `API_STATS.md`。

---

### 扩展一：GET `/api/stats/overview` 支持自定义日期范围

- **现状**
  - 见 `API_STATS.md`：当前仅支持 `month?: YYYY-MM` 参数。
- **扩展设计**
  - 新增可选 Query 参数：
    - `from?`：`YYYY-MM-DD`
    - `to?`：`YYYY-MM-DD`
  - 参数优先级：
    1. 若同时提供 `from` 与 `to`，则以 `[from, to]` 为统计区间，忽略 `month`；
    2. 否则，按原有逻辑使用 `month`（默认当月）。
- **Query 参数汇总**
  - `month?`：`YYYY-MM`，默认当前月（可选）
  - `from?`：`YYYY-MM-DD`（可选）
  - `to?`：`YYYY-MM-DD`（可选）
- **成功 data 结构（在原有字段基础上保持不变）**
  - ```ts
    {
      month?: string            // 当以 month 查询时返回
      from?: string             // 当以 from/to 查询时返回
      to?: string
      ecoScore: number
      ecoLevel: string
      totalConsumed: number
      totalWasted: number
      cleanPlateRate: number    // 0~1 之间的小数
    }
    ```
- **逻辑说明**
  - 零浪费记录页的「日历筛选」会将用户选择的开始/结束日期作为 `from` / `to` 传入。
  - 为保持兼容，前端也可以继续在「按月」模式下仅传 `month`。

---

### 扩展二：新增 GET `/api/stats/waste-trend` —— 浪费趋势（按月或按日）

- **URL**
  - `GET /api/stats/waste-trend`
- **Query 参数**
  - `from`：`YYYY-MM-DD`
  - `to`：`YYYY-MM-DD`
  - `granularity?`：`"day" | "month"`，默认 `"month"`
- **成功 data 结构**
  - ```ts
    type WasteTrendPoint = {
      bucket: string     // 当 granularity="month" 时为 "2025-01"，"2025-02"；granularity="day" 时为 "2025-01-01"
      amount: number     // 浪费数量（件数），或等价浪费指数
    }

    {
      from: string
      to: string
      granularity: "day" | "month"
      points: WasteTrendPoint[]
    }
    ```
- **逻辑说明**
  - 当前前端的「钱包心疼指数」模块已计划弱化金钱相关展示，但仍可使用本趋势接口绘制柱状图或折线图，只是把文案替换为「浪费趋势」或「健康分趋势」。
  - 当 `granularity = "month"` 时，以月份为单位聚合；`"day"` 时以日期为单位。

---

## 数据库表设计（草案）

> 以下为支持「通知设置」等新功能的推荐表结构，具体字段可在落地时根据后端栈微调。

### 表：`user_notification_settings`

- **用途**
  - 存储每个用户的通知偏好，对应前端的「通知设置」页面。
- **字段设计**
  - `id`：`bigint`，主键，自增。
  - `user_id`：`bigint`，唯一索引（`UNIQUE`），关联 `users.id`。
  - `expiry_reminder_enabled`：`boolean`，默认 `true`。
  - `daily_summary_enabled`：`boolean`，默认 `true`。
  - `sound_enabled`：`boolean`，默认 `true`。
  - `created_at`：`timestamp`，默认当前时间。
  - `updated_at`：`timestamp`，默认当前时间，更新时自动刷新。
- **索引建议**
  - `UNIQUE KEY uk_user_notification_settings_user_id (user_id)`
- **示例 SQL（以 MySQL 为例）**
  - ```sql
    CREATE TABLE user_notification_settings (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
      user_id BIGINT UNSIGNED NOT NULL,
      expiry_reminder_enabled TINYINT(1) NOT NULL DEFAULT 1,
      daily_summary_enabled TINYINT(1) NOT NULL DEFAULT 1,
      sound_enabled TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY uk_user_notification_settings_user_id (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ```
- **与前端字段映射**
  - `expiry_reminder_enabled` ⇔ `expiryReminderEnabled`
  - `daily_summary_enabled` ⇔ `dailySummaryEnabled`
  - `sound_enabled` ⇔ `soundEnabled`

---

*本文件仅为新功能的接口与数据表草案说明，实际落地时可根据后端技术栈与安全要求进行调整。*

