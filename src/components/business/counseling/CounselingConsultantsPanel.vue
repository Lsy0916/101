<!-- 心理老师面板 · 杂志编辑式列表 + 咨询师详情弹窗 -->
<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ArrowRight, School, Search, Star, User } from '@element-plus/icons-vue'
import { counselors, specialties } from './data'
import type { Counselor } from './types'

const emit = defineEmits<{
  (e: 'book', id: number): void
}>()

// ============ 咨询师列表筛选 ============
const consultantSearch = ref('')
const consFilter = reactive({ specialty: '', gender: '', sort: 'rating' })

const filteredConsultants = computed(() => {
  let list = counselors.filter(c => {
    if (consFilter.specialty && !c.specialties.includes(consFilter.specialty)) return false
    if (consFilter.gender && c.gender !== consFilter.gender) return false
    if (consultantSearch.value) {
      const q = consultantSearch.value.toLowerCase()
      if (!c.name.toLowerCase().includes(q) && !c.specialties.join(' ').toLowerCase().includes(q) && !c.intro.toLowerCase().includes(q)) return false
    }
    return true
  })
  if (consFilter.sort === 'rating') list = list.slice().sort((a, b) => b.rating - a.rating)
  else if (consFilter.sort === 'exp') list = list.slice().sort((a, b) => b.exp - a.exp)
  else if (consFilter.sort === 'sessions') list = list.slice().sort((a, b) => b.sessions - a.sessions)
  return list
})

// 咨询师详情
const counselorDetailVisible = ref(false)
const currentCounselor = ref<Counselor | null>(null)
function openCounselorDetail(c: Counselor) {
  currentCounselor.value = c
  counselorDetailVisible.value = true
}

function bookFromDialog() {
  const id = currentCounselor.value?.id
  if (id === undefined) return
  counselorDetailVisible.value = false
  emit('book', id)
}
</script>

<template>
  <!-- 极简搜索 + 筛选 -->
  <div v-reveal="{ delay: 80 }" class="cons-ribbon">
    <div class="ribbon-search">
      <el-icon class="search-ico"><Search /></el-icon>
      <input v-model="consultantSearch" :placeholder="$t('counseling.counselors.searchPlaceholderAlt')" />
    </div>
    <div class="cons-filters">
      <el-select v-model="consFilter.specialty" :placeholder="$t('counseling.counselors.specialty')" clearable class="cons-select">
        <el-option v-for="s in specialties" :key="s" :label="s" :value="s" />
      </el-select>
      <el-select v-model="consFilter.gender" :placeholder="$t('counseling.counselors.gender')" clearable class="cons-select">
        <el-option :label="$t('counseling.counselors.male')" value="male" /><el-option :label="$t('counseling.counselors.female')" value="female" />
      </el-select>
      <el-select v-model="consFilter.sort" :placeholder="$t('counseling.counselors.sort')" class="cons-select">
        <el-option :label="$t('counseling.counselors.sortByRating')" value="rating" /><el-option :label="$t('counseling.counselors.sortByExperience')" value="exp" /><el-option :label="$t('counseling.counselors.sortBySessions')" value="sessions" />
      </el-select>
    </div>
  </div>

  <!-- 当前分类小标题 -->
  <div v-if="filteredConsultants.length > 0" class="rows-heading">
    <span class="heading-name">{{ $t('counseling.tabs.counselors') }}</span>
    <span class="heading-line"></span>
    <span class="heading-count">{{ String(filteredConsultants.length).padStart(2, '0') }} {{ $t('counseling.counselors.count') }}</span>
  </div>

  <!-- 心理老师列表：横向编辑式行 -->
  <div v-reveal="{ delay: 160 }" class="counselor-rows">
    <div
      v-for="(c, i) in filteredConsultants"
      :key="c.id"
      class="counselor-row"
      @click="openCounselorDetail(c)"
    >
      <div class="row-number">
        <span class="num">{{ String(i + 1).padStart(2, '0') }}</span>
      </div>
      <div class="row-avatar" :style="{ background: c.color }">{{ c.name[0] }}</div>
      <div class="row-main">
        <div class="row-title-wrap">
          <h3 class="row-title">{{ c.name }}</h3>
          <span class="row-title-sub">{{ c.title }}</span>
          <span class="row-free">{{ $t('counseling.freeTag') }}</span>
        </div>
        <p class="row-desc">{{ c.intro }}</p>
        <div class="row-tags">
          <span v-for="sp in c.specialties" :key="sp" class="row-tag">{{ sp }}</span>
        </div>
      </div>
      <div class="row-meta">
        <span class="meta-rating"><el-icon><Star /></el-icon>{{ c.rating }}</span>
        <span class="meta-sessions">{{ c.sessions }}{{ $t('counseling.counselors.sessionsSuffix') }}</span>
        <button class="row-book" @click.stop="emit('book', c.id)">{{ $t('counseling.btn.book') }}</button>
        <el-icon class="row-arrow"><ArrowRight /></el-icon>
      </div>
    </div>
  </div>
  <div v-if="filteredConsultants.length === 0" class="empty-tip">
    <el-empty :description="$t('counseling.counselors.empty')" />
  </div>

  <!-- 咨询师详情弹窗 -->
  <el-dialog v-model="counselorDetailVisible" :title="currentCounselor ? currentCounselor.name + ' · ' + currentCounselor.title : ''" width="640px" class="counselor-dialog">
    <div v-if="currentCounselor" class="cd-content">
      <div class="cd-header">
        <div class="cd-avatar" :style="{ background: currentCounselor.color }">{{ currentCounselor.name[0] }}</div>
        <div class="cd-meta">
          <div class="cd-name">{{ currentCounselor.name }}</div>
          <div class="cd-title">{{ currentCounselor.title }} · {{ currentCounselor.exp }}{{ $t('counseling.counselors.yearsSuffix') }}</div>
          <div class="cd-stats">
            <span><el-icon><Star /></el-icon> {{ currentCounselor.rating }}</span>
            <span><el-icon><User /></el-icon> {{ currentCounselor.sessions }}{{ $t('counseling.counselors.sessionsUnit') }}</span>
            <span><el-icon><School /></el-icon> {{ currentCounselor.education }}</span>
          </div>
        </div>
      </div>
      <div class="cd-section">
        <h4>{{ $t('counseling.counselors.dialog.intro') }}</h4>
        <p>{{ currentCounselor.intro }}</p>
      </div>
      <div class="cd-section">
        <h4>{{ $t('counseling.counselors.dialog.specialties') }}</h4>
        <div class="cd-specs"><span v-for="sp in currentCounselor.specialties" :key="sp" class="cd-spec">{{ sp }}</span></div>
      </div>
      <div class="cd-section">
        <h4>{{ $t('counseling.counselors.dialog.background') }}</h4>
        <ul class="cd-edu"><li v-for="(e, i) in currentCounselor.background" :key="i">{{ e }}</li></ul>
      </div>
      <div class="cd-section">
        <h4>{{ $t('counseling.counselors.dialog.reviews') }}</h4>
        <div v-for="(r, i) in currentCounselor.reviews" :key="i" class="cd-review">
          <div class="rv-stars"><el-icon v-for="s in 5" :key="s"><Star /></el-icon></div>
          <p>{{ r }}</p>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button @click="counselorDetailVisible = false">{{ $t('counseling.btn.close') }}</el-button>
      <el-button type="primary" @click="bookFromDialog">{{ $t('counseling.btn.bookThis') }}</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
