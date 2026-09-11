<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Star, Share } from '@element-plus/icons-vue'
import BaseInitialAvatar from '@/components/base/BaseInitialAvatar.vue'

interface PostItem {
  id: number
  type: string
  author: string
  isAnonymous: boolean
  mood: string
  content: string
  photos: string[]
  likes: number
  liked: boolean
  createdAt: string
}

interface CommentItem {
  id: number
  author: string
  content: string
  time: string
  likes: number
  liked: boolean
  isAnonymous?: boolean
}

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const moodMap: Record<string, string> = {
  happy: '😊', excited: '🤩', calm: '😌', sad: '😢', hopeful: '🌟'
}

const mockPosts: Record<number, PostItem> = {
  1: { id: 1, type: 'moment', author: '林晓', isAnonymous: false, mood: 'hopeful', content: '今天第一次去参加了心理咨询，原本很紧张，但老师特别温柔。聊完之后发现，原来一直压在心头的不是事情本身，而是我不敢面对它的那个瞬间。给自己一个拥抱。', photos: [], likes: 48, liked: false, createdAt: '2小时前' },
  2: { id: 2, type: 'capsule', author: '匿名同学', isAnonymous: true, mood: 'calm', content: '写给半年后的自己：希望那时候的你，已经学会了和焦虑共处，而不是拼命想赶走它。记得多晒太阳，多喝水，别再熬夜了。', photos: [], likes: 92, liked: false, createdAt: '5小时前' },
  3: { id: 3, type: 'moment', author: '陈默', isAnonymous: false, mood: 'happy', content: '坚持冥想第 30 天。从一开始坐不住，到现在能安静地观察呼吸二十分钟。最大的改变不是不焦虑了，而是焦虑来的时候，我不再那么害怕它了。', photos: [], likes: 67, liked: false, createdAt: '昨天' },
  4: { id: 4, type: 'moment', author: '周琳', isAnonymous: false, mood: 'sad', content: '考研出分了，没上岸。哭了一下午，然后去操场跑了五公里。回来洗完澡，看着镜子里红着眼的自己，突然觉得：没关系，这条路走不通，还有别的路。明天开始重新规划。', photos: [], likes: 134, liked: false, createdAt: '昨天' },
  5: { id: 5, type: 'capsule', author: '李华', isAnonymous: false, mood: 'excited', content: '给一年前的自己：那个在车库里熬夜改简历的你，那个被拒了七次还在投的你，谢谢你没有放弃。今天我签下了 dream offer。所有的坚持，都是有意义的。', photos: [], likes: 210, liked: false, createdAt: '2天前' }
}

const post = ref<PostItem | null>(null)
const commentText = ref('')
const comments = ref<CommentItem[]>([])

const loadPost = (id: string | string[]) => {
  const data = mockPosts[Number(id)]
  if (!data) {
    router.replace({ name: 'square' })
    return
  }
  post.value = data
  comments.value = [
    { id: 1, author: '陈默', content: '读完很受触动，谢谢你的分享。跑步那个细节特别有力量。', time: '1小时前', likes: 8, liked: false },
    { id: 2, author: '匿名同学', content: '我也是今年考研失利，看到这段话像被理解了一样。', time: '40分钟前', likes: 15, liked: false, isAnonymous: true },
    { id: 3, author: '苏小北', content: '重新规划需要勇气，加油！', time: '20分钟前', likes: 4, liked: false }
  ]
  window.scrollTo({ top: 0, behavior: 'instant' })
}

onMounted(() => loadPost(route.params.id))
watch(() => route.params.id, (id) => { if (id) loadPost(id) })

const toggleLike = () => {
  if (!post.value) return
  post.value.liked = !post.value.liked
  post.value.likes += post.value.liked ? 1 : -1
}

const handleShare = () => {
  if (!post.value) return
  ElMessage.success(t('square.detail.share') + ' · ' + (post.value.isAnonymous ? t('square.detail.anonymous') : post.value.author))
}

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
  <div v-if="post" class="square-detail-page">
    <!-- 顶部返回栏 -->
    <div class="top-bar">
      <button class="back-btn" @click="router.push('/square')">
        <el-icon><ArrowLeft /></el-icon>
        <span>{{ $t('square.detail.back') }}</span>
      </button>
      <span class="top-mark">
        <span class="type-mark" :class="post.type">{{ post.type === 'capsule' ? $t('square.list.capsuleBadge') : $t('square.list.momentBadge') }}</span>
        <span class="id-mark">No.{{ String(post.id).padStart(2, '0') }}</span>
      </span>
    </div>

    <!-- 标题区 -->
    <header class="detail-header">
      <div class="header-eyebrow">
        <span v-if="post.mood" class="eyebrow-mood">{{ moodMap[post.mood] }}</span>
        <span class="eyebrow-date">{{ $t('square.detail.createdAt', { date: post.createdAt }) }}</span>
      </div>
      <h1 class="detail-title" v-html="$t('square.detail.title')"></h1>

      <!-- 作者行 -->
      <div class="author-row">
        <div class="author-block">
          <BaseInitialAvatar :name="post.author" :size="44" :is-anonymous="post.isAnonymous" class="author-avatar" />
          <div class="author-info">
            <span class="author-name">{{ post.isAnonymous ? $t('square.detail.anonymous') : post.author }}</span>
            <span class="author-title">{{ post.type === 'capsule' ? $t('square.list.capsuleBadge') : $t('square.list.momentBadge') }}</span>
          </div>
        </div>
      </div>
    </header>

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
          <button class="action-btn" :class="{ active: post.liked }" @click="toggleLike">
            <el-icon><Star /></el-icon>
            <span>{{ post.likes }}</span>
          </button>
          <button class="action-btn" @click="handleShare">
            <el-icon><Share /></el-icon>
            <span>{{ $t('square.detail.share') }}</span>
          </button>
        </div>
      </div>
    </footer>

    <!-- 评论区 -->
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
  </div>
