/**
 * 图片处理接口 - API_IMAGES
 *
 * 说明：所有方法返回 axios 拦截器已解包的 data 字段。
 */
import { request } from '@/utils/request'

/**
 * 优化食物图片（如压缩、裁剪、加滤镜）
 * @param {{
 *   imageUrl: string;   // 原始图片 URL
 *   foodId?: number;    // 关联的食物 ID（可选）
 * }} payload
 * @returns {Promise<{
 *   optimizedImageUrl?: string; // 优化后图片 URL
 * }>} */
export function optimizeImage(payload) {
  return request.post('/images/optimize', payload)
}
