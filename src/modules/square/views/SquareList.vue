<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { Plus, ChatLineRound, Share, Star, ArrowRight } from '@element-plus/icons-vue'
import InitialAvatar from '@/components/InitialAvatar.vue'

const router = useRouter()
const { t, tm } = useI18n()

const activeFilter = ref('all')

const moodMap = {
  happy: '😊', excited: '🤩', calm: '😌', sad: '😢', hopeful: '🌟'
}

const feedItems = ref([
  {
    id: 1, type: 'moment', author: '林晓', isAnonymous: false, mood: 'hopeful',
    content: '今天第一次去参加了心理咨询，原本很紧张，但老师特别温柔。聊完之后发现，原来一直压在心头的不是事情本身，而是我不敢面对它的那个瞬间。给自己一个拥抱。',
    photos: [], likes: 48, liked: false, commentCount: 12, createdAt: '2小时前',
    topics: ['心理咨询', '勇气'], isPinned: true
  },
  {
    id: 2, type: 'capsule', author: '匿名同学', isAnonymous: true, mood: 'calm',
    content: '写给半年后的自己：希望那时候的你，已经学会了和焦虑共处，而不是拼命想赶走它。记得多晒太阳，多喝水，别再熬夜了。',
    photos: [], likes: 92, liked: false, commentCount: 23, createdAt: '5小时前',
    topics: ['焦虑', '自我对话'], isHot: true
  },
  {
    id: 3, type: 'moment', author: '陈默', isAnonymous: false, mood: 'happy',
    content: '坚持冥想第 30 天。从一开始坐不住，到现在能安静地观察呼吸二十分钟。最大的改变不是不焦虑了，而是焦虑来的时候，我不再那么害怕它了。',
    photos: ['https://picsum.photos/seed/square-meditation/600/400'], likes: 67, liked: false, commentCount: 15, createdAt: '昨天',
    topics: ['冥想', '坚持']
  },
  {
    id: 4, type: 'moment', author: '周琳', isAnonymous: false, mood: 'sad',
    content: '考研出分了，没上岸。哭了一下午，然后去操场跑了五公里。回来洗完澡，看着镜子里红着眼的自己，突然觉得：没关系，这条路走不通，还有别的路。明天开始重新规划。',
    photos: ['https://picsum.photos/seed/square-run1/500/500', 'https://picsum.photos/seed/square-run2/500/500'], likes: 134, liked: false, commentCount: 38, createdAt: '昨天',
    topics: ['考研', '低谷'], isHot: true
  },
  {
    id: 5, type: 'capsule', author: '李华', isAnonymous: false, mood: 'excited',
    content: '给一年前的自己：那个在车库里熬夜改简历的你，那个被拒了七次还在投的你，谢谢你没有放弃。今天我签下了 dream offer。所有的坚持，都是有意义的。',
    photos: [], likes: 210, liked: false, commentCount: 46, createdAt: '2天前',
    topics: ['求职', '坚持']
  },
  {
    id: 6, type: 'moment', author: '匿名同学', isAnonymous: true, mood: 'calm',
    content: '今天和室友大吵了一架。冷静下来想想，其实我们都没有错，只是都在用自己的方式保护自己。等会儿去买杯奶茶，回去跟她道个歉。',
    photos: [], likes: 56, liked: false, commentCount: 19, createdAt: '2天前',
    topics: ['人际关系']
  },
  {
    id: 7, type: 'moment', author: '苏小北', isAnonymous: false, mood: 'hopeful',
    content: '读完了《被讨厌的勇气》。原来"课题分离"这四个字，可以解开我这么多年的结。别人的评价是别人的课题，我怎么做是我的课题。瞬间轻松了。',
    photos: ['https://picsum.photos/seed/square-book1/400/400', 'https://picsum.photos/seed/square-book2/400/400', 'https://picsum.photos/seed/square-book3/400/400'], likes: 89, liked: false, commentCount: 21, createdAt: '3天前',
    topics: ['读书', '自我成长']
  },
  {
    id: 8, type: 'capsule', author: '匿名同学', isAnonymous: true, mood: 'happy',
    content: '给未来的自己：希望你能记得今天这个瞬间——在图书馆靠窗的位置，阳光刚好落在书页上，心里没有任何烦恼。这是大学生活里最普通也最珍贵的一天。',
    photos: [], likes: 73, liked: false, commentCount: 11, createdAt: '3天前',
    topics: ['日常', '感恩']
  }
])

