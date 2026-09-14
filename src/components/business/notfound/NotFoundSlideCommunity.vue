<template>
  <section class="nf-slide nf-slide-community">
    <div class="nf-slide-inner nf-community-inner">
      <div class="nf-community-head">
        <span class="nf-section-label reveal-anim" data-anim="0">{{ t('notFound.community.label') }}</span>
        <h2 class="nf-community-title reveal-anim" data-anim="1">{{ t('notFound.community.title') }}</h2>
        <p class="nf-community-sub reveal-anim" data-anim="2">{{ t('notFound.community.subtitle', { n: '3,247' }) }}</p>
      </div>

      <div class="nf-notes-list">
        <article
          v-for="(note, i) in visibleNotes"
          :key="note.id"
          class="nf-note reveal-anim"
          :class="{ 'nf-note-featured': note.featured }"
          :data-anim="i % 3"
        >
          <span v-if="note.featured" class="nf-note-tag">{{ t('notFound.community.featured') }}</span>
          <p class="nf-note-text">{{ note.content }}</p>
          <div class="nf-note-meta">
            <span class="nf-note-author-line">— {{ note.user }}</span>
            <span class="nf-note-time">{{ note.time }}</span>
            <button
              class="nf-note-action"
              :class="{ liked: note.liked }"
              @click="toggleLike(note)"
            >
              <span class="nf-heart">{{ note.liked ? '♥' : '♡' }}</span>
              <span class="nf-like-count">{{ note.likes }}</span>
            </button>
          </div>
        </article>
      </div>

      <div class="nf-write reveal-anim" data-anim="0">
        <textarea
          v-model="writeText"
          class="nf-write-input"
          :placeholder="t('notFound.community.writePlaceholder')"
          rows="1"
          @keydown="handleWriteKey"
        ></textarea>
        <button class="nf-write-submit" :disabled="!writeText.trim()" @click="submitNote">
          <span>{{ t('notFound.community.writeLabel') }}</span>
          <span class="nf-write-arrow">→</span>
        </button>
      </div>

      <div class="nf-footline">
        <span class="nf-footline-slogan">{{ t('notFound.footer.slogan') }}</span>
        <span class="nf-footline-copy">{{ t('notFound.footer.copyright') }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface NoteItem {
  id: number
  user: string
  time: string
  content: string
  likes: number
  liked: boolean
  featured: boolean
}

const { t } = useI18n()

/* ---------- 社区笔记数据 ---------- */
let noteIdCounter = 100
const notes = reactive<NoteItem[]>([
  {
    id: 1,
    user: '林同学',
    time: '2 小时前',
    content: '在这里迷路的第三天，我开始享受这种没有目的的游荡。以前总想着要赶快找到方向，现在才明白，方向不是找出来的，是走出来的。',
    likes: 42,
    liked: false,
    featured: true
  },
  {
    id: 2,
    user: '小溪',
    time: '3 小时前',
    content: '今晚的月亮很亮，突然觉得迷路也没那么可怕。',
    likes: 18,
    liked: false,
    featured: false
  },
  {
    id: 3,
    user: '阿明',
    time: '5 小时前',
    content: '考研失败后一直很迷茫，在这里找到了共鸣。',
    likes: 27,
    liked: false,
    featured: false
  }
])

const visibleNotes = computed(() => notes.slice(0, 3))

function toggleLike(note: NoteItem) {
  note.liked = !note.liked
  note.likes += note.liked ? 1 : -1
}

/* ---------- 输入区 ---------- */
const writeText = ref('')
function handleWriteKey(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    submitNote()
  }
}
function submitNote() {
  const text = writeText.value.trim()
  if (!text) return
  notes.unshift({
    id: ++noteIdCounter,
    user: '你',
    time: '刚刚',
    content: text,
    likes: 0,
    liked: false,
    featured: false
  })
  writeText.value = ''
}
</script>

<style scoped>
/* ========== Slide 3：社区笔记（杂志专栏 · 无卡片） ========== */
.nf-slide-community {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.nf-community-inner {
  justify-content: flex-start;
  padding-top: 20px;
}

.nf-community-head {
  text-align: center;
  margin-bottom: 28px;
}

.nf-community-head .nf-section-label {
  display: block;
  margin-bottom: 10px;
}

.nf-section-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--brand-primary);
  white-space: nowrap;
  font-weight: 500;
}

