
const types = {
  success: 'bg-primary',
  error: 'bg-red-500',
  info: 'bg-blue-500',
}

export function showToast(message, type = 'info') {
  const toast = document.createElement('div')
  toast.className = `fixed top-20 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-full text-white text-sm font-bold shadow-lg transition-all transform translate-y-0 opacity-100 ${types[type] || types.info}`
  toast.textContent = message
  document.body.appendChild(toast)
  setTimeout(() => {
    toast.style.transform = 'translateY(-20px)'
    toast.style.opacity = '0'
    setTimeout(() => toast.remove(), 300)
  }, 2000)
}

let loadingEl = null

export function showLoading(message = '加载中...') {
  if (loadingEl) loadingEl.remove()
  loadingEl = document.createElement('div')
  loadingEl.id = 'loading-overlay'
  loadingEl.className = 'fixed inset-0 bg-black/50 z-[200] flex items-center justify-center'
  loadingEl.innerHTML = `
    <div class="bg-white rounded-2xl p-6 flex flex-col items-center gap-4">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      <p class="text-slate-800 font-bold">${message}</p>
    </div>
  `
  document.body.appendChild(loadingEl)
}

export function hideLoading() {
  if (loadingEl) {
    loadingEl.remove()
    loadingEl = null
  } else {
    const el = document.getElementById('loading-overlay')
    if (el) el.remove()
  }
}