const activeMembers = ref([
  { name: '林晓' }, { name: '陈默' }, { name: '周琳' }, { name: '李华' }, { name: '苏小北' }, { name: '匿名同学', isAnonymous: true }
])

const trendingTopics = ref([
  { tag: '考研', count: 28 },
  { tag: '焦虑', count: 22 },
  { tag: '冥想', count: 15 },
  { tag: '人际关系', count: 13 },
  { tag: '自我成长', count: 11 },
  { tag: '读书', count: 9 },
  { tag: '坚持', count: 7 },
  { tag: '情绪管理', count: 6 }
])

const onlineCount = ref(23)
const todayNewCount = ref(5)

const guidelines = computed(() => tm('square.list.community.sidebar.guidelinesItems'))

const filteredItems = computed(() => {
  if (activeFilter.value === 'all') return feedItems.value
  return feedItems.value.filter(item => item.type === activeFilter.value)
})

const counts = computed(() => ({
  all: feedItems.value.length,
  moment: feedItems.value.filter(i => i.type === 'moment').length,
  capsule: feedItems.value.filter(i => i.type === 'capsule').length
}))

const stats = computed(() => {
  const totalLikes = feedItems.value.reduce((sum, i) => sum + i.likes, 0)
  const totalComments = feedItems.value.reduce((sum, i) => sum + i.commentCount, 0)
  return {
    moments: counts.value.moment,
    capsules: counts.value.capsule,
    interactions: totalLikes + totalComments
  }
})

const filters = computed(() => [
  { key: 'all', label: t('square.list.filter.all'), count: counts.value.all },
  { key: 'moment', label: t('square.list.filter.moment'), count: counts.value.moment },
  { key: 'capsule', label: t('square.list.filter.capsule'), count: counts.value.capsule }
])

const toggleLike = (item) => {
  item.liked = !item.liked
  item.likes += item.liked ? 1 : -1
}

const openDetail = (id) => {
  router.push(`/square/${id}`)
}

const goCreate = () => {
  router.push('/square/create')
}

const handleShare = (item) => {
  ElMessage.success(t('square.list.share') + ' · ' + (item.isAnonymous ? t('square.list.anonymous') : item.author))
}

const filterByTopic = (tag) => {
  ElMessage.info('#' + tag)
}
</script>

