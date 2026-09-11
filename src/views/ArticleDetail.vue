<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, ArrowRight, Star, Share, Timer, View } from '@element-plus/icons-vue'
import ReadProgress from '@/components/ReadProgress.vue'
import InitialAvatar from '@/components/InitialAvatar.vue'
import { getArticleById, getRelatedArticles, type ArticleItem } from '@/data/articles'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

interface CommentItem {
  id: number
  author: string
  content: string
  time: string
  likes: number
  liked: boolean
  isAnonymous?: boolean
}

const article = ref<ArticleItem | null>(null)
const related = ref<ArticleItem[]>([])
const liked = ref(false)
const bookmarked = ref(false)

const commentText = ref('')
const comments = ref<CommentItem[]>([
  { id: 1, author: '林晓', content: '读完之后深有感触，尤其是关于建立微小秩序的部分，让我重新审视了自己的日常。', time: '3小时前', likes: 24, liked: false },
  { id: 2, author: '陈默', content: '正念练习确实有效，我坚持了三个月，焦虑感明显减轻了。推荐大家试试。', time: '5小时前', likes: 18, liked: false },
  { id: 3, author: '匿名同学', content: '感谢分享，正在经历迷茫期，这篇文章像一盏灯。', time: '昨天', likes: 31, liked: false, isAnonymous: true },
  { id: 4, author: '周琳', content: '与其试图掌控一切，不如学会与不确定性共处。这句话我要记下来。', time: '2天前', likes: 12, liked: false }
])

const loadArticle = (id: string | string[]) => {
  const data = getArticleById(id)
  if (!data) {
    router.replace({ name: 'articles' })
    return
  }
  article.value = data
  related.value = getRelatedArticles(data, 4)
  liked.value = false
  bookmarked.value = false
  window.scrollTo({ top: 0, behavior: 'instant' })
}

onMounted(() => {
  loadArticle(route.params.id)
})

watch(() => route.params.id, (id) => {
  if (id) loadArticle(id)
})

const goToList = () => router.push('/articles/list')
const openRelated = (id: number) => router.push(`/articles/${id}`)

const articleBody = computed(() => {
  if (!article.value) return ''
  const hero = article.value.image
    ? `<figure class="article-hero-img"><img src="${article.value.image}" alt="${article.value.title}"/><figcaption>— ${article.value.title}</figcaption></figure>`
    : ''
  return hero + (article.value.content || '')
})

