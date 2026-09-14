<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import SquareDetailTopBar from '../components/SquareDetailTopBar.vue'
import SquareDetailHeader from '../components/SquareDetailHeader.vue'
import SquareDetailBody from '../components/SquareDetailBody.vue'
import SquareDetailComments from '../components/SquareDetailComments.vue'
import { mockPosts } from '../components/data'
import type { PostItem } from '../components/types'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const post = ref<PostItem | null>(null)

const loadPost = (id: string | string[]) => {
  const data = mockPosts[Number(id)]
  if (!data) {
    router.replace({ name: 'square' })
    return
  }
  post.value = data
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
</script>

<template>
  <div v-if="post" class="square-detail-page">
    <!-- 顶部返回栏 -->
    <SquareDetailTopBar :id="post.id" :type="post.type" @back="router.push('/square')" />

    <!-- 标题区 -->
    <SquareDetailHeader :post="post" />

    <!-- 正文 + 互动栏 -->
    <SquareDetailBody :post="post" @like="toggleLike" @share="handleShare" />

    <!-- 评论区（切文时按 key 重建以重置状态） -->
    <SquareDetailComments :key="post.id" />
  </div>
</template>

<style scoped>
.square-detail-page {
  min-height: 100vh;
  background: var(--brand-primary-wash);
  padding-top: 28px;
  padding-bottom: 80px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif;
  color: var(--ink-900);
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
  color: var(--brand-primary);
  opacity: 0.03;
  letter-spacing: -12px;
  line-height: 0.8;
  pointer-events: none;
  user-select: none;
  z-index: 0;
  font-family: Georgia, 'Times New Roman', serif;
}
</style>
