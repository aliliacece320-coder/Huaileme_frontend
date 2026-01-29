/**
 * 食物管理接口 - API_FOODS
 *
 * 接口约定（统一响应结构）：
 *   { code: string, msg: string, data: any }
 * 这里所有方法都返回已解包的 data 字段。
 */
import { request } from '@/utils/request'

/**
 * 获取食物列表
 * @param {{ status?: 'active'|'archived', keyword?: string, storageStatus?: 'fridge'|'freezer'|'room' }} [params]
 * @returns {Promise<{
 *   items: Array<{
 *     id: number;                // 食物 ID
 *     name: string;              // 名称
 *     category?: string;         // 类别，如「蔬菜」「肉类」
 *     days_left?: number;        // 距离过期天数（后端下划线风格）
 *     daysLeft?: number;         // 距离过期天数（驼峰风格）
 *     freshnessScore?: number;   // 新鲜度评分（0-100）
 *     freshness_percentage?: number; // 新鲜度百分比（0-100）
 *     storageStatus?: 'fridge'|'freezer'|'room'; // 存放位置（枚举值）
 *     storage_location?: string; // 存放位置中文描述
 *     imageUrl?: string;         // 食物图片 URL（驼峰）
 *     image_url?: string;        // 食物图片 URL（下划线）
 *   }>;
 *   total?: number;              // 列表总数
 * }>}
 */
export function getFoods(params = {}) {
  return request.get('/foods', { params })
}

/**
 * 获取单个食物详情
 * @param {string|number} id 食物 ID
 * @returns {Promise<{
 *   id: number;
 *   name: string;
 *   category?: string;
 *   days_left?: number;
 *   daysLeft?: number;
 *   freshnessScore?: number;
 *   freshness_percentage?: number;
 *   storageStatus?: 'fridge'|'freezer'|'room';
 *   storage_location?: string;
 *   expireDate?: string;     // 过期日期（YYYY-MM-DD）
 *   expire_date?: string;    // 过期日期（下划线命名）
 *   createdAt?: string;
 *   created_at?: string;
 *   added_date?: string;     // 添加到冰箱的日期
 *   imageUrl?: string;
 *   image_url?: string;
 * }>} */
export function getFood(id) {
  if (!id) throw new Error('缺少食物 ID')
  return request.get(`/foods/${encodeURIComponent(id)}`)
}

/**
 * 创建食物
 * @param {{
 *   name: string;
 *   category?: string;
 *   expireDate?: string;
 *   storageStatus?: 'fridge'|'freezer'|'room';
 *   imageUrl?: string;
 * }} payload
 * @returns {Promise<{ id: number }>} 新建记录的基础信息
 */
export function createFood(payload) {
  return request.post('/foods', payload)
}

/**
 * 更新食物
 * @param {string|number} id 食物 ID
 * @param {Partial<{
 *   name: string;
 *   category: string;
 *   expireDate: string;
 *   storageStatus: 'fridge'|'freezer'|'room';
 *   imageUrl: string;
 * }>} payload
 * @returns {Promise<void | { success?: boolean }>} 一般为空或简单成功标记
 */
export function updateFood(id, payload) {
  return request.put(`/foods/${encodeURIComponent(id)}`, payload)
}

/**
 * 删除食物
 * @param {string|number} id 食物 ID
 * @returns {Promise<void | { success?: boolean }>} 一般为空或简单成功标记
 */
export function deleteFood(id) {
  return request.delete(`/foods/${encodeURIComponent(id)}`)
}

/**
 * 获取高风险（快过期）食物列表
 * @param {{ limit?: number }} [params]
 * @returns {Promise<{
 *   urgentItems: Array<{
 *     id: number;
 *     name: string;
 *     daysLeft?: number;
 *     days_left?: number;
 *     freshnessScore?: number;
 *     freshness_percentage?: number;
 *     storageStatus?: 'fridge'|'freezer'|'room';
 *     storage_location?: string;
 *     category?: string;
 *     imageUrl?: string;
 *     image_url?: string;
 *   }>;
 * }>}
 */
export function getRiskFoods(params = {}) {
  return request.get('/foods/risk/list', { params })
}

/**
 * 获取食物统计概要（供首页/冰箱页使用）
 * @returns {Promise<{
 *   urgentCount?: number;   // 急需消灭的食物数量
 *   goodCount?: number;     // 状态良好的食物数量
 *   healthScore?: number;   // 冰箱健康指数（0-100）
 *   totalActive?: number;   // 当前库存总数
 * }>}
 */
export function getFoodStatsSummary() {
  return request.get('/foods/stats/summary')
}
