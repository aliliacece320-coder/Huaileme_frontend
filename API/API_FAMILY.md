## 用户 / 家庭接口（`/api/family` & `/api/user`）

> 说明：具体认证实现（如 token）见后端实际代码，本处仅描述业务接口与数据结构。

### 统一说明

- **通用响应结构**：`{ code: "000", data: <业务数据>, msg: "描述信息" }`
  - 成功：`code = "000"`；
  - 失败：`code` 为 3 位业务错误码（`1xx~5xx`），`data = null`。

---

### GET `/api/user/profile` —— 获取当前登录用户信息

- **前置条件**
  - 已登录（由认证中间件注入 `userId` 与 `familyId`）
- **成功 data 结构**
  - `{ id, username, displayName, currentFamilyId, createdAt, status }`

---

### PUT `/api/user/profile` —— 更新当前用户基础信息

- **Body**
  - 可选：`displayName`
- **成功 data 结构**
  - `{ id, message }`

---

### GET `/api/family` —— 获取当前家庭信息与成员列表

- **前置条件**
  - 已登录，且已绑定 `familyId`
- **成功 data 结构**
  - `{ id, name, ownerUserId, createdAt, status, members: UserSummary[] }`
  - `UserSummary`：`{ id, username, displayName }`

---

### POST `/api/family/join` —— 加入指定家庭

- **Body**
  - `familyId`：目标家庭 ID
- **成功 data 结构**
  - `{ familyId, message }`

---

### POST `/api/family/leave` —— 退出当前家庭

- **成功 data 结构**
  - `{ oldFamilyId, newFamilyId, message }`
  - 单人使用场景下，可由后端自动新建一个新的家庭并绑定为 `newFamilyId`。