<template>
  <div class="square-page">
    <!-- 编辑式标题区 -->
    <header class="page-header">
      <div class="header-inner">
        <div class="header-left">
          <span class="header-eyebrow">{{ $t('square.list.eyebrow') }}</span>
          <h1 class="header-title" v-html="$t('square.list.title')"></h1>
          <p class="header-desc">{{ $t('square.list.desc') }}</p>
        </div>
        <div class="header-right">
          <div class="stat-block">
            <span class="stat-num">{{ onlineCount }}</span>
            <span class="stat-label">{{ $t('square.list.community.online') }}</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-block">
            <span class="stat-num">{{ todayNewCount }}</span>
            <span class="stat-label">{{ $t('square.list.community.todayNew') }}</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-block">
            <span class="stat-num">{{ stats.interactions }}</span>
            <span class="stat-label">{{ $t('square.list.stats.interactions') }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 今日话题 -->
    <section class="daily-prompt-section">
      <div class="daily-prompt-card">
        <div class="prompt-left">
          <span class="prompt-label">{{ $t('square.list.community.dailyPrompt.label') }}</span>
          <p class="prompt-question">{{ $t('square.list.community.dailyPrompt.question') }}</p>
          <button class="prompt-join" @click="goCreate">
            <span>{{ $t('square.list.community.dailyPrompt.join') }}</span>
            <el-icon><ArrowRight /></el-icon>
          </button>
        </div>
        <div class="prompt-deco">“</div>
      </div>
    </section>

    <!-- 主体：双栏 -->
    <div class="community-body">
      <!-- 左栏：Feed -->
      <main class="feed-column">
        <!-- 筛选栏 -->
        <div class="filter-bar">
          <button
            v-for="f in filters"
            :key="f.key"
            class="filter-tab"
            :class="{ active: activeFilter === f.key }"
            @click="activeFilter = f.key"
          >
            <span class="tab-label">{{ f.label }}</span>
            <span class="tab-count">({{ f.count }})</span>
          </button>
        </div>

        <!-- Feed 列表 -->
        <div v-if="filteredItems.length > 0" class="feed-list">
          <article
            v-for="(item, i) in filteredItems"
            :key="item.id"
            class="feed-card"
            :class="{ 'is-capsule': item.type === 'capsule', 'is-pinned': item.isPinned }"
            v-reveal="i * 60"
            @click="openDetail(item.id)"
          >
            <!-- 置顶/热议标记 -->
            <div class="card-mark" v-if="item.isPinned || item.isHot">
              <span class="mark-badge" :class="{ pinned: item.isPinned, hot: item.isHot }">
                {{ item.isPinned ? $t('square.list.pinned') : $t('square.list.hot') }}
              </span>
            </div>

            <!-- 卡片头部 -->
            <div class="card-head">
              <InitialAvatar :name="item.author" :size="44" :is-anonymous="item.isAnonymous" />
              <div class="head-meta">
                <span class="head-author">{{ item.isAnonymous ? $t('square.list.anonymous') : item.author }}</span>
                <span class="head-time">{{ item.createdAt }}</span>
              </div>
              <span class="type-badge" :class="item.type">
                {{ item.type === 'capsule' ? $t('square.list.capsuleBadge') : $t('square.list.momentBadge') }}
              </span>
            </div>

            <!-- 心情 + 内容 -->
            <div class="card-body">
              <div class="mood-line" v-if="item.mood">
                <span class="mood-emoji">{{ moodMap[item.mood] }}</span>
              </div>
              <p class="card-content">{{ item.content }}</p>
            </div>

            <!-- 图片网格 -->
            <div v-if="item.photos && item.photos.length" class="card-photo-grid" :class="'photo-count-' + Math.min(item.photos.length, 4)">
              <img v-for="(photo, pi) in item.photos.slice(0, 4)" :key="pi" :src="photo" class="card-photo" loading="lazy" />
              <span v-if="item.photos.length > 4" class="photo-more">+{{ item.photos.length - 4 }}</span>
            </div>

            <!-- 话题标签 -->
            <div class="card-topics" v-if="item.topics && item.topics.length">
              <span
                v-for="topic in item.topics"
                :key="topic"
                class="topic-tag"
                @click.stop="filterByTopic(topic)"
              >#{{ topic }}</span>
            </div>

            <!-- 互动栏 -->
            <div class="card-foot">
              <button
                class="interact-btn"
                :class="{ liked: item.liked }"
                @click.stop="toggleLike(item)"
              >
                <el-icon><Star /></el-icon>
                <span>{{ item.likes }}</span>
              </button>
              <button class="interact-btn" @click.stop="openDetail(item.id)">
                <el-icon><ChatLineRound /></el-icon>
                <span>{{ item.commentCount }}</span>
              </button>
              <button class="interact-btn" @click.stop="handleShare(item)">
                <el-icon><Share /></el-icon>
                <span>{{ $t('square.list.share') }}</span>
              </button>
            </div>
          </article>
        </div>

        <!-- 空状态 -->
        <div v-else class="empty-state">
          <h3 class="empty-title">{{ $t('square.list.empty.title') }}</h3>
          <p class="empty-hint">{{ $t('square.list.empty.hint') }}</p>
          <button class="empty-btn" @click="goCreate">{{ $t('square.list.empty.btn') }}</button>
        </div>
      </main>

      <!-- 右栏：社区侧边栏 -->
      <aside class="sidebar-column">
        <!-- 活跃同学 -->
        <div class="sidebar-card">
          <div class="sidebar-head">
            <h4 class="sidebar-title">{{ $t('square.list.community.sidebar.activeMembers') }}</h4>
            <span class="online-dot">{{ onlineCount }} {{ $t('square.list.community.online') }}</span>
          </div>
          <div class="members-row">
            <div
              v-for="(member, i) in activeMembers"
              :key="i"
              class="member-avatar"
              :style="{ zIndex: activeMembers.length - i, marginLeft: i === 0 ? '0' : '-10px' }"
            >
              <InitialAvatar :name="member.name" :size="36" :is-anonymous="member.isAnonymous" />
            </div>
            <span class="members-more">+{{ onlineCount - activeMembers.length }}</span>
          </div>
        </div>

        <!-- 热门话题 -->
        <div class="sidebar-card">
          <div class="sidebar-head">
            <h4 class="sidebar-title">{{ $t('square.list.community.sidebar.trending') }}</h4>
          </div>
          <div class="topic-cloud">
            <button
              v-for="topic in trendingTopics"
              :key="topic.tag"
              class="cloud-tag"
              @click="filterByTopic(topic.tag)"
            >
              <span class="cloud-hash">#</span>{{ topic.tag }}
              <span class="cloud-count">{{ topic.count }}</span>
            </button>
          </div>
        </div>

        <!-- 社区公约 -->
        <div class="sidebar-card guidelines-card">
          <div class="sidebar-head">
            <h4 class="sidebar-title">{{ $t('square.list.community.sidebar.guidelines') }}</h4>
          </div>
          <ol class="guidelines-list">
            <li v-for="(rule, i) in guidelines" :key="i" class="guideline-item">
              <span class="rule-num">{{ String(i + 1).padStart(2, '0') }}</span>
              <span class="rule-text">{{ rule }}</span>
            </li>
          </ol>
        </div>
      </aside>
    </div>

    <!-- FAB 发布按钮 -->
    <button class="fab-btn" @click="goCreate" :aria-label="$t('square.list.fab')">
      <el-icon><Plus /></el-icon>
      <span class="fab-text">{{ $t('square.list.fab') }}</span>
    </button>
  </div>
</template>

<style scoped>
.square-page {
  min-height: 100vh;
  background: #f8fbff;
  padding-top: 28px;
  padding-bottom: 120px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif;
  color: #111827;
  position: relative;
  overflow-x: hidden;
}

.square-page::before {
  content: 'SQUARE';
  position: absolute;
  top: 60px;
  right: -40px;
  font-size: clamp(140px, 22vw, 280px);
  font-weight: 900;
  color: #0052d9;
  opacity: 0.04;
  letter-spacing: -8px;
  line-height: 0.8;
  pointer-events: none;
  user-select: none;
  z-index: 0;
}

/* ===== 标题区 ===== */
.page-header {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 56px 36px;
  position: relative;
  z-index: 1;
}

.header-inner {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 48px;
  padding-bottom: 32px;
  border-bottom: 1px solid #eef2f6;
}

.header-left {
  flex: 1;
  min-width: 0;
}

.header-eyebrow {
  display: block;
  font-size: 12px;
  letter-spacing: 3px;
  color: #9ca3af;
  font-weight: 600;
  margin-bottom: 14px;
  text-transform: uppercase;
}

.header-title {
  font-size: clamp(40px, 6vw, 68px);
  font-weight: 900;
  color: #111827;
  margin: 0 0 14px;
  letter-spacing: -2px;
  line-height: 1.02;
}

.header-title em {
  font-style: italic;
  font-weight: 300;
  color: #0052d9;
  opacity: 0.85;
}

.header-desc {
  font-size: 15px;
  color: #6b7280;
  margin: 0;
  letter-spacing: 0.3px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
}

.stat-block {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.stat-num {
  font-size: 30px;
  font-weight: 900;
  color: #0052d9;
  letter-spacing: -1px;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 11px;
  color: #9ca3af;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-weight: 600;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: #eef2f6;
}

/* ===== 今日话题 ===== */
.daily-prompt-section {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 56px;
  position: relative;
  z-index: 1;
}

.daily-prompt-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 28px 36px;
  background: linear-gradient(120deg, #0052d9 0%, #1890ff 100%);
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}

.prompt-left {
  flex: 1;
  min-width: 0;
}

.prompt-label {
  display: inline-block;
  font-size: 10px;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 10px;
  padding: 3px 10px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}

.prompt-question {
  font-size: clamp(18px, 2vw, 24px);
  font-weight: 700;
  color: #fff;
  margin: 0 0 14px;
  line-height: 1.4;
  letter-spacing: -0.3px;
}

.prompt-join {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: inherit;
  backdrop-filter: blur(4px);
}

.prompt-join:hover {
  background: rgba(255, 255, 255, 0.28);
  transform: translateX(4px);
}

.prompt-join .el-icon {
  font-size: 12px;
}

.prompt-deco {
  font-size: 120px;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.12);
  line-height: 0.7;
  font-family: Georgia, serif;
  flex-shrink: 0;
}

/* ===== 主体双栏 ===== */
.community-body {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 56px 0;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 40px;
  position: relative;
  z-index: 1;
}

/* ===== Feed 列表 ===== */
.filter-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.filter-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: transparent;
  border: 1px solid #eef2f6;
  border-radius: 24px;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: inherit;
  letter-spacing: 0.3px;
}

