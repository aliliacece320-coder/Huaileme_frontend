<template>
  <router-view />
</template>

<script setup>
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
* {
  box-sizing: border-box;
}
html {
  /* 移动端 viewport：支持 safe-area */
  min-height: 100%;
  min-height: 100dvh;
}
body, #app {
  min-height: 100%;
  min-height: 100dvh;
  font-family: 'Noto Sans SC', 'ZCOOL KuaiLe', system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
body {
  background: radial-gradient(circle at top right, #f0fff4, transparent),
    radial-gradient(circle at bottom left, #fff5f5, transparent), #f8fdfb;
}
/* 提升移动端滚动体验（尤其是 iOS） */
body {
  -webkit-overflow-scrolling: touch;
}
/* 可滚动区域通用类，可按需复用到长列表容器上 */
.scroll-touch {
  -webkit-overflow-scrolling: touch;
}
/* safe-area 留白：固定顶/底栏使用 */
.safe-top {
  padding-top: env(safe-area-inset-top, 0px);
}
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
.safe-inset-bottom {
  padding-bottom: max(env(safe-area-inset-bottom, 0px), 8px);
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
