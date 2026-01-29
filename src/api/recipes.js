/**
 * 菜谱推荐接口 - API_RECIPES
 *
 * 说明：所有方法返回 axios 拦截器已解包的 data 字段。
 */
import { request } from '@/utils/request'

/**
 * 获取菜谱推荐列表
 * @param {{
 *   mode: 'manual'|'auto';          // 推荐模式
 *   selectedFoodIds?: number[];     // 选中的食材 ID 列表
 * }} body
 * @returns {Promise<{
 *   recipes: Array<{
 *     id: number;
 *     title?: string;               // 菜名（标题）
 *     name?: string;                // 菜名备用字段
 *     image_url?: string;
 *     imageUrl?: string;
 *     match_score?: number;         // 与当前库存匹配度（0-100）
 *     matchScore?: number;
 *     cooking_time?: number;        // 预计烹饪时间（分钟）
 *     estimatedTime?: number;
 *     difficulty?: string;          // 难度描述
 *     description?: string;         // 简要说明/用料提示
 *     ingredients?: Array<string|{ name: string }>; // 用到的主要食材
 *   }>;
 * }>}
 */
export function getRecipeRecommendations(body) {
  return request.post('/recipes/recommend', body)
}

/**
 * 标记菜谱已完成（并记录所消耗的食材）
 * @param {string|number} recipeId 菜谱 ID
 * @param {{ foodIds: number[] }} body 使用到的库存食材 ID 列表
 * @returns {Promise<void | { success?: boolean }>} 一般为空或简单成功标记
 */
export function completeRecipe(recipeId, body) {
  return request.post(`/recipes/${encodeURIComponent(recipeId)}/complete`, body)
}
