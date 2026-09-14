<!-- 广场详情页 · 评论区：输入 + 列表（状态自持，父级用 :key=post.id 在切文时重建） -->
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Star } from '@element-plus/icons-vue'
import BaseInitialAvatar from '@/components/base/BaseInitialAvatar.vue'
import { defaultCommentsSeed } from './data'
import type { CommentItem } from './types'

const { t } = useI18n()

const commentText = ref('')
const comments = ref<CommentItem[]>(defaultCommentsSeed.map((c) => ({ ...c })))

const submitComment = () => {
  const text = commentText.value.trim()
  if (!text) return
  comments.value.unshift({
    id: Date.now(),
    author: '王同学',
    content: text,
    time: t('square.detail.createdAt', { date: '刚刚' }).replace(/.*·\s*/, '刚刚'),
    likes: 0,
    liked: false
  })
  commentText.value = ''
}

const toggleCommentLike = (comment: CommentItem) => {
  comment.liked = !comment.liked
  comment.likes += comment.liked ? 1 : -1
}
</script>

<template>
  <section class="comments-section">
    <div class="comments-header">
      <h2 class="comments-title">{{ $t('square.detail.comments.title') }}</h2>
      <span class="comments-count">{{ $t('square.detail.comments.count', { n: comments.length }) }}</span>
    </div>

    <!-- 评论输入 -->
    <div class="comment-input-wrap">
      <BaseInitialAvatar name="王同学" :size="40" />
      <div class="comment-input-area">
        <textarea
          v-model="commentText"
          :placeholder="$t('square.detail.comments.placeholder')"
          class="comment-textarea"
          rows="3"
        ></textarea>
        <button
          class="comment-submit-btn"
          :disabled="!commentText.trim()"
          @click="submitComment"
        >
          {{ $t('square.detail.comments.submit') }}
        </button>
      </div>
    </div>

    <!-- 评论列表 -->
    <div v-if="comments.length > 0" class="comments-list">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="comment-item"
      >
        <BaseInitialAvatar :name="comment.author" :size="40" :is-anonymous="comment.isAnonymous" />
        <div class="comment-body">
          <div class="comment-meta">
            <span class="comment-author">{{ comment.isAnonymous ? $t('square.detail.anonymous') : comment.author }}</span>
            <span class="comment-time">{{ comment.time }}</span>
          </div>
          <p class="comment-content">{{ comment.content }}</p>
          <button
            class="comment-like-btn"
            :class="{ liked: comment.liked }"
            @click="toggleCommentLike(comment)"
          >
            <el-icon><Star /></el-icon>
            <span>{{ comment.likes }}</span>
          </button>
        </div>
      </div>
    </div>
    <div v-else class="comments-empty">
      {{ $t('square.detail.comments.empty') }}
    </div>
  </section>
</template>

<style scoped>
/* ===== 评论区 ===== */
.comments-section {
  max-width: 860px;
  margin: 64px auto 0;
  padding: 0 40px;
  position: relative;
  z-index: 1;
}

.comments-header {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 36px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--mist-050);
}

.comments-title {
  font-size: clamp(26px, 3vw, 36px);
  font-weight: 900;
  color: var(--navy-950);
  letter-spacing: -1px;
  margin: 0;
}

.comments-count {
  font-size: 13px;
  color: var(--ink-400);
  font-weight: 500;
  letter-spacing: 0.5px;
  font-variant-numeric: tabular-nums;
}

/* 评论输入 */
.comment-input-wrap {
  display: flex;
  gap: 14px;
  margin-bottom: 48px;
}

.comment-input-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comment-textarea {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--mist-050);
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--ink-800);
  background: var(--brand-primary-wash);
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  transition: border-color 0.25s ease, background 0.25s ease;
  box-sizing: border-box;
  outline: none;
}

.comment-textarea:focus {
  border-color: var(--brand-primary);
  background: white;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-primary) 8%, transparent);
}

.comment-textarea::placeholder {
  color: var(--ink-400);
}

.comment-submit-btn {
  align-self: flex-end;
  padding: 10px 24px;
  background: var(--brand-primary);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: inherit;
}

.comment-submit-btn:hover:not(:disabled) {
  background: var(--brand-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px color-mix(in srgb, var(--brand-primary) 20%, transparent);
}

.comment-submit-btn:disabled {
  background: var(--brand-primary-soft);
  cursor: not-allowed;
}

/* 评论列表 */
.comments-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.comment-item {
  display: flex;
  gap: 14px;
}

.comment-body {
  flex: 1;
  min-width: 0;
}

.comment-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.comment-author {
  font-size: 14px;
  font-weight: 700;
  color: var(--ink-900);
}

.comment-time {
  font-size: 12px;
  color: var(--ink-400);
  letter-spacing: 0.5px;
}

.comment-content {
  font-size: 14px;
  line-height: 1.7;
  color: var(--ink-600);
  margin: 0 0 10px;
}

.comment-like-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: transparent;
  border: 1px solid var(--mist-050);
  border-radius: 20px;
  font-size: 12px;
  color: var(--ink-500);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.comment-like-btn:hover {
  border-color: var(--brand-primary-soft);
  background: var(--brand-primary-faint);
  color: var(--brand-primary);
}

.comment-like-btn.liked {
  border-color: var(--brand-primary);
  background: var(--brand-primary-faint);
  color: var(--brand-primary);
}

.comment-like-btn .el-icon {
  font-size: 12px;
}

.comments-empty {
  text-align: center;
  padding: 48px 0;
  color: var(--ink-400);
  font-size: 14px;
}

@media (width <= 768px) {
  .comments-section {
    padding-left: 20px;
    padding-right: 20px;
  }

  .comment-input-wrap {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