const formatViews = (n: number) => {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}

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
  <div class="article-detail-page" v-if="article">
    <ReadProgress />

    <!-- 顶部返回栏 · 紧贴 navbar -->
    <div class="top-bar">
      <button class="back-btn" @click="goToList">
        <el-icon><ArrowLeft /></el-icon>
        <span>{{ $t('common.back') }}</span>
      </button>
      <span class="top-mark">{{ article.categoryLabel }} · No.{{ String(article.id).padStart(2, '0') }}</span>
    </div>

    <!-- 标题区 · 纯排版 -->
    <header class="detail-header">
      <div class="header-eyebrow">
        <span class="eyebrow-cat">{{ article.categoryLabel }}</span>
        <span class="eyebrow-sep">/</span>
        <span class="eyebrow-date">{{ article.date }}</span>
      </div>
      <h1 class="detail-title" v-reveal>{{ article.title }}</h1>
      <p class="detail-summary" v-reveal="120">{{ article.summary }}</p>

      <!-- 作者 + meta · 编辑式定义行 -->
      <div class="author-row" v-reveal="200">
        <div class="author-block">
          <InitialAvatar :name="article.author" :size="44" class="author-avatar" />
          <div class="author-info">
            <span class="author-name">{{ article.author }}</span>
            <span class="author-title">{{ article.authorTitle }}</span>
          </div>
        </div>
        <div class="meta-divider"></div>
        <div class="meta-stats">
          <span class="meta-item"><el-icon><Timer /></el-icon>{{ article.readTime }}</span>
          <span class="meta-item"><el-icon><View /></el-icon>{{ formatViews(article.views) }}</span>
        </div>
      </div>
    </header>

    <!-- 双栏布局: 正文 + 右侧推荐 -->
    <div class="article-grid">
      <!-- 主栏: 正文（含封面首图）+ 操作栏 -->
      <div class="article-main">
        <article class="rich-content drop-cap" v-html="articleBody" v-reveal="80"></article>

        <!-- 底部操作栏 -->
        <footer class="detail-footer">
          <div class="footer-line"></div>
          <div class="footer-row">
            <span class="footer-mark">— End of Article</span>
            <div class="footer-actions">
              <button class="action-btn" :class="{ active: liked }" @click="liked = !liked">
                <el-icon><Star /></el-icon>
                <span>{{ liked ? $t('article.detail.comments.liked') : $t('article.detail.comments.like') }}</span>
              </button>
              <button class="action-btn" @click="bookmarked = !bookmarked">
                <el-icon><Share /></el-icon>
                <span>{{ $t('square.detail.share') }}</span>
              </button>
            </div>
          </div>
        </footer>
      </div>

      <!-- 右侧推荐栏 · sticky -->
      <aside class="related-sidebar" v-if="related.length > 0">
        <div class="sidebar-header">
          <span class="sidebar-eyebrow">— Continue Reading</span>
          <h3 class="sidebar-title">相关<em>推荐</em></h3>
        </div>
        <div class="sidebar-list">
          <article
            v-for="(item, i) in related"
            :key="item.id"
            class="sidebar-card"
            v-reveal="i * 80"
            @click="openRelated(item.id)"
          >
            <span class="card-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <div class="card-body">
              <span class="card-cat">{{ item.categoryLabel }}</span>
              <h4 class="card-title">{{ item.title }}</h4>
              <span class="card-meta">{{ item.readTime }}</span>
            </div>
            <el-icon class="card-arrow"><ArrowRight /></el-icon>
          </article>
        </div>
      </aside>
    </div>

    <!-- 评论区 -->
    <section class="comments-section">
      <div class="comments-header">
        <span class="comments-eyebrow">— Discussion</span>
        <h2 class="comments-title">{{ $t('article.detail.comments.title') }}</h2>
        <span class="comments-count">{{ $t('article.detail.comments.count', { n: comments.length }) }}</span>
      </div>

      <!-- 评论输入 -->
      <div class="comment-input-wrap">
        <InitialAvatar name="王同学" :size="40" />
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
      <div class="comments-list" v-if="comments.length > 0">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="comment-item"
        >
          <InitialAvatar :name="comment.author" :size="40" :is-anonymous="comment.isAnonymous" />
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
  </div>
</template>

<style scoped>
.article-detail-page {
  min-height: 100vh;
  background: #ffffff;
  padding-top: 28px;
  padding-bottom: 80px;
}

/* ===== 顶部返回栏 ===== */
.top-bar {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eef2f6;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: #1f2937;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  padding: 8px 0;
  transition: color 0.2s ease, transform 0.2s ease;
}
.back-btn:hover {
  color: #0052d9;
  transform: translateX(-4px);
}
.back-btn .el-icon { font-size: 14px; }

.top-mark {
  font-size: 11px;
  letter-spacing: 2px;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  font-variant-numeric: tabular-nums;
}

/* ===== 标题区 · 纯排版 ===== */
.detail-header {
  max-width: 1200px;
  margin: 0 auto;
  padding: 56px 40px 48px;
}

