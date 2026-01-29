/**
 * 扫码识别接口 - API_SCAN
 *
 * 说明：所有方法返回 axios 拦截器已解包的 data 字段。
 */
import { request } from '@/utils/request'

/**
 * 识别食品包装上的保质期/信息
 * @param {{
 *   imageBase64?: string;      // dataURL 或 base64 图片数据
 *   imageUrl?: string;         // 图片 URL（二选一）
 *   storageStatus?: 'fridge'|'freezer'|'room'; // 预计存放位置
 * }} payload
 * @returns {Promise<{
 *   name?: string;             // 识别出的食物名称
 *   brand?: string;            // 品牌
 *   category?: string;         // 类别
 *   expireDate?: string;       // 过期日期（YYYY-MM-DD）
 *   expiry_date?: string;      // 过期日期（下划线）
 *   image_url?: string;        // 建议使用的图片 URL
 *   imageUrl?: string;
 * }>} */
export function recognizeFood(payload) {
  return request.post('/scan/recognize', payload)
}

/**
 * 保存已识别的食物信息到冰箱
 * @param {{
 *   name: string;
 *   expireDate: string;
 *   storageStatus: 'fridge'|'freezer'|'room';
 *   brand?: string;
 *   category?: string;
 *   imageUrl?: string;
 * }} payload
 * @returns {Promise<{ id: number }>} 新建的食物记录 ID
 */
export function saveScannedFood(payload) {
  return request.post('/scan/save', payload)
}