</template>

<style scoped>
.square-detail-page {
  min-height: 100vh;
  background: #f8fbff;
  padding-top: 28px;
  padding-bottom: 80px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif;
  color: #111827;
  position: relative;
  overflow-x: hidden;
}

.square-detail-page::before {
  content: 'SQUARE';
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: clamp(200px, 30vw, 400px);
  font-weight: 900;
  color: #0052d9;
  opacity: 0.03;
  letter-spacing: -12px;
  line-height: 0.8;
  pointer-events: none;
  user-select: none;
  z-index: 0;
  font-family: Georgia, 'Times New Roman', serif;
}

/* ===== 顶部返回栏 ===== */
.top-bar {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 40px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
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
  font-family: inherit;
}

.back-btn:hover {
  color: #0052d9;
  transform: translateX(-4px);
}

.back-btn .el-icon { font-size: 14px; }

.top-mark {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  letter-spacing: 2px;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  font-variant-numeric: tabular-nums;
}

.type-mark {
  padding: 3px 8px;
  border-radius: 5px;
  font-size: 10px;
}

.type-mark.moment {
  background: #f0f7ff;
  color: #0052d9;
}

.type-mark.capsule {
  background: linear-gradient(135deg, #0052d9, #1890ff);
  color: #fff;
}

/* ===== 标题区 ===== */
.detail-header {
  max-width: 860px;
  margin: 0 auto;
  padding: 56px 40px 40px;
  position: relative;
  z-index: 1;
}

.header-eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  letter-spacing: 2px;
  color: #0052d9;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 24px;
}

.eyebrow-mood {
  font-size: 24px;
  line-height: 1;
}

.eyebrow-date {
  color: #6b7280;
  font-weight: 500;
}

.detail-title {
  font-size: clamp(32px, 4.5vw, 52px);
  font-weight: 900;
  color: #0a0f1a;
  line-height: 1.08;
  letter-spacing: -1.5px;
  margin: 0 0 32px;
}

.detail-title em {
  font-style: italic;
  font-weight: 300;
  color: #0052d9;
}

/* 作者行 */
.author-row {
  display: flex;
  align-items: center;
  gap: 24px;
  padding-top: 24px;
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
  color: #0052d9;
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
  border-color: #0052d9;
  background: #0052d9;
  color: #fff;
  box-shadow: 0 6px 16px rgba(0, 82, 217, 0.2);
  transform: translateY(-2px);
}

.action-btn.active {
  border-color: #0052d9;
  background: #0052d9;
  color: #fff;
}

.action-btn .el-icon { font-size: 13px; }

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
  border-bottom: 1px solid #eef2f6;
}

.comments-title {
  font-size: clamp(26px, 3vw, 36px);
  font-weight: 900;
  color: #0a0f1a;
  letter-spacing: -1px;
  margin: 0;
}

.comments-count {
  font-size: 13px;
  color: #9ca3af;
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
  border: 1px solid #eef2f6;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: #1f2937;
  background: #f8fbff;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  transition: border-color 0.25s ease, background 0.25s ease;
  box-sizing: border-box;
  outline: none;
}

.comment-textarea:focus {
  border-color: #0052d9;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(0, 82, 217, 0.08);
}

.comment-textarea::placeholder {
  color: #9ca3af;
}

.comment-submit-btn {
  align-self: flex-end;
  padding: 10px 24px;
  background: #0052d9;
  color: #fff;
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
  background: #0040b0;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 82, 217, 0.2);
}

.comment-submit-btn:disabled {
  background: #d0e7ff;
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
  color: #111827;
}

.comment-time {
  font-size: 12px;
  color: #9ca3af;
  letter-spacing: 0.5px;
}

.comment-content {
  font-size: 14px;
  line-height: 1.7;
  color: #4b5563;
  margin: 0 0 10px;
}

.comment-like-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
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
  background: #f0f7ff;
  color: #0052d9;
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
@media (max-width: 768px) {
  .top-bar,
  .detail-header,
  .rich-content,
  .detail-footer,
  .comments-section {
    padding-left: 20px;
    padding-right: 20px;
  }
  .detail-header { padding-top: 36px; padding-bottom: 28px; }
  .footer-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  .comment-input-wrap {
    flex-direction: column;
    gap: 10px;
  }
  .photo-grid {
    grid-template-columns: 1fr;
  }
}
</style>
