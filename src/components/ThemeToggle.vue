<template>
  <div class="theme-toggle">
    <el-switch
        v-model="isDark"
        inline-prompt
        :active-icon="Moon"
        :inactive-icon="Sunny"
        @change="debouncedToggleDark"
    />
  </div>
</template>

<script setup>
import {Moon, Sunny} from "@element-plus/icons-vue";
import {onMounted, ref} from "vue";
import {debounce} from "@/utils/debounce.js";

const isDark = ref(false);

// 深色模式切换函数
const toggleDark = (val) => {
  isDark.value = val
  if (val) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('darkMode', val)
}

// 使用防抖优化深色模式切换性能
const debouncedToggleDark = debounce((val) => {
  toggleDark(val);
}, 100, true);

// 生命周期
onMounted(() => {
  // 恢复深色模式设置
  const darkMode = localStorage.getItem('darkMode') === 'true'
  isDark.value = darkMode
  if (darkMode) {
    document.documentElement.classList.add('dark')
  }
});
</script>

<style scoped lang="scss">
.theme-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}
</style>
