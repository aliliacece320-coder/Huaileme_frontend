/**
 * 认证接口（登录/注册/登出）
 *
 * 说明：底层使用原生 axios + 统一响应结构 { code, msg, data }。
 * 这里导出的函数都返回 data 字段，并自动维护 TOKEN_KEY。
 */
import axios from 'axios'
import { TOKEN_KEY } from '@/utils/request'

const baseURL = '/api'

/**
 * 底层认证请求封装
 * @param {'GET'|'POST'} method HTTP 方法
 * @param {string} path 相对路径，如 "/auth/login"
 * @param {any} body 请求体
 * @returns {Promise<any>} 已解包的 data 字段
 */
async function authRequest(method, path, body) {
  const headers = { 'Content-Type': 'application/json' }
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) headers.Authorization = `Bearer ${token}`
  const { data } = await axios.request({
    baseURL,
    url: path,
    method,
    data: body,
    headers,
  })
  if (!data || typeof data !== 'object') throw new Error('无效的响应格式')
  if (data.code !== '000') throw new Error(data.msg || `业务错误 ${data.code}`)
  return data.data
}

/**
 * 用户注册并返回基础账户信息
 * @param {string} username 用户名
 * @param {string} password 密码
 * @returns {Promise<{
 *   id: number;          // 用户 ID
 *   username: string;    // 用户名
 *   token?: string;      // JWT Token（存在时会自动写入 localStorage）
 * }>} */
export async function register(username, password) {
  const data = await authRequest('POST', '/auth/register', { username, password })
  if (data?.token) {
    localStorage.setItem(TOKEN_KEY, data.token)
  }
  return data
}

/**
 * 用户登录
 * @param {string} username 用户名
 * @param {string} password 密码
 * @returns {Promise<{
 *   id: number;
 *   username: string;
 *   token?: string;
 * }>} */
export async function login(username, password) {
  const data = await authRequest('POST', '/auth/login', { username, password })
  if (data?.token) {
    localStorage.setItem(TOKEN_KEY, data.token)
  }
  return data
}

/**
 * 用户登出
 * @returns {Promise<void>} 无返回，确保本地 TOKEN 被清理
 */
export async function logout() {
  try {
    await authRequest('POST', '/auth/logout')
  } finally {
    localStorage.removeItem(TOKEN_KEY)
  }
}
