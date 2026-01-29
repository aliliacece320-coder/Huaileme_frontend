/**
 * 家庭接口 - API_FAMILY
 *
 * 说明：所有方法返回 axios 拦截器已解包的 data 字段。
 */
import { request } from '@/utils/request'

/**
 * 获取当前用户所属家庭信息
 * @returns {Promise<{
 *   id: number;             // 家庭 ID
 *   name: string;           // 家庭名称
 *   members?: Array<{
 *     id: number;
 *     username: string;
 *     displayName?: string;
 *   }>;                     // 家庭成员列表
 * }>} */
export function getFamily() {
  return request.get('/family')
}

/**
 * 加入指定家庭
 * @param {number} familyId 家庭 ID
 * @returns {Promise<void | { success?: boolean }>} 一般为空或简单成功标记
 */
export function joinFamily(familyId) {
  return request.post('/family/join', { familyId })
}

/**
 * 退出当前家庭
 * @returns {Promise<void | { success?: boolean }>} 一般为空或简单成功标记
 */
export function leaveFamily() {
  return request.post('/family/leave')
}
