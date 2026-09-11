<template>
  <div class="counseling-page">
    <!-- 主体功能区 -->
    <el-tabs v-model="activeTab" class="main-tabs" @tab-change="handleTabChange">
      <!-- ============ 预约咨询 ============ -->
      <el-tab-pane :label="$t('counseling.tabs.booking')" name="booking">
        <div v-reveal class="module-cover">
          <div class="cover-top">
            <span class="cover-eyebrow">{{ $t('counseling.cover.booking.eyebrow') }}</span>
            <span class="cover-no">No.01</span>
          </div>
          <h2 class="cover-title" v-html="$t('counseling.cover.booking.title')"></h2>
          <p class="cover-desc">{{ $t('counseling.cover.booking.desc') }}</p>
          <div class="cover-line"></div>
        </div>
        <div v-reveal="{ delay: 100 }" class="booking-layout">
          <div class="booking-main">
            <el-form ref="bookingFormRef" :model="booking" label-position="top" class="booking-form">
              <!-- 01 咨询类型 -->
              <section ref="secType" class="step-block" :class="{ error: errors.type }">
                <div class="step-marker">
                  <span class="step-num">01</span>
                </div>
                <div class="step-body">
                  <h3 class="step-title">{{ $t('counseling.step.type') }}<em v-if="true">*</em></h3>
                  <div class="type-options">
                    <button
                      v-for="ct in consultationTypes"
                      :key="ct.key"
                      type="button"
                      class="type-opt"
                      :class="{ active: booking.type === ct.key }"
                      @click="booking.type = ct.key; errors.type = false"
                    >
                      <span class="to-name">{{ ct.name }}</span>
                      <span class="to-dur">{{ ct.duration }}min</span>
                    </button>
                  </div>
                </div>
              </section>

              <!-- 02 心理老师 -->
              <section ref="secCounselor" class="step-block" :class="{ error: errors.counselorId }">
                <div class="step-marker">
                  <span class="step-num">02</span>
                </div>
                <div class="step-body">
                  <div class="step-title-row">
                    <h3 class="step-title">{{ $t('counseling.step.counselor') }}<em>*</em></h3>
                    <div class="counselor-search">
                      <el-icon><Search /></el-icon>
                      <input v-model="counselorSearch" :placeholder="$t('counseling.counselors.searchPlaceholder')" />
                      <span v-if="filteredCounselors.length" class="cs-count">{{ filteredCounselors.length }} {{ $t('counseling.counselors.count') }}</span>
                    </div>
                  </div>

                  <div v-if="booking.type" class="type-hint">
                    {{ $t('counseling.counselors.filteredHint', { type: getTypeName(booking.type) }) }}
                  </div>

                  <div v-if="filteredCounselors.length" class="counselor-pick-list">
                    <el-popover
                      v-for="c in filteredCounselors"
                      :key="c.id"
                      placement="top"
                      :width="280"
                      trigger="hover"
                      :show-after="200"
                      popper-class="counselor-popover"
                    >
                      <template #reference>
                        <div
                          class="counselor-pick-card"
                          :class="{ active: booking.counselorId === c.id }"
                          @click="selectCounselor(c.id)"
                        >
                          <span class="cp-name">{{ c.name }}</span>
                          <span class="cp-meta">{{ c.title }}</span>
                          <span class="cp-rating">★ {{ c.rating }}</span>
                        </div>
                      </template>
                      <div class="pop-detail">
                        <div class="pop-head">
                          <div class="pop-avatar" :style="{ background: c.color }">{{ c.name[0] }}</div>
                          <div>
                            <div class="pop-name">{{ c.name }}</div>
                            <div class="pop-title">{{ c.title }}</div>
                          </div>
                        </div>
                        <div class="pop-stats">
                          <span><el-icon><Star /></el-icon> {{ c.rating }}</span>
                          <span><el-icon><School /></el-icon> {{ c.exp }}{{ $t('counseling.counselors.yearsSuffix') }}</span>
                          <span><el-icon><ChatLineRound /></el-icon> {{ c.sessions }}{{ $t('counseling.counselors.sessionsUnit') }}</span>
                        </div>
                        <p class="pop-intro">{{ c.intro }}</p>
                      </div>
                    </el-popover>
                  </div>
                  <div v-else class="counselor-empty">
                    <span>{{ $t('counseling.empty.noCounselor') }}</span>
                  </div>
                </div>
              </section>

              <!-- 03 咨询时间 -->
              <section ref="secTime" class="step-block" :class="{ error: errors.dateIdx || errors.slot }">
                <div class="step-marker">
                  <span class="step-num">03</span>
                </div>
                <div class="step-body">
                  <h3 class="step-title">{{ $t('counseling.step.time') }}<em>*</em></h3>
                  <div class="date-row">
                    <div
                      v-for="(d, i) in nextDays"
                      :key="i"
                      class="date-opt"
                      :class="{ active: booking.dateIdx === i }"
                      @click="booking.dateIdx = i; errors.dateIdx = false"
                    >
                      <span class="do-week">{{ d.weekday }}</span>
                      <span class="do-date">{{ d.dateStr }}</span>
                    </div>
                  </div>
                  <div class="time-mode">
                    <div class="slot-row">
                      <button
                        v-for="slot in timeSlots"
                        :key="slot.value"
                        type="button"
                        class="slot-opt"
                        :class="{ active: booking.slot === slot.value, disabled: slot.disabled }"
                        :disabled="slot.disabled"
                        @click="!slot.disabled && (booking.slot = slot.value, errors.slot = false)"
                      >{{ slot.label }}</button>
                    </div>
                    <div class="mode-row">
                      <button
                        type="button"
                        class="mode-opt"
                        :class="{ active: booking.mode === 'online' }"
                        @click="booking.mode = 'online'"
                      >{{ $t('counseling.btn.online') }}</button>
                      <button
                        type="button"
                        class="mode-opt"
                        :class="{ active: booking.mode === 'offline' }"
                        @click="booking.mode = 'offline'"
                      >{{ $t('counseling.btn.offline') }}</button>
                    </div>
                  </div>
                </div>
              </section>

              <!-- 04 个人信息 -->
              <section ref="secInfo" class="step-block">
                <div class="step-marker">
                  <span class="step-num">04</span>
                </div>
                <div class="step-body">
                  <h3 class="step-title">{{ $t('counseling.step.info') }}<em>*</em></h3>
                  <el-row :gutter="24">
                    <el-col :span="12">
                      <el-form-item :label="$t('counseling.form.name')" :required="true" :error="errors.name ? $t('counseling.validation.nameRequired') : ''">
                        <el-input v-model="booking.name" :placeholder="$t('counseling.form.namePlaceholder')" @input="errors.name = ''" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item :label="$t('counseling.form.contact')" :required="true" :error="errors.contact ? $t('counseling.validation.contactRequired') : ''">
                        <el-input v-model="booking.contact" :placeholder="$t('counseling.form.contactPlaceholder')" @input="errors.contact = ''" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item>
                    <template #label>{{ $t('counseling.form.description') }} <span class="optional">{{ $t('counseling.form.optional') }}</span></template>
                    <el-input v-model="booking.description" type="textarea" :rows="3" :placeholder="$t('counseling.form.descPlaceholder')" maxlength="500" show-word-limit />
                  </el-form-item>
                  <div class="form-inline">
                    <span class="form-inline-label">{{ $t('counseling.form.experience') }}</span>
                    <el-switch v-model="booking.isFirst" :active-text="$t('counseling.form.first')" :inactive-text="$t('counseling.form.followup')" />
                  </div>
                  <el-form-item :error="errors.agree ? $t('counseling.validation.agreeRequired') : ''">
                    <el-checkbox v-model="booking.agree" @change="errors.agree = ''">{{ $t('counseling.form.agreePrefix') }} <a href="#" @click.prevent="activeTab = 'notice'">{{ $t('counseling.form.noticeLink') }}</a> {{ $t('counseling.form.and') }} <a href="#">{{ $t('counseling.form.consentLink') }}</a></el-checkbox>
                  </el-form-item>
                </div>
              </section>

              <div class="form-footer">
                <span class="form-hint">{{ $t('counseling.form.required').split('*')[0] }}<em>*</em>{{ $t('counseling.form.required').split('*')[1] }}</span>
                <el-button type="primary" size="large" @click="submitBooking">{{ $t('counseling.btn.confirmBooking') }}<el-icon class="el-icon--right"><ArrowRight /></el-icon></el-button>
              </div>
            </el-form>
          </div>

          <!-- 右侧：预约摘要 + 我的预约 -->
          <aside class="booking-aside">
            <div class="summary-card" :style="{ '--unset-text': $t('counseling.summary.empty') }">
              <h4><el-icon><Tickets /></el-icon> {{ $t('counseling.summary.title') }}</h4>
              <div class="summary-row"><span>{{ $t('counseling.summary.type') }}</span><b :class="{ unset: !booking.type }">{{ getTypeName(booking.type) }}</b></div>
              <div class="summary-row"><span>{{ $t('counseling.summary.counselor') }}</span><b :class="{ unset: !booking.counselorId }">{{ booking.counselorId ? getCounselor(booking.counselorId).name : '' }}</b></div>
              <div class="summary-row"><span>{{ $t('counseling.summary.date') }}</span><b :class="{ unset: booking.dateIdx < 0 }">{{ booking.dateIdx >= 0 ? nextDays[booking.dateIdx].full : '' }}</b></div>
              <div class="summary-row"><span>{{ $t('counseling.summary.time') }}</span><b :class="{ unset: !booking.slot }">{{ booking.slot || '' }}</b></div>
              <div class="summary-row"><span>{{ $t('counseling.summary.mode') }}</span><b>{{ booking.mode === 'online' ? $t('counseling.summary.onlineValue') : $t('counseling.summary.offlineValue') }}</b></div>
              <div class="summary-divider"></div>
              <div class="summary-row total"><span>{{ $t('counseling.summary.serviceType') }}</span><b class="free-tag">{{ $t('counseling.summary.freeTag') }}</b></div>
            </div>

            <div class="my-bookings">
              <div class="mb-header">
                <h4><el-icon><List /></el-icon> {{ $t('counseling.myBookings') }}</h4>
                <span class="mb-count">{{ myBookings.length }}</span>
              </div>
              <div v-if="myBookings.length > 0" class="mb-list">
                <div v-for="(b, i) in myBookings" :key="i" class="mb-item" :class="'status-' + b.status">
                  <div class="mb-top">
                    <span class="mb-counselor">{{ b.counselorName }}</span>
                    <span class="mb-status" :class="'s-' + b.status">{{ statusMap[b.status] }}</span>
                  </div>
                  <div class="mb-info">{{ b.date }} {{ b.slot }} · {{ b.typeName }}</div>
                  <div v-if="b.status === 'pending'" class="mb-actions">
                    <el-button size="small" plain @click="cancelBooking(i)">{{ $t('counseling.booking.cancelBtn') }}</el-button>
                  </div>
                </div>
              </div>
              <div v-else class="mb-empty">{{ $t('counseling.booking.empty') }}</div>
            </div>
          </aside>
        </div>
      </el-tab-pane>

      <!-- ============ 心理老师 ============ -->
      <el-tab-pane :label="$t('counseling.tabs.counselors')" name="consultants">
        <div v-reveal class="module-cover">
          <div class="cover-top">
            <span class="cover-eyebrow">{{ $t('counseling.cover.counselors.eyebrow') }}</span>
            <span class="cover-no">No.02</span>
          </div>
          <h2 class="cover-title" v-html="$t('counseling.cover.counselors.title')"></h2>
          <p class="cover-desc">{{ counselors.length }}{{ $t('counseling.counselors.count') }}{{ $t('counseling.cover.counselors.desc') }}</p>
          <div class="cover-line"></div>
        </div>
        <!-- 极简搜索 + 筛选 -->
        <div v-reveal="{ delay: 80 }" class="cons-ribbon">
          <div class="ribbon-search">
            <el-icon class="search-ico"><Search /></el-icon>
            <input v-model="consultantSearch" :placeholder="$t('counseling.counselors.searchPlaceholderAlt')" />
          </div>
          <div class="cons-filters">
            <el-select v-model="consFilter.specialty" :placeholder="$t('counseling.counselors.specialty')" clearable class="cons-select">
              <el-option v-for="s in specialties" :key="s" :label="s" :value="s" />
            </el-select>
            <el-select v-model="consFilter.gender" :placeholder="$t('counseling.counselors.gender')" clearable class="cons-select">
              <el-option :label="$t('counseling.counselors.male')" value="male" /><el-option :label="$t('counseling.counselors.female')" value="female" />
            </el-select>
            <el-select v-model="consFilter.sort" :placeholder="$t('counseling.counselors.sort')" class="cons-select">
              <el-option :label="$t('counseling.counselors.sortByRating')" value="rating" /><el-option :label="$t('counseling.counselors.sortByExperience')" value="exp" /><el-option :label="$t('counseling.counselors.sortBySessions')" value="sessions" />
            </el-select>
          </div>
        </div>

        <!-- 当前分类小标题 -->
        <div v-if="filteredConsultants.length > 0" class="rows-heading">
          <span class="heading-name">{{ $t('counseling.tabs.counselors') }}</span>
          <span class="heading-line"></span>
          <span class="heading-count">{{ String(filteredConsultants.length).padStart(2, '0') }} {{ $t('counseling.counselors.count') }}</span>
        </div>

        <!-- 心理老师列表：横向编辑式行 -->
        <div v-reveal="{ delay: 160 }" class="counselor-rows">
          <div
            v-for="(c, i) in filteredConsultants"
            :key="c.id"
            class="counselor-row"
            @click="openCounselorDetail(c)"
          >
            <div class="row-number">
              <span class="num">{{ String(i + 1).padStart(2, '0') }}</span>
            </div>
            <div class="row-avatar" :style="{ background: c.color }">{{ c.name[0] }}</div>
            <div class="row-main">
              <div class="row-title-wrap">
                <h3 class="row-title">{{ c.name }}</h3>
                <span class="row-title-sub">{{ c.title }}</span>
                <span class="row-free">{{ $t('counseling.freeTag') }}</span>
              </div>
              <p class="row-desc">{{ c.intro }}</p>
              <div class="row-tags">
                <span v-for="sp in c.specialties" :key="sp" class="row-tag">{{ sp }}</span>
              </div>
            </div>
            <div class="row-meta">
              <span class="meta-rating"><el-icon><Star /></el-icon>{{ c.rating }}</span>
              <span class="meta-sessions">{{ c.sessions }}{{ $t('counseling.counselors.sessionsSuffix') }}</span>
              <button class="row-book" @click.stop="goBookWith(c.id)">{{ $t('counseling.btn.book') }}</button>
              <el-icon class="row-arrow"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
        <div v-if="filteredConsultants.length === 0" class="empty-tip">
          <el-empty :description="$t('counseling.counselors.empty')" />
        </div>
      </el-tab-pane>



      <!-- ============ 咨询须知 ============ -->
      <el-tab-pane :label="$t('counseling.tabs.notice')" name="notice">
        <div v-reveal class="module-cover">
          <div class="cover-top">
            <span class="cover-eyebrow">{{ $t('counseling.cover.notice.eyebrow') }}</span>
            <span class="cover-no">No.03</span>
          </div>
          <h2 class="cover-title" v-html="$t('counseling.cover.notice.title')"></h2>
          <p class="cover-desc">{{ $t('counseling.cover.notice.desc') }}</p>
          <div class="cover-line"></div>
        </div>
        <div v-reveal="{ delay: 100 }" class="notice-layout">
          <!-- 流程图 · 全宽编辑式横幅 -->
          <section class="notice-hero">
            <div class="hero-eyebrow">
              <span class="hero-no">No.00</span>
              <span class="hero-line"></span>
              <span class="hero-label">{{ $t('counseling.process.heroLabel') }}</span>
            </div>
            <div class="process-flow">
              <div v-for="(p, i) in counselingProcess" :key="i" class="process-step">
                <div class="ps-num">{{ String(i + 1).padStart(2, '0') }}</div>
                <div class="ps-content">
                  <div class="ps-title">{{ p.title }}</div>
                  <div class="ps-desc">{{ p.desc }}</div>
                </div>
                <el-icon v-if="i < counselingProcess.length - 1" class="ps-arrow"><ArrowRight /></el-icon>
              </div>
            </div>
          </section>

          <!-- 编辑式 bento 网格 · 非对称节奏 -->
          <div class="notice-grid">
            <!-- 01 保密原则 -->
            <section class="notice-section ns-01">
              <div class="ns-stamp">01</div>
              <h3 class="section-title"><el-icon><Lock /></el-icon> {{ $t('counseling.section.confidentiality') }}</h3>
              <ul class="notice-list">
                <li v-for="(c, i) in confidentialityItems" :key="i">{{ c }}</li>
              </ul>
              <div class="notice-warn">
                <el-icon><Warning /></el-icon>
                <span>{{ $t('counseling.confidentiality.warning') }}</span>
              </div>
            </section>

            <!-- 02 咨询准备 · 横向三栏 -->
            <section class="notice-section ns-02">
              <div class="ns-stamp">02</div>
              <h3 class="section-title"><el-icon><Reading /></el-icon> {{ $t('counseling.section.preparation') }}</h3>
              <div class="prep-row">
                <div class="prep-block">
                  <h4>{{ $t('counseling.prep.before') }}</h4>
                  <ul class="notice-list">
                    <li v-for="(item, i) in prepBeforeItems" :key="i">{{ item }}</li>
                  </ul>
                </div>
                <div class="prep-block">
                  <h4>{{ $t('counseling.prep.during') }}</h4>
                  <ul class="notice-list">
                    <li v-for="(item, i) in prepDuringItems" :key="i">{{ item }}</li>
                  </ul>
                </div>
                <div class="prep-block">
                  <h4>{{ $t('counseling.prep.after') }}</h4>
                  <ul class="notice-list">
                    <li v-for="(item, i) in prepAfterItems" :key="i">{{ item }}</li>
                  </ul>
                </div>
              </div>
            </section>

            <!-- 03 服务说明 · 横向表格 -->
            <section class="notice-section ns-03">
              <div class="ns-stamp">03</div>
              <h3 class="section-title"><el-icon><School /></el-icon> {{ $t('counseling.section.service') }}</h3>
              <div class="service-info-banner">
                <el-icon><CircleCheckFilled /></el-icon>
                <div>
                  <div class="sib-title">{{ $t('counseling.service.freeTitle') }}</div>
                  <div class="sib-desc">{{ $t('counseling.service.freeDesc') }}</div>
                </div>
              </div>
              <div class="service-table">
                <div v-for="(s, i) in serviceInfo" :key="i" class="service-row">
                  <div class="sr-label">{{ s.label }}</div>
                  <div class="sr-value">{{ s.value }}</div>
                </div>
              </div>
              <div class="notice-warn info">
                <el-icon><InfoFilled /></el-icon>
                <span>{{ $t('counseling.service.firstWarning') }}</span>
              </div>
            </section>

            <!-- 04 取消与改约 -->
            <section class="notice-section ns-04">
              <div class="ns-stamp">04</div>
              <h3 class="section-title"><el-icon><RefreshLeft /></el-icon> {{ $t('counseling.section.cancellation') }}</h3>
              <ul class="notice-list">
                <li v-for="(item, i) in cancellationItems" :key="i">{{ item }}</li>
              </ul>
            </section>
          </div>
        </div>
      </el-tab-pane>

      <!-- ============ 常见问题 ============ -->
      <el-tab-pane :label="$t('counseling.tabs.faq')" name="faq">
        <div v-reveal class="module-cover">
          <div class="cover-top">
            <span class="cover-eyebrow">{{ $t('counseling.cover.faq.eyebrow') }}</span>
            <span class="cover-no">No.04</span>
          </div>
          <h2 class="cover-title" v-html="$t('counseling.cover.faq.title')"></h2>
          <p class="cover-desc">{{ $t('counseling.cover.faq.desc') }}</p>
          <div class="cover-line"></div>
        </div>
        <div v-reveal="{ delay: 100 }" class="faq-layout">
          <aside class="faq-sidebar">
            <div
              v-for="cat in faqCategories"
              :key="cat.key"
              class="faq-cat"
              :class="{ active: faqActiveCat === cat.key }"
              @click="faqActiveCat = cat.key"
            >
              <el-icon><component :is="cat.icon" /></el-icon>
              <span>{{ cat.name }}</span>
              <span class="faq-cat-count">{{ getFaqCount(cat.key) }}</span>
            </div>
          </aside>
          <div class="faq-content">
            <el-input v-model="faqSearch" :placeholder="$t('counseling.faq.searchPlaceholder')" prefix-icon="Search" clearable class="faq-search" />
            <el-collapse v-model="faqActive" accordion>
              <el-collapse-item v-for="(item, i) in filteredFaqs" :key="i" :name="i">
                <template #title>
                  <span class="faq-q"><span class="q-mark">Q</span>{{ item.q }}</span>
                </template>
                <p class="faq-a">{{ item.a }}</p>
              </el-collapse-item>
            </el-collapse>
            <div v-if="filteredFaqs.length === 0" class="empty-tip">
              <el-empty :description="$t('counseling.faq.empty')" />
            </div>
            <div class="faq-contact">
              <el-icon><ChatLineRound /></el-icon>
              <span>{{ $t('counseling.faq.contactPrompt') }}</span>
              <el-button type="primary" link @click="activeTab = 'booking'">{{ $t('counseling.faq.contactBtn') }}</el-button>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 咨询师详情弹窗 -->
    <el-dialog v-model="counselorDetailVisible" :title="currentCounselor ? currentCounselor.name + ' · ' + currentCounselor.title : ''" width="640px" class="counselor-dialog">
      <div v-if="currentCounselor" class="cd-content">
        <div class="cd-header">
          <div class="cd-avatar" :style="{ background: currentCounselor.color }">{{ currentCounselor.name[0] }}</div>
          <div class="cd-meta">
            <div class="cd-name">{{ currentCounselor.name }}</div>
            <div class="cd-title">{{ currentCounselor.title }} · {{ currentCounselor.exp }}{{ $t('counseling.counselors.yearsSuffix') }}</div>
            <div class="cd-stats">
              <span><el-icon><Star /></el-icon> {{ currentCounselor.rating }}</span>
              <span><el-icon><User /></el-icon> {{ currentCounselor.sessions }}{{ $t('counseling.counselors.sessionsUnit') }}</span>
              <span><el-icon><School /></el-icon> {{ currentCounselor.education }}</span>
            </div>
          </div>
        </div>
        <div class="cd-section">
          <h4>{{ $t('counseling.counselors.dialog.intro') }}</h4>
          <p>{{ currentCounselor.intro }}</p>
        </div>
        <div class="cd-section">
          <h4>{{ $t('counseling.counselors.dialog.specialties') }}</h4>
          <div class="cd-specs"><span v-for="sp in currentCounselor.specialties" :key="sp" class="cd-spec">{{ sp }}</span></div>
        </div>
        <div class="cd-section">
          <h4>{{ $t('counseling.counselors.dialog.background') }}</h4>
          <ul class="cd-edu"><li v-for="(e, i) in currentCounselor.background" :key="i">{{ e }}</li></ul>
        </div>
        <div class="cd-section">
          <h4>{{ $t('counseling.counselors.dialog.reviews') }}</h4>
          <div v-for="(r, i) in currentCounselor.reviews" :key="i" class="cd-review">
            <div class="rv-stars"><el-icon v-for="s in 5" :key="s"><Star /></el-icon></div>
            <p>{{ r }}</p>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="counselorDetailVisible = false">{{ $t('counseling.btn.close') }}</el-button>
        <el-button type="primary" @click="goBookWith(currentCounselor?.id)">{{ $t('counseling.btn.bookThis') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ChatLineRound, User, Star, Calendar,
  Tickets, List, CircleCheckFilled, Warning, ArrowRight, Lock, Reading,
  RefreshLeft, InfoFilled, School, Search, ChatDotRound, House, Connection
} from '@element-plus/icons-vue'

// --- 类型定义 ---
interface Counselor {
  id: number
  name: string
  title: string
  gender: string
  rating: number
  sessions: number
  exp: number
  education: string
  color: string
  types: string[]
  specialties: string[]
  intro: string
  background: string[]
  reviews: string[]
}

interface BookingItem {
  counselorName: string
  counselorId: number
  date: string
  slot: string
  typeName: string
  type: string
  mode: string
  topics: string[]
  description: string
  isFirst: boolean
  status: string
  createdAt: string
}

const route = useRoute()
const { t, tm } = useI18n()

const tabQueryMap: Record<string, string> = { booking: 'booking', consultants: 'consultants', notice: 'notice', faq: 'faq' }
const activeTab = ref(tabQueryMap[String(route.query.tab)] || 'booking')

watch(() => route.query.tab, (newTab) => {
  const mapped = typeof newTab === 'string' ? tabQueryMap[newTab] : undefined
  if (mapped && mapped !== activeTab.value) {
    activeTab.value = mapped
  }
})

// ============ 咨询类型 ============
const consultationTypes = [
  { key: 'individual', name: '个体咨询', desc: '一对一深度探讨个人议题', duration: 50, icon: User },
  { key: 'couple', name: '伴侣咨询', desc: '改善亲密关系与沟通', duration: 60, icon: Connection },
  { key: 'family', name: '家庭咨询', desc: '处理家庭关系与冲突', duration: 60, icon: House },
  { key: 'group', name: '团体辅导', desc: '在团体中获得支持与成长', duration: 90, icon: ChatDotRound }
]

const specialties = ['情绪管理', '焦虑抑郁', '人际关系', '亲密关系', '家庭治疗', '创伤治疗', '青少年', '职业规划', '认知行为', '正念取向', '精神分析', '团体咨询']

// ============ 心理老师数据 ============
const counselors: Counselor[] = [
  { id: 1, name: '林晓薇', title: '资深心理老师', gender: 'female', rating: 4.9, sessions: 1280, exp: 12, education: '心理学博士', color: '#0052d9',
    types: ['individual', 'couple', 'group'],
    specialties: ['情绪管理', '焦虑抑郁', '认知行为'], intro: '擅长运用认知行为疗法（CBT）帮助同学处理焦虑、抑郁情绪，12年辅导经验，温和而敏锐。',
    background: ['北京师范大学心理学博士', '中美认知行为治疗三年制培训', '中国心理学会注册心理师'], reviews: ['林老师非常有耐心，让我学会识别自己的自动化思维，焦虑明显减轻。', '辅导节奏舒服，每次都有新的觉察。'] },
  { id: 2, name: '陈志远', title: '高级心理老师', gender: 'male', rating: 4.8, sessions: 960, exp: 9, education: '应用心理学硕士', color: '#10b981',
    types: ['individual', 'couple', 'group'],
    specialties: ['人际关系', '亲密关系', '精神分析'], intro: '精神分析取向，擅长探索早年关系模式对当下人际互动的影响，陪伴同学深度自我探索。',
    background: ['华东师范大学应用心理学硕士', '中德班精神分析三年制培训', '国家二级心理咨询师'], reviews: ['陈老师帮我看到了自己一直没意识到的关系模式，很有启发。'] },
  { id: 3, name: '苏雨桐', title: '资深心理老师', gender: 'female', rating: 4.9, sessions: 1100, exp: 14, education: '家庭治疗博士', color: '#7c3aed',
    types: ['individual', 'couple', 'family', 'group'],
    specialties: ['家庭治疗', '亲密关系', '青少年'], intro: '系统式家庭治疗取向，擅长处理家庭冲突、亲子沟通、青少年议题，让家庭成为成长的资源。',
    background: ['香港大学家庭治疗博士', '米纽庆家庭治疗中心进修', 'AAMFT临床会员'], reviews: ['苏老师让全家都参与了改变，家不再是争吵的地方。'] },
  { id: 4, name: '王浩然', title: '心理辅导老师', gender: 'male', rating: 4.7, sessions: 680, exp: 7, education: '心理学硕士', color: '#f59e0b',
    types: ['individual', 'group'],
    specialties: ['职业规划', '正念取向', '情绪管理'], intro: '结合正念与接纳承诺疗法（ACT），帮助同学应对学业压力、职业迷茫与人生转型期的困惑。',
    background: ['浙江大学心理学硕士', '正念减压MBSR教师培训', 'ACBS会员'], reviews: ['王老师的正念练习很实用，考试压力下也能用上。'] },
  { id: 5, name: '张静怡', title: '高级心理老师', gender: 'female', rating: 4.8, sessions: 820, exp: 10, education: '临床心理学硕士', color: '#ef4444',
    types: ['individual', 'group'],
    specialties: ['创伤治疗', '焦虑抑郁', '认知行为'], intro: 'EMDR国际认证治疗师，专注于创伤后应激障碍（PTSD）、复杂性创伤与童年创伤的修复。',
    background: ['北京大学临床心理学硕士', 'EMDR国际认证', '创伤聚焦CBT培训'], reviews: ['张老师非常专业，处理我的创伤记忆时让我感到安全。'] },
  { id: 6, name: '李明哲', title: '资深心理老师', gender: 'male', rating: 4.7, sessions: 740, exp: 8, education: '心理学博士', color: '#06b6d4',
    types: ['individual', 'family', 'group'],
    specialties: ['青少年', '家庭治疗', '人际关系'], intro: '青少年心理专家，擅长处理厌学、网络成瘾、青春期叛逆、亲子冲突等议题，与家庭协同工作。',
    background: ['南京师范大学发展心理学博士', '结构式家庭治疗培训', '青少年心理工作坊认证'], reviews: ['孩子终于愿意和我们说话了，谢谢李老师。'] },
  { id: 7, name: '周思琪', title: '心理辅导老师', gender: 'female', rating: 4.6, sessions: 520, exp: 6, education: '应用心理学硕士', color: '#ec4899',
    types: ['individual', 'couple', 'group'],
    specialties: ['人际关系', '情绪管理', '正念取向'], intro: '人际关系取向（IPT）辅导老师，帮助同学理解人际模式、建立健康边界、改善社交焦虑。',
    background: ['西南大学应用心理学硕士', '人际关系取向治疗IPT认证', '国家二级心理咨询师'], reviews: ['周老师很温柔，让我敢于面对社交中的恐惧。'] },
  { id: 8, name: '黄子轩', title: '高级心理老师', gender: 'male', rating: 4.8, sessions: 890, exp: 11, education: '临床心理学博士', color: '#0284c7',
    types: ['individual', 'couple', 'group'],
    specialties: ['焦虑抑郁', '创伤治疗', '精神分析'], intro: '整合精神分析与躯体体验取向，关注身心联结，帮助同学从身体与情绪双层面获得疗愈。',
    background: ['复旦大学临床心理学博士', '躯体体验SE治疗师认证', '中德班精神分析毕业'], reviews: ['黄老师让我重新连接了自己的身体感受，很特别。'] }
]

// ============ 预约状态 ============
const bookingFormRef = ref<HTMLElement | null>(null)
const secType = ref<HTMLElement | null>(null)
const secCounselor = ref<HTMLElement | null>(null)
const secTime = ref<HTMLElement | null>(null)
const secInfo = ref<HTMLElement | null>(null)

const errors = reactive<Record<string, boolean | string>>({
  type: false,
  counselorId: false,
  dateIdx: false,
  slot: false,
  name: '',
  contact: '',
  agree: ''
})

const booking = reactive({
  type: 'individual',
  topics: [] as string[],
  specFilter: '',
  counselorId: null as number | null,
  dateIdx: -1,
  slot: '',
  mode: 'online',
  name: '',
  contact: '',

  description: '',
  isFirst: true,
  agree: false
})

const counselorSearch = ref('')

function selectCounselor(id: number) {
  booking.counselorId = id
  errors.counselorId = false
}

const filteredCounselors = computed(() => {
  const type = booking.type
  const kw = counselorSearch.value.trim().toLowerCase()
  const spec = booking.specFilter
  return counselors.filter(c => {
    const typeOk = !type || c.types.includes(type)
    const specOk = !spec || c.specialties.includes(spec)
    const kwOk = !kw || c.name.toLowerCase().includes(kw) || c.specialties.join('').toLowerCase().includes(kw) || c.title.toLowerCase().includes(kw)
    return typeOk && specOk && kwOk
  })
})

watch(() => booking.type, (newType) => {
  if (booking.counselorId) {
    const c = counselors.find(x => x.id === booking.counselorId)
    if (c && !c.types.includes(newType)) {
      booking.counselorId = null
    }
  }
})

const weekdays = computed(() => [
  t('counseling.weekdays.sun'), t('counseling.weekdays.mon'), t('counseling.weekdays.tue'),
  t('counseling.weekdays.wed'), t('counseling.weekdays.thu'), t('counseling.weekdays.fri'),
  t('counseling.weekdays.sat')
])

const nextDays = computed(() => {
  const days = []
  const wdays = weekdays.value
  const now = new Date()
  for (let i = 1; i <= 7; i++) {
    const d = new Date(now.getTime() + i * 24 * 60 * 60 * 1000)
    days.push({
      weekday: wdays[d.getDay()],
      dateStr: `${d.getMonth() + 1}/${d.getDate()}`,
      full: `${d.getMonth() + 1}月${d.getDate()}日 ${wdays[d.getDay()]}`
    })
  }
  return days
})

const timeSlots = computed(() => [
  { label: '09:00', value: '09:00', period: t('counseling.timeSlots.morning'), disabled: false },
  { label: '10:00', value: '10:00', period: t('counseling.timeSlots.morning'), disabled: false },
  { label: '11:00', value: '11:00', period: t('counseling.timeSlots.morning'), disabled: true },
  { label: '14:00', value: '14:00', period: t('counseling.timeSlots.afternoon'), disabled: false },
  { label: '15:00', value: '15:00', period: t('counseling.timeSlots.afternoon'), disabled: false },
  { label: '16:00', value: '16:00', period: t('counseling.timeSlots.afternoon'), disabled: true },
  { label: '19:00', value: '19:00', period: t('counseling.timeSlots.evening'), disabled: false },
  { label: '20:00', value: '20:00', period: t('counseling.timeSlots.evening'), disabled: false }
])

function validateBooking() {
  let valid = true
  let firstErrorRef: HTMLElement | null = null

  if (!booking.type) { errors.type = true; valid = false; if (!firstErrorRef) firstErrorRef = secType.value }
  if (!booking.counselorId) { errors.counselorId = true; valid = false; if (!firstErrorRef) firstErrorRef = secCounselor.value }
  if (booking.dateIdx < 0) { errors.dateIdx = true; valid = false; if (!firstErrorRef) firstErrorRef = secTime.value }
  if (!booking.slot) { errors.slot = true; valid = false; if (!firstErrorRef) firstErrorRef = secTime.value }
  if (!booking.name) { errors.name = t('counseling.validation.nameRequired'); valid = false; if (!firstErrorRef) firstErrorRef = secInfo.value }
  if (!booking.contact) { errors.contact = t('counseling.validation.contactRequired'); valid = false; if (!firstErrorRef) firstErrorRef = secInfo.value }
  if (!booking.agree) { errors.agree = t('counseling.validation.agreeRequired'); valid = false; if (!firstErrorRef) firstErrorRef = secInfo.value }

  if (!valid && firstErrorRef) {
    firstErrorRef.scrollIntoView({ behavior: 'smooth', block: 'center' })
    ElMessage.warning(t('counseling.validation.formIncomplete'))
  }
  return valid
}

function getTypeName(key: string) {
  return consultationTypes.find(t => t.key === key)?.name || ''
}
function getCounselor(id: number | null) {
  return counselors.find(c => c.id === id) || { name: '' }
}

// 我的预约
const myBookings = ref<BookingItem[]>([])
const statusMap = computed<Record<string, string>>(() => ({
  pending: t('counseling.bookingStatus.pending'),
  confirmed: t('counseling.bookingStatus.confirmed'),
  completed: t('counseling.bookingStatus.completed'),
  cancelled: t('counseling.bookingStatus.cancelled')
}))

function submitBooking() {
  if (!validateBooking()) return
  const c = counselors.find(x => x.id === booking.counselorId)
  if (!c) return
  const newBooking = {
    counselorName: c.name,
    counselorId: c.id,
    date: nextDays.value[booking.dateIdx].full,
    slot: booking.slot,
    typeName: getTypeName(booking.type),
    type: booking.type,
    mode: booking.mode,
    topics: [...booking.topics],
    description: booking.description,
    isFirst: booking.isFirst,
    status: 'pending',
    createdAt: new Date().toISOString()
  }
  myBookings.value.unshift(newBooking)
  saveBookings()
  ElMessage.success(t('counseling.message.bookingSuccess'))
  // 重置
  booking.counselorId = null
  booking.dateIdx = -1
  booking.slot = ''
  booking.name = ''
  booking.contact = ''
  booking.description = ''
  booking.agree = false
  booking.topics = []
  // 重置错误
  Object.keys(errors).forEach(k => { errors[k] = (typeof errors[k] === 'string') ? '' : false })
  // 滚动到顶部
  secType.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function cancelBooking(idx: number) {
  ElMessageBox.confirm(t('counseling.message.cancelConfirm'), t('counseling.message.cancelTitle'), { type: 'warning' }).then(() => {
    myBookings.value[idx].status = 'cancelled'
    saveBookings()
    ElMessage.success(t('counseling.message.cancelled'))
  }).catch(() => {})
}

function saveBookings() {
  localStorage.setItem('counseling_bookings', JSON.stringify(myBookings.value))
}
function loadBookings() {
  const saved = localStorage.getItem('counseling_bookings')
  if (saved) myBookings.value = JSON.parse(saved)
}

function goBookWith(id: number | undefined) {
  if (id === undefined) return
  booking.type = 'individual'
  booking.counselorId = id
  counselorDetailVisible.value = false
  activeTab.value = 'booking'
}

// ============ 咨询师列表筛选 ============
const consultantSearch = ref('')
const consFilter = reactive({ specialty: '', gender: '', sort: 'rating' })

const filteredConsultants = computed(() => {
  let list = counselors.filter(c => {
    if (consFilter.specialty && !c.specialties.includes(consFilter.specialty)) return false
    if (consFilter.gender && c.gender !== consFilter.gender) return false
    if (consultantSearch.value) {
      const q = consultantSearch.value.toLowerCase()
      if (!c.name.toLowerCase().includes(q) && !c.specialties.join(' ').toLowerCase().includes(q) && !c.intro.toLowerCase().includes(q)) return false
    }
    return true
  })
  if (consFilter.sort === 'rating') list = list.slice().sort((a, b) => b.rating - a.rating)
  else if (consFilter.sort === 'exp') list = list.slice().sort((a, b) => b.exp - a.exp)
  else if (consFilter.sort === 'sessions') list = list.slice().sort((a, b) => b.sessions - a.sessions)
  return list
})

// 咨询师详情
const counselorDetailVisible = ref(false)
const currentCounselor = ref<Counselor | null>(null)
function openCounselorDetail(c: Counselor) {
  currentCounselor.value = c
  counselorDetailVisible.value = true
}

// ============ 咨询须知 ============
const counselingProcess = computed(() => [
  { title: t('counseling.process.step1.title'), desc: t('counseling.process.step1.desc') },
  { title: t('counseling.process.step2.title'), desc: t('counseling.process.step2.desc') },
  { title: t('counseling.process.step3.title'), desc: t('counseling.process.step3.desc') },
  { title: t('counseling.process.step4.title'), desc: t('counseling.process.step4.desc') }
])

const confidentialityItems = computed(() => tm('counseling.confidentiality.items') as string[])

const prepBeforeItems = computed(() => tm('counseling.prep.beforeItems') as string[])
const prepDuringItems = computed(() => tm('counseling.prep.duringItems') as string[])
const prepAfterItems = computed(() => tm('counseling.prep.afterItems') as string[])

const cancellationItems = computed(() => tm('counseling.cancellation.items') as string[])

const serviceInfo = computed(() => [
  { label: t('counseling.service.info.target'), value: t('counseling.service.info.targetValue') },
  { label: t('counseling.service.info.nature'), value: t('counseling.service.info.natureValue') },
  { label: t('counseling.service.info.duration'), value: t('counseling.service.info.durationValue') },
  { label: t('counseling.service.info.frequency'), value: t('counseling.service.info.frequencyValue') },
  { label: t('counseling.service.info.format'), value: t('counseling.service.info.formatValue') },
  { label: t('counseling.service.info.cycle'), value: t('counseling.service.info.cycleValue') }
])

// ============ 常见问题 ============
const faqCategories = computed(() => [
  { key: 'all', name: t('counseling.faq.categories.all'), icon: List },
  { key: 'booking', name: t('counseling.faq.categories.booking'), icon: Calendar },
  { key: 'service', name: t('counseling.faq.categories.service'), icon: School },
  { key: 'effect', name: t('counseling.faq.categories.effect'), icon: Reading },
  { key: 'privacy', name: t('counseling.faq.categories.confidentiality'), icon: Lock }
])

const faqActiveCat = ref('all')
const faqSearch = ref('')
const faqActive = ref('')

const faqList = [
  { cat: 'booking', q: '如何预约心理辅导？', a: '在"预约咨询"页面依次选择咨询类型、心理老师、时间段并填写基本信息，提交后心理老师会在24小时内确认。也可以前往心理辅导中心现场预约。' },
  { cat: 'booking', q: '首次咨询需要准备什么？', a: '建议提前5分钟到达辅导室（线下）或确保网络通畅（线上）。简单梳理近期困扰和想探讨的话题，保持开放真诚的心态即可。' },
  { cat: 'booking', q: '可以指定心理老师吗？', a: '可以。你可以在"心理老师"页面查看所有老师的详细介绍、擅长领域与同学评价，选择心仪的老师进行预约。' },
  { cat: 'booking', q: '一次咨询多长时间？频率如何？', a: '通常每次50分钟，首次评估访谈可能延长至60-80分钟。频率一般为每周1次，具体根据议题与进展由双方协商确定。' },
  { cat: 'booking', q: '可以线上咨询吗？', a: '支持视频咨询。在预约时选择"视频咨询"方式，咨询前会收到专属视频房间链接。线上咨询效果与线下相当，且更便捷。' },
  { cat: 'booking', q: '如何取消或改约？', a: '提前24小时以上可在"我的预约"中在线取消或改约；不足24小时请尽量联系辅导中心说明情况。详见《咨询须知》。' },
  { cat: 'service', q: '心理辅导是否收费？', a: '本校心理辅导服务完全免费，面向全体在校同学开放，不收取任何费用。' },
  { cat: 'service', q: '服务对象包括哪些同学？', a: '全体在校本科生、研究生均可预约。短期访学同学也可前往辅导中心咨询现场安排。' },
  { cat: 'service', q: '咨询形式有哪些？', a: '提供面对面咨询（心理辅导中心）和视频咨询两种形式，可根据个人情况选择。视频咨询通过加密平台进行，安全便捷。' },
  { cat: 'service', q: '可以请家长或同学陪同吗？', a: '首次评估可由信任的同学陪同至等候区。咨询过程中通常一对一进行，以保障隐私；如需家长参与家庭议题，由心理老师安排。' },
  { cat: 'effect', q: '心理咨询真的有效吗？', a: '研究表明，约75%的同学在经过6-12次咨询后症状明显改善。效果与咨访关系质量、个人投入度、议题复杂度相关。' },
  { cat: 'effect', q: '一般需要咨询多少次？', a: '短程咨询（CBT等）通常6-12次，中程12-24次，长程可达数月乃至数年。心理老师会在评估后给出建议。' },
  { cat: 'effect', q: '咨询后情绪变差正常吗？', a: '部分同学在咨询初期可能因触碰痛苦议题而情绪波动，这通常是疗愈过程的一部分。如持续加重请及时告知心理老师。' },
  { cat: 'effect', q: '对心理老师不满意怎么办？', a: '可以在任何阶段提出更换心理老师，辅导中心将协助安排。良好的咨访关系是咨询效果的基础。' },
  { cat: 'privacy', q: '咨询内容会被保密吗？', a: '严格保密。所有记录加密存储，未经书面同意不向第三方透露。保密义务在咨询关系结束后继续有效。' },
  { cat: 'privacy', q: '什么情况下会突破保密？', a: '仅在有自伤/伤人风险、未成年人受虐、法律强制要求三种情况下，心理老师有义务突破保密以保护安全。' },
  { cat: 'privacy', q: '咨询记录保存多久？', a: '咨询记录保存至咨询关系结束后3年，之后按规定销毁。期间仅心理老师本人与督导可查阅（隐去身份信息）。' }
]

function getFaqCount(cat: string) {
  return cat === 'all' ? faqList.length : faqList.filter(f => f.cat === cat).length
}

const filteredFaqs = computed(() => {
  let list = faqList
  if (faqActiveCat.value !== 'all') list = list.filter(f => f.cat === faqActiveCat.value)
  if (faqSearch.value) {
    const q = faqSearch.value.toLowerCase()
    list = list.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
  }
  return list
})

// ============ tab 切换 ============
function handleTabChange(_name: string | number) {
  // 占位：可在此埋点
}

onMounted(() => {
  loadBookings()
})
</script>

<style scoped>
/* ============================================================
   心理咨询中心 · 开放排版（贴合网站主题）
   品牌蓝 #0052d9 主导  浅蓝点缀 #f0f7ff
   圆角 16-20px 卡片 / 8-10px 小元素  软阴影
   视觉节奏：非对称网格 / 多变列宽 / 大留白
   ============================================================ */

.counseling-page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 32px 40px 96px;
  color: #1f2937;
  font-feature-settings: "tnum" 1;
}

/* ============ 杂志编辑式标题区 ============ */
.page-intro {
  padding: 24px 0 48px;
  border-bottom: 1px solid #eef2f6;
  margin-bottom: 48px;
}

.intro-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 48px;
  flex-wrap: wrap;
}

