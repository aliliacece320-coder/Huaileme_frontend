// 前端 API 客户端（移动端友好版）
// - 统一处理响应结构 { code, data, msg }
// - 自动附带登录 Token
// - 对常用数据做本地缓存（localStorage），弱网/离线时可回退到缓存

const API_BASE = '/api';
const CACHE_PREFIX = 'huaileme_cache_';
const TOKEN_KEY = 'huaileme_auth_token';

function setCache(key, data, ttlMs) {
  try {
    const expiresAt = Date.now() + ttlMs;
    const payload = { expiresAt, data };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(payload));
  } catch (e) {
    console.warn('缓存写入失败', key, e);
  }
}

function getCache(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const payload = JSON.parse(raw);
    if (!payload || typeof payload !== 'object') return null;
    if (Date.now() > payload.expiresAt) {
      localStorage.removeItem(CACHE_PREFIX + key);
      return null;
    }
    return payload.data;
  } catch (e) {
    console.warn('缓存读取失败', key, e);
    return null;
  }
}

async function request(path, { method = 'GET', params, body } = {}) {
  let url = API_BASE + path;

  if (params && Object.keys(params).length > 0) {
    const usp = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      if (Array.isArray(value)) {
        value.forEach((v) => usp.append(key, v));
      } else {
        usp.append(key, value);
      }
    });
    url += `?${usp.toString()}`;
  }

  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const json = await res.json();
  if (!json || typeof json !== 'object') {
    throw new Error('无效的响应格式');
  }

  if (json.code !== '000') {
    throw new Error(json.msg || `业务错误 ${json.code}`);
  }

  return json.data;
}

// 通用缓存包装：优先网络，失败时回退到缓存；若无缓存则抛错
async function withCache(cacheKey, ttlMs, fetcher) {
  try {
    const data = await fetcher();
    if (ttlMs > 0) {
      setCache(cacheKey, data, ttlMs);
    }
    return data;
  } catch (e) {
    const cached = getCache(cacheKey);
    if (cached != null) {
      console.warn('网络失败，使用本地缓存', cacheKey, e);
      return cached;
    }
    throw e;
  }
}

