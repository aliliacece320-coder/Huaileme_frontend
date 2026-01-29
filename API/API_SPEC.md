## 目录

- [0. 约定与数据模型](#0-约定与数据模型)
  - [0.1 基本约定](#01-基本约定)（Base URL、统一响应结构、错误码、时区）
  - [0.2 核心枚举 & 字段约定](#02-核心枚举--字段约定)
- [0.3 数据库表定义](#03-数据库表定义sqlite)（users / families / foods / recipes）
- [1. 食物管理模块（routes/foods.js）](#1-食物管理模块routesfoodsjs)
  - [1.1 获取食物列表](#11-获取食物列表)
  - [1.2 获取食物详情](#12-获取食物详情)
  - [1.3 创建食物](#13-创建食物)
  - [1.4 更新食物](#14-更新食物)
  - [1.5 删除食物（软删除）](#15-删除食物软删除)
  - [1.6 风险食物列表（临期清单）](#16-风险食物列表临期清单)
  - [1.7 首页统计摘要](#17-首页统计摘要)
- [2. 菜谱推荐模块（routes/recipes.js）](#2-菜谱推荐模块routesrecipesjs)
  - [2.1 获取推荐菜谱](#21-获取推荐菜谱)
  - [2.2 完成菜谱（批量标记已烹饪）](#22-完成菜谱批量标记已烹饪)
- [3. 扫码识别模块（routes/scan.js）](#3-扫码识别模块routesscanjs)
  - [3.1 识别食物（多模态 AI 识别）](#31-识别食物模拟-ocr--视觉)
  - [3.2 保存识别结果为食物](#32-保存识别结果为食物)
- [4. 统计模块（routes/stats.js）](#4-统计模块routesstatsjs)
  - [4.1 统计概览（环保分--月度报告）](#41-统计概览环保分--月度报告)
- [5. 食物操作模块（routesfood-actionsjs）](#5-食物操作模块routesfood-actionsjs)
  - [5.1 执行操作（吃掉--丢弃--分享）](#51-执行操作吃掉--丢弃--分享)
- [6. 用户 / 家庭标识与通用请求参数](#6-用户--家庭标识与通用请求参数说明性)
- [7. 后台自动任务与 AI 调用约定](#7-后台自动任务与-ai-调用约定)

---

## 0. 约定与数据模型

### 0.1 基本约定

- **Base URL**：`/api`

- **统一响应包裹格式**：所有接口（包括成功和失败）返回结构统一为：

  ```json
  {
    "code": "000",        // 业务状态码，字符串，3 位
    "data": { },          // 业务数据载荷，失败时通常为 null
    "msg": "操作成功"     // 描述信息
  }
  ```

  - 成功：`code = "000"`，`data` 为具体业务数据对象或数组（本文件各接口下展示的 JSON 示例，即为 `data` 字段的结构）。
  - 失败：`code` 为 3 位错误码字符串（如 `"100"`, `"200"`, `"300"` 等），`data = null`，`msg` 为具体错误文案（例如 `"用户名或密码错误"`、`"食材ID不存在"`）。

- **业务错误码体系**：采用 3 位数字编码，首位代表错误大类，后两位细分场景，示例如下（非穷举）：
  - `1xx` 通用基础错误
    - `100`：请求参数错误 - 请检查传入参数是否完整、格式是否正确
    - `101`：接口访问超时 - 请稍后重试
    - `102`：无接口访问权限 - 请完成登录后再操作
    - `103`：请求方式错误 - 请使用指定请求方式（GET/POST/PUT/DELETE）
  - `2xx` 用户/登录相关错误
    - `200`：用户名或密码错误 - 请核对后重新输入
    - `201`：用户名已存在 - 请更换用户名注册
    - `202`：用户未注册 - 请先完成注册
    - `203`：登录态已过期 - 请重新登录
    - `204`：登录失败次数过多 - 请10分钟后再尝试
  - `3xx` 家庭操作相关错误
    - `300`：Family ID不存在 - 请检查家庭标识是否正确
    - `301`：无法加入当前家庭 - 家庭状态异常/无加入权限
    - `302`：切换家庭失败 - 原家庭状态异常，请稍后重试
    - `303`：用户已归属其他家庭 - 请先退出当前家庭再操作
  - `4xx` 食材管理相关错误
    - `400`：食材ID不存在 - 请检查食材标识是否正确
    - `401`：食材状态异常 - 无法执行当前操作（如已过期/已删除）
    - `402`：食材录入失败 - 核心字段缺失（如食材名称/到期时间）
  - `5xx` 统计 / AI / 后台任务相关错误
    - `500`：统计数据失败 - 暂无相关原始数据
    - `501`：AI调用失败 - 服务暂不可用，请稍后重试
    - `502`：后端自动化任务执行失败 - 请联系客服处理

- **时间与时区**：
  - 全系统统一采用东八区（GMT+8）时间进行所有时间计算、存储、展示；
  - 所有时间字段（如食材录入时间、到期时间、过期检查时间、操作时间）均基于此时区；
  - 每个请求建议携带请求时间戳（GMT+8），便于后端校验与审计。
- **AI 调用原则**：
  - 前端**不能直接调用任何 AI 大模型的 API 或 SDK**，只允许通过本项目后端暴露的业务接口间接使用 AI 能力；
  - 所有与 AI 服务的对接（鉴权、路由、限流、重试等）必须在后端完成，并对前端透明。

- **日期格式**：全部使用 `YYYY-MM-DD`
- **时间单位**：剩余天数为整数天（建议 `Math.floor`）

### 0.2 核心枚举 & 字段约定

- **食物消耗状态 `status`**：
  - `active`：在库（未消耗）
  - `consumed`：已食用
  - `wasted`：已丢弃/浪费
  - `deleted`：软删除

- **存储状态 `storage_status`**（独立于消耗状态的第二维度）：
  - `room`：常温
  - `fridge`：冷藏
  - `freezer`：冷冻

  > 说明：每条食材记录必须同时具有“存储状态 + 消耗状态”两类状态，二者独立管理、展示和统计。

- **食材类别 `category`**（示例）：`meat`, `vegetable`, `fruit`, `drink`, `leftover`, `snack`, `other`

- **数量 `quantity`**：
  - 类型：浮点数，例如 `1`、`0.5`、`3.5`；
  - 可计数食材：以自然单位计（3 根黄瓜、5 个番茄等），使用后半个可记为 `0.5`，新鲜度/采购时间仍按整条记录延续；
  - 不可精准计数食材：以抽象集合计（1 把青菜、1 捆葱等），无需精确；
  - 每条记录在创建时给出初始数量，后续仅允许用户手动修改数量，不做自动叠加。

- **新鲜度 `freshness_score`**：
  - 区间：`0 ~ 100`
  - 0 = 完全变质，100 = 刚买
  - 计算建议：基于剩余天数占总保质期的比例（见下文接口逻辑）

### 0.3 数据库表定义（SQLite）

> 如有现成 `huaileme.db`，可以对照调整；以下为“目标结构”，便于后端按需迁移。

#### 0.3.1 `families` 表（家庭表）

```sql
CREATE TABLE IF NOT EXISTS families (
  id INTEGER PRIMARY KEY,              -- Family ID，家庭主键（Int64）
  name TEXT NOT NULL,                  -- 家庭名称（如“张三一家”、“我的冰箱”）
  owner_user_id INTEGER,               -- 家庭创建者/所有者 User ID（可选）
  created_at TEXT NOT NULL,            -- 创建时间 YYYY-MM-DD
  status TEXT NOT NULL DEFAULT 'active', -- 家庭状态：active/disabled
  note TEXT,                           -- 备注（可选）

  FOREIGN KEY (owner_user_id) REFERENCES users(id)
);
```

#### 0.3.2 `users` 表（用户表）

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,              -- User ID，全局唯一（Int64）
  username TEXT NOT NULL UNIQUE,       -- 用户名，唯一
  password_hash TEXT NOT NULL,         -- 密码哈希（不存明文）
  display_name TEXT,                   -- 显示昵称（可选）
  current_family_id INTEGER NOT NULL,  -- 当前绑定的家庭 ID（Family ID）
  created_at TEXT NOT NULL,            -- 注册时间 YYYY-MM-DD
  status TEXT NOT NULL DEFAULT 'active', -- 用户状态：active/banned/deleted
  last_login_at TEXT,                  -- 最近登录时间（可选）

  FOREIGN KEY (current_family_id) REFERENCES families(id)
);
```

#### 0.3.3 `foods` 表（食物表）

```sql
CREATE TABLE IF NOT EXISTS foods (
  id INTEGER PRIMARY KEY,              -- 食材ID，自增整型（Int64）
  name TEXT NOT NULL,                  -- 名称
  brand TEXT,                          -- 品牌（可选）
  category TEXT,                       -- 类别（meat/vegetable/...）
  image_url TEXT,                      -- 图片地址

  quantity REAL NOT NULL DEFAULT 1,    -- 抽象数量（可为小数）

  expire_date TEXT NOT NULL,           -- 过期日期 YYYY-MM-DD
  created_at TEXT NOT NULL,            -- 录入日期 YYYY-MM-DD

  storage_status TEXT NOT NULL,        -- 存储状态（room/fridge/freezer）

  status TEXT NOT NULL DEFAULT 'active',  -- 消耗状态（active/consumed/wasted/deleted）
  is_leftover INTEGER NOT NULL DEFAULT 0, -- 是否剩菜 0/1

  freshness_score INTEGER DEFAULT 100, -- 新鲜度 0~100

  -- 操作相关信息合并在 foods 表中
  last_action_type TEXT,               -- 最近一次操作类型：consume / waste
  last_action_time TEXT,               -- 最近一次操作时间（ISO 日期时间）
  last_action_score INTEGER,           -- 最近一次评分（可选）
  last_action_note TEXT,               -- 最近一次备注（可选）

  consumed_at TEXT,                    -- 标记为 consumed 的时间（可选）
  wasted_at TEXT,                      -- 标记为 wasted 的时间（可选）

  family_id INTEGER NOT NULL,          -- 家庭ID（Family ID）
  created_by_user_id INTEGER,          -- 录入该食材的用户（可选）

  deleted_at TEXT,                     -- 软删除时间（可选，软删除标记用）

  FOREIGN KEY (family_id) REFERENCES families(id),
  FOREIGN KEY (created_by_user_id) REFERENCES users(id)
);
```

#### 0.3.4 `recipes` 表（菜谱表，当前可选）

```sql
CREATE TABLE IF NOT EXISTS recipes (
  id INTEGER PRIMARY KEY,              -- 菜谱ID，自增整型（Int64）
  family_id INTEGER NOT NULL,          -- 所属家庭 ID（Family ID）
  title TEXT NOT NULL,                 -- 菜谱标题
  description TEXT,                    -- 描述
  ingredients TEXT,                    -- JSON 字符串：[{ foodId, name }]
  steps TEXT,                          -- JSON 字符串：["步骤1", "步骤2", ...]
  created_at TEXT NOT NULL,            -- 创建时间
  created_by_user_id INTEGER,          -- 创建该菜谱的用户（可选）

  FOREIGN KEY (family_id) REFERENCES families(id),
  FOREIGN KEY (created_by_user_id) REFERENCES users(id)
);
```

---

## 1. 食物管理模块（`routes/foods.js`）

### 1.1 获取食物列表

**GET `/api/foods`**

#### 输入（Query）

- `storageStatus` (可选)：`room|fridge|freezer|...`
- `status` (可选)：`active|consumed|wasted|deleted`
- `keyword` (可选)：名称模糊搜索
- `category` (可选)
- `page` (可选，默认 1)
- `pageSize` (可选，默认 20)

#### 输出（200）

```json
{
  "items": [
    {
      "id": 1,
      "name": "牛奶",
      "category": "drink",
      "imageUrl": "/images/milk.png",
      "quantity": 1,
      "expireDate": "2026-02-01",
      "createdAt": "2026-01-20",
      "storageStatus": "fridge",
      "status": "active",
      "isLeftover": false,
      "freshnessScore": 85,
      "daysLeft": 3
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 42
}
```

#### 内部逻辑

1. 解析 Query，拼接 SQL WHERE（storage_status/status/keyword/category）。
2. 查询 `foods`，按 `expire_date` 升序排序。
3. 对每条记录计算：
   - `daysLeft = expire_date - today（单位天）`
   - `totalDays = expire_date - created_at`（如 ≤0 则视为 0）
   - `freshnessScore = clamp( round(daysLeft / totalDays * 100), 0, 100 )`
4. 做分页并返回。

#### 数据库

- `SELECT ... FROM foods WHERE ... ORDER BY expire_date LIMIT ?, ?`

---

### 1.2 获取食物详情

**GET `/api/foods/:id`**

#### 输入

- Path：`id`

#### 输出（200）

```json
{
  "id": 1,
  "name": "牛奶",
  "category": "drink",
  "imageUrl": "/images/milk.png",
  "quantity": 1,
  "expireDate": "2026-02-01",
  "createdAt": "2026-01-20",
  "storageStatus": "fridge",
  "status": "active",
  "isLeftover": false,
  "freshnessScore": 85,
  "daysLeft": 3,
  "lastAction": {
    "actionType": "consume",
    "actionTime": "2026-01-25T12:00:00Z",
    "score": 5,
    "note": "味道不错"
  }
}
```

#### 内部逻辑

1. `SELECT * FROM foods WHERE id = ?`，无结果返回 404。
2. 计算 `daysLeft` 和 `freshnessScore`。
3. 从 `foods` 表中读取最近一次操作相关字段（`last_action_type` / `last_action_time` / `last_action_score` / `last_action_note`），组装为 `lastAction` 对象返回。

---

### 1.3 创建食物

**POST `/api/foods`**

#### 输入（Body）

```json
{
  "name": "牛奶",
  "brand": "某某牧场",
  "category": "drink",
  "imageUrl": "/images/milk.png",
  "quantity": 1,
  "expireDate": "2026-02-01",
  "storageStatus": "fridge",
  "status": "active",
  "isLeftover": false
}
```

#### 输出（201）

```json
{
  "id": 1,
  "message": "食物创建成功"
}
```

#### 内部逻辑

1. 校验必填字段：`name`, `expireDate`, `storageStatus`。
2. 生成 `id`，`created_at = today`。
3. `is_leftover` 仅在**录入阶段**由前端/AI 明确设置，后续不通过操作自动生成或切换：
   - AI 识别为“剩菜”时自动勾选 `is_leftover = 1`；
   - AI 识别为“新鲜食材”时勾选 `is_leftover = 0`，并推断合适的 `category` 与 `storage_type`；
   - 用户只在 AI 识别错误时手动纠正，正常流程不要求手动多选属性。
4. 计算初始 `freshness_score`（同列表）。
5. `INSERT INTO foods (...) VALUES (...)`。

---

### 1.4 更新食物

**PUT `/api/foods/:id`**

#### 输入

- Path：`id`
- Body：同创建，所有字段可选（部分更新）。

#### 输出（200）

```json
{
  "id": 1,
  "message": "食物更新成功"
}
```

#### 内部逻辑

1. 校验 `id` 是否存在。
2. 对 Body 中出现的字段做合法性校验。
3. 若 `expireDate` 被修改，重新计算 `freshness_score`。
4. 执行 `UPDATE foods SET ... WHERE id = ?`。

---

### 1.5 删除食物（软删除）

**DELETE `/api/foods/:id`**

#### 输出（200）

```json
{
  "id": 1,
  "message": "食物已删除"
}
```

#### 内部逻辑

1. 校验存在性。
2. 将 `status` 更新为 `deleted`，可同时写 `deleted_at = now`。
3. 不做物理删除。

---

### 1.6 风险食物列表（临期清单）

**GET `/api/foods/risk/list`**

#### 输入（Query）

- `daysThreshold` (默认 3)：剩余天数 ≤ 此值为“紧急项”
- `includeLeftover` (默认 false)：是否包含剩菜

#### 输出（200）

```json
{
  "urgentItems": [
    {
      "id": 1,
      "name": "鸡腿",
      "expireDate": "2026-01-30",
      "daysLeft": 2,
      "storageStatus": "fridge",
      "status": "active",
      "isLeftover": false,
      "freshnessScore": 60
    }
  ],
  "urgentItemsCount": 3,
  "goodItemsCount": 12
}
```

#### 内部逻辑

1. 查询当前家庭下 `status = 'active'` 的食物。
2. 计算 `daysLeft`。
3. `urgentItems = daysLeft <= daysThreshold`。
4. `goodItemsCount = daysLeft > daysThreshold`。

---

### 1.7 首页统计摘要

**GET `/api/foods/stats/summary`**

#### 输出（200）

```json
{
  "healthScore": 88,
  "totalActive": 30,
  "urgentCount": 5,
  "goodCount": 25,
  "wastedThisMonth": 3,
  "consumedThisMonth": 20
}
```

#### 内部逻辑（示例）

1. `foods` 中 `status = 'active'`：
   - 计算当前在库食物的 `urgentCount` / `goodCount`；
   - `totalActive = active 食物总数`。
2. `foods` 中本月：
   - `wastedThisMonth = COUNT(status='wasted' AND wasted_at 在本月)`
   - `consumedThisMonth = COUNT(status='consumed' AND consumed_at 在本月)`
3. 健康分 `healthScore`（健康分侧重“吃进去的平均新鲜程度”）：
   - 选取最近 30 天内的所有 `consume` 记录；
   - 对每条记录，根据消费时对应 `food` 的 `freshness_score` 计算平均值；
   - 平均新鲜度经简单平滑后直接作为 `healthScore`（0~100），数值越高表示吃进去的食物整体越新鲜。

> 说明：健康分只依赖 `consume` 行为，和浪费行为解耦；浪费相关统计由环保分负责。

---

## 2. 菜谱推荐模块（`routes/recipes.js`）

### 2.1 获取推荐菜谱

**POST `/api/recipes/recommend`**

#### 输入（Body）

```json
{
  "mode": "manual",              // "manual" | "auto"
  "selectedFoodIds": ["id1","id2"],
  "daysThreshold": 3
}
```

#### 输出（200）

```json
{
  "recipes": [
    {
      "id": 1,
      "title": "清冰箱奶香炖菜",
      "description": "利用即将过期的牛奶和胡萝卜的一道简单炖菜",
      "ingredients": [
        { "foodId": "id1", "name": "牛奶" },
        { "foodId": "id2", "name": "胡萝卜" }
      ],
      "steps": [
        "将胡萝卜切块，焯水备用",
        "牛奶倒入锅中，小火加热，加入胡萝卜焖煮10分钟"
      ],
      "estimatedTime": 30,
      "difficulty": "easy"
    }
  ]
}
```

#### 内部逻辑

1. `mode = "manual"`：用 `selectedFoodIds` 查 `foods`，过滤：
   - `status = 'active'`
   - `is_leftover = 0`（不含剩菜）
   - `category` 属于“可参与菜谱推荐”的生鲜类（鱼虾蛋、生肉、新鲜蔬果、可烹饪半成品等）
2. `mode = "auto"`：从“风险列表”接口逻辑中选 `daysLeft <= daysThreshold` 且符合上述条件的食材，按一定规则组合。
3. 零食、成品食材、剩菜等不会参与任何菜谱推荐逻辑。
4. 当前版本可以用规则或模板构造菜谱，不必接真 AI；后续可以将这些原始食材列表交给外部 AI 服务生成菜谱。
5. 如需记录，可写入 `recipes` 表（可选）。

---

### 2.2 完成菜谱（批量标记已烹饪）

**POST `/api/recipes/:id/complete`**

#### 输入

- Path：`id`（菜谱 ID，可为虚拟）
- Body：

```json
{
  "foodIds": ["id1", "id2"],
  "rating": 5,
  "note": "味道不错"
}
```

#### 输出（200）

```json
{
  "recipeId": "id",
  "updatedFoods": ["id1", "id2"],
  "message": "菜谱已完成，食材已标记为已食用"
}
```

#### 内部逻辑（需事务）

1. 校验 `foodIds` 对应记录存在且 `status = 'active'`。
2. 事务中：
   - `UPDATE foods SET status = 'consumed' WHERE id IN (foodIds)`
   - 同时为每个 `foodId` 更新：
     - `consumed_at = now`
     - `last_action_type = 'consume'`
     - `last_action_time = now`
     - `last_action_score = rating`（可选）
     - `last_action_note = note`
3. 提交事务。

---

## 3. 扫码识别模块（`routes/scan.js`）

### 3.1 识别食物（模拟 OCR + 视觉）

**POST `/api/scan/recognize`**

#### 输入（Body）

```json
{
  "imageBase64": "data:image/jpeg;base64,...",
  "imageUrl": "https://example.com/xxx.jpg",
  "barcode": "6901234567890",
  "storageType": "fridge"
}
```

至少提供 `imageBase64` / `imageUrl` / `barcode` 之一。

#### 输出（200，示例）

```json
{
  "name": "纯牛奶",
  "brand": "某某牧场",
  "category": "drink",
  "expireDate": "2026-02-01",
  "confidence": 0.92,
  "candidates": [
    { "name": "纯牛奶", "expireDateOffsetDays": 7 },
    { "name": "酸奶", "expireDateOffsetDays": 5 }
  ],
  "ocrRawText": "2026-02-01",
  "tips": [
    "已根据冷藏存储自动校正保质期",
    "如识别有误，请手动修改"
  ]
}
```

#### 内部逻辑

1. 后端统一调用 AI 大模型服务（前端不直连 AI）：
   - 前端上传图片 / 条码等原始信息给后端；
   - 后端整理为文本 + 图片等输入，请求外部大模型；
   - 将识别结果（品名、品牌、日期、是否剩菜、新鲜食材类别、推荐存储方式等）转为结构化字段返回前端。
2. 根据 AI 返回的建议，自动推断：
   - `category`（如新鲜蔬果、生肉、半成品等）；
   - `isLeftover`（是否为剩菜）；
   - `storageStatus` 初值；
   - `expireDate`（结合 OCR 日期和保存方式校正，例如冷冻可适当延长）。
3. 当前阶段可先返回 mock 数据，但接口契约按上述理想形态设计，便于后续无缝接真 AI。

#### 数据库

- 无写入，仅识别。

---

### 3.3 食材图片 AI 优化

**POST `/api/images/optimize`**

#### 输入（Body）

```json
{
  "imageUrl": "https://example.com/raw.jpg",
  "foodId": 1
}
```

- `imageUrl`：必填，原始图片地址；
- `foodId`：可选，关联的食材 ID，便于后端做关联和审计。

#### 输出（200）

```json
{
  "foodId": 1,
  "originalImageUrl": "https://example.com/raw.jpg",
  "optimizedImageUrl": "https://example.com/optimized.jpg"
}
```

#### 内部逻辑

1. 后端调用图片优化服务/AI，对原始图片做轻量化美化处理：
   - 调整亮度、对比度、清晰度；
   - 简化或虚化背景，突出主体食材；
   - 严格避免改变食物本身的外观形态和颜色，保证可识别性。
2. 将优化结果存储到对象存储或静态资源服务器，生成新的 `optimizedImageUrl`。
3. 返回原始 + 优化后图片地址，前端可自行选择展示哪一张。

> 说明：优化仅针对图像观感，不参与任何识别与决策逻辑。

---

### 3.2 保存识别结果为食物

**POST `/api/scan/save`**

#### 输入（Body）

```json
{
  "name": "纯牛奶",
  "brand": "某某牧场",
  "category": "drink",
  "expireDate": "2026-02-01",
  "storageStatus": "fridge",
  "imageUrl": "/images/milk.png"
}
```

#### 输出（201）

```json
{
  "id": 1,
  "message": "识别结果已保存为食物"
}
```

#### 内部逻辑

- 与 `POST /api/foods` 相同，可以复用逻辑。

---

## 4. 统计模块（`routes/stats.js`）

### 4.1 统计概览（环保分 & 月度报告）

**GET `/api/stats/overview`**

#### 输入（Query）

- `month`：`YYYY-MM`，默认当前月

#### 输出（200）

```json
{
  "month": "2026-01",
  "ecoScore": 82,
  "ecoLevel": "B",
  "totalConsumed": 30,
  "totalWasted": 5,
  "cleanPlateRate": 0.86
}
```

#### 内部逻辑

1. 从 `foods` 中筛选 `consumed_at` / `wasted_at` 在指定月份范围内的记录（当前登录用户所属家庭）。
2. `totalConsumed` / `totalWasted` = 分别统计 `status = 'consumed'` / `status = 'wasted'` 的数量。
3. `cleanPlateRate = totalConsumed / (totalConsumed + totalWasted)`。
4. `ecoScore`（环保分）示例：
   - 从 100 起步，每浪费 1 个 -2 分；
   - 若 `cleanPlateRate < 0.5` 再 -10 分；
   - clamp 到 0~100。
5. `ecoLevel` 等级映射：
   - `90+` -> `S`
   - `80+` -> `A`
   - `60+` -> `B`
   - 否则 `C`。

> 说明：浪费统计核心以 `waste` 状态的食材数量为依据。所有“过期未吃”的食材将由后端每日自动任务标记为 `wasted`，前端无需参与任何计算；前端只需传入统计时间范围（此处为 `month`），直接消费本接口返回的最终统计结果。

---

### 4.2 统计辅助接口（按家庭维度）

> 以下接口均在“已登录 + 已绑定家庭”的前提下调用，隐式按当前 `familyId` 过滤。

#### 4.2.1 获取近 N 天临期食材数量

**GET `/api/stats/foods/near-expiry-count`**

- Query：
  - `days`：可选，整数，默认 `3`。

- 成功 data 示例：

```json
{
  "nearExpiryCount": 5
}
```

- 逻辑说明：
  - 基于 `foods` 表，筛选当前家庭下 `status = 'active'` 且 `daysLeft <= days` 的食材数量，其中：
    - `daysLeft = expire_date - today`（单位天，向下取整）。

#### 4.2.2 获取当前新鲜食材数量

**GET `/api/stats/foods/fresh-count`**

- 成功 data 示例：

```json
{
  "freshCount": 20
}
```

- 逻辑说明：
  - 统计当前家庭下所有满足以下条件的食材数量：
    - `status = 'active'`（未消耗）；
    - `expire_date >= today`（未过期）。

#### 4.2.3 统计指定时间内浪费食材数量

**GET `/api/stats/foods/wasted-count`**

- Query：
  - `from`：必填，`YYYY-MM-DD`；
  - `to`：必填，`YYYY-MM-DD`。

- 成功 data 示例：

```json
{
  "wastedCount": 3
}
```

- 逻辑说明：
  - 从 `foods` 表中统计在 `[from, to]` 时间范围内 `status = 'wasted'` 且 `wasted_at` 落在该区间内的记录数量。

#### 4.2.4 统计指定时间内消耗食材数量

**GET `/api/stats/foods/consumed-count`**

- Query：
  - `from`：必填，`YYYY-MM-DD`；
  - `to`：必填，`YYYY-MM-DD`。

- 成功 data 示例：

```json
{
  "consumedCount": 18
}
```

- 逻辑说明：
  - 从 `foods` 表中统计在 `[from, to]` 时间范围内 `status = 'consumed'` 且 `consumed_at` 落在该区间内的记录数量。

---

## 5. 食物操作模块（`routes/food-actions.js`）

### 5.1 执行操作（吃掉 / 丢弃）

**POST `/api/food-actions/:foodId`**

#### 输入

- Path：`foodId`
- Body：

```json
{
  "actionType": "consume",
  "score": 5,
  "note": "和家人一起吃完了"
}
```

#### 输出（200）

```json
{
  "foodId": "uuid",
  "newStatus": "consumed",
  "message": "操作已记录"
}
```

#### 内部逻辑

1. 校验 `foodId` 存在且 `status != 'deleted'`。
2. 映射：
   - `consume` → `consumed`
   - `waste` → `wasted`
3. 在 `foods` 表中直接更新该记录：
   - 更新 `status`；
   - 更新 `last_action_type` / `last_action_time = now` / `last_action_score` / `last_action_note`；
   - 若为 `consume`，同时设置 `consumed_at = now`；
   - 若为 `waste`，同时设置 `wasted_at = now`。

---

## 6. 用户 / 家庭标识与通用请求参数（说明性）

### 6.1 用户与家庭标识

- 登录体系采用标准用户名/密码模式，核心字段：
  - 用户名（唯一，字符串，建议长度 1~20，支持字母/数字/下划线）；
  - 密码（字符串，原始长度建议 6~20，密文存储，传输加密）。
- 用户注册/初始化时，系统自动生成全局唯一的 **User ID**（整型，Int64），作为用户永久不变的主标识。
- 家庭标识 **Family ID**（整型，Int64）：
  - 用户完成登录/注册后，系统自动为其初始化并分配一个 Family ID；
  - 一个用户在任意时刻仅能绑定一个 Family ID；
  - 加入/离开/切换家庭，本质是将用户当前绑定的 Family ID 切换到新的标识。
- 所有 `foods` / `recipes` 等数据均以 **家庭（Family）** 为粒度管理，记录通过 `family_id` 归属某个家庭，而不是某个个人用户。
- 单用户独立使用时，可视为“一个用户 = 一个家庭”，所有食材数据既归属该家庭，也间接归属该用户。

### 6.2 通用请求参数（隐式）

- 除特殊说明外，本文件中所有业务接口（食材管理、家庭操作、数据统计等）都默认在“已登录”前提下调用：
  - 后端应在认证中间件中解析登录态（如 token），注入当前请求的 `userId`（Int64）与 `familyId`（Int64）；
  - 大多数业务接口无需在文档中显式列出 `userId` / `familyId` 参数，视为**隐式必传**；
  - 建议每个请求同时附带一个请求时间戳（GMT+8），用于防重放与审计。
- 家庭相关操作接口的前置条件：
  - 调用者已完成登录并拥有绑定的 Family ID；
  - 加入/离开/切换家庭的操作基于当前登录用户的 User ID + 待操作 Family ID 发起；
  - 操作成功后，原 Family ID 关联的数据与该用户解绑，新 Family ID 成为用户唯一关联标识。

### 6.3 管理员 API 预留

- 当前版本不设计具体管理员 API，仅预留管理员权限模块位：
  - 后续可扩展管理员专属接口（如全局数据统计、用户/家庭状态管理、异常数据处理等）；
  - 管理员接口应在鉴权层增加额外的权限校验（例如 `role = admin`），不在本文件详细展开。

---

## 7. 后台自动任务与 AI 调用约定

### 7.1 食材过期自动检查任务

- 所有后端自动化任务（如本节所述的食材过期检查），均基于东八区时间按天执行，并保留完整任务执行日志，支持问题排查。
- 食材过期检查任务建议设计为**每日固定时间（如凌晨）自动执行**：
  - 扫描当前家庭下所有 `status = 'active'` 的食材；
  - 若 `expire_date < today` 且 `status` 仍为 `active`，则视为“过期未食用”；
  - 自动将这些食材的 `status` 更新为 `wasted`，不再处于 `active` 状态，同时更新 `wasted_at = today` 并写入适当的 `last_action_*` 字段（如 `last_action_type = 'waste'`、`last_action_note = '自动过期'` 等）。
- 通过该任务，环保分相关统计可以完全依赖 `foods` 表中的 `wasted_at` 记录，不需要前端或临时脚本参与。

### 7.2 AI 大模型调用职责划分

- 前端职责：
  - 采集用户输入的原始信息（文字、图片、条码等），通过 HTTP 请求发送给后端的**业务接口**（如 `/api/scan/recognize`），前端只依赖这些业务接口；
  - **严禁在前端直接集成或调用任何外部 AI 大模型的 API / SDK**，也不处理 AI 返回的复杂原始结构。
- 后端职责：
  - 统一封装所有与 AI 大模型的对接逻辑（如鉴权、路由、重试、限流等），前端对具体 AI 服务提供商和调用方式完全无感；
  - 将前端传来的原始信息整理为 AI 所需的 prompt / 参数，发起调用并获得结果；
  - 把 AI 返回结果转换为本项目需要的结构化字段（如 `name`、`category`、`isLeftover`、`expireDate` 等），经由本文件中定义的 API 返回给前端。
- 兼容性：
  - 不考虑任何“前端直连 AI”的场景，包括无法访问国外 AI 的情况也必须由后端中转解决；
  - 本文档中所有涉及 AI 的接口（如扫码识别、菜谱推荐）都**默认且仅允许**由后端完成 AI 调用。