/* ============ 心理老师 · 杂志编辑式行 ============ */
.cons-ribbon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 18px 0;
  border-top: 1px solid #0a0f1a;
  border-bottom: 1px solid #eef2f6;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.cons-ribbon .ribbon-search {
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #0a0f1a;
  padding: 4px 0;
  min-width: 220px;
}

.cons-ribbon .search-ico {
  font-size: 15px;
  color: #6b7280;
}

.cons-ribbon .ribbon-search input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #0a0f1a;
  font-family: inherit;
  width: 100%;
  padding: 4px 0;
}

.cons-ribbon .ribbon-search input::placeholder {
  color: #9ca3af;
}

.cons-filters { display: flex; gap: 10px; }

:deep(.cons-select .el-input__wrapper) {
  border-radius: 0;
  background: transparent;
  box-shadow: none !important;
  border: none;
  border-bottom: 1px solid #e2e8f0;
  padding: 4px 0;
}
:deep(.cons-select .el-input__wrapper:hover),
:deep(.cons-select .el-input.is-focus .el-input__wrapper) {
  border-bottom-color: #0a0f1a;
}
:deep(.cons-select .el-input__inner) { font-size: 13px; color: #1f2937; }
:deep(.cons-select) { width: 120px; }

/* 当前分类小标题 */
.rows-heading {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 40px 0 20px;
}

.rows-heading .heading-name {
  font-size: clamp(22px, 2.4vw, 30px);
  font-weight: 800;
  color: #0a0f1a;
  letter-spacing: -0.5px;
}

.rows-heading .heading-line {
  flex: 1;
  height: 1px;
  background: #eef2f6;
}

.rows-heading .heading-count {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 600;
  letter-spacing: 1px;
  font-variant-numeric: tabular-nums;
}

/* 心理老师列表：横向编辑式行 */
.counselor-rows {
  display: flex;
  flex-direction: column;
  padding-right: 12px;
  overflow: visible;
}

.counselor-row {
  display: grid;
  grid-template-columns: 56px 52px 1fr 240px;
  gap: 24px;
  align-items: center;
  padding: 24px 0;
  border-bottom: 1px solid #eef2f6;
  cursor: pointer;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease;
  position: relative;
}

.counselor-row::before {
  content: '';
  position: absolute;
  left: -16px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: var(--brand-primary);
  border-radius: 2px;
  transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.counselor-row:hover {
  transform: translateX(8px);
}

.counselor-row:hover::before {
  height: 60%;
}

.counselor-row:hover .row-title {
  color: var(--brand-primary);
}

.row-number .num {
  font-size: 22px;
  font-weight: 800;
  color: #0a0f1a;
  letter-spacing: -0.5px;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.counselor-row:hover .row-number .num {
  color: var(--brand-primary);
}

.row-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  flex-shrink: 0;
  letter-spacing: -0.5px;
}

.row-main {
  min-width: 0;
}

.row-title-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.row-title {
  font-size: clamp(17px, 1.4vw, 20px);
  font-weight: 700;
  color: #0a0f1a;
  margin: 0;
  line-height: 1.3;
  letter-spacing: -0.2px;
  transition: color 0.25s;
}

.row-title-sub {
  font-size: 12px;
  color: #9ca3af;
  letter-spacing: 0.2px;
}

.row-free {
  font-size: 10px;
  font-weight: 700;
  color: var(--brand-primary);
  padding: 2px 8px;
  border: 1px solid #d0e7ff;
  border-radius: 4px;
  letter-spacing: 0.5px;
}

.row-desc {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.row-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.row-tag {
  font-size: 11px;
  color: #6b7280;
  padding: 2px 0;
  font-weight: 500;
}

.row-tag::before {
  content: '/ ';
  color: #d0d5dd;
}

.row-tag:first-child::before {
  content: '';
}

.row-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.row-meta .meta-rating {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 700;
  color: #0a0f1a;
  font-variant-numeric: tabular-nums;
}

.row-meta .meta-rating .el-icon {
  color: #f59e0b;
  font-size: 14px;
}

.row-meta .meta-sessions {
  font-size: 12px;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
}

.row-book {
  background: var(--brand-primary);
  border: none;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: 0.5px;
  transition: all 0.25s ease;
  box-shadow: 0 4px 12px rgba(0, 82, 217, 0.2);
}

.row-book:hover {
  background: #0040b8;
  box-shadow: 0 6px 18px rgba(0, 82, 217, 0.35);
  transform: translateY(-1px);
}

.row-arrow {
  font-size: 18px;
  color: var(--brand-primary);
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.counselor-row:hover .row-arrow {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 900px) {
  .counselor-row {
    grid-template-columns: 40px 48px 1fr;
    gap: 16px;
  }
  .row-meta {
    display: none;
  }
}

.empty-tip { padding: 80px 0; }

/* ============ 咨询师详情弹窗 ============ */
.cd-content { padding: 0; }

.cd-header {
  display: flex;
  gap: 20px;
  align-items: center;
  padding-bottom: 24px;
  border-bottom: 1px solid #eef2f6;
  margin-bottom: 28px;
}

.cd-avatar {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.12);
  letter-spacing: -0.5px;
}

.cd-name { font-size: 22px; font-weight: 700; color: #1f2937; letter-spacing: -0.4px; }
.cd-title { font-size: 13px; color: #9ca3af; margin: 6px 0 10px; letter-spacing: 0.2px; }
.cd-stats {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #6b7280;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.2px;
}
.cd-stats .el-icon { color: #f59e0b; }
.cd-stats span { display: inline-flex; align-items: center; gap: 6px; }

.cd-section { margin-bottom: 28px; }
.cd-section h4 {
  font-size: 12px;
  color: var(--brand-primary);
  margin: 0 0 14px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
}
.cd-section h4::before {
  content: '';
  width: 16px;
  height: 2px;
  background: linear-gradient(90deg, #0052d9, transparent);
  border-radius: 2px;
}
.cd-section p { font-size: 14px; color: #4b5563; line-height: 1.8; margin: 0; }

.cd-specs { display: flex; flex-wrap: wrap; gap: 6px; }
.cd-spec {
  background: #f0f7ff;
  color: var(--brand-primary);
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 8px;
  border: 1px solid rgba(0, 82, 217, 0.08);
  font-weight: 500;
  letter-spacing: 0.2px;
}

.cd-edu { margin: 0; padding-left: 22px; }
.cd-edu li {
  font-size: 13px;
  color: #4b5563;
  line-height: 1.8;
  padding: 8px 0;
  list-style: none;
  position: relative;
}
.cd-edu li::before {
  content: '';
  position: absolute;
  left: -22px;
  top: 16px;
  width: 8px;
  height: 8px;
  background: #f0f7ff;
  border: 2px solid var(--brand-primary);
  border-radius: 50%;
}

.cd-review {
  padding: 16px 0;
  background: transparent;
  border-radius: 0;
  margin-bottom: 0;
  border-bottom: 1px solid #f1f5f9;
}
.cd-review:last-child { border-bottom: none; }
.rv-stars { display: flex; gap: 2px; color: #f59e0b; margin-bottom: 8px; font-size: 14px; }
.cd-review p { font-size: 13px; color: #4b5563; line-height: 1.8; margin: 0; }

/* ============ 暗夜模式适配 ============ */
html.dark .counselor-row {
  border-bottom-color: #334155 !important;
}

html.dark .row-title,
html.dark .row-number .num,
html.dark .meta-rating {
  color: #f1f5f9 !important;
}

html.dark .row-desc,
html.dark .row-title-sub,
html.dark .meta-sessions {
  color: #94a3b8 !important;
}

html.dark .row-book {
  background: #0052d9 !important;
  color: #fff !important;
}
</style>