.filter-tab:hover {
  border-color: #d0e7ff;
  background: #f0f7ff;
  color: #0052d9;
}

.filter-tab.active {
  background: #0052d9;
  border-color: #0052d9;
  color: #fff;
  box-shadow: 0 4px 14px rgba(0, 82, 217, 0.2);
}

.tab-count {
  font-size: 12px;
  opacity: 0.7;
  font-variant-numeric: tabular-nums;
}

.feed-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feed-card {
  background: #ffffff;
  border: 1px solid #eef2f6;
  border-radius: 20px;
  padding: 28px 32px;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.feed-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #d0e7ff, #f0f7ff);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feed-card:hover {
  border-color: #e5e7eb;
  transform: translateY(-6px) rotate(-0.3deg);
  box-shadow: 0 18px 40px rgba(0, 82, 217, 0.12);
}

.feed-card:hover::before {
  opacity: 1;
}

.feed-card.is-capsule {
  background: linear-gradient(135deg, #f0f7ff 0%, #ffffff 60%);
  border-color: #d0e7ff;
}

.feed-card.is-capsule::before {
  background: linear-gradient(90deg, #e0e7ff, #f0f7ff);
  opacity: 0;
}

.feed-card.is-pinned {
  border-color: #e5e7eb;
}

/* 图片网格 */
.card-photo-grid {
  display: grid;
  gap: 6px;
  margin: 14px 0 4px;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}
.photo-count-1 { grid-template-columns: 1fr; }
.photo-count-1 .card-photo { height: 280px; }
.photo-count-2 { grid-template-columns: 1fr 1fr; }
.photo-count-2 .card-photo { height: 180px; }
.photo-count-3 { grid-template-columns: 1fr 1fr 1fr; }
.photo-count-3 .card-photo { height: 140px; }
.photo-count-4 { grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; }
.photo-count-4 .card-photo { height: 120px; }
.card-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  cursor: pointer;
  transition: transform 0.4s ease;
}
.card-photo:hover { transform: scale(1.03); }
.photo-more {
  position: absolute;
  right: 8px;
  bottom: 8px;
  background: rgba(17, 24, 39, 0.7);
  color: #fff;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 12px;
}

/* 置顶/热议标记 */
.card-mark {
  position: absolute;
  top: 16px;
  right: 16px;
}

.mark-badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 5px;
}

