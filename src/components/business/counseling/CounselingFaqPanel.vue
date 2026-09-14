<!-- 常见问题面板 · 卡片化侧栏分类 + 手风琴问答 -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChatLineRound, Calendar, List, Lock, Reading, School } from '@element-plus/icons-vue'
import { faqList } from './data'

const emit = defineEmits<{
  (e: 'book'): void
}>()

const { t } = useI18n()

const faqCategories = computed(() => [
  { key: 'all', name: t('counseling.faq.categories.all'), icon: List },
  { key: 'booking', name: t('counseling.faq.categories.booking'), icon: Calendar },
  { key: 'service', name: t('counseling.faq.categories.service'), icon: School },
  { key: 'effect', name: t('counseling.faq.categories.effect'), icon: Reading },
  { key: 'privacy', name: t('counseling.faq.categories.confidentiality'), icon: Lock }
])

const faqActiveCat = ref('all')
const faqSearch = ref('')
const faqActive = ref('')

function getFaqCount(cat: string) {
  return cat === 'all' ? faqList.length : faqList.filter(f => f.cat === cat).length
}

const filteredFaqs = computed(() => {
  let list = faqList
  if (faqActiveCat.value !== 'all') list = list.filter(f => f.cat === faqActiveCat.value)
  if (faqSearch.value) {
    const q = faqSearch.value.toLowerCase()
    list = list.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
  }
  return list
})
</script>

<template>
  <div v-reveal="{ delay: 100 }" class="faq-layout">
    <aside class="faq-sidebar">
      <div
        v-for="cat in faqCategories"
        :key="cat.key"
        class="faq-cat"
        :class="{ active: faqActiveCat === cat.key }"
        @click="faqActiveCat = cat.key"
      >
        <el-icon><component :is="cat.icon" /></el-icon>
        <span>{{ cat.name }}</span>
        <span class="faq-cat-count">{{ getFaqCount(cat.key) }}</span>
      </div>
    </aside>
    <div class="faq-content">
      <el-input v-model="faqSearch" :placeholder="$t('counseling.faq.searchPlaceholder')" prefix-icon="Search" clearable class="faq-search" />
      <el-collapse v-model="faqActive" accordion>
        <el-collapse-item v-for="(item, i) in filteredFaqs" :key="i" :name="i">
          <template #title>
            <span class="faq-q"><span class="q-mark">Q</span>{{ item.q }}</span>
          </template>
          <p class="faq-a">{{ item.a }}</p>
        </el-collapse-item>
      </el-collapse>
      <div v-if="filteredFaqs.length === 0" class="empty-tip">
        <el-empty :description="$t('counseling.faq.empty')" />
      </div>
      <div class="faq-contact">
        <el-icon><ChatLineRound /></el-icon>
        <span>{{ $t('counseling.faq.contactPrompt') }}</span>
        <el-button type="primary" link @click="emit('book')">{{ $t('counseling.faq.contactBtn') }}</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ============ FAQ · 卡片化侧栏 ============ */
.faq-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 48px;
  align-items: flex-start;
}

.faq-sidebar {
  position: sticky;
  top: 96px;
  background: white;
  border: 1px solid var(--mist-050);
  border-radius: 16px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 4px 16px color-mix(in srgb, var(--slate-900) 4%, transparent);
}

.faq-cat {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  color: var(--ink-600);
  font-weight: 500;
  transition: all 0.25s ease;
  border: none;
  letter-spacing: 0.2px;
  background: transparent;
}

.faq-cat:hover { background: var(--brand-primary-faint); color: var(--brand-primary); }

.faq-cat.active {
  background: linear-gradient(135deg, var(--brand-primary) 0%, var(--color-info) 100%);
  color: white;
  font-weight: 600;
  box-shadow: 0 6px 16px color-mix(in srgb, var(--brand-primary) 25%, transparent);
}
.faq-cat .el-icon { font-size: 16px; }

.faq-cat-count {
  margin-left: auto;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 8px;
  background: var(--slate-100);
  color: var(--ink-400);
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}

.faq-cat.active .faq-cat-count {
  background: color-mix(in srgb, white 20%, transparent);
  color: white;
}

.faq-content { min-width: 0; }

.faq-search { margin-bottom: 28px; max-width: 460px; }

:deep(.faq-search .el-input__wrapper) {
  border-radius: 12px;
  background: var(--slate-50);
  box-shadow: none !important;
  border: 1px solid var(--slate-200);
  padding: 8px 14px;
}

:deep(.faq-search .el-input__wrapper:hover) {
  border-color: var(--brand-primary);
  background: white;
}

:deep(.faq-search.is-focus .el-input__wrapper) {
  border-color: var(--brand-primary) !important;
  background: white;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-primary) 10%, transparent) !important;
}
:deep(.faq-search .el-input__inner) { font-size: 14px; color: var(--ink-800); }

:deep(.el-collapse) { border: none; }

:deep(.el-collapse-item__header) {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--mist-050);
  border-radius: 0;
  padding: 0;
  margin-bottom: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--ink-800);
  height: 64px;
  letter-spacing: -0.2px;
  transition: color 0.2s ease;
}
:deep(.el-collapse-item__header:hover) { color: var(--brand-primary); }
:deep(.el-collapse-item__wrap) { border: none; background: transparent; }

:deep(.el-collapse-item__content) {
  padding: 16px 0 24px;
  background: transparent;
  border-radius: 0;
  margin-bottom: 0;
  border: none;
}

.faq-q { display: flex; align-items: center; gap: 14px; color: var(--ink-800); }

.q-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--brand-primary-faint), var(--brand-primary-soft));
  color: var(--brand-primary);
  border: none;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  letter-spacing: 0.3px;
}

.faq-a {
  margin: 0 0 0 44px;
  font-size: 14px;
  color: var(--ink-600);
  line-height: 1.85;
  letter-spacing: 0.1px;
  padding: 14px 18px;
  background: var(--slate-50);
  border-radius: 10px;
  border-left: 3px solid var(--brand-primary);
}

.faq-contact {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 40px;
  padding: 20px 24px;
  background: linear-gradient(135deg, color-mix(in srgb, var(--brand-primary) 6%, transparent) 0%, color-mix(in srgb, var(--color-info) 2%, transparent) 100%);
  border: 1px solid color-mix(in srgb, var(--brand-primary) 12%, transparent);
  border-radius: 14px;
  font-size: 14px;
  color: var(--ink-600);
}
.faq-contact .el-icon { color: var(--brand-primary); font-size: 20px; }
.faq-contact a { color: var(--brand-primary); text-decoration: none; font-weight: 600; }
.faq-contact a:hover { text-decoration: underline; text-underline-offset: 3px; }

.empty-tip { padding: 80px 0; }

@media (width <= 900px) {
  .faq-layout { grid-template-columns: 1fr; gap: 28px; }
  .faq-sidebar { position: relative; top: 0; flex-direction: row; overflow-x: auto; gap: 8px; padding: 8px; }
  .faq-cat { flex-shrink: 0; white-space: nowrap; }
}

@media (width <= 768px) {
  .faq-a { margin-left: 0; padding: 12px 14px; }
  .q-mark { width: 26px; height: 26px; }
}

/* ============ 暗夜模式适配 ============ */
html.dark .faq-sidebar {
  background: var(--slate-800) !important;
  border-color: var(--slate-700) !important;
  box-shadow: 0 2px 12px color-mix(in srgb, black 30%, transparent) !important;
}
</style>
