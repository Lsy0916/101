<!-- 评论区（ArticleDetailView），纯前端本地演示数据，状态自持 -->
<script setup lang="ts">
import { ref } from 'vue'
import { Star } from '@element-plus/icons-vue'
import BaseInitialAvatar from '@/components/base/BaseInitialAvatar.vue'

interface CommentItem {
  id: number
  author: string
  content: string
  time: string
  likes: number
  liked: boolean
  isAnonymous?: boolean
}

const commentText = ref('')
const comments = ref<CommentItem[]>([
  { id: 1, author: '林晓', content: '读完之后深有感触，尤其是关于建立微小秩序的部分，让我重新审视了自己的日常。', time: '3小时前', likes: 24, liked: false },
  { id: 2, author: '陈默', content: '正念练习确实有效，我坚持了三个月，焦虑感明显减轻了。推荐大家试试。', time: '5小时前', likes: 18, liked: false },
  { id: 3, author: '匿名同学', content: '感谢分享，正在经历迷茫期，这篇文章像一盏灯。', time: '昨天', likes: 31, liked: false, isAnonymous: true },
  { id: 4, author: '周琳', content: '与其试图掌控一切，不如学会与不确定性共处。这句话我要记下来。', time: '2天前', likes: 12, liked: false }
])

const submitComment = () => {
  const text = commentText.value.trim()
  if (!text) return
  comments.value.unshift({
    id: Date.now(),
    author: '王同学',
    content: text,
    time: '刚刚',
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
      <span class="comments-eyebrow">— Discussion</span>
      <h2 class="comments-title">{{ $t('article.detail.comments.title') }}</h2>
      <span class="comments-count">{{ $t('article.detail.comments.count', { n: comments.length }) }}</span>
    </div>

    <!-- 评论输入 -->
    <div class="comment-input-wrap">
      <BaseInitialAvatar name="王同学" :size="40" />
      <div class="comment-input-area">
        <textarea
          v-model="commentText"
          :placeholder="$t('article.detail.comments.placeholder')"
          class="comment-textarea"
          rows="3"
        ></textarea>
        <button
          class="comment-submit-btn"
          :disabled="!commentText.trim()"
          @click="submitComment"
        >
          {{ $t('article.detail.comments.submit') }}
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
            <span class="comment-author">{{ comment.isAnonymous ? $t('article.detail.comments.anon') : comment.author }}</span>
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
      {{ $t('article.detail.comments.empty') }}
    </div>
  </section>
</template>

<style scoped>
/* ===== 评论区 ===== */
.comments-section {
  max-width: 1200px;
  margin: 64px auto 0;
  padding: 0 40px;
}

.comments-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 36px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--mist-050);
  position: relative;
}

.comments-eyebrow {
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--brand-primary);
  font-weight: 700;
  text-transform: uppercase;
}

.comments-header .comments-title {
  font-size: clamp(28px, 3.5vw, 40px);
  font-weight: 900;
  color: var(--navy-950);
  letter-spacing: -1px;
  margin: 0;
}

.comments-count {
  position: absolute;
  right: 0;
  bottom: 28px;
  font-size: 13px;
  color: var(--ink-400);
  font-weight: 500;
  letter-spacing: 0.5px;
  font-variant-numeric: tabular-nums;
}

/* 评论输入 · 卡片式 */
.comment-input-wrap {
  display: flex;
  gap: 14px;
  margin-bottom: 40px;
  padding: 20px;
  background: var(--brand-primary-wash);
  border: 1px solid var(--mist-050);
  border-radius: 16px;
  transition: border-color 0.25s ease;
}

.comment-input-wrap:focus-within {
  border-color: var(--brand-primary-soft);
  background: white;
  box-shadow: 0 4px 16px color-mix(in srgb, var(--brand-primary) 6%, transparent);
}

.comment-input-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comment-textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--mist-050);
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--ink-800);
  background: white;
  resize: vertical;
  min-height: 72px;
  font-family: inherit;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
  box-sizing: border-box;
}

.comment-textarea:focus {
  outline: none;
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand-primary) 8%, transparent);
}

.comment-textarea::placeholder {
  color: var(--ink-400);
}

.comment-submit-btn {
  align-self: flex-end;
  padding: 10px 28px;
  background: linear-gradient(135deg, var(--brand-primary), var(--color-info));
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: inherit;
}

.comment-submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--brand-primary) 25%, transparent);
}

.comment-submit-btn:disabled {
  background: var(--brand-primary-soft);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 评论列表 · 卡片式 */
.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-item {
  display: flex;
  gap: 14px;
  padding: 20px 24px;
  background: white;
  border: 1px solid var(--mist-050);
  border-radius: 14px;
  transition: all 0.25s ease;
}

.comment-item:hover {
  border-color: var(--brand-primary-soft);
  box-shadow: 0 6px 18px color-mix(in srgb, var(--brand-primary) 6%, transparent);
  transform: translateY(-2px);
}

.comment-body {
  flex: 1;
  min-width: 0;
  position: relative;
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
  line-height: 1.75;
  color: var(--ink-600);
  margin: 0 0 12px;
}

.comment-like-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
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
  background: color-mix(in srgb, var(--brand-primary) 8%, transparent);
  color: var(--brand-primary);
  font-weight: 600;
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
