/**
 * 统计接口 - API_STATS
 *
 * 说明：所有方法返回 axios 拦截器已解包的 data 字段。
 */
import { request } from '@/utils/request'

/**
 * 获取接近过期的食物数量
 * @param {{ daysThreshold?: number }} [params]
 * @returns {Promise<{ count: number }>} count 为即将过期的食物数量
 */
export function getNearExpiryCount(params = {}) {
  return request.get('/stats/foods/near-expiry-count', { params })
}

/**
 * 获取新鲜食物数量
 * @returns {Promise<{ count: number }>} count 为新鲜食物数量
 */
export function getFreshCount() {
  return request.get('/stats/foods/fresh-count')
}

/**
 * 获取一段时间内浪费的食物数量
 * @param {{ from: string; to: string }} params 查询时间范围（YYYY-MM-DD）
 * @returns {Promise<{ wastedCount: number }>} wastedCount 为浪费的食物数量
 */
export function getWastedCount(params) {
  return request.get('/stats/foods/wasted-count', { params })
}

/**
 * 获取一段时间内吃掉的食物数量
 * @param {{ from: string; to: string }} params 查询时间范围（YYYY-MM-DD）
 * @returns {Promise<{ consumedCount: number }>} consumedCount 为已消费的食物数量
 */
export function getConsumedCount(params) {
  return request.get('/stats/foods/consumed-count', { params })
}

/**
 * 获取统计概览（首页/报表页使用）
 * @param {{ from?: string; to?: string }} [params]
 * @returns {Promise<{
 *   ecoScore?: number;        // 环保评分
 *   ecoLevel?: string;        // 环保等级描述
 *   totalConsumed?: number;   // 吃掉的食物总数
 *   totalWasted?: number;     // 浪费的食物总数
 *   cleanPlateRate?: number;  // 光盘率（0-1）
 * }>} */
export function getStatsOverview(params = {}) {
  return request.get('/stats/overview', { params })
}

/**
 * 最近 6 个月浪费趋势（供零浪费报告页使用）
 * 复杂数据处理函数：将多个按月 wastedCount 聚合为图表可用结构。
 * @returns {Promise<Array<{
 *   month: string;  // 月份文案，如 "5月"
 *   amount: number; // 该月浪费的食物数量
 * }>>}
 */
export async function getWasteTrend() {
  const now = new Date()
  const results = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const from = `${y}-${m}-01`
    const toDate = new Date(y, d.getMonth() + 1, 0)
    const to = `${toDate.getFullYear()}-${String(toDate.getMonth() + 1).padStart(2, '0')}-${String(toDate.getDate()).padStart(2, '0')}`
    const data = await getWastedCount({ from, to })
    results.push({
      month: `${d.getMonth() + 1}月`,
      amount: data?.wastedCount ?? 0,
    })
  }
  return results
}