window.ApiClient = {
  // ========== 认证 / 用户 / 家庭 ==========
  async register(username, password) {
    const data = await request('/auth/register', {
      method: 'POST',
      body: { username, password },
    });
    if (data?.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
    }
    return data;
  },

  async login(username, password) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: { username, password },
    });
    if (data?.token) {
      localStorage.setItem(TOKEN_KEY, data.token);
    }
    return data;
  },

  async logout() {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem(TOKEN_KEY);
    }
  },

  async getUserProfile() {
    const cacheKey = 'user_profile';
    return await withCache(cacheKey, 5 * 60 * 1000, () =>
      request('/user/profile', { method: 'GET' }),
    );
  },

  async updateUserProfile({ displayName }) {
    const data = await request('/user/profile', {
      method: 'PUT',
      body: { displayName },
    });
    // 简单起见，更新本地缓存
    const cached = getCache('user_profile');
    if (cached) {
      setCache(
        'user_profile',
        { ...cached, displayName },
        5 * 60 * 1000,
      );
    }
    return data;
  },

  async getFamily() {
    const cacheKey = 'family_current';
    return await withCache(cacheKey, 5 * 60 * 1000, () =>
      request('/family', { method: 'GET' }),
    );
  },

  async joinFamily(familyId) {
    const data = await request('/family/join', {
      method: 'POST',
      body: { familyId },
    });
    // 加入后刷新家庭缓存
    setCache('family_current', null, 0);
    return data;
  },

  async leaveFamily() {
    const data = await request('/family/leave', {
      method: 'POST',
    });
    setCache('family_current', null, 0);
    return data;
  },

  // ========== 食物相关 ==========
  async getFoods({ storageStatus, status, keyword, category, page, pageSize } = {}) {
    const params = { storageStatus, status, keyword, category, page, pageSize };
    const cacheKey = `foods_list_${JSON.stringify(params)}`;
    const data = await withCache(cacheKey, 60 * 1000, () =>
      request('/foods', {
        method: 'GET',
        params,
      }),
    );
    return Array.isArray(data?.items) ? data.items : [];
  },

  async getFood(id) {
    if (!id) throw new Error('缺少食物 ID');
    const cacheKey = `food_detail_${id}`;
    return await withCache(cacheKey, 5 * 60 * 1000, () =>
      request(`/foods/${encodeURIComponent(id)}`, { method: 'GET' }),
    );
  },

  async createFood(payload) {
    return await request('/foods', {
      method: 'POST',
      body: payload,
    });
  },

  async updateFood(id, payload) {
    return await request(`/foods/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: payload,
    });
  },

  async deleteFood(id) {
    return await request(`/foods/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  // 风险清单 & 首页统计摘要
  async getFoodStats() {
    const summary = await withCache('foods_stats_summary', 2 * 60 * 1000, () =>
      request('/foods/stats/summary', { method: 'GET' }),
    );
    return {
      urgent_count: summary.urgentCount ?? 0,
      fresh_count: summary.goodCount ?? 0,
      health_score: summary.healthScore ?? 0,
      total_active: summary.totalActive ?? 0,
    };
  },

  async getRiskFoods({ daysThreshold, includeLeftover } = {}) {
    const cacheKey = `foods_risk_${daysThreshold ?? 'default'}_${
      includeLeftover ? 'withLeftover' : 'noLeftover'
    }`;
    const data = await withCache(cacheKey, 2 * 60 * 1000, () =>
      request('/foods/risk/list', {
        method: 'GET',
        params: { daysThreshold, includeLeftover },
      }),
    );
    const items = data?.urgentItems || [];
    return items.map((item) => {
      const daysLeft = item.daysLeft ?? item.days_left ?? 0;
      const freshness =
        item.freshnessPercentage ?? item.freshness_percentage ?? 0;
      return {
        ...item,
        days_left: daysLeft,
        freshness_percentage: freshness,
      };
    });
  },

  // ========== 菜谱推荐 ==========
  async getRecipeRecommendations(selectedFoodIds = []) {
    const data = await request('/recipes/recommend', {
      method: 'POST',
      body: {
        mode: 'manual',
        selectedFoodIds,
      },
    });
    return data?.recipes || [];
  },

  async completeRecipe(recipeId, foodIds, rating, note) {
    if (!recipeId) throw new Error('缺少菜谱 ID');
    return await request(`/recipes/${encodeURIComponent(recipeId)}/complete`, {
      method: 'POST',
      body: { foodIds, rating, note },
    });
  },

  // ========== 扫码识别 ==========
  async recognizeFood({ imageBase64, imageUrl, barcode, storageStatus } = {}) {
    const payload = { imageBase64, imageUrl, barcode, storageStatus };
    return await request('/scan/recognize', {
      method: 'POST',
      body: payload,
    });
  },

  async saveScannedFood({ name, expireDate, storageStatus, brand, category, imageUrl }) {
    return await request('/scan/save', {
      method: 'POST',
      body: { name, expireDate, storageStatus, brand, category, imageUrl },
    });
  },

  // ========== 食物操作 ==========
  async performFoodAction(foodId, actionType, score, note) {
    if (!foodId) throw new Error('缺少食物 ID');
    return await request(`/food-actions/${encodeURIComponent(foodId)}`, {
      method: 'POST',
      body: { actionType, score, note },
    });
  },

  // ========== 图片处理 ==========
  async optimizeImage({ imageUrl, foodId }) {
    return await request('/images/optimize', {
      method: 'POST',
      body: { imageUrl, foodId },
    });
  },

  // ========== 统计 ==========
  async getNearExpiryCount(days) {
    const cacheKey = `stats_near_expiry_${days || 3}`;
    return await withCache(cacheKey, 60 * 1000, () =>
      request('/stats/foods/near-expiry-count', {
        method: 'GET',
        params: { days },
      }),
    );
  },

  async getFreshCount() {
    const cacheKey = 'stats_fresh_count';
    return await withCache(cacheKey, 60 * 1000, () =>
      request('/stats/foods/fresh-count', { method: 'GET' }),
    );
  },

  async getWastedCount(from, to) {
    return await request('/stats/foods/wasted-count', {
      method: 'GET',
      params: { from, to },
    });
  },

  async getConsumedCount(from, to) {
    return await request('/stats/foods/consumed-count', {
      method: 'GET',
      params: { from, to },
    });
  },

  async getStatsOverview(month) {
    const cacheKey = `stats_overview_${month || 'current'}`;
    const data = await withCache(cacheKey, 5 * 60 * 1000, () =>
      request('/stats/overview', {
        method: 'GET',
        params: { month },
      }),
    );
    return {
      eco_score: data.ecoScore ?? 0,
      eco_level: data.ecoLevel ?? '',
      total_consumed: data.totalConsumed ?? 0,
      total_wasted: data.totalWasted ?? 0,
      consumed_percentage: data.cleanPlateRate ?? 0,
    };
  },

  async getWasteTrend() {
    const cacheKey = 'stats_waste_trend_6m';
    return await withCache(cacheKey, 10 * 60 * 1000, async () => {
      const now = new Date();
      const results = [];

      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const from = `${year}-${month}-01`;
        const toDate = new Date(year, d.getMonth() + 1, 0);
        const to = `${toDate.getFullYear()}-${String(
          toDate.getMonth() + 1,
        ).padStart(2, '0')}-${String(toDate.getDate()).padStart(2, '0')}`;

        const data = await request('/stats/foods/wasted-count', {
          method: 'GET',
          params: { from, to },
        });

        results.push({
          month: `${d.getMonth() + 1}月`,
          amount: data?.wastedCount ?? 0,
        });
      }

      return results;
    });
  },

  async getBadges() {
    const cacheKey = 'stats_badges_static';
    const cached = getCache(cacheKey);
    if (cached) return cached;

    const data = [
      {
        id: 'fridge_guardian',
        name: '冰箱守护者',
        unlocked: true,
        level: 4,
      },
      {
        id: 'clearance_master',
        name: '清仓小能手',
        unlocked: false,
        progress: 30,
      },
      {
        id: 'food_hero',
        name: '节粮小英雄',
        unlocked: true,
        level: 2,
      },
      {
        id: 'smart_shopper',
        name: '精明小买手',
        unlocked: false,
        progress: 60,
      },
    ];

    setCache(cacheKey, data, 24 * 60 * 60 * 1000);
    return data;
  },
};

