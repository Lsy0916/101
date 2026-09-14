<!-- 广场详情页 · 正文 + 底部互动栏 -->
<script setup lang="ts">
import { Star, Share } from '@element-plus/icons-vue'
import type { PostItem } from './types'

defineProps<{
  post: PostItem
}>()

const emit = defineEmits<{
  (e: 'like'): void
  (e: 'share'): void
}>()
</script>

<template>
  <!-- 正文 -->
  <article class="rich-content">
    <p class="content-text">{{ post.content }}</p>
    <div v-if="post.photos && post.photos.length > 0" class="photo-grid">
      <img v-for="(photo, i) in post.photos" :key="i" :src="photo" class="content-photo" :alt="$t('square.create.photo.alt')" loading="lazy" />
    </div>
  </article>

  <!-- 互动栏 -->
  <footer class="detail-footer">
    <div class="footer-line"></div>
    <div class="footer-row">
      <span class="footer-mark">— End</span>
      <div class="footer-actions">
        <button class="action-btn" :class="{ active: post.liked }" @click="emit('like')">
          <el-icon><Star /></el-icon>
          <span>{{ post.likes }}</span>
        </button>
        <button class="action-btn" @click="emit('share')">
          <el-icon><Share /></el-icon>
          <span>{{ $t('square.detail.share') }}</span>
        </button>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* ===== 正文 ===== */
.rich-content {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 40px;
  position: relative;
  z-index: 1;
}

.content-text {
  font-size: 17px;
  line-height: 1.9;
  color: #1f2937;
  margin: 0;
  letter-spacing: 0.1px;
  position: relative;
  padding-left: 20px;
}

.content-text::before {
  content: '"';
  position: absolute;
  left: -8px;
  top: -16px;
  font-size: 64px;
  font-family: Georgia, 'Times New Roman', serif;
  color: rgba(0, 82, 217, 0.15);
  line-height: 1;
  font-weight: 900;
  pointer-events: none;
}

.content-text::first-letter {
  font-size: 32px;
  font-weight: 800;
  color: var(--brand-primary);
  font-family: Georgia, 'Times New Roman', serif;
  line-height: 1;
  margin-right: 2px;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 32px 0;
}

.content-photo {
  width: 100%;
  height: 100%;
  max-height: 320px;
  object-fit: cover;
  border-radius: 12px;
  display: block;
}

/* ===== 底部互动栏 ===== */
.detail-footer {
  max-width: 860px;
  margin: 64px auto 0;
  padding: 0 40px;
}

.footer-line {
  height: 1px;
  background: #eef2f6;
  margin-bottom: 28px;
}

.footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.footer-mark {
  font-size: 11px;
  letter-spacing: 2px;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: transparent;
  border: 1px solid #e8ecf0;
  color: #1f2937;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.25s ease;
  border-radius: 12px;
  font-family: inherit;
}

.action-btn:hover {
  border-color: var(--brand-primary);
  background: var(--brand-primary);
  color: #fff;
  box-shadow: 0 6px 16px rgba(0, 82, 217, 0.2);
  transform: translateY(-2px);
}

.action-btn.active {
  border-color: var(--brand-primary);
  background: var(--brand-primary);
  color: #fff;
}

.action-btn .el-icon { font-size: 13px; }

@media (max-width: 768px) {
  .rich-content {
    padding-left: 20px;
    padding-right: 20px;
  }
  .detail-footer {
    padding-left: 20px;
    padding-right: 20px;
  }
  .footer-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .photo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
