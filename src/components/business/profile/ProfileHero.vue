<!-- 个人中心 Hero 封面 · 杂志期刊式首屏 -->
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Edit, Histogram, School } from '@element-plus/icons-vue'
import BaseInitialAvatar from '@/components/base/BaseInitialAvatar.vue'

const props = defineProps<{
  name: string
  role: string
  school: string
  studentId: string
  bio: string
}>()

const emit = defineEmits<{
  (e: 'edit-profile'): void
  (e: 'view-stats'): void
}>()

const { t } = useI18n()

const issueNo = computed(() => String(new Date().getMonth() + 1).padStart(2, '0'))
</script>

<template>
  <header class="hero">
    <div class="hero-bg" aria-hidden="true"></div>
    <div class="hero-inner">
      <div class="hero-topline">
        <span class="hero-eyebrow">{{ t('profile.eyebrow') }} / PROFILE</span>
        <span class="hero-issue">No.{{ issueNo }}</span>
      </div>

      <h1 class="hero-title" v-html="t('profile.title')"></h1>
      <p class="hero-sub">{{ t('profile.desc') }}</p>

      <div class="hero-divider" aria-hidden="true"></div>

      <div class="hero-grid">
        <div class="hero-portrait">
          <BaseInitialAvatar :name="props.name || 'U'" :size="96" />
          <span class="hero-role">{{ props.role }}</span>
        </div>
        <div class="hero-detail">
          <div class="hero-name">{{ props.name || t('nav.user.guest') }}</div>
          <div class="hero-meta">
            <span class="meta-item">
              <el-icon><School /></el-icon>{{ props.school || '—' }}
            </span>
            <span class="meta-dot">/</span>
            <span class="meta-item">{{ t('profile.hero.studentId') }} · {{ props.studentId || '—' }}</span>
            <span class="meta-dot">/</span>
            <span class="meta-item">{{ t('profile.hero.joinDate') }} · 2024-09-01</span>
          </div>
          <p class="hero-bio">{{ props.bio || t('profile.hero.bioEmpty') }}</p>
        </div>
        <div class="hero-cta">
          <button class="cta-btn" @click="emit('edit-profile')">
            <el-icon><Edit /></el-icon>{{ t('profile.hero.editProfile') }}
          </button>
          <button class="cta-btn ghost" @click="emit('view-stats')">
            <el-icon><Histogram /></el-icon>{{ t('profile.hero.viewStats') }}
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* 字体定义 */
.hero-title,
.hero-name {
  font-family: Georgia, 'Times New Roman', 'Songti SC', STSong, serif;
}

/* ============ Hero 封面 ============ */
.hero {
  position: relative;
  overflow: hidden;
  margin-bottom: 8px;
  background: linear-gradient(135deg, var(--navy-800) 0%, var(--brand-primary) 50%, var(--color-info) 100%);
}

.hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 88% 18%, color-mix(in srgb, white 14%, transparent) 0%, transparent 42%),
    radial-gradient(circle at 12% 88%, color-mix(in srgb, var(--color-info) 28%, transparent) 0%, transparent 50%);
}

.hero-inner {
  position: relative;
  z-index: 1;
  padding: 56px 56px 48px;
  color: white;
}

.hero-topline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 12px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: color-mix(in srgb, white 70%, transparent);
  font-weight: 600;
}

.hero-eyebrow {
  white-space: nowrap;
}

.hero-issue {
  font-family: Georgia, serif;
  font-style: italic;
  letter-spacing: 1px;
}

.hero-title {
  margin: 0 0 14px;
  font-size: clamp(40px, 6vw, 64px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -1px;
  color: white;
}

.hero-title :deep(em) {
  font-style: italic;
  font-weight: 400;
  color: #bae0ff; /* stylelint-disable-line color-no-hex, function-allowed-list */
}

.hero-sub {
  margin: 0 0 28px;
  max-width: 620px;
  font-size: 15px;
  line-height: 1.7;
  color: color-mix(in srgb, white 78%, transparent);
}

.hero-divider {
  height: 1px;
  background: color-mix(in srgb, white 25%, transparent);
  margin-bottom: 32px;
}

.hero-grid {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 36px;
  align-items: center;
}

.hero-portrait {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.hero-role {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: color-mix(in srgb, white 90%, transparent);
  border: 1px solid color-mix(in srgb, white 30%, transparent);
  padding: 3px 12px;
}

.hero-detail {
  min-width: 0;
}

.hero-name {
  font-size: clamp(26px, 3vw, 34px);
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 12px;
  line-height: 1.15;
}

.hero-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: color-mix(in srgb, white 85%, transparent);
}

.meta-item .el-icon {
  font-size: 15px;
}

.meta-dot {
  color: color-mix(in srgb, white 35%, transparent);
  font-size: 13px;
}

.hero-bio {
  margin: 0;
  font-size: 14px;
  line-height: 1.65;
  color: color-mix(in srgb, white 72%, transparent);
  max-width: 560px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hero-cta {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-shrink: 0;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 22px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid white;
  background: white;
  color: var(--brand-primary);
  transition: all 0.25s ease;
  white-space: nowrap;
}

.cta-btn:hover {
  background: var(--brand-primary-faint);
}

.cta-btn.ghost {
  background: transparent;
  color: white;
  border-color: color-mix(in srgb, white 40%, transparent);
}

.cta-btn.ghost:hover {
  background: color-mix(in srgb, white 12%, transparent);
  border-color: color-mix(in srgb, white 70%, transparent);
}

@media (width <= 1024px) {
  .hero-grid {
    grid-template-columns: auto 1fr;
    gap: 28px;
  }

  .hero-cta {
    grid-column: 1 / -1;
    flex-direction: row;
    margin-top: 8px;
  }
}

@media (width <= 768px) {
  .hero-inner {
    padding: 36px 24px 32px;
  }

  .hero-topline {
    margin-bottom: 18px;
    font-size: 11px;
    letter-spacing: 2px;
  }

  .hero-title {
    font-size: clamp(34px, 10vw, 44px);
  }

  .hero-sub {
    font-size: 14px;
    margin-bottom: 22px;
  }

  .hero-grid {
    grid-template-columns: 1fr;
    gap: 24px;
    text-align: center;
  }

  .hero-portrait {
    align-items: center;
  }

  .hero-detail {
    text-align: center;
  }

  .hero-meta {
    justify-content: center;
  }

  .hero-cta {
    flex-flow: row wrap;
    justify-content: center;
  }

  .cta-btn {
    padding: 10px 20px;
    font-size: 13px;
  }
}
</style>
