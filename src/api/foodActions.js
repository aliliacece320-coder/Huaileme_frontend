/**
 * 食物操作接口 - API_SPEC
 *
 * 说明：所有方法返回 axios 拦截器已解包的 data 字段。
 */
import { request } from '@/utils/request'

/**
 * 对单个食物执行操作（吃掉 / 浪费等）
 * @param {string|number} foodId 食物 ID
 * @param {{
 *   actionType: 'consume'|'waste'; // 行为类型：吃掉或浪费
 *   score?: number;                // 口味评分（可选）
 *   note?: string;                 // 备注
 * }} body
 * @returns {Promise<void | { success?: boolean }>} 一般为空或简单成功标记
 */
export function performFoodAction(foodId, body) {
  return request.post(`/food-actions/${encodeURIComponent(foodId)}`, body)
}
