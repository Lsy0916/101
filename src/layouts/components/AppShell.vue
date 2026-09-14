<script setup lang="ts">
/**
 * 应用壳层（TS 版，替代旧 MainLayout）：
 * grain-overlay + 命令面板 + Navbar + 页面过渡 + Footer。
 * 路由 meta：hideNavbar / transparentNavbar / hideFooter 控制显隐。
 */
import { useRoute, useRouter } from 'vue-router'
import { Location, Phone, Message, Share } from '@element-plus/icons-vue'
import Navbar from '../Navbar.vue'
import AppCommandPalette from '@/components/business/common/AppCommandPalette.vue'

const route = useRoute()
const router = useRouter()

function goCounseling() { router.push({ name: 'counseling' }) }
function goAssessment() { router.push({ name: 'assessment' }) }
function goArticles() { router.push({ name: 'articles' }) }
function goCapsule() { router.push({ name: 'time-capsule' }) }
// 命令面板选中条目后的跳转（business 组件不直接碰 router）
function onPaletteNavigate(to: string) { void router.push(to) }
</script>

<template>
  <div class="main-layout">
    <div class="grain-overlay" aria-hidden="true"></div>
    <AppCommandPalette @navigate="onPaletteNavigate" />
    <Navbar v-if="!route.meta.hideNavbar" />
    <main class="main-content" :class="{ 'no-padding': route.meta.transparentNavbar || route.meta.hideNavbar }">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <footer v-if="!route.meta.hideFooter" class="main-footer">
      <div class="footer-content">
        <div class="footer-grid">
          <!-- 品牌介绍 -->
          <div class="footer-brand">
            <h3 class="footer-logo">生涯心旅</h3>
            <p class="brand-desc">致力于为大学生提供专业的心理健康服务与活动中心指导，结合AI技术与专业咨询，用心呵护每一份成长。</p>
            <div class="social-links">
              <a href="#" class="social-icon"><el-icon><Share /></el-icon></a>
              <a href="#" class="social-icon"><el-icon><Message /></el-icon></a>
            </div>
          </div>

          <!-- 平台导航 -->
          <div class="footer-column">
            <h4>平台导航</h4>
            <ul class="footer-menu">
              <li><a href="#home">首页</a></li>
              <li><a href="#services">服务介绍</a></li>
              <li><a href="#about">关于我们</a></li>
              <li><a href="#news">最新动态</a></li>
            </ul>
          </div>

          <!-- 服务项目 -->
          <div class="footer-column">
            <h4>服务项目</h4>
            <ul class="footer-menu">
              <li><a href="javascript:void(0)" @click="goCounseling">心理咨询</a></li>
              <li><a href="javascript:void(0)" @click="goCapsule">活动中心</a></li>
              <li><a href="javascript:void(0)" @click="goAssessment">心理测评</a></li>
              <li><a href="javascript:void(0)" @click="goArticles">文章资讯</a></li>
            </ul>
          </div>

          <!-- 联系方式 -->
          <div class="footer-column">
            <h4>联系我们</h4>
            <ul class="contact-list">
              <li>
                <el-icon><Location /></el-icon>
                <span>北京市海淀区科技园路88号</span>
              </li>
              <li>
                <el-icon><Phone /></el-icon>
                <span>400-123-4567</span>
              </li>
              <li>
                <el-icon><Message /></el-icon>
                <span>contact@shengyaxinlv.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-inner">
          <p>© 2026 生涯心旅. All Rights Reserved.</p>
          <div class="footer-links">
            <span>隐私政策</span>
            <span>服务条款</span>
            <span>帮助中心</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  width: 100%;
  padding-top: var(--navbar-h, 30px);
  min-height: 100vh;
  transition: padding-top 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-content.no-padding {
  padding-top: 0;
  min-height: 100vh;
}

.main-footer {
  position: relative;
  z-index: 2;
  background: white;
  border-top: 1px solid var(--mist-050);
  color: var(--ink-600);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 3rem;
}

.footer-logo {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--brand-primary);
  margin-bottom: 1rem;
  letter-spacing: 1px;
}

.brand-desc {
  line-height: 1.6;
  color: var(--ink-500);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  max-width: 90%;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--brand-primary-faint);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--brand-primary);
  transition: all 0.3s ease;
  text-decoration: none;
}

.social-icon:hover {
  background: var(--brand-primary);
  color: white;
  transform: translateY(-3px);
}

.footer-column h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--ink-800);
  margin-bottom: 1.5rem;
}

.footer-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-menu li {
  margin-bottom: 0.8rem;
}

.footer-menu a {
  color: var(--ink-500);
  text-decoration: none;
  transition: color 0.2s;
  font-size: 0.95rem;
}

.footer-menu a:hover {
  color: var(--brand-primary);
  padding-left: 5px;
}

.contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.contact-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 1rem;
  color: var(--ink-500);
  font-size: 0.95rem;
}

.contact-list .el-icon {
  color: var(--brand-primary);
  font-size: 1.1rem;
  margin-top: 2px;
}

.footer-bottom {
  border-top: 1px solid var(--slate-100);
  padding: 1.5rem 0;
  background: #fcfcfd; /* stylelint-disable-line color-no-hex, function-allowed-list */
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-inner p {
  color: var(--slate-400);
  font-size: 0.85rem;
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 24px;
  color: var(--slate-400);
  font-size: 0.85rem;
}

.footer-links span {
  cursor: pointer;
  transition: color 0.2s;
}

.footer-links span:hover {
  color: var(--brand-primary);
}

@media (width <= 992px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}

@media (width <= 576px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-inner {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

/* Page Transitions */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-fade-enter-from {
  opacity: 0;
}

.page-fade-leave-to {
  opacity: 0;
}
</style>