.header-eyebrow {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  letter-spacing: 2px;
  color: #0052d9;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 28px;
}
.eyebrow-sep { color: #d0d5db; font-weight: 400; }
.eyebrow-date { color: #6b7280; font-weight: 500; }

.detail-title {
  font-size: clamp(36px, 5.5vw, 68px);
  font-weight: 900;
  color: #0a0f1a;
  line-height: 1.04;
  letter-spacing: -2px;
  margin: 0 0 28px;
}

.detail-summary {
  font-size: clamp(16px, 1.4vw, 20px);
  line-height: 1.7;
  color: #4b5563;
  font-weight: 400;
  font-style: italic;
  margin: 0 0 40px;
  padding-left: 20px;
  border-left: 2px solid #0052d9;
  max-width: 760px;
}

/* 作者行 */
.author-row {
  display: flex;
  align-items: center;
  gap: 24px;
  padding-top: 28px;
  border-top: 1px solid #eef2f6;
}

.author-block {
  display: flex;
  align-items: center;
  gap: 14px;
}

.author-avatar {
  flex-shrink: 0;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-name {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  letter-spacing: 0.2px;
}

.author-title {
  font-size: 11px;
  color: #9ca3af;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.meta-divider {
  width: 1px;
  height: 28px;
  background: #eef2f6;
}

.meta-stats {
  display: flex;
  gap: 20px;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  letter-spacing: 0.5px;
  font-variant-numeric: tabular-nums;
}
.meta-item .el-icon { font-size: 13px; color: #9ca3af; }

/* ===== Hero 大图 ===== */
/* 文章首图（封面）· 嵌入正文 */
.rich-content :deep(.article-hero-img) {
  margin: 0 0 40px;
  position: relative;
}
.rich-content :deep(.article-hero-img img) {
  width: 100%;
  height: clamp(280px, 38vw, 480px);
  object-fit: cover;
  display: block;
  border-radius: 20px;
  filter: grayscale(1%) contrast(1.02);
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
.rich-content :deep(.article-hero-img:hover img) {
  transform: scale(1.02);
}
.rich-content :deep(.article-hero-img figcaption) {
  margin-top: 14px;
  font-size: 12px;
  color: #9ca3af;
  letter-spacing: 1.5px;
  font-style: italic;
  font-family: Georgia, 'Times New Roman', serif;
  text-align: center;
}

/* ===== 双栏布局 ===== */
.article-grid {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 56px;
  align-items: start;
}

.article-main {
  min-width: 0;
}

/* ===== 正文 ===== */
.rich-content {
  font-size: 17px;
  line-height: 1.85;
  color: #1f2937;
  font-weight: 400;
}

.rich-content :deep(p) {
  margin: 0 0 24px;
}

.rich-content :deep(h3) {
  font-size: clamp(20px, 2vw, 26px);
  font-weight: 800;
  color: #0a0f1a;
  letter-spacing: -0.5px;
  margin: 56px 0 20px;
  position: relative;
  padding-left: 18px;
}
.rich-content :deep(h3)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.45em;
  width: 6px;
  height: 6px;
  background: #0052d9;
  border-radius: 50%;
}

.rich-content :deep(strong) {
  font-weight: 700;
  color: #0a0f1a;
}

.rich-content :deep(blockquote) {
  margin: 32px 0;
  padding: 16px 24px;
  border-left: 3px solid #0052d9;
  font-style: italic;
  color: #4b5563;
  background: #f8fbff;
}

.rich-content :deep(a) {
  color: #0052d9;
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.rich-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  margin: 32px 0;
  display: block;
}

/* ===== 底部操作栏 ===== */
.detail-footer {
  margin: 80px 0 0;
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
  border-radius: 0;
}
.action-btn:hover {
  border-color: #0a0f1a;
  background: #0a0f1a;
  color: #fff;
}
.action-btn.active {
  border-color: #0052d9;
  background: #0052d9;
  color: #fff;
}
.action-btn .el-icon { font-size: 13px; }

/* ===== 右侧推荐栏 ===== */
.related-sidebar {
  position: sticky;
  top: 88px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  padding-right: 8px;
  scroll-behavior: smooth;
}

.related-sidebar::-webkit-scrollbar {
  width: 4px;
}
.related-sidebar::-webkit-scrollbar-track {
  background: transparent;
}
.related-sidebar::-webkit-scrollbar-thumb {
  background: #d0e7ff;
  border-radius: 2px;
}
.related-sidebar::-webkit-scrollbar-thumb:hover {
  background: #0052d9;
}

.sidebar-header {
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eef2f6;
}

.sidebar-eyebrow {
  display: block;
  font-size: 11px;
  letter-spacing: 2px;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.sidebar-title {
  font-size: 24px;
  font-weight: 900;
  color: #0a0f1a;
  letter-spacing: -1px;
  margin: 0;
}
.sidebar-title em {
  font-style: italic;
  font-weight: 300;
  color: #0052d9;
}

.sidebar-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sidebar-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.sidebar-card:hover {
  background: #f8fbff;
  border-color: #d0e7ff;
  transform: translateX(4px);
}

.sidebar-card:hover .card-arrow {
  color: #0052d9;
  transform: translateX(2px);
}

.card-num {
  font-size: 11px;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 1px;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  margin-top: 2px;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
}

.card-cat {
  font-size: 9px;
  letter-spacing: 1.5px;
  color: #0052d9;
  font-weight: 700;
  text-transform: uppercase;
}

.card-title {
  font-size: 13px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  line-height: 1.45;
  letter-spacing: -0.2px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  font-size: 11px;
  color: #9ca3af;
  font-weight: 500;
  letter-spacing: 0.5px;
  font-variant-numeric: tabular-nums;
  margin-top: 2px;
}

.card-arrow {
  font-size: 14px;
  color: #d0d5db;
  transition: all 0.3s ease;
  flex-shrink: 0;
  margin-top: 2px;
}

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
  border-bottom: 1px solid #eef2f6;
  position: relative;
}

.comments-eyebrow {
  font-size: 12px;
  letter-spacing: 2px;
  color: #0052d9;
  font-weight: 700;
  text-transform: uppercase;
}

.comments-header .comments-title {
  font-size: clamp(28px, 3.5vw, 40px);
  font-weight: 900;
  color: #0a0f1a;
  letter-spacing: -1px;
  margin: 0;
}

.comments-count {
  position: absolute;
  right: 0;
  bottom: 28px;
  font-size: 13px;
  color: #9ca3af;
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
  background: #f8fbff;
  border: 1px solid #eef2f6;
  border-radius: 16px;
  transition: border-color 0.25s ease;
}

.comment-input-wrap:focus-within {
  border-color: #d0e7ff;
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(0, 82, 217, 0.06);
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
  border: 1px solid #eef2f6;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: #1f2937;
  background: #ffffff;
  resize: vertical;
  min-height: 72px;
  font-family: inherit;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
  box-sizing: border-box;
}

.comment-textarea:focus {
  outline: none;
  border-color: #0052d9;
  box-shadow: 0 0 0 3px rgba(0, 82, 217, 0.08);
}

.comment-textarea::placeholder {
  color: #9ca3af;
}

.comment-submit-btn {
  align-self: flex-end;
  padding: 10px 28px;
  background: linear-gradient(135deg, #0052d9, #1890ff);
  color: #fff;
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
  box-shadow: 0 8px 20px rgba(0, 82, 217, 0.25);
}

.comment-submit-btn:disabled {
  background: #d0e7ff;
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
  background: #ffffff;
  border: 1px solid #eef2f6;
  border-radius: 14px;
  transition: all 0.25s ease;
}

.comment-item:hover {
  border-color: #d0e7ff;
  box-shadow: 0 6px 18px rgba(0, 82, 217, 0.06);
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
  color: #111827;
}

.comment-time {
  font-size: 12px;
  color: #9ca3af;
  letter-spacing: 0.5px;
}

.comment-content {
  font-size: 14px;
  line-height: 1.75;
  color: #4b5563;
  margin: 0 0 12px;
}

.comment-like-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: transparent;
  border: 1px solid #eef2f6;
  border-radius: 20px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.comment-like-btn:hover {
  border-color: #d0e7ff;
  background: #f0f7ff;
  color: #0052d9;
}

.comment-like-btn.liked {
  border-color: #0052d9;
  background: rgba(0, 82, 217, 0.08);
  color: #0052d9;
  font-weight: 600;
}

.comment-like-btn .el-icon {
  font-size: 12px;
}

.comments-empty {
  text-align: center;
  padding: 48px 0;
  color: #9ca3af;
  font-size: 14px;
}

/* ===== 响应式 ===== */
@media (max-width: 992px) {
  .article-grid {
    grid-template-columns: 1fr;
    gap: 64px;
  }
  .related-sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .top-bar,
  .detail-header,
  .article-grid,
  .comments-section {
    padding-left: 20px;
    padding-right: 20px;
  }
  .detail-header { padding-top: 36px; padding-bottom: 32px; }
  .author-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .meta-divider { display: none; }
  .footer-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .comment-input-wrap {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