.mark-badge.pinned {
  background: #0052d9;
  color: #fff;
}

.mark-badge.hot {
  background: #fef2f2;
  color: #ef4444;
  border: 1px solid #fecaca;
}

/* 卡片头部 */
.card-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
  padding-right: 60px;
}

.head-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.head-author {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  letter-spacing: 0.2px;
}

.head-time {
  font-size: 12px;
  color: #9ca3af;
  letter-spacing: 0.3px;
}

.type-badge {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 5px 10px;
  border-radius: 6px;
  flex-shrink: 0;
}

.type-badge.moment {
  background: #f0f7ff;
  color: #0052d9;
}

.type-badge.capsule {
  background: linear-gradient(135deg, #0052d9, #1890ff);
  color: #fff;
}

/* 卡片正文 */
.card-body {
  margin-bottom: 16px;
}

.mood-line {
  margin-bottom: 12px;
}

.mood-emoji {
  font-size: 28px;
  line-height: 1;
}

.card-content {
  font-size: 15px;
  line-height: 1.8;
  color: #1f2937;
  margin: 0;
  letter-spacing: 0.1px;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 话题标签 */
.card-topics {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.topic-tag {
  font-size: 12px;
  color: #0052d9;
  background: #f0f7ff;
  padding: 4px 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  letter-spacing: 0.2px;
}

.topic-tag:hover {
  background: #0052d9;
  color: #fff;
}

/* 互动栏 */
.card-foot {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.interact-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 20px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  font-weight: 500;
}

.interact-btn:hover {
  background: #f0f7ff;
  border-color: #d0e7ff;
  color: #0052d9;
}

.interact-btn.liked {
  color: #0052d9;
  background: #f0f7ff;
  border-color: #d0e7ff;
}

.interact-btn .el-icon {
  font-size: 15px;
}

/* ===== 空状态 ===== */
.empty-state {
  text-align: center;
  padding: 80px 0 40px;
}

.empty-title {
  font-size: 24px;
  font-weight: 800;
  color: #111827;
  margin: 0 0 10px;
  letter-spacing: -0.5px;
}

.empty-hint {
  font-size: 14px;
  color: #9ca3af;
  margin: 0 0 28px;
}

.empty-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  background: #0052d9;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  box-shadow: 0 6px 18px rgba(0, 82, 217, 0.22);
}

.empty-btn:hover {
  background: #0040b0;
  transform: translateY(-2px);
  box-shadow: 0 10px 26px rgba(0, 82, 217, 0.3);
}

/* ===== 侧边栏 ===== */
.sidebar-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 88px;
  align-self: start;
}

.sidebar-card {
  background: #f8fbff;
  border: 1px solid #eef2f6;
  border-radius: 16px;
  padding: 22px 24px;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.sidebar-card:hover {
  border-color: #d0e7ff;
  box-shadow: 0 6px 18px rgba(0, 82, 217, 0.06);
}

.sidebar-card.guidelines-card {
  background: rgba(0, 82, 217, 0.04);
  border-color: #d0e7ff;
}

.sidebar-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.sidebar-title {
  font-size: 13px;
  font-weight: 800;
  color: #111827;
  margin: 0;
  letter-spacing: 0.5px;
}

.online-dot {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #10b981;
  font-weight: 600;
}

.online-dot::before {
  content: '';
  width: 6px;
  height: 6px;
  background: #10b981;
  border-radius: 50%;
  display: inline-block;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

/* 活跃同学 */
.members-row {
  display: flex;
  align-items: center;
}

.member-avatar {
  border-radius: 50%;
  border: 2px solid #fff;
  transition: transform 0.2s ease;
}

.member-avatar:hover {
  transform: translateY(-3px);
  z-index: 10 !important;
}

.members-more {
  margin-left: 12px;
  font-size: 12px;
  color: #9ca3af;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

/* 热门话题 */
.topic-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cloud-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: #f8fbff;
  border: 1px solid #eef2f6;
  border-radius: 16px;
  font-size: 12px;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  font-weight: 500;
}

.cloud-tag:hover {
  background: #f0f7ff;
  border-color: #d0e7ff;
  color: #0052d9;
  transform: translateY(-2px);
}

.cloud-hash {
  color: #9ca3af;
  font-weight: 700;
}

.cloud-tag:hover .cloud-hash {
  color: #0052d9;
}

.cloud-count {
  font-size: 10px;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
  margin-left: 2px;
}

/* 社区公约 */
.guidelines-card {
  background: linear-gradient(160deg, #f8fbff 0%, #ffffff 100%);
}

.guidelines-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.guideline-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.rule-num {
  font-size: 11px;
  font-weight: 800;
  color: #0052d9;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  margin-top: 1px;
  letter-spacing: 0.5px;
}

.rule-text {
  font-size: 13px;
  color: #4b5563;
  line-height: 1.5;
}

/* ===== FAB ===== */
.fab-btn {
  position: fixed;
  right: 48px;
  bottom: 48px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 28px;
  background: linear-gradient(135deg, #0052d9, #1890ff);
  color: #fff;
  border: none;
  border-radius: 32px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer;
  z-index: 50;
  transition: all 0.3s ease;
  font-family: inherit;
  box-shadow: 0 8px 24px rgba(0, 82, 217, 0.3);
  animation: fab-pulse 2.4s ease-out infinite;
}

@keyframes fab-pulse {
  0% { box-shadow: 0 8px 24px rgba(0, 82, 217, 0.3), 0 0 0 0 rgba(0, 82, 217, 0.4); }
  100% { box-shadow: 0 8px 24px rgba(0, 82, 217, 0.3), 0 0 0 20px rgba(0, 82, 217, 0); }
}

.fab-btn:hover {
  background: linear-gradient(135deg, #0040b0, #0077e6);
  transform: translateY(-3px);
  box-shadow: 0 14px 32px rgba(0, 82, 217, 0.4);
  animation: none;
}

.fab-btn .el-icon {
  font-size: 18px;
}

/* ===== 响应式 ===== */
@media (max-width: 1100px) {
  .community-body {
    grid-template-columns: 1fr;
  }
  .sidebar-column {
    position: static;
    order: 2;
  }
  .feed-column {
    order: 1;
  }
}

@media (max-width: 992px) {
  .page-header,
  .daily-prompt-section,
  .community-body {
    padding-left: 32px;
    padding-right: 32px;
  }
  .header-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 28px;
  }
  .header-right {
    gap: 20px;
  }
  .stat-num {
    font-size: 26px;
  }
  .prompt-deco {
    display: none;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 24px 20px 24px;
  }
  .daily-prompt-section {
    padding: 0 20px;
  }
  .community-body {
    padding: 24px 20px 0;
  }
  .daily-prompt-card {
    padding: 20px 22px;
    border-radius: 16px;
  }
  .header-title {
    font-size: 36px;
    letter-spacing: -1px;
  }
  .feed-card {
    padding: 20px 18px;
    border-radius: 16px;
  }
  .fab-btn {
    right: 20px;
    bottom: 24px;
    padding: 14px 22px;
  }
  .fab-text {
    display: none;
  }
  .interact-btn {
    padding: 6px 10px;
    font-size: 12px;
  }
  .card-head {
    padding-right: 0;
  }
  .card-mark {
    position: static;
    margin-bottom: 10px;
  }
}
</style>
