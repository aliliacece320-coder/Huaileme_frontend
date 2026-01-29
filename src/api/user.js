/**
 * 用户接口 - API_USER
 *
 * 说明：所有方法返回 axios 拦截器已解包的 data 字段。
 */
import { request } from '@/utils/request'

/**
 * 获取当前登录用户的个人资料
 * @returns {Promise<{
 *   id: number;              // 用户 ID
 *   username: string;        // 登录名
 *   displayName?: string;    // 显示昵称
 * }>}
 */
export function getUserProfile() {
  return request.get('/user/profile')
}

/**
 * 更新当前登录用户的个人资料
 * @param {Partial<{
 *   displayName: string;
 * }>} payload
 * @returns {Promise<void | { success?: boolean }>} 一般为空或简单成功标记
 */
export function updateUserProfile(payload) {
  return request.put('/user/profile', payload)
}
