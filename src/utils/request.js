/**
 * Axios 请求封装
 * - BaseURL: /api
 * - 统一响应结构 { code, data, msg }
 * - 自动附带 Authorization: Bearer <token>
 * - 请求/响应拦截器 + 全局 Loading / 错误提示
 */
import axios from 'axios'
import { showToast, showLoading, hideLoading } from './toast'

const TOKEN_KEY = 'huaileme_auth_token'

export const request = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截：附加 Token + 全局 Loading
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 默认展示全局 Loading，个别请求可以通过 config.showLoading = false 关闭
    if (config.showLoading !== false) {
      showLoading('加载中...')
    }

    return config
  },
  (err) => {
    hideLoading()
    return Promise.reject(err)
  }
)

// 响应拦截：统一解包 data，业务错误 & HTTP 错误全局提示
request.interceptors.response.use(
  (res) => {
    hideLoading()

    const { data } = res
    if (!data || typeof data !== 'object') {
      const msg = '无效的响应格式'
      showToast(msg, 'error')
      return Promise.reject(new Error(msg))
    }

    if (data.code !== '000') {
      const msg = data.msg || `业务错误 ${data.code}`
      showToast(msg, 'error')
      return Promise.reject(new Error(msg))
    }

    return data.data
  },
  (err) => {
    hideLoading()

    if (err.response) {
      const status = err.response.status
      let msg = err.response?.data?.msg

      if (!msg) {
        if (status === 401) {
          msg = '未登录或登录已过期，请先登录'
          try {
            localStorage.removeItem(TOKEN_KEY)
          } catch (_) {}
        } else if (status === 404) {
          msg = '请求的接口不存在 (404)'
        } else if (status >= 500) {
          msg = '服务器开小差了，请稍后重试'
        } else {
          msg = `请求失败 (${status})`
        }
      }

      showToast(msg, 'error')
      return Promise.reject(new Error(msg))
    }

    // 网络错误 / 超时等
    showToast(err.message || '网络异常，请检查网络后重试', 'error')
    return Promise.reject(err)
  }
)

export { TOKEN_KEY }