.nf-community-title {
  font-family: var(--font-serif);
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 400;
  color: var(--text-primary);
  margin: 0 0 8px;
  letter-spacing: 2px;
}

.nf-community-sub {
  font-size: 12px;
  font-weight: 300;
  color: var(--text-secondary);
  margin: 0;
  letter-spacing: 1px;
}

/* 杂志风笔记列表：细线分隔，无卡片 */
.nf-notes-list {
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
}

.nf-note {
  padding: 22px 0;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nf-note:last-child {
  border-bottom: 1px solid var(--border);
}

.nf-note-tag {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: var(--brand-primary);
  font-weight: 500;
  align-self: flex-start;
}

.nf-note-text {
  font-family: var(--font-serif);
  font-size: 15px;
  line-height: 1.85;
  margin: 0;
  color: var(--text-primary);
}

/* 精选笔记：大号衬线引言，无背景 */
.nf-note-featured .nf-note-text {
  font-size: clamp(18px, 2vw, 22px);
  font-style: italic;
  line-height: 1.7;
  color: var(--text-primary);
  font-weight: 400;
}

.nf-note-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 12px;
}

.nf-note-author-line {
  font-family: var(--font-serif);
  color: var(--text-primary);
  font-weight: 500;
}

.nf-note-time {
  color: var(--text-tertiary);
  letter-spacing: 0.5px;
}

.nf-note-action {
  background: none;
  border: none;
  font-size: 13px;
  color: var(--text-tertiary);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  margin-left: auto;
  transition: color 0.3s ease;
  font-family: var(--font-sans);
}

.nf-note-action .nf-heart {
  font-size: 15px;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.nf-note-action.liked {
  color: #ef4444;
}

.nf-note-action.liked .nf-heart {
  animation: nfHeartBounce 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes nfHeartBounce {
  0% { transform: scale(1); }
  50% { transform: scale(1.25); }
  100% { transform: scale(1); }
}

/* 输入区：极简底线 */
.nf-write {
  display: flex;
  align-items: center;
  gap: 20px;
  border-bottom: 1px solid var(--text-primary);
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.nf-write-input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 8px 0;
  font-family: var(--font-serif);
  font-size: 15px;
  color: var(--text-primary);
  resize: none;
  outline: none;
}

.nf-write-input::placeholder {
  color: var(--text-tertiary);
  font-style: italic;
}

.nf-write-submit {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 0;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-weight: 500;
  font-family: var(--font-sans);
  transition: color 0.3s ease, gap 0.3s ease;
}

.nf-write-arrow {
  font-size: 14px;
}

.nf-write-submit:hover:not(:disabled) {
  color: var(--brand-primary);
  gap: 14px;
}

.nf-write-submit:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 底部页脚线（合并到最后一个 slide） */
.nf-footline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  margin-top: auto;
}

.nf-footline-slogan {
  font-family: var(--font-serif);
  font-size: 12px;
  color: var(--text-secondary);
  letter-spacing: 1px;
}

.nf-footline-copy {
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--text-tertiary);
  text-transform: uppercase;
}

/* ========== 滚动显现动画 ========== */
.reveal-anim {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal-anim.in-view {
  opacity: 1;
  transform: translateY(0);
}

.reveal-anim[data-anim="0"] { transition-delay: 0s; }
.reveal-anim[data-anim="1"] { transition-delay: 0.1s; }
.reveal-anim[data-anim="2"] { transition-delay: 0.2s; }
.reveal-anim[data-anim="3"] { transition-delay: 0.3s; }

/* ========== 响应式 ========== */
@media (max-width: 768px) {
  .nf-footline {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}

@media (max-height: 760px) {
  .nf-community-head {
    margin-bottom: 20px;
  }

  .nf-community-title {
    font-size: clamp(22px, 3vw, 30px);
  }

  .nf-note {
    padding: 16px 0;
    gap: 8px;
  }

  .nf-note-text {
    font-size: 13px;
  }

  .nf-note-featured .nf-note-text {
    font-size: 16px;
  }

  .nf-write {
    margin-bottom: 14px;
    padding-bottom: 8px;
  }

  .nf-footline {
    padding-top: 12px;
  }
}
</style>