.intro-left {
  max-width: 720px;
}

.intro-eyebrow {
  display: block;
  font-size: 12px;
  letter-spacing: 3px;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 20px;
  text-transform: uppercase;
}

.intro-title {
  font-size: clamp(40px, 6vw, 80px);
  font-weight: 800;
  color: #0a0f1a;
  margin: 0 0 18px 0;
  letter-spacing: -2px;
  line-height: 1.02;
}

.intro-title em {
  font-style: italic;
  font-weight: 300;
  color: #0052d9;
}

.intro-sub {
  font-size: 15px;
  color: #6b7280;
  margin: 0;
  line-height: 1.7;
  max-width: 520px;
}

.intro-right {
  display: flex;
  align-items: flex-end;
}

.intro-mark {
  font-size: 13px;
  letter-spacing: 2px;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  font-variant-numeric: tabular-nums;
  padding-bottom: 10px;
  position: relative;
}
.intro-mark::before {
  content: '';
  position: absolute;
  left: -28px;
  top: 50%;
  width: 20px;
  height: 1px;
  background: #d0d5db;
}

/* ============ 通用 section ============ */
.notice-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}


.section-title {
  font-size: 17px;
  color: #111827;
  font-weight: 700;
  margin: 0 0 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: -0.3px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.section-title .el-icon {
  color: #0052d9;
  font-size: 20px;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e0efff 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ============ Tabs · 极简文字 ============ */
:deep(.main-tabs .el-tabs__header) { margin-bottom: 40px; }
:deep(.main-tabs .el-tabs__nav) { gap: 32px; }
:deep(.main-tabs .el-tabs__item) {
  font-size: 14px;
  font-weight: 500;
  color: #9ca3af;
  padding: 0 0 14px;
  height: auto;
  border: none;
  letter-spacing: 0.5px;
  transition: color 0.25s ease;
}
:deep(.main-tabs .el-tabs__item:hover) { color: #0a0f1a; }
:deep(.main-tabs .el-tabs__item.is-active) { color: #0a0f1a; font-weight: 700; }
:deep(.main-tabs .el-tabs__active-bar) {
  background: #0a0f1a;
  height: 2px;
  border-radius: 0;
}
:deep(.main-tabs .el-tabs__nav-wrap::after) { display: none; }

/* ============ 模块封面 · 编辑式标题区 ============ */
.module-cover {
  padding: 8px 0 36px;
  margin-bottom: 40px;
  border-bottom: 1px solid #eef2f6;
  position: relative;
}
.module-cover .cover-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}
.module-cover .cover-eyebrow {
  font-size: 12px;
  letter-spacing: 3px;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
}
.module-cover .cover-no {
  font-size: 12px;
  letter-spacing: 2px;
  color: #9ca3af;
  font-weight: 600;
  text-transform: uppercase;
  font-variant-numeric: tabular-nums;
  padding: 4px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 0;
}
.module-cover .cover-title {
  font-size: clamp(36px, 5vw, 64px);
  font-weight: 800;
  color: #0a0f1a;
  margin: 0 0 14px 0;
  letter-spacing: -1.5px;
  line-height: 1.02;
}
.module-cover .cover-title em {
  font-style: italic;
  font-weight: 300;
  color: #0052d9;
  opacity: 0.85;
}
.module-cover .cover-desc {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 22px 0;
  line-height: 1.7;
  max-width: 640px;
}
.module-cover .cover-line {
  height: 1px;
  background: linear-gradient(to right, #0052d9 0, #0052d9 56px, #eef2f6 56px, #eef2f6 100%);
}

/* ============ 预约布局 · 大留白 ============ */
.booking-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 64px;
  align-items: flex-start;
}

.booking-main { min-width: 0; }

.booking-aside {
  position: sticky;
  top: 96px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 步骤区块 · 大号编号 + 卡片式分隔 */
.step-block {
  display: grid;
  grid-template-columns: 88px 1fr;
  gap: 36px;
  padding: 36px 28px;
  border-bottom: 1px solid #eef2f6;
  border-radius: 16px;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}
.step-block::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 3px;
  height: 0;
  background: #0052d9;
  border-radius: 0 3px 3px 0;
  transform: translateY(-50%);
  transition: height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.step-block:first-child { padding-top: 28px; }
.step-block:last-of-type { border-bottom: none; padding-bottom: 28px; }
.step-block:hover {
  background: #f8fbff;
  box-shadow: 0 8px 24px rgba(0, 82, 217, 0.06);
}
.step-block:hover::before { height: 60%; }
.step-block.error { background: rgba(239, 68, 68, 0.03); }
.step-block.error::before { background: #ef4444; height: 60%; }

.step-marker { position: relative; }
.step-num {
  font-size: 68px;
  font-weight: 300;
  color: #0052d9;
  letter-spacing: -3px;
  line-height: 0.9;
  font-variant-numeric: tabular-nums;
  display: block;
  opacity: 0.85;
}
.step-block.error .step-num { color: #ef4444; opacity: 1; }

.step-body { min-width: 0; }

.step-title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 24px;
  letter-spacing: -0.4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.step-block.error .step-title { color: #ef4444; }
.step-title em {
  font-style: normal;
  color: #ef4444;
  font-size: 16px;
  margin-left: 4px;
}

.step-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}
.step-title-row .step-title { margin: 0; }

.optional {
  font-size: 11px;
  color: #9ca3af;
  font-weight: 500;
  margin-left: 8px;
  letter-spacing: 0.3px;
  padding: 2px 8px;
  background: #f3f4f6;
  border-radius: 6px;
}

/* 咨询类型 · 卡片化大号文字 */
.type-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.type-opt {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 14px 20px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.type-opt:hover {
  border-color: #0052d9;
  background: #f0f7ff;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 82, 217, 0.08);
}
.type-opt:hover .to-name { color: #0052d9; }
.type-opt.active {
  border-color: #0052d9;
  background: #0052d9;
  box-shadow: 0 8px 20px rgba(0, 82, 217, 0.2);
}
.type-opt.active .to-name { color: #ffffff; font-weight: 700; }
.type-opt.active .to-dur { color: rgba(255, 255, 255, 0.85); }

.to-name { font-size: 16px; color: #1f2937; font-weight: 600; transition: all 0.2s; letter-spacing: -0.2px; }
.to-dur { font-size: 11px; color: #9ca3af; font-variant-numeric: tabular-nums; letter-spacing: 0.3px; }

/* 心理老师 · 搜索框 */
.counselor-search {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  background: #ffffff;
  transition: all 0.25s ease;
  width: 280px;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.03);
}
.counselor-search:focus-within {
  border-color: #0052d9;
  box-shadow: 0 0 0 3px rgba(0, 82, 217, 0.1);
}
.counselor-search .el-icon { color: #9ca3af; font-size: 14px; }
.counselor-search input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  color: #1f2937;
  font-family: inherit;
}
.counselor-search input::placeholder { color: #9ca3af; }
.cs-count {
  font-size: 11px;
  color: #0052d9;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  background: #f0f7ff;
  padding: 2px 8px;
  border-radius: 8px;
}

.type-hint {
  font-size: 12px;
  color: #0052d9;
  margin-bottom: 16px;
  padding: 8px 14px;
  background: #f0f7ff;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.2px;
  border: 1px solid rgba(0, 82, 217, 0.1);
}
.type-hint::before {
  content: '◆';
  font-size: 8px;
  color: #0052d9;
}

.counselor-empty {
  padding: 32px;
  text-align: center;
  color: #9ca3af;
  font-size: 13px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px dashed #e2e8f0;
}

/* 心理老师 · 列表（卡片化） */
.counselor-pick-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.counselor-pick-card {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 16px;
  align-items: center;
  padding: 14px 18px;
  cursor: pointer;
  border: 1px solid #eef2f6;
  border-radius: 12px;
  background: #ffffff;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}
.counselor-pick-card:hover {
  border-color: #0052d9;
  background: #f0f7ff;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 82, 217, 0.06);
}
.counselor-pick-card.active {
  border-color: #0052d9;
  background: #f0f7ff;
  box-shadow: 0 6px 16px rgba(0, 82, 217, 0.1);
}
.counselor-pick-card.active .cp-name { color: #0052d9; font-weight: 700; }
.counselor-pick-card.active .cp-rating {
  color: #0052d9;
  position: relative;
  padding-right: 28px;
}
.counselor-pick-card.active .cp-rating::after {
  content: '✓';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 13px;
  font-weight: 700;
  color: #0052d9;
}

.cp-name { font-size: 15px; font-weight: 600; color: #1f2937; transition: color 0.2s; letter-spacing: -0.2px; }
.cp-meta { font-size: 12px; color: #9ca3af; letter-spacing: 0.2px; }
.cp-rating { font-size: 13px; color: #f59e0b; font-weight: 600; font-variant-numeric: tabular-nums; }

/* 快速筛选 */
.quick-filter { display: flex; flex-wrap: wrap; gap: 8px; }
.filter-chip {
  padding: 6px 14px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  transition: all 0.2s;
  background: #ffffff;
  font-weight: 500;
}
.filter-chip:hover { color: #0052d9; border-color: #0052d9; background: #f0f7ff; }
.filter-chip.active {
  color: #ffffff;
  border-color: #0052d9;
  background: #0052d9;
  font-weight: 600;
}

/* 日期 · 卡片化横向 */
.date-row {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  margin-bottom: 24px;
  padding: 4px 0 8px;
}
.date-opt {
  flex-shrink: 0;
  min-width: 76px;
  padding: 12px 14px;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  background: #ffffff;
}
.date-opt:hover {
  border-color: #0052d9;
  background: #f0f7ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 82, 217, 0.08);
}
.date-opt:hover .do-date { color: #0052d9; }
.date-opt.active {
  border-color: #0052d9;
  background: #0052d9;
  box-shadow: 0 6px 16px rgba(0, 82, 217, 0.2);
}
.date-opt.active .do-week { color: rgba(255, 255, 255, 0.85); }
.date-opt.active .do-date { color: #ffffff; font-weight: 700; }

.do-week { display: block; font-size: 11px; color: #9ca3af; margin-bottom: 4px; letter-spacing: 0.5px; }
.do-date { display: block; font-size: 17px; font-weight: 600; color: #1f2937; font-variant-numeric: tabular-nums; transition: all 0.2s; letter-spacing: -0.3px; }

/* 时段 + 方式 */
.time-mode { display: flex; flex-direction: column; gap: 20px; }

.slot-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.slot-opt {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 8px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.3px;
}
.slot-opt:hover:not(.disabled) {
  color: #0052d9;
  border-color: #0052d9;
  background: #f0f7ff;
}
.slot-opt.active {
  color: #ffffff;
  background: #0052d9;
  border-color: #0052d9;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(0, 82, 217, 0.2);
}
.slot-opt.disabled {
  color: #d1d5db;
  cursor: not-allowed;
  text-decoration: line-through;
  background: #f9fafb;
}

.mode-row {
  display: flex;
  gap: 12px;
  align-items: center;
}
.mode-opt {
  padding: 8px 18px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  font-family: inherit;
  font-size: 13px;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 20px;
  letter-spacing: 0.2px;
  font-weight: 500;
}
.mode-opt:hover { color: #0052d9; border-color: #0052d9; background: #f0f7ff; }
.mode-opt.active {
  color: #ffffff;
  background: #0052d9;
  border-color: #0052d9;
  font-weight: 600;
  box-shadow: 0 4px 10px rgba(0, 82, 217, 0.2);
}

/* 内联表单项 */
.form-inline {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #eef2f6;
}
.form-inline-label {
  font-size: 13px;
  color: #4b5563;
  font-weight: 600;
  letter-spacing: 0.2px;
}

/* 表单 · 现代化输入 */
.booking-form :deep(.el-form-item) {
  margin-bottom: 22px;
}
.booking-form :deep(.el-form-item__label) {
  font-size: 13px;
  color: #1f2937;
  font-weight: 600;
  padding-bottom: 8px;
  line-height: 1.4;
  letter-spacing: 0.2px;
}
.booking-form :deep(.el-form-item__error) {
  font-size: 12px;
  padding-top: 4px;
  color: #ef4444;
}
.booking-form :deep(.el-input__wrapper) {
  border-radius: 10px;
  background: #f8fafc;
  box-shadow: none !important;
  border: 1px solid #e2e8f0;
  padding: 8px 14px;
  transition: all 0.25s ease;
}
.booking-form :deep(.el-input__wrapper:hover) {
  border-color: #0052d9;
  background: #ffffff;
}
.booking-form :deep(.el-input.is-focus .el-input__wrapper) {
  border-color: #0052d9;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(0, 82, 217, 0.1) !important;
}
.booking-form :deep(.el-input__inner) {
  font-size: 14px;
  color: #1f2937;
  font-weight: 400;
}
.booking-form :deep(.el-textarea__inner) {
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  box-shadow: none;
  padding: 12px 14px;
  font-size: 14px;
  line-height: 1.7;
  transition: all 0.25s ease;
  color: #1f2937;
}
.booking-form :deep(.el-textarea__inner:hover) {
  border-color: #0052d9;
  background: #ffffff;
}
.booking-form :deep(.el-textarea__inner:focus) {
  border-color: #0052d9;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(0, 82, 217, 0.1);
}
.booking-form :deep(.el-textarea__inner::placeholder) { color: #9ca3af; }
.booking-form a {
  color: #0052d9;
  text-decoration: none;
  font-weight: 500;
}
.booking-form a:hover { text-decoration: underline; text-underline-offset: 3px; }
.booking-form :deep(.el-radio-button__inner) {
  border-color: #e2e8f0;
  border-radius: 10px !important;
  background: #f8fafc;
  color: #4b5563;
}
.booking-form :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: #0052d9; border-color: #0052d9; box-shadow: none; color: #fff;
}
.booking-form :deep(.el-checkbox__label) { font-size: 13px; color: #4b5563; }
.booking-form :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background: #0052d9;
  border-color: #0052d9;
  border-radius: 4px;
}
.booking-form :deep(.el-checkbox__inner) { border-radius: 4px; }
.booking-form :deep(.el-switch.is-checked .el-switch__core) {
  background: #0052d9;
  border-color: #0052d9;
}

/* 表单底部 */
.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  padding-top: 28px;
  border-top: 1px solid #e2e8f0;
}

:deep(.form-footer .el-button) { border-radius: 10px; font-weight: 600; }
:deep(.form-footer .el-button--primary) {
  background: linear-gradient(135deg, #0052d9 0%, #1890ff 100%);
  border-color: transparent;
  min-width: 200px;
  height: 52px;
  font-size: 15px;
  letter-spacing: 1px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 20px rgba(0, 82, 217, 0.25);
}
:deep(.form-footer .el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(0, 82, 217, 0.35);
  letter-spacing: 1.5px;
}

.form-hint {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
  letter-spacing: 0.2px;
}
.form-hint em {
  color: #ef4444;
  font-style: normal;
  font-weight: 700;
}

/* 预约摘要 · 卡片化 */
.summary-card {
  background: linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%);
  border: 1px solid #d0e7ff;
  border-radius: 16px;
  padding: 24px 24px;
  box-shadow: 0 4px 20px rgba(0, 82, 217, 0.06);
}

.summary-card h4 {
  font-size: 12px;
  color: #0052d9;
  margin: 0 0 18px;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 700;
}
.summary-card h4 .el-icon { color: #0052d9; font-size: 14px; }

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  font-size: 13px;
  align-items: center;
  border-bottom: 1px dashed #e2e8f0;
}
.summary-row:last-of-type { border-bottom: none; }
.summary-row span { color: #6b7280; font-size: 12px; }
.summary-row b { color: #1f2937; font-weight: 600; font-size: 13px; }
.summary-row b:empty::before,
.summary-row b.unset {
  content: var(--unset-text, '未选择');
  color: #cbd5e1;
  font-weight: 400;
  font-size: 12px;
  font-style: italic;
}
.summary-divider { height: 1px; background: linear-gradient(90deg, transparent, #d0e7ff, transparent); margin: 12px 0; }
.summary-row.total {
  padding-top: 14px;
  margin-top: 8px;
  border-top: 1px solid #d0e7ff;
  border-bottom: none;
}
.summary-row.total b { font-size: 13px; color: #111827; font-weight: 600; }
.summary-row.total b.free-tag {
  color: #0052d9;
  background: rgba(0, 82, 217, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 0.5px;
}
.summary-row.total b.free-tag::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #0052d9;
}

.my-bookings {
  background: #ffffff;
  border: 1px solid #eef2f6;
  border-radius: 16px;
  padding: 22px 24px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
}

.mb-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.mb-header h4 {
  font-size: 12px;
  color: #0052d9;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 700;
}
.mb-header h4 .el-icon { color: #0052d9; font-size: 14px; }
.mb-count {
  font-size: 12px;
  font-weight: 700;
  color: #0052d9;
  background: #f0f7ff;
  padding: 2px 10px;
  border-radius: 10px;
  font-variant-numeric: tabular-nums;
}

.mb-list { display: flex; flex-direction: column; gap: 0; }
.mb-item {
  padding: 14px 0;
  background: transparent;
  border-radius: 0;
  border-left: none;
  border-bottom: 1px solid #f1f5f9;
}
.mb-item:last-child { border-bottom: none; }
.mb-item.status-completed { opacity: 0.6; }
.mb-item.status-cancelled { opacity: 0.5; }

.mb-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.mb-counselor { font-size: 14px; font-weight: 700; color: #1f2937; letter-spacing: -0.2px; }
.mb-status {
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 10px;
  letter-spacing: 0.3px;
}
.mb-status.s-pending { color: #b45309; background: rgba(180, 83, 9, 0.1); }
.mb-status.s-confirmed { color: #0052d9; background: rgba(0, 82, 217, 0.1); }
.mb-status.s-completed { color: #6b7280; background: #f3f4f6; }
.mb-status.s-cancelled { color: #ef4444; background: rgba(239, 68, 68, 0.1); }

.mb-info { font-size: 12px; color: #9ca3af; letter-spacing: 0.2px; }
.mb-actions { margin-top: 10px; }
.mb-empty { font-size: 13px; color: #9ca3af; text-align: center; padding: 24px 0; letter-spacing: 0.3px; }

/* ============ 心理老师 · 杂志编辑式行 ============ */
.cons-ribbon {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  padding: 18px 0;
  border-top: 1px solid #0a0f1a;
  border-bottom: 1px solid #eef2f6;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.cons-ribbon .ribbon-search {
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #0a0f1a;
  padding: 4px 0;
  min-width: 220px;
}

.cons-ribbon .search-ico {
  font-size: 15px;
  color: #6b7280;
}

.cons-ribbon .ribbon-search input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #0a0f1a;
  font-family: inherit;
  width: 100%;
  padding: 4px 0;
}

.cons-ribbon .ribbon-search input::placeholder {
  color: #9ca3af;
}

.cons-filters { display: flex; gap: 10px; }

:deep(.cons-select .el-input__wrapper) {
  border-radius: 0;
  background: transparent;
  box-shadow: none !important;
  border: none;
  border-bottom: 1px solid #e2e8f0;
  padding: 4px 0;
}
:deep(.cons-select .el-input__wrapper:hover),
:deep(.cons-select .el-input.is-focus .el-input__wrapper) {
  border-bottom-color: #0a0f1a;
}
:deep(.cons-select .el-input__inner) { font-size: 13px; color: #1f2937; }
:deep(.cons-select) { width: 120px; }

/* 当前分类小标题 */
.rows-heading {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 40px 0 20px;
}

.rows-heading .heading-name {
  font-size: clamp(22px, 2.4vw, 30px);
  font-weight: 800;
  color: #0a0f1a;
  letter-spacing: -0.5px;
}

.rows-heading .heading-line {
  flex: 1;
  height: 1px;
  background: #eef2f6;
}

.rows-heading .heading-count {
  font-size: 12px;
  color: #9ca3af;
  font-weight: 600;
  letter-spacing: 1px;
  font-variant-numeric: tabular-nums;
}

/* 心理老师列表：横向编辑式行 */
.counselor-rows {
  display: flex;
  flex-direction: column;
  padding-right: 12px;
  overflow: visible;
}

.counselor-row {
  display: grid;
  grid-template-columns: 56px 52px 1fr 240px;
  gap: 24px;
  align-items: center;
  padding: 24px 0;
  border-bottom: 1px solid #eef2f6;
  cursor: pointer;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease;
  position: relative;
}

.counselor-row::before {
  content: '';
  position: absolute;
  left: -16px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 0;
  background: #0052d9;
  border-radius: 2px;
  transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.counselor-row:hover {
  transform: translateX(8px);
}

.counselor-row:hover::before {
  height: 60%;
}

.counselor-row:hover .row-title {
  color: #0052d9;
}

.row-number .num {
  font-size: 22px;
  font-weight: 800;
  color: #0a0f1a;
  letter-spacing: -0.5px;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.counselor-row:hover .row-number .num {
  color: #0052d9;
}

.row-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  flex-shrink: 0;
  letter-spacing: -0.5px;
}

.row-main {
  min-width: 0;
}

.row-title-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.row-title {
  font-size: clamp(17px, 1.4vw, 20px);
  font-weight: 700;
  color: #0a0f1a;
  margin: 0;
  line-height: 1.3;
  letter-spacing: -0.2px;
  transition: color 0.25s;
}

.row-title-sub {
  font-size: 12px;
  color: #9ca3af;
  letter-spacing: 0.2px;
}

.row-free {
  font-size: 10px;
  font-weight: 700;
  color: #0052d9;
  padding: 2px 8px;
  border: 1px solid #d0e7ff;
  border-radius: 4px;
  letter-spacing: 0.5px;
}

.row-desc {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.row-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.row-tag {
  font-size: 11px;
  color: #6b7280;
  padding: 2px 0;
  font-weight: 500;
}

.row-tag::before {
  content: '/ ';
  color: #d0d5dd;
}

.row-tag:first-child::before {
  content: '';
}

.row-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.row-meta .meta-rating {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  font-weight: 700;
  color: #0a0f1a;
  font-variant-numeric: tabular-nums;
}

.row-meta .meta-rating .el-icon {
  color: #f59e0b;
  font-size: 14px;
}

.row-meta .meta-sessions {
  font-size: 12px;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
}

.row-book {
  background: #0052d9;
  border: none;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  padding: 8px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-family: inherit;
  letter-spacing: 0.5px;
  transition: all 0.25s ease;
  box-shadow: 0 4px 12px rgba(0, 82, 217, 0.2);
}

.row-book:hover {
  background: #0040b8;
  box-shadow: 0 6px 18px rgba(0, 82, 217, 0.35);
  transform: translateY(-1px);
}

.row-arrow {
  font-size: 18px;
  color: #0052d9;
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.counselor-row:hover .row-arrow {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 900px) {
  .counselor-row {
    grid-template-columns: 40px 48px 1fr;
    gap: 16px;
  }
  .row-meta {
    display: none;
  }
}

.empty-tip { padding: 80px 0; }

/* ============ 咨询须知 · 编辑式 bento 布局 ============ */
.notice-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* —— 流程图全宽 hero —— */
.notice-hero {
  position: relative;
  padding: 28px 32px 30px;
  background: linear-gradient(135deg, #f8fbff 0%, #f0f7ff 100%);
  border: 1px solid #d0e7ff;
  border-radius: 22px;
  overflow: hidden;
}
.notice-hero::before {
  content: 'PROCESS';
  position: absolute;
  top: -20px;
  right: -10px;
  font-size: 110px;
  font-weight: 900;
  color: #0052d9;
  opacity: 0.05;
  letter-spacing: -4px;
  line-height: 1;
  pointer-events: none;
  user-select: none;
}
.hero-eyebrow {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 22px;
  position: relative;
  z-index: 1;
}
.hero-no {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #0052d9;
  background: #ffffff;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid #d0e7ff;
}
.hero-line { flex: 1; height: 1px; background: linear-gradient(90deg, #d0e7ff, transparent); }
.hero-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 2px;
  color: #6b7280;
  text-transform: uppercase;
}

.process-flow {
  display: flex;
  align-items: stretch;
  gap: 0;
  position: relative;
  z-index: 1;
}

.process-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  flex: 1;
  position: relative;
  padding: 0 28px;
  text-align: center;
}
.process-step:first-child { padding-left: 0; }
.process-step:last-child { padding-right: 0; }

/* 步骤间贯穿连接线 · 与数字圆同轴 */
.process-step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 24px;
  left: calc(50% + 28px);
  width: calc(100% - 56px);
  height: 2px;
  background: #d0e7ff;
  border-radius: 1px;
  z-index: 0;
}

.process-step .ps-arrow {
  position: absolute;
  top: 24px;
  left: calc(100% - 14px);
  transform: translate(-50%, -50%);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #d0e7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0052d9;
  font-size: 14px;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 82, 217, 0.1);
}

.ps-num {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #ffffff;
  border: 2px solid #0052d9;
  color: #0052d9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  letter-spacing: 0.5px;
  box-shadow: 0 6px 16px rgba(0, 82, 217, 0.15);
  font-family: Georgia, 'Times New Roman', serif;
  position: relative;
  z-index: 1;
}

.ps-content {
  background: #f8fbff;
  border: 1px solid #eef2f6;
  border-radius: 14px;
  padding: 16px 20px;
  transition: all 0.3s ease;
  text-align: center;
  max-width: 220px;
  box-sizing: border-box;
}
.ps-content:hover {
  border-color: #d0e7ff;
  box-shadow: 0 8px 20px rgba(0, 82, 217, 0.08);
  transform: translateY(-2px);
}
.ps-title { font-size: 15px; font-weight: 700; color: #1f2937; margin-bottom: 6px; letter-spacing: -0.2px; }
.ps-desc { font-size: 12.5px; color: #6b7280; line-height: 1.65; }

/* —— bento 非对称网格：4-8 / 8-4 zig-zag —— */
.notice-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
  align-items: stretch;
}
.notice-section.ns-01 { grid-column: span 4; grid-row: 1; }
.notice-section.ns-02 { grid-column: span 8; grid-row: 1; }
.notice-section.ns-03 { grid-column: 1 / span 8; grid-row: 2; }
.notice-section.ns-04 { grid-column: 9 / span 4; grid-row: 2; }

.notice-grid .notice-section {
  position: relative;
  padding: 32px 32px 28px;
  background: #ffffff;
  border: 1px solid #eef2f6;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(15, 23, 42, 0.03);
  min-height: 100%;
  box-sizing: border-box;
  transition: box-shadow 0.35s ease, transform 0.35s ease, border-color 0.35s ease;
  overflow: hidden;
}
.notice-grid .notice-section:hover {
  box-shadow: 0 14px 36px rgba(0, 82, 217, 0.1);
  transform: translateY(-4px);
  border-color: #d0e7ff;
}

/* 大号编辑式数字印章 */
.ns-stamp {
  position: absolute;
  top: 16px;
  right: 20px;
  font-size: 88px;
  font-weight: 900;
  color: #0052d9;
  opacity: 0.12;
  font-variant-numeric: tabular-nums;
  letter-spacing: -4px;
  line-height: 1;
  pointer-events: none;
  user-select: none;
  font-family: 'Georgia', 'Times New Roman', serif;
}
.notice-section.ns-02 .ns-stamp,
.notice-section.ns-03 .ns-stamp { right: auto; left: 20px; }

.notice-list { margin: 0; padding-left: 0; list-style: none; }
.notice-list li {
  font-size: 13px;
  color: #4b5563;
  line-height: 1.75;
  padding: 10px 0 10px 22px;
  border-bottom: 1px solid #f1f5f9;
  position: relative;
}
.notice-list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 18px;
  width: 10px;
  height: 10px;
  background: #f0f7ff;
  border: 2px solid #0052d9;
  border-radius: 50%;
}
.notice-list li:last-child { border-bottom: none; }

.notice-warn {
  display: flex;
  gap: 12px;
  margin-top: 18px;
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.15);
  border-left: 3px solid #ef4444;
  border-radius: 10px;
  font-size: 12.5px;
  color: #b91c1c;
  line-height: 1.65;
}
.notice-warn .el-icon { flex-shrink: 0; color: #ef4444; font-size: 16px; margin-top: 2px; }
.notice-warn.info {
  background: rgba(0, 82, 217, 0.05);
  border-color: rgba(0, 82, 217, 0.15);
  border-left-color: #0052d9;
  color: #1e40af;
}
.notice-warn.info .el-icon { color: #0052d9; }

/* —— 咨询准备：横向三栏 —— */
.prep-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}
.prep-block {
  padding: 14px 16px;
  background: #f8fbff;
  border-radius: 12px;
  border: 1px solid #eef2f6;
  border-top: 2px solid #0052d9;
}
.prep-block h4 {
  font-size: 12px;
  color: #0052d9;
  margin: 0 0 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 6px;
}
.prep-block h4::before {
  content: '';
  width: 14px;
  height: 2px;
  background: linear-gradient(90deg, #0052d9, transparent);
  border-radius: 2px;
}
.prep-block .notice-list li { padding: 6px 0 6px 18px; font-size: 12px; }
.prep-block .notice-list li::before { top: 12px; width: 8px; height: 8px; border-width: 1.5px; }

/* 服务说明 · 蓝色 banner */
.service-info-banner {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: linear-gradient(135deg, rgba(0, 82, 217, 0.08) 0%, rgba(24, 144, 255, 0.04) 100%);
  border: 1px solid rgba(0, 82, 217, 0.15);
  border-radius: 14px;
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;
}
.service-info-banner::before {
  content: '';
  position: absolute;
  top: -30px;
  right: -30px;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(0, 82, 217, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}
.service-info-banner .el-icon {
  font-size: 22px;
  color: #0052d9;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  background: #ffffff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 82, 217, 0.1);
  position: relative;
  z-index: 1;
}
.sib-title { font-size: 16px; font-weight: 700; color: #1f2937; letter-spacing: -0.2px; position: relative; z-index: 1; }
.sib-desc { font-size: 12px; color: #6b7280; margin-top: 4px; letter-spacing: 0.2px; position: relative; z-index: 1; }

.service-table {
  display: flex;
  flex-direction: column;
  gap: 0;
  background: #ffffff;
  border: 1px solid #eef2f6;
  border-radius: 14px;
  padding: 4px 20px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.03);
}

.service-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  background: transparent;
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.2s ease;
}
.service-row:hover { background: #f8fafc; }

.service-row:last-child { border-bottom: none; }

.sr-label {
  font-size: 13px;
  color: #6b7280;
  letter-spacing: 0.2px;
  font-weight: 500;
}
.sr-value { font-size: 14px; font-weight: 600; color: #1f2937; letter-spacing: -0.2px; }

/* ============ FAQ · 卡片化侧栏 ============ */
.faq-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 48px;
  align-items: flex-start;
}

.faq-sidebar {
  position: sticky;
  top: 96px;
  background: #ffffff;
  border: 1px solid #eef2f6;
  border-radius: 16px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.04);
}

.faq-cat {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  color: #4b5563;
  font-weight: 500;
  transition: all 0.25s ease;
  border: none;
  letter-spacing: 0.2px;
  background: transparent;
}

.faq-cat:hover { background: #f0f7ff; color: #0052d9; }
.faq-cat.active {
  background: linear-gradient(135deg, #0052d9 0%, #1890ff 100%);
  color: #ffffff;
  font-weight: 600;
  box-shadow: 0 6px 16px rgba(0, 82, 217, 0.25);
}
.faq-cat .el-icon { font-size: 16px; }
.faq-cat-count {
  margin-left: auto;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 8px;
  background: #f1f5f9;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
  font-weight: 600;
}
.faq-cat.active .faq-cat-count {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.faq-content { min-width: 0; }

.faq-search { margin-bottom: 28px; max-width: 460px; }
:deep(.faq-search .el-input__wrapper) {
  border-radius: 12px;
  background: #f8fafc;
  box-shadow: none !important;
  border: 1px solid #e2e8f0;
  padding: 8px 14px;
}
:deep(.faq-search .el-input__wrapper:hover) {
  border-color: #0052d9;
  background: #ffffff;
}
:deep(.faq-search.is-focus .el-input__wrapper) {
  border-color: #0052d9 !important;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(0, 82, 217, 0.1) !important;
}
:deep(.faq-search .el-input__inner) { font-size: 14px; color: #1f2937; }

:deep(.el-collapse) { border: none; }
:deep(.el-collapse-item__header) {
  background: transparent;
  border: none;
  border-bottom: 1px solid #eef2f6;
  border-radius: 0;
  padding: 0;
  margin-bottom: 0;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  height: 64px;
  letter-spacing: -0.2px;
  transition: color 0.2s ease;
}
:deep(.el-collapse-item__header:hover) { color: #0052d9; }
:deep(.el-collapse-item__wrap) { border: none; background: transparent; }
:deep(.el-collapse-item__content) {
  padding: 16px 0 24px;
  background: transparent;
  border-radius: 0;
  margin-bottom: 0;
  border: none;
}

.faq-q { display: flex; align-items: center; gap: 14px; color: #1f2937; }

.q-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: linear-gradient(135deg, #f0f7ff, #d0e7ff);
  color: #0052d9;
  border: none;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
  letter-spacing: 0.3px;
}

.faq-a {
  margin: 0 0 0 44px;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.85;
  letter-spacing: 0.1px;
  padding: 14px 18px;
  background: #f8fafc;
  border-radius: 10px;
  border-left: 3px solid #0052d9;
}

.faq-contact {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 40px;
  padding: 20px 24px;
  background: linear-gradient(135deg, rgba(0, 82, 217, 0.06) 0%, rgba(24, 144, 255, 0.02) 100%);
  border: 1px solid rgba(0, 82, 217, 0.12);
  border-radius: 14px;
  font-size: 14px;
  color: #4b5563;
}
.faq-contact .el-icon { color: #0052d9; font-size: 20px; }
.faq-contact a { color: #0052d9; text-decoration: none; font-weight: 600; }
.faq-contact a:hover { text-decoration: underline; text-underline-offset: 3px; }

/* ============ 咨询师详情弹窗 ============ */
.cd-content { padding: 0; }

.cd-header {
  display: flex;
  gap: 20px;
  align-items: center;
  padding-bottom: 24px;
  border-bottom: 1px solid #eef2f6;
  margin-bottom: 28px;
}

.cd-avatar {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.12);
  letter-spacing: -0.5px;
}

.cd-name { font-size: 22px; font-weight: 700; color: #1f2937; letter-spacing: -0.4px; }
.cd-title { font-size: 13px; color: #9ca3af; margin: 6px 0 10px; letter-spacing: 0.2px; }
.cd-stats {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #6b7280;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.2px;
}
.cd-stats .el-icon { color: #f59e0b; }
.cd-stats span { display: inline-flex; align-items: center; gap: 6px; }

.cd-section { margin-bottom: 28px; }
.cd-section h4 {
  font-size: 12px;
  color: #0052d9;
  margin: 0 0 14px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 8px;
}
.cd-section h4::before {
  content: '';
  width: 16px;
  height: 2px;
  background: linear-gradient(90deg, #0052d9, transparent);
  border-radius: 2px;
}
.cd-section p { font-size: 14px; color: #4b5563; line-height: 1.8; margin: 0; }

.cd-specs { display: flex; flex-wrap: wrap; gap: 6px; }
.cd-spec {
  background: #f0f7ff;
  color: #0052d9;
  font-size: 12px;
  padding: 5px 12px;
  border-radius: 8px;
  border: 1px solid rgba(0, 82, 217, 0.08);
  font-weight: 500;
  letter-spacing: 0.2px;
}

.cd-edu { margin: 0; padding-left: 22px; }
.cd-edu li {
  font-size: 13px;
  color: #4b5563;
  line-height: 1.8;
  padding: 8px 0;
  list-style: none;
  position: relative;
}
.cd-edu li::before {
  content: '';
  position: absolute;
  left: -22px;
  top: 16px;
  width: 8px;
  height: 8px;
  background: #f0f7ff;
  border: 2px solid #0052d9;
  border-radius: 50%;
}

.cd-review {
  padding: 16px 0;
  background: transparent;
  border-radius: 0;
  margin-bottom: 0;
  border-bottom: 1px solid #f1f5f9;
}
.cd-review:last-child { border-bottom: none; }
.rv-stars { display: flex; gap: 2px; color: #f59e0b; margin-bottom: 8px; font-size: 14px; }
.cd-review p { font-size: 13px; color: #4b5563; line-height: 1.8; margin: 0; }

/* ============ 响应式 ============ */
@media (max-width: 1200px) {
  .counseling-page { padding: 24px 32px 80px; }
  .booking-layout { grid-template-columns: 1fr 280px; gap: 48px; }
  .notice-grid { grid-template-columns: 1fr; gap: 24px; }
  .notice-section.ns-01,
  .notice-section.ns-02,
  .notice-section.ns-03,
  .notice-section.ns-04 { grid-column: 1; grid-row: auto; }
  .notice-layout { gap: 24px; }
  .prep-row { grid-template-columns: 1fr; }
  .step-block { padding: 32px 24px; }
}

@media (max-width: 900px) {
  .counseling-page { padding: 20px 24px 64px; }
  .intro-container { flex-direction: column; align-items: flex-start; gap: 32px; }
  .booking-layout { grid-template-columns: 1fr; gap: 40px; }
  .booking-aside { position: relative; top: 0; flex-direction: row; flex-wrap: wrap; gap: 20px; }
  .summary-card, .my-bookings { flex: 1 1 280px; }
  .faq-layout { grid-template-columns: 1fr; gap: 28px; }
  .faq-sidebar { position: relative; top: 0; flex-direction: row; overflow-x: auto; gap: 8px; padding: 8px; }
  .faq-cat { flex-shrink: 0; white-space: nowrap; }
  .process-flow { flex-direction: column; gap: 20px; padding: 28px 20px; }
  .process-step { padding: 0; flex-direction: row; align-items: center; }
  .ps-arrow { display: none; }
  .process-step::after { display: none; }
  .step-block { grid-template-columns: 64px 1fr; gap: 24px; padding: 28px 20px; }
  .step-num { font-size: 52px; }
  .step-title { font-size: 20px; }
}

@media (max-width: 768px) {
  .counseling-page { padding: 16px 16px 48px; }
  .booking-aside { flex-direction: column; }
  :deep(.main-tabs .el-tabs__item) { font-size: 13px; padding: 0 0 12px; letter-spacing: 0.2px; }
  :deep(.main-tabs .el-tabs__nav) { gap: 20px; }
  :deep(.main-tabs .el-tabs__nav-wrap) { overflow-x: auto; }
  .step-block { grid-template-columns: 1fr; gap: 12px; padding: 24px 18px; }
  .step-num { font-size: 40px; }
  .step-title { font-size: 18px; margin-bottom: 18px; }
  .form-footer { flex-direction: column-reverse; gap: 16px; align-items: stretch; }
  :deep(.form-footer .el-button--primary) { width: 100%; min-width: 0; }
  .type-options { gap: 8px; }
  .type-opt { padding: 10px 14px; }
  .to-name { font-size: 14px; }
  .cons-ribbon { flex-direction: column; align-items: stretch; gap: 14px; }
  .cons-filters { flex-wrap: wrap; }
  .faq-a { margin-left: 0; padding: 12px 14px; }
  .q-mark { width: 26px; height: 26px; }
}

/* ============ 暗夜模式适配 ============ */
html.dark .counselor-search,
html.dark .summary-card,
html.dark .my-bookings,
html.dark .booking-form-card,
html.dark .counselor-pick-card,
html.dark .mode-card,
html.dark .faq-sidebar,
html.dark .service-table,
html.dark .notice-grid .notice-section,
html.dark .prep-block {
  background: #1e293b !important;
  border-color: #334155 !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3) !important;
}

html.dark .process-flow {
  background: linear-gradient(135deg, #1e293b 0%, #182234 100%) !important;
  border-color: #334155 !important;
}

html.dark .notice-hero {
  background: linear-gradient(135deg, #1e293b 0%, #182234 100%) !important;
  border-color: #334155 !important;
}
html.dark .hero-no { background: #0f172a !important; border-color: #334155 !important; color: #93c5fd !important; }
html.dark .hero-label { color: #94a3b8 !important; }
html.dark .hero-line { background: linear-gradient(90deg, #334155, transparent) !important; }
html.dark .ps-num { background: #0f172a !important; border-color: #3b82f6 !important; color: #93c5fd !important; }
html.dark .ps-title { color: #f1f5f9 !important; }
html.dark .ps-desc { color: #94a3b8 !important; }
html.dark .ns-stamp { color: #3b82f6 !important; opacity: 0.12 !important; }

html.dark .section-title {
  color: #f1f5f9 !important;
  border-bottom-color: #334155 !important;
}

html.dark .section-title .el-icon {
  background: rgba(0, 82, 217, 0.18) !important;
}

html.dark .service-info-banner {
  background: rgba(0, 82, 217, 0.12) !important;
  border-color: rgba(0, 82, 217, 0.25) !important;
}

html.dark .service-info-banner .el-icon {
  background: #1e293b !important;
}

html.dark .notice-list li {
  color: #cbd5e1 !important;
  border-bottom-color: #334155 !important;
}

html.dark .notice-list li::before {
  background: #1e293b !important;
}

html.dark .notice-warn {
  background: rgba(239, 68, 68, 0.12) !important;
  border-color: rgba(239, 68, 68, 0.25) !important;
}

html.dark .row-title,
html.dark .row-number .num,
html.dark .meta-rating,
html.dark .ps-title,
html.dark .sib-title,
html.dark .sr-value,
html.dark .cover-title {
  color: #f1f5f9 !important;
}

html.dark .row-desc,
html.dark .row-title-sub,
html.dark .meta-sessions,
html.dark .ps-desc,
html.dark .sib-desc,
html.dark .sr-label,
html.dark .cover-desc,
html.dark .cover-eyebrow,
html.dark .cover-no {
  color: #94a3b8 !important;
}

html.dark .counselor-row {
  border-bottom-color: #334155 !important;
}

html.dark .module-cover {
  border-bottom-color: #334155 !important;
}

html.dark .module-cover .cover-line {
  background: linear-gradient(to right, #0052d9 0, #0052d9 56px, #334155 56px, #334155 100%);
}

html.dark .row-book {
  background: #0052d9 !important;
  color: #fff !important;
}

html.dark .type-hint,
html.dark .cs-count {
  background: rgba(0, 82, 217, 0.15) !important;
  border-color: rgba(0, 82, 217, 0.25) !important;
}
</style>

<style>
.counselor-popover.el-popover.el-popper {
  padding: 18px 20px !important;
  border-radius: 14px !important;
  border: 1px solid #eef2f6 !important;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.1) !important;
  background: #ffffff !important;
}
.pop-detail { font-size: 13px; }
.pop-head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f1f5f9;
}
.pop-avatar {
  width: 44px; height: 44px; border-radius: 12px;
  color: #fff; display: flex; align-items: center; justify-content: center;
  font-size: 18px; font-weight: 700;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.1);
}
.pop-name { font-size: 16px; font-weight: 700; color: #1f2937; letter-spacing: -0.2px; }
.pop-title { font-size: 12px; color: #9ca3af; margin-top: 4px; letter-spacing: 0.2px; }
.pop-stats { display: flex; gap: 14px; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; }
.pop-stats span { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: #6b7280; font-variant-numeric: tabular-nums; }
.pop-stats .el-icon { color: #0052d9; font-size: 13px; }
.pop-intro { font-size: 13px; color: #4b5563; line-height: 1.75; margin: 0; }
</style>
