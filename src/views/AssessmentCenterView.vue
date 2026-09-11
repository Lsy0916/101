<template>
  <div class="assessment-page">
    <!-- 主体功能区 -->
    <el-tabs v-model="mainTab" class="main-tabs" @tab-change="handleTabChange">
      <!-- 测评广场 -->
      <el-tab-pane :label="$t('assessment.tabs.scales')" name="scales">
        <div v-reveal class="module-cover">
          <div class="cover-top">
            <span class="cover-eyebrow">— Assessment</span>
            <span class="cover-no">No.{{ String(scaleList.length).padStart(2, '0') }}</span>
          </div>
          <h2 class="cover-title" v-html="$t('assessment.cover.scales.title')"></h2>
          <p class="cover-desc">{{ $t('assessment.cover.scales.desc') }}</p>
          <div class="cover-line"></div>
        </div>
        <!-- 编号式分类导航 + 极简搜索 -->
        <div v-reveal="{ delay: 80 }" class="scale-ribbon">
          <div class="ribbon-cats">
            <button
              v-for="cat in categories"
              :key="cat.key"
              class="ribbon-cat"
              :class="{ active: activeCategory === cat.key }"
              @click="activeCategory = cat.key"
            >
              <span class="cat-name">{{ cat.name }}</span>
              <span class="cat-count">({{ getCategoryCount(cat.key) }})</span>
            </button>
          </div>
          <div class="ribbon-search">
            <el-icon class="search-ico"><Search /></el-icon>
            <input v-model="searchQuery" :placeholder="$t('assessment.searchPlaceholder')" />
          </div>
        </div>

        <!-- 当前分类小标题 -->
        <div v-if="filteredScales.length > 0" class="rows-heading">
          <span class="heading-name">{{ getCategoryName(activeCategory) }}</span>
          <span class="heading-line"></span>
          <span class="heading-count">{{ String(filteredScales.length).padStart(2, '0') }} {{ $t('assessment.unit.items') }}</span>
        </div>

        <!-- 测评列表：横向编辑式行 -->
        <div v-if="filteredScales.length > 0" class="scale-rows">
          <div
            v-for="(scale, i) in filteredScales"
            :key="scale.key"
            class="scale-row"
            :class="{ 'is-completed': isCompleted(scale.key), 'is-unavailable': !scale.available }"
            @click="handleScaleClick(scale)"
          >
            <div class="row-number">
              <span class="num">{{ String(i + 1).padStart(2, '0') }}</span>
              <div class="row-icon" :class="'cat-' + scale.category">
                <el-icon><component :is="scale.icon" /></el-icon>
              </div>
            </div>
            <div class="row-main">
              <div class="row-title-wrap">
                <h3 class="row-title">{{ scale.name }}</h3>
                <span v-if="isCompleted(scale.key)" class="row-status done">{{ $t('assessment.status.completed') }}</span>
                <span v-else-if="!scale.available" class="row-status soon">{{ $t('assessment.status.comingSoon') }}</span>
              </div>
              <p class="row-desc">{{ scale.desc }}</p>
              <div class="row-tags">
                <span v-for="tag in scale.tags" :key="tag" class="row-tag">{{ tag }}</span>
              </div>
            </div>
            <div class="row-meta">
              <span class="meta-item"><el-icon><Timer /></el-icon>{{ scale.duration }}</span>
              <span class="meta-item"><el-icon><Collection /></el-icon>{{ scale.count }}{{ $t('assessment.unit.questions') }}</span>
              <span class="meta-difficulty">{{ scale.difficulty }}</span>
              <el-icon class="row-arrow"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="filter-empty">
          <el-empty :description="$t('assessment.empty')" :image-size="80" />
        </div>

        <!-- 提示 -->
        <div class="footer-tip">
          <el-icon><InfoFilled /></el-icon>
          <span>{{ $t('assessment.disclaimer') }}</span>
        </div>
      </el-tab-pane>

      <!-- 我的 -->
      <el-tab-pane :label="$t('assessment.tabs.mine')" name="mine">
        <div class="mine-wrapper">
          <!-- 模块封面 · 编辑式 -->
          <div v-reveal class="module-cover">
            <div class="cover-top">
              <span class="cover-eyebrow">— My Profile</span>
              <span class="cover-no">No.{{ String(userLevel).padStart(2, '0') }}</span>
            </div>
            <h2 class="cover-title" v-html="$t('assessment.cover.mine.title')"></h2>
            <p class="cover-desc">{{ $t('assessment.cover.mine.desc') }}</p>
            <div class="cover-line"></div>
          </div>

          <!-- 个人信息 · 编辑式定义列表 -->
          <div v-reveal="{ delay: 80 }" class="profile-editorial">
            <div class="profile-stats">
              <div class="profile-stat">
                <span class="ps-num">{{ totalCompleted }}</span>
                <span class="ps-label">{{ $t('assessment.profile.completed') }}</span>
              </div>
              <div class="profile-divider"></div>
              <div class="profile-stat">
                <span class="ps-num">{{ growthPoints }}</span>
                <span class="ps-label">{{ $t('assessment.profile.growthPoints') }}</span>
              </div>
              <div class="profile-divider"></div>
              <div class="profile-stat">
                <span class="ps-num">{{ assessmentDays }}</span>
                <span class="ps-label">{{ $t('assessment.profile.assessmentDays') }}</span>
              </div>
              <div class="profile-divider"></div>
              <div class="profile-stat">
                <span class="ps-num">{{ unlockedBadges }}</span>
                <span class="ps-label">{{ $t('assessment.profile.badges') }}</span>
              </div>
              <div class="profile-divider"></div>
              <div class="profile-stat level">
                <span class="ps-num">Lv.{{ userLevel }}</span>
                <span class="ps-label">{{ $t('assessment.profile.growthLevel') }}</span>
              </div>
            </div>
            <div class="profile-meta-row">
              <span class="pm-item"><el-icon><Calendar /></el-icon> {{ $t('assessment.profile.joinedOn', { date: joinDate }) }}</span>
              <span class="pm-sep">·</span>
              <span class="pm-item"><el-icon><Promotion /></el-icon> {{ growthStatus }}</span>
              <span class="pm-sep">·</span>
              <span class="pm-item">{{ $t('assessment.profile.toNextLevel', { points: pointsToNext }) }}</span>
            </div>
            <div class="level-bar-wrap">
              <div class="level-bar-track">
                <div class="level-bar-fill" :style="{ width: levelProgress + '%' }"></div>
              </div>
              <span class="level-bar-pct">{{ levelProgress }}%</span>
            </div>
          </div>

          <!-- 历史测评时间轴 -->
          <div v-reveal class="history-section">
            <div class="section-header">
              <h3><el-icon><Clock /></el-icon> {{ $t('assessment.profile.historyTitle') }}</h3>
              <el-button v-if="allHistory.length > 0" link type="primary" @click="clearAllHistory">{{ $t('assessment.profile.clearHistory') }}</el-button>
            </div>
            <div v-if="allHistory.length > 0" class="timeline">
              <div v-for="(record, idx) in sortedHistory" :key="idx" class="timeline-item">
                <div class="timeline-dot" :class="'dot-' + record.levelTag"></div>
                <div class="timeline-card">
                  <div class="timeline-top">
                    <span class="timeline-title">{{ record.scaleName }}</span>
                    <span class="timeline-date"><el-icon><Clock /></el-icon> {{ record.date }}</span>
                  </div>
                  <div class="timeline-body">
                    <el-tag :type="record.levelTag" size="small" effect="light" round>{{ record.level }}</el-tag>
                    <span class="timeline-score">{{ record.score }}{{ $t('assessment.unit.score') }}</span>
                    <span class="timeline-result-title">{{ record.title }}</span>
                  </div>
                  <div class="timeline-actions">
                    <el-button size="small" type="primary" plain @click="viewHistory(record)">{{ $t('assessment.profile.viewDetails') }}</el-button>
                    <el-button size="small" plain @click="retakeAssessment(record)">{{ $t('assessment.profile.retake') }}</el-button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <el-empty :description="$t('assessment.profile.historyEmpty')">
                <el-button type="primary" @click="mainTab = 'scales'">{{ $t('assessment.profile.goAssess') }}</el-button>
              </el-empty>
            </div>
          </div>

          <!-- 我的勋章 -->
          <div v-reveal="{ delay: 100 }" class="badges-section">
            <div class="section-header">
              <h3><el-icon><Medal /></el-icon> {{ $t('assessment.profile.badgesTitle') }}</h3>
              <span class="badges-count">{{ unlockedBadges }}/{{ badges.length }} {{ $t('assessment.profile.unlocked') }}</span>
            </div>
            <div class="badges-grid">
              <div
                v-for="badge in badges"
                :key="badge.key"
                class="badge-card"
                :class="{ unlocked: badge.unlocked, locked: !badge.unlocked }"
              >
                <div class="badge-icon">{{ badge.icon }}</div>
                <div class="badge-info">
                  <div class="badge-name">{{ badge.name }}</div>
                  <div class="badge-desc">{{ badge.desc }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- 成长看板 -->
      <el-tab-pane :label="$t('assessment.tabs.dashboard')" name="dashboard">
        <div class="dashboard-wrapper">
          <div v-reveal class="module-cover">
            <div class="cover-top">
              <span class="cover-eyebrow">— Growth Dashboard</span>
              <span class="cover-no">No.{{ String(totalCompleted).padStart(2, '0') }}</span>
            </div>
            <h2 class="cover-title" v-html="$t('assessment.cover.dashboard.title')"></h2>
            <p class="cover-desc">{{ $t('assessment.cover.dashboard.desc') }}</p>
            <div class="cover-line"></div>
          </div>
          <div v-reveal="{ delay: 80 }" class="dashboard-layout">
            <!-- 左侧导航 -->
            <aside class="dashboard-sidebar">
              <div
                v-for="item in dashboardNav"
                :key="item.key"
                class="nav-item"
                :class="{ active: activeDashboard === item.key }"
                @click="activeDashboard = item.key"
              >
                <el-icon><component :is="item.icon" /></el-icon>
                <span>{{ item.name }}</span>
              </div>
            </aside>

            <!-- 右侧内容 -->
            <div class="dashboard-content">
              <!-- 数据概览 -->
              <div v-show="activeDashboard === 'overview'" class="content-section">
                <div class="kpi-grid">
                  <div class="kpi-card">
                    <div class="kpi-icon"><el-icon><Check /></el-icon></div>
                    <div class="kpi-info">
                      <span class="kpi-value">{{ totalCompleted }}</span>
                      <span class="kpi-label">{{ $t('assessment.dashboard.kpi.total') }}</span>
                    </div>
                  </div>
                  <div class="kpi-card">
                    <div class="kpi-icon"><el-icon><TrophyBase /></el-icon></div>
                    <div class="kpi-info">
                      <span class="kpi-value">{{ growthPoints }}</span>
                      <span class="kpi-label">{{ $t('assessment.dashboard.kpi.points') }}</span>
                    </div>
                  </div>
                  <div class="kpi-card">
                    <div class="kpi-icon"><el-icon><Histogram /></el-icon></div>
                    <div class="kpi-info">
                      <span class="kpi-value">{{ avgScore }}</span>
                      <span class="kpi-label">{{ $t('assessment.dashboard.kpi.avg') }}</span>
                    </div>
                  </div>
                  <div class="kpi-card">
                    <div class="kpi-icon"><el-icon><Calendar /></el-icon></div>
                    <div class="kpi-info">
                      <span class="kpi-value">{{ assessmentDays }}</span>
                      <span class="kpi-label">{{ $t('assessment.dashboard.kpi.days') }}</span>
                    </div>
                  </div>
                </div>

                <div class="goal-banner">
                  <div class="goal-info">
                    <div class="goal-title"><el-icon><Aim /></el-icon> {{ $t('assessment.dashboard.monthlyGoal') }}</div>
                    <div class="goal-desc">{{ $t('assessment.dashboard.goalDesc', { target: monthlyGoal.target, done: monthlyGoal.current, dim: favoriteCategory }) }}</div>
                  </div>
                  <div class="goal-progress-wrap">
                    <div class="goal-progress-bar">
                      <div class="goal-progress-fill" :style="{ width: monthlyGoal.percent + '%' }"></div>
                    </div>
                    <span class="goal-percent">{{ monthlyGoal.percent }}%</span>
                  </div>
                </div>

                <div class="panel dashboard-card">
                  <div class="card-header">
                    <h3><el-icon><DataAnalysis /></el-icon> {{ $t('assessment.dashboard.quickEntry') }}</h3>
                  </div>
                  <div class="quick-entry-grid">
                    <div v-for="item in dashboardNav.slice(1)" :key="item.key" class="quick-entry-item" @click="activeDashboard = item.key">
                      <div class="quick-entry-icon"><el-icon><component :is="item.icon" /></el-icon></div>
                      <span>{{ item.name }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 身心能量 -->
              <div v-show="activeDashboard === 'radar'" class="content-section">
                <div class="panel dashboard-card">
                  <div class="card-header">
                    <h3>{{ $t('assessment.dashboard.radar') }}</h3>
                    <el-tooltip :content="$t('assessment.dashboard.radarTip')">
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                  <div class="radar-container radar-large">
                    <svg viewBox="0 0 200 200" class="radar-svg">
                      <polygon v-for="n in 5" :key="n" :points="getRadarPoints(n * 20)" class="radar-bg-poly" />
                      <line
v-for="i in 6" :key="i" x1="100" y1="100"
                        :x2="100 + 80 * Math.cos((i * 60 - 90) * Math.PI / 180)"
                        :y2="100 + 80 * Math.sin((i * 60 - 90) * Math.PI / 180)" class="radar-axis" />
                      <polygon :points="radarAvgPoints" class="radar-avg-poly" />
                      <polygon :points="radarDataPoints" class="radar-data-poly" />
                      <text
v-for="(label, i) in radarLabels" :key="i"
                        :x="100 + 95 * Math.cos((i * 60 - 90) * Math.PI / 180)"
                        :y="100 + 95 * Math.sin((i * 60 - 90) * Math.PI / 180)"
                        class="radar-label">{{ label }}</text>
                    </svg>
                  </div>
                  <div class="radar-legend">
                    <div class="legend-item"><span class="dot self"></span> {{ $t('assessment.dashboard.yourStatus') }}</div>
                    <div class="legend-item"><span class="dot avg"></span> {{ $t('assessment.dashboard.groupAvg') }}</div>
                  </div>
                </div>
              </div>

              <!-- 情绪趋势 -->
              <div v-show="activeDashboard === 'trend'" class="content-section">
                <div class="panel dashboard-card">
                  <div class="card-header">
                    <h3>{{ $t('assessment.dashboard.moodTrend') }}</h3>
                    <div class="trend-controls">
                      <div class="range-tabs">
                        <span :class="{ active: trendRange === '7d' }" @click="trendRange = '7d'">{{ $t('assessment.dashboard.range7') }}</span>
                        <span :class="{ active: trendRange === '30d' }" @click="trendRange = '30d'">{{ $t('assessment.dashboard.range30') }}</span>
                        <span :class="{ active: trendRange === 'all' }" @click="trendRange = 'all'">{{ $t('assessment.dashboard.rangeAll') }}</span>
                      </div>
                      <div class="chart-legend">
                        <span class="legend-dot phq"></span> PHQ-9
                        <span class="legend-dot gad"></span> GAD-7
                      </div>
                    </div>
                  </div>
                  <div class="trend-chart-container trend-large">
                    <div class="y-axis">
                      <span>{{ $t('assessment.dashboard.high') }}</span><span>{{ $t('assessment.dashboard.mid') }}</span><span>{{ $t('assessment.dashboard.low') }}</span>
                    </div>
                    <div class="chart-area">
                      <div v-if="trendAvgLine > 0" class="avg-line" :style="{ bottom: trendAvgLine + '%' }">
                        <span class="avg-label">{{ $t('assessment.dashboard.avgLabel') }} {{ trendAvgLine }}%</span>
                      </div>
                      <div v-for="(point, idx) in trendData" :key="idx" class="trend-bar-group">
                        <div v-if="point.phq > 0" class="bar phq" :style="{ height: point.phq + '%' }"></div>
                        <div v-if="point.gad > 0" class="bar gad" :style="{ height: point.gad + '%' }"></div>
                        <div class="bar-date">{{ point.date }}</div>
                      </div>
                      <div v-if="trendData.length === 0" class="chart-empty">{{ $t('assessment.dashboard.noTrendData') }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 测评分布 -->
              <div v-show="activeDashboard === 'distribution'" class="content-section">
                <div class="panel dashboard-card">
                  <div class="card-header">
                    <h3><el-icon><PieChart /></el-icon> {{ $t('assessment.dashboard.typeDist') }}</h3>
                  </div>
                  <div v-if="categoryDistribution.length > 0" class="donut-wrapper donut-large">
                    <svg viewBox="0 0 180 180" class="donut-svg donut-svg-large">
                      <template v-for="(seg, i) in donutSegments" :key="i">
                        <path v-if="!seg.isFull" :d="seg.path" :fill="seg.color" opacity="0.85" />
                        <circle v-else cx="90" cy="90" r="70" :fill="seg.color" opacity="0.85" />
                      </template>
                      <text x="90" y="84" text-anchor="middle" class="donut-center-val">{{ totalCompleted }}</text>
                      <text x="90" y="102" text-anchor="middle" class="donut-center-label">{{ $t('assessment.dashboard.totalLabel') }}</text>
                    </svg>
                    <div class="donut-legend">
                      <div v-for="(d, i) in categoryDistribution" :key="i" class="donut-legend-item">
                        <span class="legend-dot" :style="{ background: d.color }"></span>
                        <span class="legend-name">{{ d.name }}</span>
                        <span class="legend-val">{{ d.value }} ({{ d.percent }}%)</span>
                      </div>
                    </div>
                  </div>
                  <div v-else class="chart-empty-state">
                    <el-empty :description="$t('assessment.dashboard.distEmpty')" :image-size="80" />
                  </div>
                </div>
              </div>

              <!-- AI 洞察 -->
              <div v-show="activeDashboard === 'ai'" class="content-section">
                <div class="panel dashboard-card ai-summary-card">
                  <div class="ai-header">
                    <div class="ai-icon"><el-icon><MagicStick /></el-icon></div>
                    <h3>{{ $t('assessment.dashboard.aiInsight') }}</h3>
                  </div>
                  <div class="ai-body">
                    <div v-if="allHistory.length > 0" class="ai-insight-grid">
                      <div class="insight-item">
                        <div class="i-title">{{ $t('assessment.dashboard.summary') }}</div>
                        <p>{{ aiInsights.summary }}</p>
                      </div>
                      <div class="insight-item insight-strength">
                        <div class="i-title">{{ $t('assessment.dashboard.strength') }}</div>
                        <p>{{ aiInsights.strength }}</p>
                      </div>
                      <div class="insight-item insight-risk">
                        <div class="i-title">{{ $t('assessment.dashboard.risk') }}</div>
                        <p>{{ aiInsights.risk }}</p>
                      </div>
                      <div class="insight-item insight-suggestion">
                        <div class="i-title">{{ $t('assessment.dashboard.suggestion') }}</div>
                        <p>{{ aiInsights.suggestion }}</p>
                      </div>
                    </div>
                    <div v-else class="ai-empty">
                      <p>{{ $t('assessment.dashboard.aiEmpty') }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 进步对比 -->
              <div v-show="activeDashboard === 'progress'" class="content-section">
                <div class="panel dashboard-card">
                  <div class="card-header">
                    <h3><el-icon><TrendCharts /></el-icon> {{ $t('assessment.dashboard.progress') }}</h3>
                  </div>
                  <div v-if="progressComparison.length > 0" class="comparison-list">
                    <div v-for="(cmp, idx) in progressComparison" :key="idx" class="comparison-item">
                      <div class="cmp-info">
                        <div class="cmp-name">{{ cmp.scaleName }}</div>
                        <div class="cmp-date">{{ $t('assessment.dashboard.recent') }}{{ cmp.date }}</div>
                      </div>
                      <div class="cmp-scores">
                        <span class="cmp-prev">{{ cmp.prevScore }}</span>
                        <el-icon class="cmp-arrow" :class="cmp.trend">
                          <ArrowRight v-if="cmp.diff === 0" />
                          <ArrowUpBold v-else-if="(cmp.diff > 0 && !cmp.isLowerBetter) || (cmp.diff < 0 && cmp.isLowerBetter)" />
                          <ArrowDownBold v-else />
                        </el-icon>
                        <span class="cmp-curr">{{ cmp.currScore }}</span>
                        <span class="cmp-diff" :class="(cmp.isLowerBetter ? cmp.diff < 0 : cmp.diff > 0) ? 'good' : 'bad'">
                          {{ cmp.diff > 0 ? '+' : '' }}{{ cmp.diff }}
                        </span>
                      </div>
                      <div class="cmp-tag" :class="(cmp.isLowerBetter ? cmp.diff < 0 : cmp.diff > 0) ? 'good' : (cmp.diff === 0 ? 'stable' : 'bad')">
                        {{ cmp.isLowerBetter ? (cmp.diff < 0 ? $t('assessment.dashboard.improve') : cmp.diff > 0 ? $t('assessment.dashboard.attention') : $t('assessment.dashboard.flat')) : (cmp.diff > 0 ? $t('assessment.dashboard.up') : cmp.diff < 0 ? $t('assessment.dashboard.down') : $t('assessment.dashboard.flat')) }}
                      </div>
                    </div>
                  </div>
                  <div v-else class="chart-empty-state">
                    <el-empty :description="$t('assessment.dashboard.progressEmpty')" :image-size="80" />
                  </div>
                </div>
              </div>

              <!-- 智能推荐 -->
              <div v-show="activeDashboard === 'recommend'" class="content-section">
                <div class="panel dashboard-card recommend-card">
                  <div class="card-header">
                    <h3><el-icon><MagicStick /></el-icon> {{ $t('assessment.dashboard.recommend') }}</h3>
                  </div>
                  <div class="recommend-list">
                    <div v-for="(rec, idx) in recommendations" :key="idx" class="recommend-item" @click="goToRecommendation(rec)">
                      <div class="rec-icon" :class="'cat-' + (rec.scale?.category || '')">
                        <el-icon><component :is="rec.scale?.icon" /></el-icon>
                      </div>
                      <div class="rec-info">
                        <div class="rec-name">{{ rec.scale?.name }}</div>
                        <div class="rec-reason">{{ rec.reason }}</div>
                      </div>
                      <el-icon class="rec-arrow"><ArrowRight /></el-icon>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 历史足迹 -->
              <div v-show="activeDashboard === 'history'" class="content-section">
                <div class="panel dashboard-card">
                  <div class="card-header">
                    <h3><el-icon><List /></el-icon> {{ $t('assessment.dashboard.history') }}</h3>
                    <div class="history-actions">
                      <el-select v-model="historyFilter" size="small" class="history-filter" :placeholder="$t('assessment.dashboard.filterScale')">
                        <el-option v-for="opt in historyFilterOptions" :key="opt.key" :label="opt.label" :value="opt.key" />
                      </el-select>
                      <el-button link type="primary" @click="exportHistory">
                        <el-icon><Download /></el-icon> {{ $t('assessment.dashboard.exportCsv') }}
                      </el-button>
                    </div>
                  </div>
                  <div class="history-table-wrapper">
                    <el-table :data="filteredHistory" stripe style="width: 100%" max-height="500">
                      <el-table-column prop="date" :label="$t('assessment.dashboard.col.date')" width="120" />
                      <el-table-column prop="scaleName" :label="$t('assessment.dashboard.col.scale')" />
                      <el-table-column :label="$t('assessment.dashboard.col.score')" width="80">
                        <template #default="scope">{{ scope.row.score }}</template>
                      </el-table-column>
                      <el-table-column :label="$t('assessment.dashboard.col.conclusion')" width="120">
                        <template #default="scope">
                          <el-tag :type="scope.row.levelTag" size="small">{{ scope.row.level }}</el-tag>
                        </template>
                      </el-table-column>
                      <el-table-column :label="$t('assessment.dashboard.col.action')" width="80">
                        <template #default="scope">
                          <el-button link type="primary" @click="viewHistory(scope.row)">{{ $t('assessment.dashboard.detail') }}</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                    <div v-if="allHistory.length === 0" class="history-empty">{{ $t('assessment.dashboard.noHistory') }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 测评介绍 / 结果弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      width="640px"
      class="scale-dialog"
      align-center
      :show-close="true"
    >
      <!-- 介绍模式 -->
      <div v-if="dialogMode === 'intro' && currentScale" class="intro-content">
        <div class="intro-header">
          <div class="scale-type-tag" :class="'cat-' + currentScaleInfo?.category">
            {{ getCategoryName(currentScaleInfo?.category) }}
          </div>
          <h2>{{ currentScale.name }}</h2>
          <p class="scale-desc">{{ currentScale.description }}</p>
        </div>

        <div class="intro-details">
          <div class="detail-item">
            <el-icon><Timer /></el-icon>
            <div class="item-text">
              <span class="label">{{ $t('assessment.dialog.estimatedTime') }}</span>
              <span class="val">{{ currentScaleInfo?.duration }}</span>
            </div>
          </div>
          <div class="detail-item">
            <el-icon><Collection /></el-icon>
            <div class="item-text">
              <span class="label">{{ $t('assessment.dialog.questionCount') }}</span>
              <span class="val">{{ currentScaleInfo?.count }} {{ $t('assessment.unit.questions') }}</span>
            </div>
          </div>
          <div class="detail-item">
            <el-icon><Star /></el-icon>
            <div class="item-text">
              <span class="label">{{ $t('assessment.dialog.reliability') }}</span>
              <span class="val">{{ $t('assessment.dialog.reliabilityHigh') }}</span>
            </div>
          </div>
        </div>

        <div class="intro-tips">
          <h4><el-icon><InfoFilled /></el-icon> {{ $t('assessment.dialog.notice') }}</h4>
          <ul>
            <li>{{ $t('assessment.dialog.tip1') }}</li>
            <li>{{ $t('assessment.dialog.tip2') }}</li>
            <li>{{ $t('assessment.dialog.tip3') }}</li>
          </ul>
        </div>

        <div class="intro-actions">
          <button class="start-btn" @click="startAssessment">
            <span>{{ $t('assessment.dialog.start') }}</span>
            <el-icon><ArrowRight /></el-icon>
          </button>
        </div>
      </div>

      <!-- 结果模式 -->
      <div v-else-if="dialogMode === 'result' && result" class="result-content">
        <div class="result-summary-card">
          <div class="res-left">
            <div class="res-badge" :type="result?.levelTag">{{ result?.level }}</div>
            <h2>{{ result?.title }}</h2>
            <p class="res-date">{{ $t('assessment.dialog.completedOn', { date: result?.date }) }}</p>
          </div>
          <div class="res-right">
            <div class="res-score-circle" :style="{ borderColor: getLevelColor(result?.levelTag) }">
              <span class="score-val">{{ result?.score }}</span>
              <span class="score-unit">{{ activeScaleKey === 'mbti' ? '类型' : $t('assessment.unit.score') }}</span>
            </div>
          </div>
        </div>

        <div class="result-body">
          <div class="insight-grid">
            <div class="insight-card">
              <h3><el-icon><Compass /></el-icon> {{ $t('assessment.dialog.deepAnalysis') }}</h3>
              <p>{{ result?.insight }}</p>
            </div>
            <div class="insight-card highlight">
              <h3><el-icon><Promotion /></el-icon> {{ $t('assessment.dialog.actionSuggestion') }}</h3>
              <p>{{ result?.suggestion }}</p>
            </div>
          </div>

          <div v-if="activeScaleKey === 'mbti'" class="mbti-details">
            <h3>{{ $t('assessment.dialog.mbtiDim') }}</h3>
            <div class="mbti-bars">
              <div v-for="dim in mbtiScores" :key="dim.left" class="mbti-bar-item">
                <span class="dim-l">{{ dim.left }}</span>
                <div class="bar-track">
                  <div class="bar-fill" :style="{ width: dim.percent + '%', left: dim.isLeft ? '0' : 'auto', right: dim.isLeft ? 'auto' : '0' }"></div>
                </div>
                <span class="dim-r">{{ dim.right }}</span>
              </div>
            </div>
          </div>

          <div v-if="activeScaleKey === 'riasec'" class="riasec-details">
            <h3>{{ $t('assessment.dialog.riasecDim') }}</h3>
            <div class="riasec-bars">
              <div v-for="dim in riasecScores" :key="dim.key" class="r-bar-item">
                <div class="r-info">
                  <span class="r-name">{{ dim.name }} ({{ dim.key }})</span>
                  <span class="r-val">{{ dim.score }}</span>
                </div>
                <el-progress :percentage="(dim.score/15)*100" :color="dim.color" :show-text="false" />
              </div>
            </div>
          </div>
        </div>

        <div class="result-footer">
          <el-button @click="startAssessment">{{ $t('assessment.dialog.retake') }}</el-button>
          <el-button type="primary" @click="mockDownload">{{ $t('assessment.dialog.saveReport') }}</el-button>
          <el-button plain @click="mockShare">{{ $t('assessment.dialog.share') }}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import {
  Check,
  MagicStick,
  InfoFilled,
  Compass,
  Promotion,
  TrendCharts,
  Collection,
  Star,
  QuestionFilled,
  Download,
  Search,
  Timer,
  ArrowRight,
  Aim,
  TrophyBase,
  Medal,
  Clock,
  Calendar,
  Histogram,
  DataAnalysis,
  ArrowUpBold,
  ArrowDownBold,
  PieChart,
  List
} from '@element-plus/icons-vue'

// --- 类型定义 ---
/** 测评列表条目（广场卡片） */
interface ScaleInfo {
  key: string
  name: string
  desc: string
  duration: string
  count: number
  category: string
  icon: string
  difficulty: string
  available: boolean
  tags: string[]
}

/** 单条测评记录（localStorage 持久化） */
interface AssessmentRecord {
  scaleKey: string
  scaleName: string
  date: string
  score: number
  level: string
  levelTag: string
  title: string
  insight: string
  suggestion: string
  details: Record<string, number>
  duration: number
}

interface ScaleResult {
  level: string
  levelTag: string
  title: string
  insight: string
  suggestion: string
}

interface ScaleQuestion {
  id: number
  text: string
  type?: string
  dim?: string
}

interface ScaleDefinition {
  name: string
  description: string
  optionType: 'frequency' | 'agreement' | 'mbti'
  questions: ScaleQuestion[]
  calc: (score: number, details: Record<string, number>) => ScaleResult
}

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const mainTab = ref('scales')
const searchQuery = ref('')
const activeCategory = ref('all')

// 存储 Key
const STORAGE_KEY = 'edu_assessment_records'

// --- 分类定义 ---
const categories = [
  { key: 'all', name: '全部' },
  { key: 'mental', name: '心理健康' },
  { key: 'career', name: '生涯发展' },
  { key: 'cognitive', name: '认知能力' },
  { key: 'esports', name: '电竞能力' },
  { key: 'learning', name: '学习风格' },
  { key: 'social', name: '人际关系' }
]

function getCategoryName(key?: string) {
  if (key === 'all') return '全部测评'
  return categories.find(c => c.key === key)?.name || '全部测评'
}

function getCategoryCount(key: string) {
  if (key === 'all') return scaleList.length
  return scaleList.filter(s => s.category === key).length
}

// --- 测评列表（卡片展示用） ---
const scaleList: ScaleInfo[] = [
  // 心理健康
  { key: 'phq9', name: '抑郁自评 PHQ-9', desc: '评估近两周情绪低落与兴趣减退程度', duration: '3min', count: 9, category: 'mental', icon: 'TrendCharts', difficulty: '入门', available: true, tags: ['情绪', '自评'] },
  { key: 'gad7', name: '焦虑自评 GAD-7', desc: '识别紧张、担忧与焦虑状态', duration: '3min', count: 7, category: 'mental', icon: 'Odometer', difficulty: '入门', available: true, tags: ['焦虑', '自评'] },
  { key: 'pss', name: '压力感知 PSS-10', desc: '测评生活压力感知水平', duration: '5min', count: 10, category: 'mental', icon: 'Compass', difficulty: '入门', available: false, tags: ['压力'] },
  // 生涯发展
  { key: 'riasec', name: '职业兴趣 RIASEC', desc: '探索霍兰德职业兴趣代码', duration: '8min', count: 18, category: 'career', icon: 'User', difficulty: '进阶', available: true, tags: ['职业', '兴趣'] },
  { key: 'mbti', name: '性格倾向 MBTI', desc: '了解性格心理偏好与类型', duration: '10min', count: 20, category: 'career', icon: 'Collection', difficulty: '进阶', available: true, tags: ['性格', '类型'] },
  // 认知能力
  { key: 'reaction', name: '反应速度测试', desc: '测量视觉反应与决策速度', duration: '2min', count: 10, category: 'cognitive', icon: 'Lightning', difficulty: '入门', available: false, tags: ['反应', '速度'] },
  { key: 'memory', name: '短时记忆测评', desc: '评估工作记忆容量与精度', duration: '5min', count: 8, category: 'cognitive', icon: 'Cpu', difficulty: '进阶', available: false, tags: ['记忆'] },
  { key: 'logic', name: '逻辑推理测试', desc: '测评演绎与归纳推理能力', duration: '8min', count: 12, category: 'cognitive', icon: 'Opportunity', difficulty: '进阶', available: false, tags: ['逻辑'] },
  // 电竞能力
  { key: 'aim', name: '瞄准精度测试', desc: '测试鼠标控制与瞄准精度', duration: '3min', count: 5, category: 'esports', icon: 'Aim', difficulty: '入门', available: false, tags: ['FPS', '精度'] },
  { key: 'flick', name: '快速转向反应', desc: '评估瞬时转向与瞄准能力', duration: '4min', count: 8, category: 'esports', icon: 'Aim', difficulty: '进阶', available: false, tags: ['FPS', '反应'] },
  { key: 'decision', name: '瞬时决策测试', desc: '评估高压下的决策速度', duration: '4min', count: 10, category: 'esports', icon: 'Lightning', difficulty: '进阶', available: false, tags: ['决策', '反应'] },
  // 学习风格
  { key: 'vark', name: '学习风格 VARK', desc: '识别视觉/听觉/读写/动觉偏好', duration: '5min', count: 16, category: 'learning', icon: 'Reading', difficulty: '入门', available: false, tags: ['学习'] },
  // 人际关系
  { key: 'sas', name: '社交焦虑量表', desc: '评估社交互动中的焦虑水平', duration: '5min', count: 20, category: 'social', icon: 'ChatDotRound', difficulty: '进阶', available: false, tags: ['社交'] },
  { key: 'eq', name: '共情能力自评', desc: '测评情感共情与理解水平', duration: '6min', count: 15, category: 'social', icon: 'Connection', difficulty: '进阶', available: false, tags: ['共情'] }
]

const filteredScales = computed(() => {
  return scaleList.filter(scale => {
    const matchesSearch = scale.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          scale.desc.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          scale.tags.some(t => t.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchesCategory = activeCategory.value === 'all' || scale.category === activeCategory.value
    return matchesSearch && matchesCategory
  })
})

const scales: Record<string, ScaleDefinition> = {
  phq9: {
    name: '抑郁自评量表 PHQ-9',
    description: '通过评估过去两周的心情状态，了解您的情绪健康水平。',
    optionType: 'frequency',
    questions: [
      { id: 1, text: '做事提不起劲，或没有乐趣' },
      { id: 2, text: '感到心情低落、沮丧或绝望' },
      { id: 3, text: '入睡困难、睡得不稳或睡得太多' },
      { id: 4, text: '感到疲倦或没有劲' },
      { id: 5, text: '胃口不好或吃得太多' },
      { id: 6, text: '觉得自己很糟，或觉得自己很失败' },
      { id: 7, text: '对事物专注有困难，例如看报纸或看电视' },
      { id: 8, text: '动作或说话速度缓慢到别人都能察觉' },
      { id: 9, text: '有不如死掉或想伤害自己的念头' }
    ],
    calc: (score) => {
      if (score <= 4) return { level: '健康', levelTag: 'success', title: '情绪状态良好', insight: '您目前情绪非常稳定，心理韧性较强。', suggestion: '继续保持良好的生活作息与社交习惯。' }
      if (score <= 9) return { level: '轻度', levelTag: 'info', title: '情绪稍有波动', insight: '近期可能面临一些压力，导致情绪轻微受压。', suggestion: '尝试深呼吸或冥想，多与亲友交流。' }
      if (score <= 14) return { level: '中度', levelTag: 'warning', title: '情绪负荷较重', insight: '您的情绪状态已开始影响日常生活。', suggestion: '建议咨询心理老师或尝试系统的压力管理。' }
      return { level: '重度', levelTag: 'danger', title: '需要尽快关注', insight: '情绪陷入显著低谷，请务必寻求专业帮助。', suggestion: '请立即联系专业心理咨询机构，您并不孤单。' }
    }
  },
  gad7: {
    name: '焦虑自评量表 GAD-7',
    description: '用于识别过去两周内的焦虑、紧张和担忧程度。',
    optionType: 'frequency',
    questions: [
      { id: 1, text: '感到紧张、焦虑或心情不安' },
      { id: 2, text: '无法停止或控制担忧' },
      { id: 3, text: '对各种各样的事情担忧过多' },
      { id: 4, text: '很难放松下来' },
      { id: 5, text: '由于不安而无法静坐' },
      { id: 6, text: '变得容易烦躁或急躁' },
      { id: 7, text: '感到好像有什么可怕的事会发生' }
    ],
    calc: (score) => {
      if (score <= 4) return { level: '正常', levelTag: 'success', title: '心态平和', insight: '您具备良好的焦虑过滤能力。', suggestion: '保持目前的压力应对策略。' }
      if (score <= 9) return { level: '轻度', levelTag: 'info', title: '存在一定担忧', insight: '对未来的不确定性感到一些不安。', suggestion: '练习正念，减少对结果的过度纠结。' }
      return { level: '显著', levelTag: 'warning', title: '建议情绪疏导', insight: '过度担忧可能已导致心理耗竭。', suggestion: '寻求支持，将担忧清单化并逐一解决。' }
    }
  },
  riasec: {
    name: '霍兰德职业兴趣 RIASEC',
    description: '探索您的职业兴趣倾向，匹配最适合的职业环境。',
    optionType: 'agreement',
    questions: [
      { id: 1, text: '我喜欢修补电器设备或机械', type: 'R' },
      { id: 2, text: '我喜欢进行科学实验或研究', type: 'I' },
      { id: 3, text: '我喜欢创作绘画、设计或摄影', type: 'A' },
      { id: 4, text: '我喜欢参加公益活动或帮助他人', type: 'S' },
      { id: 5, text: '我喜欢说服他人或领导团队', type: 'E' },
      { id: 6, text: '我喜欢整理文档或处理精确数据', type: 'C' },
      { id: 7, text: '我喜欢操作复杂的工具或仪器', type: 'R' },
      { id: 8, text: '我喜欢分析复杂的逻辑问题', type: 'I' },
      { id: 9, text: '我喜欢写诗、写小说或进行表演', type: 'A' },
      { id: 10, text: '我喜欢教导他人知识或技能', type: 'S' },
      { id: 11, text: '我喜欢策划并启动一个商业项目', type: 'E' },
      { id: 12, text: '我喜欢按照既定流程精确办事', type: 'C' },
      { id: 13, text: '我喜欢在户外从事体力活动', type: 'R' },
      { id: 14, text: '我喜欢钻研学术理论', type: 'I' },
      { id: 15, text: '我喜欢追求独特的美学表达', type: 'A' },
      { id: 16, text: '我喜欢倾听他人的情感烦恼', type: 'S' },
      { id: 17, text: '我喜欢在竞争环境中赢得胜利', type: 'E' },
      { id: 18, text: '我喜欢管理财务报表', type: 'C' }
    ],
    calc: (score, details) => {
      const sorted = Object.entries(details).sort((a, b) => b[1] - a[1])
      const code = sorted.slice(0, 3).map(i => i[0]).join('')
      const typeMap: Record<string, string> = { R: '现实', I: '研究', A: '艺术', S: '社会', E: '企业', C: '常规' }
      return {
        level: code,
        levelTag: 'primary',
        title: '职业兴趣代码：' + code,
        insight: `您最突出的兴趣是 ${typeMap[code[0]]} 型。这意味着您在 ${typeMap[code[0]]}、${typeMap[code[1]]} 领域有很强的动力。`,
        suggestion: `建议关注 ${code.includes('I') ? '科研、技术、医疗' : ''} ${code.includes('S') ? '教育、咨询、公共服务' : ''} ${code.includes('A') ? '传媒、设计、艺术' : ''} 等领域。`
      }
    }
  },
  mbti: {
    name: '性格倾向自评 (简版 MBTI)',
    description: '探索您的心理偏好，了解您获取能量、收集信息及决策的方式。',
    optionType: 'mbti',
    questions: [
      { id: 1, text: '在社交聚会中，我倾向于：A.活跃参与；B.静观其变', dim: 'EI' },
      { id: 2, text: '我更喜欢：A.关注现实细节；B.想象未来可能性', dim: 'SN' },
      { id: 3, text: '决策时我更看重：A.逻辑分析；B.情感价值', dim: 'TF' },
      { id: 4, text: '生活方式上我倾向：A.有计划有组织；B.随性且开放', dim: 'JP' },
      { id: 5, text: '独自一人让我：A.感到无聊；B.感到充能', dim: 'EI' },
      { id: 6, text: '我更信任：A.经验；B.直觉', dim: 'SN' },
      { id: 7, text: '我会被描述为：A.理性的；B.感性的', dim: 'TF' },
      { id: 8, text: '面对最后期限，我：A.提前完成；B.最后一刻冲刺', dim: 'JP' },
      { id: 9, text: '说话前：A.经常直接说出；B.先在脑中构思', dim: 'EI' },
      { id: 10, text: '处理问题时：A.脚踏实地；B.脑洞大开', dim: 'SN' }
    ],
    calc: (score, details) => {
      const type = (details.E >= details.I ? 'E' : 'I') +
                   (details.S >= details.N ? 'S' : 'N') +
                   (details.T >= details.F ? 'T' : 'F') +
                   (details.J >= details.P ? 'J' : 'P')
      const descriptions: Record<string, string> = {
        'INTJ': '战略家，具有强大的逻辑与远见。',
        'ENFP': '传播者，热情洋溢且富有创意。',
        'ISTJ': '检查者，务实、可靠且注重秩序。',
        'ESTP': '企业家，大胆、敏捷且充满行动力。'
      }
      return {
        level: type,
        levelTag: 'danger',
        title: '您的性格类型是 ' + type,
        insight: descriptions[type] || `您的性格类型体现了独特的 ${type} 特质平衡。`,
        suggestion: '了解性格类型有助于更好地进行团队协作与自我调节。建议阅读相关类型的深度解析。'
      }
    }
  }
}

// --- 状态管理 ---
const activeScaleKey = ref('')
const result = ref<AssessmentRecord | null>(null)
const allHistory = ref<AssessmentRecord[]>([])
const growthPoints = ref(0)
const dialogVisible = ref(false)
const dialogMode = ref<'intro' | 'result'>('intro')

const currentScale = computed(() => scales[activeScaleKey.value] || null)
const currentScaleInfo = computed(() => scaleList.find(s => s.key === activeScaleKey.value))

const totalCompleted = computed(() => allHistory.value.length)

// --- 逻辑方法 ---

function handleTabChange(name: string | number) {
  if (name === 'dashboard' || name === 'mine') loadHistory()
}

function isCompleted(key: string) {
  return allHistory.value.some(h => h.scaleKey === key)
}

function handleScaleClick(scale: ScaleInfo) {
  if (!scale.available) {
    ElMessage.info(t('assessment.comingSoonTip', { name: scale.name }))
    return
  }
  activeScaleKey.value = scale.key
  // 检查是否有历史结果且路由要求显示结果
  if (route.query.view === 'result' && route.query.scale === scale.key) {
    const lastRecord = allHistory.value.find(h => h.scaleKey === scale.key)
    if (lastRecord) {
      result.value = lastRecord
      dialogMode.value = 'result'
      dialogVisible.value = true
      return
    }
  }
  result.value = null
  dialogMode.value = 'intro'
  dialogVisible.value = true
}

function startAssessment() {
  dialogVisible.value = false
  router.push({ name: 'assessment-take', params: { id: activeScaleKey.value } })
}

function loadHistory() {
  allHistory.value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  growthPoints.value = allHistory.value.length * 10
}

function viewHistory(row: AssessmentRecord) {
  activeScaleKey.value = row.scaleKey
  result.value = row
  mainTab.value = 'scales'
  dialogMode.value = 'result'
  dialogVisible.value = true
}

// --- 「我的」页面逻辑 ---

// 历史记录按时间倒序
const sortedHistory = computed(() => {
  return [...allHistory.value].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

// 加入日期（首次测评日期或默认）
const joinDate = computed(() => {
  if (allHistory.value.length === 0) return '2024-09-01'
  const earliest = [...allHistory.value].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
  return earliest.date
})

// 测评天数（不同日期的数量）
const assessmentDays = computed(() => {
  const dates = new Set(allHistory.value.map(h => h.date))
  return dates.size
})

// 成长状态文案
const growthStatus = computed(() => {
  const count = totalCompleted.value
  if (count === 0) return '即将启程'
  if (count < 3) return '初露锋芒'
  if (count < 6) return '稳步成长'
  if (count < 10) return '深度探索'
  return '自我大师'
})

// 用户等级（基于成长积分）
const userLevel = computed(() => {
  const p = growthPoints.value
  if (p >= 150) return 5
  if (p >= 100) return 4
  if (p >= 60) return 3
  if (p >= 30) return 2
  return 1
})

// 等级进度（当前等级内的百分比）
const levelProgress = computed(() => {
  const p = growthPoints.value
  const thresholds = [0, 30, 60, 100, 150]
  const lv = userLevel.value
  if (lv >= 5) return 100
  const current = thresholds[lv - 1]
  const next = thresholds[lv]
  return Math.min(100, Math.round(((p - current) / (next - current)) * 100))
})

// 距下一级所需积分
const pointsToNext = computed(() => {
  const p = growthPoints.value
  const thresholds = [0, 30, 60, 100, 150]
  const lv = userLevel.value
  if (lv >= 5) return 0
  return thresholds[lv] - p
})

// 勋章列表
const badges = computed(() => {
  const count = totalCompleted.value
  const categories_done = new Set(allHistory.value.map(h => {
    const scale = scaleList.find(s => s.key === h.scaleKey)
    return scale?.category
  })).size
  const hasMental = allHistory.value.some(h => {
    const s = scaleList.find(sc => sc.key === h.scaleKey)
    return s?.category === 'mental'
  })
  const hasCareer = allHistory.value.some(h => {
    const s = scaleList.find(sc => sc.key === h.scaleKey)
    return s?.category === 'career'
  })

  return [
    { key: 'first', icon: '🌱', name: '初心萌芽', desc: '完成第一次测评', unlocked: count >= 1 },
    { key: 'multi', icon: '🔀', name: '多元探索', desc: '完成2种不同类型测评', unlocked: categories_done >= 2 },
    { key: 'mental', icon: '💚', name: '心理关怀', desc: '完成心理健康类测评', unlocked: hasMental },
    { key: 'career', icon: '🧭', name: '生涯启航', desc: '完成生涯发展类测评', unlocked: hasCareer },
    { key: 'depth', icon: '🔍', name: '深度探索', desc: '完成3次以上测评', unlocked: count >= 3 },
    { key: 'master', icon: '🏆', name: '自我大师', desc: '完成5次以上测评', unlocked: count >= 5 }
  ]
})

const unlockedBadges = computed(() => badges.value.filter(b => b.unlocked).length)

// 清空历史记录
function clearAllHistory() {
  ElMessageBox.confirm(t('assessment.history.clearConfirm'), t('assessment.history.clearTitle'), {
    confirmButtonText: t('assessment.history.clearOk'),
    cancelButtonText: t('common.cancel'),
    type: 'warning'
  }).then(() => {
    localStorage.removeItem(STORAGE_KEY)
    allHistory.value = []
    growthPoints.value = 0
    ElMessage.success(t('assessment.history.cleared'))
  }).catch(() => {})
}

// 重新测评
function retakeAssessment(record: AssessmentRecord) {
  activeScaleKey.value = record.scaleKey
  dialogMode.value = 'intro'
  dialogVisible.value = true
}

// --- 可视化计算逻辑 ---

const radarLabels = ['情绪调节', '压力耐受', '职业驱动', '思维深度', '社交能量', '自我认知']

function getRadarPoints(radius: number) {
  return Array.from({ length: 6 }).map((_, i) => {
    const angle = (i * 60 - 90) * Math.PI / 180
    return `${100 + radius * Math.cos(angle)},${100 + radius * Math.sin(angle)}`
  }).join(' ')
}

const radarDataPoints = computed(() => {
  const base = [60, 60, 50, 50, 60, 70]
  if (allHistory.value.length > 0) {
    allHistory.value.forEach(h => {
      if (h.scaleKey === 'phq9') base[0] = Math.min(95, 100 - h.score * 3)
      if (h.scaleKey === 'pss') base[1] = Math.min(95, 100 - h.score * 2)
      if (h.scaleKey === 'riasec') base[2] = 85
      if (h.scaleKey === 'mbti') base[5] = 90
    })
  }
  return base.map((val, i) => {
    const angle = (i * 60 - 90) * Math.PI / 180
    const r = (val / 100) * 80
    return `${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`
  }).join(' ')
})

// 趋势图时间范围
const trendRange = ref('all') // '7d' | '30d' | 'all'

const trendData = computed(() => {
  let data = allHistory.value.filter(h => h.scaleKey === 'phq9' || h.scaleKey === 'gad7')
  const now = new Date()
  if (trendRange.value === '7d') {
    const ago = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    data = data.filter(h => new Date(h.date) >= ago)
  } else if (trendRange.value === '30d') {
    const ago = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    data = data.filter(h => new Date(h.date) >= ago)
  }
  return data.slice(0, 10).reverse().map(h => ({
    date: dayjs(h.date).format('MM-DD'),
    phq: h.scaleKey === 'phq9' ? (h.score / 27) * 100 : 0,
    gad: h.scaleKey === 'gad7' ? (h.score / 21) * 100 : 0
  }))
})

// 趋势平均线
const trendAvgLine = computed(() => {
  const valid = trendData.value.filter(p => p.phq > 0 || p.gad > 0)
  if (valid.length === 0) return 0
  const sum = valid.reduce((acc, p) => acc + Math.max(p.phq, p.gad), 0)
  return Math.round(sum / valid.length)
})

const aiInsights = computed(() => {
  if (allHistory.value.length === 0) return { summary: '', strength: '', risk: '', suggestion: '' }
  const hasPsych = allHistory.value.some(h => ['phq9', 'gad7'].includes(h.scaleKey))
  const hasCareer = allHistory.value.some(h => ['riasec', 'mbti'].includes(h.scaleKey))

  let summary = "您近期完成了多个维度的测评，展现出较好的自我探索意识。"
  let strength = "具备良好的自我觉察力，愿意主动关注内心状态。"
  let risk = "目前数据点较少，建议持续测评以监测状态变化。"
  let suggestion = "建议保持每两周一次的测评频率，建立个人成长基线。"

  if (hasPsych && hasCareer) {
    summary = "您的探索覆盖了心理健康与生涯发展两大核心维度，呈现全面的自我认知图谱。"
    strength = "性格倾向与职业兴趣高度契合，具备清晰的自我定位能力。"
    risk = "在面临高压力时，情绪调节能力仍有提升空间，可能影响职业效能发挥。"
    suggestion = "建议结合情绪管理练习与职业规划，形成个性化的成长方案。"
  } else if (hasPsych) {
    summary = "您关注心理健康状态，展现了良好的自我关怀意识。"
    strength = "能够主动识别情绪信号，这是心理韧性的重要基础。"
    risk = "仅关注情绪维度可能忽略职业与认知层面的潜能。"
    suggestion = "建议补充生涯发展类测评，全面探索自我潜能。"
  } else if (hasCareer) {
    summary = "您正在积极探索职业方向，展现了前瞻性的规划意识。"
    strength = "对职业兴趣与性格有清晰认知，有助于精准定位发展方向。"
    risk = "缺乏情绪状态基线数据，可能在压力下难以察觉情绪变化。"
    suggestion = "建议补充心理健康类测评，建立完整的自我认知图谱。"
  }

  return { summary, strength, risk, suggestion }
})

// === 成长看板增强功能 ===

// 成长看板侧边栏导航
const activeDashboard = ref('overview')
const dashboardNav = [
  { key: 'overview', name: '数据概览', icon: DataAnalysis },
  { key: 'radar', name: '身心能量', icon: Aim },
  { key: 'trend', name: '情绪趋势', icon: TrendCharts },
  { key: 'distribution', name: '测评分布', icon: PieChart },
  { key: 'ai', name: 'AI 洞察', icon: MagicStick },
  { key: 'progress', name: '进步对比', icon: TrophyBase },
  { key: 'recommend', name: '智能推荐', icon: Star },
  { key: 'history', name: '历史足迹', icon: List }
]

// 平均分（归一化到 100）
const avgScore = computed(() => {
  const maxScores: Record<string, number> = { phq9: 27, gad7: 21, pss: 40, riasec: 18, mbti: 40 }
  const scored = allHistory.value.filter(h => typeof h.score === 'number' && maxScores[h.scaleKey])
  if (scored.length === 0) return 0
  const sum = scored.reduce((acc, h) => acc + (h.score / maxScores[h.scaleKey]) * 100, 0)
  return Math.round(sum / scored.length)
})

// 最爱维度
const favoriteCategory = computed(() => {
  const catCount: Record<string, number> = {}
  allHistory.value.forEach(h => {
    const scale = scaleList.find(s => s.key === h.scaleKey)
    if (scale) catCount[scale.category] = (catCount[scale.category] || 0) + 1
  })
  const sorted = Object.entries(catCount).sort((a, b) => b[1] - a[1])
  if (sorted.length === 0) return '尚未探索'
  return getCategoryName(sorted[0][0])
})

// 分类分布（用于环形图）
const categoryDistribution = computed(() => {
  const catCount: Record<string, number> = {}
  allHistory.value.forEach(h => {
    const scale = scaleList.find(s => s.key === h.scaleKey)
    if (scale) {
      const name = getCategoryName(scale.category)
      catCount[name] = (catCount[name] || 0) + 1
    }
  })
  const colors = ['#0052d9', '#4d8bf5', '#10b981', '#f59e0b', '#7c3aed', '#ef4444', '#6b7280']
  return Object.entries(catCount).map(([name, value], i) => ({
    name, value, color: colors[i % colors.length], percent: 0
  })).map(item => {
    const total = allHistory.value.length
    return { ...item, percent: Math.round((item.value / total) * 100) }
  })
})

// 环形图 SVG 路径
const donutSegments = computed(() => {
  const data = categoryDistribution.value
  if (data.length === 0) return []
  const total = data.reduce((acc, d) => acc + d.value, 0)
  let cumulative = 0
  const radius = 70
  const cx = 90, cy = 90
  return data.map(d => {
    const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2
    cumulative += d.value
    const endAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2
    const x1 = cx + radius * Math.cos(startAngle)
    const y1 = cy + radius * Math.sin(startAngle)
    const x2 = cx + radius * Math.cos(endAngle)
    const y2 = cy + radius * Math.sin(endAngle)
    const largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0
    // 单段且占满时无法用 arc 绘制，需特殊处理
    if (data.length === 1 || (cumulative === total && d.value === total)) {
      return { ...d, path: '', isFull: true }
    }
    return {
      ...d,
      path: `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      isFull: false
    }
  })
})

// 群体均值（mock）
const radarAvgPoints = computed(() => {
  const avg = [55, 58, 52, 50, 55, 58]
  return avg.map((val, i) => {
    const angle = (i * 60 - 90) * Math.PI / 180
    const r = (val / 100) * 80
    return `${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`
  }).join(' ')
})

// 进步对比（同量表历次分数变化）
const progressComparison = computed(() => {
  const grouped: Record<string, AssessmentRecord[]> = {}
  allHistory.value.forEach(h => {
    if (!grouped[h.scaleKey]) grouped[h.scaleKey] = []
    grouped[h.scaleKey].push(h)
  })
  const comparisons: {
    scaleName: string
    scaleKey: string
    prevScore: number
    currScore: number
    diff: number
    trend: string
    date: string
    isLowerBetter: boolean
  }[] = []
  Object.entries(grouped).forEach(([key, records]) => {
    if (records.length >= 2) {
      const sorted = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      const prev = sorted[sorted.length - 2]
      const curr = sorted[sorted.length - 1]
      const diff = curr.score - prev.score
      comparisons.push({
        scaleName: curr.scaleName,
        scaleKey: key,
        prevScore: prev.score,
        currScore: curr.score,
        diff,
        trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable',
        date: curr.date,
        isLowerBetter: ['phq9', 'gad7', 'pss', 'sas'].includes(key) // 分数越低越好
      })
    }
  })
  return comparisons
})

// 智能推荐
const recommendations = computed(() => {
  const completedKeys = new Set(allHistory.value.map(h => h.scaleKey))
  const recs = []
  if (completedKeys.has('phq9') && !completedKeys.has('gad7')) {
    recs.push({ key: 'gad7', reason: '完成焦虑测评，全面了解情绪状态' })
  }
  if (completedKeys.has('gad7') && !completedKeys.has('phq9')) {
    recs.push({ key: 'phq9', reason: '补充抑郁测评，建立情绪基线' })
  }
  if (completedKeys.has('riasec') && !completedKeys.has('mbti')) {
    recs.push({ key: 'mbti', reason: '结合性格类型，深化职业探索' })
  }
  if (completedKeys.has('mbti') && !completedKeys.has('riasec')) {
    recs.push({ key: 'riasec', reason: '探索职业兴趣，匹配性格倾向' })
  }
  // 补充未完成的可用测评
  if (recs.length < 3) {
    scaleList
      .filter(s => s.available && !completedKeys.has(s.key))
      .slice(0, 3 - recs.length)
      .forEach(s => {
        recs.push({ key: s.key, reason: '尝试新的测评维度，拓展自我认知' })
      })
  }
  return recs.slice(0, 3).map(rec => ({
    ...rec,
    scale: scaleList.find(s => s.key === rec.key)
  }))
})

// 月度目标
const monthlyGoalTarget = 4
const monthlyGoal = computed(() => {
  const now = new Date()
  const monthRecords = allHistory.value.filter(h => {
    const d = new Date(h.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  return {
    current: monthRecords.length,
    target: monthlyGoalTarget,
    percent: Math.min(100, Math.round((monthRecords.length / monthlyGoalTarget) * 100))
  }
})

// 历史筛选
const historyFilter = ref('all')
const historyFilterOptions = computed(() => {
  const opts = [{ key: 'all', label: t('assessment.history.allScales') }]
  const doneKeys = [...new Set(allHistory.value.map(h => h.scaleKey))]
  doneKeys.forEach(k => {
    const scale = scaleList.find(s => s.key === k)
    if (scale) opts.push({ key: k, label: scale.name })
  })
  return opts
})
const filteredHistory = computed(() => {
  if (historyFilter.value === 'all') return allHistory.value
  return allHistory.value.filter(h => h.scaleKey === historyFilter.value)
})

// 导出 CSV
function exportHistory() {
  if (allHistory.value.length === 0) {
    ElMessage.warning(t('assessment.history.noExport'))
    return
  }
  const headers = [
    t('assessment.history.csvHeaders.date'),
    t('assessment.history.csvHeaders.scale'),
    t('assessment.history.csvHeaders.score'),
    t('assessment.history.csvHeaders.level'),
    t('assessment.history.csvHeaders.title')
  ]
  const rows = allHistory.value.map(h => [h.date, h.scaleName, h.score, h.level, h.title])
  const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `assessment_history_${dayjs().format('YYYYMMDD')}.csv`
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success(t('assessment.history.exported'))
}

// 跳转到推荐测评
function goToRecommendation(rec: { key: string }) {
  activeScaleKey.value = rec.key
  dialogMode.value = 'intro'
  dialogVisible.value = true
}

const riasecScores = computed(() => {
  if (!result.value || result.value.scaleKey !== 'riasec') return []
  const d = result.value.details
  const names: Record<string, string> = { R: '现实', I: '研究', A: '艺术', S: '社会', E: '企业', C: '常规' }
  const colors: Record<string, string> = { R: '#ef4444', I: '#3b82f6', A: '#8b5cf6', S: '#10b981', E: '#f59e0b', C: '#6b7280' }
  return Object.keys(names).map(k => ({ key: k, name: names[k], score: d[k], color: colors[k] }))
})

const mbtiScores = computed(() => {
  if (!result.value || result.value.scaleKey !== 'mbti') return []
  const d = result.value.details
  const pairs = [['E', 'I'], ['S', 'N'], ['T', 'F'], ['J', 'P']]
  const names: Record<string, string> = { E: '外向', I: '内向', S: '实感', N: '直觉', T: '思考', F: '情感', J: '判断', P: '感知' }
  return pairs.map(p => {
    const leftVal = d[p[0]]
    const rightVal = d[p[1]]
    const total = leftVal + rightVal || 1
    const isLeft = leftVal >= rightVal
    return {
      left: names[p[0]],
      right: names[p[1]],
      percent: (Math.max(leftVal, rightVal) / total) * 100,
      isLeft
    }
  })
})

// --- 辅助方法 ---
function getLevelColor(tag: string) {
  const map: Record<string, string> = { success: '#059669', info: '#0052d9', warning: '#d97706', danger: '#ef4444', primary: '#7c3aed' }
  return map[tag] || '#0052d9'
}

function mockDownload() { ElMessage.success(t('assessment.dialog.reportGenerated')) }
function mockShare() { ElMessage.info(t('assessment.dialog.shareCopied')) }

onMounted(() => {
  loadHistory()
  const s = route.query.scale
  const v = route.query.view
  if (typeof s === 'string' && scales[s]) {
    activeScaleKey.value = s
    if (v === 'result') {
      const lastRecord = allHistory.value.find(h => h.scaleKey === s)
      if (lastRecord) {
        result.value = lastRecord
        dialogMode.value = 'result'
        dialogVisible.value = true
      }
    } else if (v === 'intro') {
      dialogMode.value = 'intro'
      dialogVisible.value = true
    }
  }
})

// 监听路由参数变化，实现从答题页返回后显示结果
watch(() => [route.query.scale, route.query.view], ([newScale, newView]) => {
  if (typeof newScale === 'string' && scales[newScale]) {
    activeScaleKey.value = newScale
    if (newView === 'result') {
      const lastRecord = allHistory.value.find(h => h.scaleKey === newScale)
      if (lastRecord) {
        result.value = lastRecord
        dialogMode.value = 'result'
        dialogVisible.value = true
      }
    } else if (newView === 'intro') {
      dialogMode.value = 'intro'
      dialogVisible.value = true
    }
  }
})
</script>

<style scoped>
/* 测评中心 - 杂志编辑式 */
.assessment-page {
  padding: 24px 24px 80px;
  max-width: 1400px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', sans-serif;
  color: #111827;
  position: relative;
}

/* 杂志编辑式标题区 */
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
  max-width: 760px;
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
  font-size: clamp(40px, 6vw, 84px);
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

/* 标签页 · 极简文字 */
.main-tabs {
  margin-top: 0;
}

:deep(.main-tabs .el-tabs__header) {
  margin-bottom: 36px;
}

:deep(.main-tabs .el-tabs__nav-wrap::after) {
  display: none;
}

:deep(.main-tabs .el-tabs__item) {
  font-size: 14px;
  color: #9ca3af;
  font-weight: 500;
  padding: 0 20px 14px 0;
  letter-spacing: 0.5px;
}

:deep(.main-tabs .el-tabs__item.is-active) {
  color: #0a0f1a;
  font-weight: 700;
}

:deep(.main-tabs .el-tabs__active-bar) {
  background: #0a0f1a;
  height: 2px;
  border-radius: 0;
}

/* 编号式分类导航 + 搜索 */
.scale-ribbon {
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

.ribbon-cats {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 28px;
  flex: 1;
}

.ribbon-cat {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 0;
  font-family: inherit;
  transition: opacity 0.25s;
  opacity: 0.45;
}

.ribbon-cat:hover {
  opacity: 0.8;
}

.ribbon-cat.active {
  opacity: 1;
}

.ribbon-cat .cat-name {
  font-size: 15px;
  font-weight: 500;
  color: #0a0f1a;
  letter-spacing: 0.2px;
}

.ribbon-cat.active .cat-name {
  font-weight: 700;
}

.ribbon-cat .cat-count {
  font-size: 11px;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
  margin-left: 4px;
  opacity: 0.7;
}

.ribbon-cat.active .cat-count {
  color: #0052d9;
  opacity: 1;
}

.ribbon-search {
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #0a0f1a;
  padding: 4px 0;
  min-width: 200px;
}

.ribbon-search .search-ico {
  font-size: 15px;
  color: #6b7280;
}

.ribbon-search input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #0a0f1a;
  font-family: inherit;
  width: 100%;
  padding: 4px 0;
}

.ribbon-search input::placeholder {
  color: #9ca3af;
}

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

/* 测评列表：杂志网格卡片 */
.scale-rows {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 0;
  border-top: 1px solid #eef2f6;
  border-left: 1px solid #eef2f6;
}

.scale-row {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 28px 24px 24px;
  border-right: 1px solid #eef2f6;
  border-bottom: 1px solid #eef2f6;
  cursor: pointer;
  transition: background 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  background: #ffffff;
}

.scale-row:hover {
  background: #f8fbff;
  box-shadow: 0 12px 32px rgba(0, 82, 217, 0.1);
  z-index: 2;
}

.scale-row.is-completed .row-title {
  color: #0052d9;
}

.scale-row.is-unavailable {
  opacity: 0.55;
}

.scale-row.is-unavailable:hover {
  opacity: 0.9;
  background: #fafafa;
}

.row-number {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.row-number .num {
  font-size: 13px;
  font-weight: 700;
  color: #9ca3af;
  letter-spacing: 1.5px;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.scale-row:hover .row-number .num {
  color: #0052d9;
}

.row-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  border-radius: 8px;
  background: #f8fafc;
  color: #0052d9;
  transition: all 0.3s ease;
}

.row-icon.cat-mental { background: #f0f7ff; color: #0052d9; }
.row-icon.cat-career { background: #eef6ff; color: #1890ff; }
.row-icon.cat-cognitive { background: #f5f0ff; color: #6b5ce7; }
.row-icon.cat-esports { background: #fff0f6; color: #e84393; }
.row-icon.cat-learning { background: #f0fbf6; color: #00a878; }
.row-icon.cat-social { background: #fff7e6; color: #e8830c; }

.scale-row:hover .row-icon {
  transform: scale(1.08) rotate(-4deg);
}

.row-main {
  min-width: 0;
  flex: 1;
}

.row-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.row-title {
  font-size: 17px;
  font-weight: 700;
  color: #0a0f1a;
  margin: 0;
  line-height: 1.3;
  letter-spacing: -0.2px;
}

.row-status {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.row-status.done {
  background: #0a0f1a;
  color: #fff;
}

.row-status.soon {
  background: transparent;
  color: #9ca3af;
  border: 1px dashed #d0d5dd;
}

.row-desc {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 10px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
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
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
}

.row-meta .meta-items {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
}

.row-meta .meta-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-variant-numeric: tabular-nums;
}

.row-meta .meta-item .el-icon {
  font-size: 13px;
}

.meta-difficulty {
  font-size: 11px;
  font-weight: 700;
  color: #0a0f1a;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.row-arrow {
  font-size: 16px;
  color: #0052d9;
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.3s ease;
}

.scale-row:hover .row-arrow {
  opacity: 1;
  transform: translateX(0);
}

@media (max-width: 900px) {
  .scale-rows {
    grid-template-columns: 1fr;
  }
}

/* 空状态 */
.filter-empty {
  padding: 80px 0;
}

/* 提示 */
.footer-tip {
  margin-top: 48px;
  padding: 24px 0 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.6;
  border-top: 1px solid #eef2f6;
}

.footer-tip .el-icon {
  color: #6b7280;
  flex-shrink: 0;
  font-size: 14px;
}

/* 面板基础 */
.panel {
  background: #fff;
  border-radius: 20px;
  padding: 28px;
  border: 1px solid #eef2f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  height: 100%;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

/* 弹窗 */
:deep(.scale-dialog) {
  border-radius: 24px;
  overflow: hidden;
}

:deep(.scale-dialog .el-dialog__header) {
  display: none;
}

:deep(.scale-dialog .el-dialog__body) {
  padding: 0;
}

:deep(.scale-dialog .el-dialog__headerbtn) {
  top: 16px;
  right: 16px;
  z-index: 10;
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
}

/* 介绍模式 */
.intro-content {
  padding: 40px 36px 32px;
}

.intro-header {
  text-align: center;
  margin-bottom: 32px;
  position: relative;
}

.intro-header::before {
  content: '';
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: #0052d9;
  border-radius: 2px;
}

.scale-type-tag {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 16px;
  background: #f0f7ff;
  color: #1e293b;
  letter-spacing: 0.5px;
}

.intro-header h2 {
  font-size: 26px;
  color: #1e293b;
  margin: 0 0 12px 0;
  font-weight: 800;
  letter-spacing: -0.3px;
}

.scale-desc {
  color: #777;
  font-size: 14px;
  line-height: 1.7;
  margin: 0 auto;
  max-width: 440px;
}

.intro-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 26px;
}

.detail-item {
  padding: 20px 12px;
  background: #f8fafc;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  border: 1px solid #eef2f6;
  transition: all 0.3s ease;
}

.detail-item:hover {
  background: #f0f7ff;
  border-color: #0052d9;
  transform: translateY(-2px);
  box-shadow: 0 8px 18px -6px rgba(0, 82, 217, 0.15);
}

.detail-item .el-icon {
  font-size: 22px;
  color: #0052d9;
}

.item-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  text-align: center;
}

.item-text .label {
  font-size: 11px;
  color: #999;
  letter-spacing: 0.3px;
}

.item-text .val {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}

.intro-tips {
  text-align: left;
  background: linear-gradient(135deg, #f0f7ff 0%, #f8fbff 100%);
  padding: 20px 22px;
  border-radius: 14px;
  border: 1px solid #d0e7ff;
  margin-bottom: 28px;
}

.intro-tips h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1e293b;
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.intro-tips h4 .el-icon {
  color: #555;
}

.intro-tips ul {
  padding-left: 20px;
  color: #666;
  margin: 0;
}

.intro-tips li {
  margin-bottom: 6px;
  font-size: 12px;
  line-height: 1.7;
}

.intro-actions {
  text-align: center;
}

.start-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 40px;
  background: #0052d9;
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  box-shadow: 0 8px 22px -6px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
}

.start-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 28px -8px rgba(0, 0, 0, 0.35);
  background: #003bb3;
}

.start-btn .el-icon {
  transition: transform 0.3s ease;
}

.start-btn:hover .el-icon {
  transform: translateX(4px);
}

/* 结果报告 */
.result-content {
  padding: 32px;
}

.result-summary-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f0f7ff 0%, #f8fbff 100%);
  padding: 28px;
  border-radius: 18px;
  margin-bottom: 24px;
  border: 1px solid #d0e7ff;
  position: relative;
  overflow: hidden;
}

.result-summary-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: #0052d9;
}

.res-badge {
  display: inline-block;
  padding: 5px 14px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 12px;
}

.res-badge[type="success"] { background: #dcfce7; color: #059669; }
.res-badge[type="info"] { background: #dbeafe; color: #0052d9; }
.res-badge[type="warning"] { background: #fef3c7; color: #d97706; }
.res-badge[type="danger"] { background: #fee2e2; color: #ef4444; }
.res-badge[type="primary"] { background: #ede9fe; color: #7c3aed; }

.res-left h2 {
  font-size: 22px;
  color: #1e293b;
  margin: 0 0 6px 0;
  font-weight: 700;
}

.res-date {
  font-size: 12px;
  color: #999;
  font-weight: 500;
  margin: 0;
}

.res-score-circle {
  width: 100px;
  height: 100px;
  border: 5px solid #0052d9;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.06);
}

.score-val {
  font-size: 30px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
}

.score-unit {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  font-weight: 600;
}

.insight-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 22px;
}

.insight-card {
  padding: 22px;
  border-radius: 16px;
  border: 1px solid #eef2f6;
  background: #fff;
}

.insight-card h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  margin: 0 0 12px 0;
  color: #1e293b;
  font-weight: 700;
}

.insight-card p {
  color: #555;
  line-height: 1.7;
  font-size: 13px;
  margin: 0;
}

.insight-card.highlight {
  background: #f8fbff;
  border-color: #d0e7ff;
}

.mbti-details h3,
.riasec-details h3 {
  font-size: 15px;
  color: #1e293b;
  font-weight: 700;
  margin: 0 0 14px 0;
}

.mbti-bars {
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: #f8fafc;
  padding: 22px;
  border-radius: 16px;
  border: 1px solid #eef2f6;
}

.mbti-bar-item {
  display: flex;
  align-items: center;
  gap: 14px;
}

.dim-l, .dim-r {
  width: 36px;
  font-weight: 700;
  color: #1e293b;
  font-size: 13px;
}

.dim-l { text-align: right; }

.bar-track {
  flex: 1;
  height: 11px;
  background: #e5e5e5;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}

.bar-fill {
  position: absolute;
  height: 100%;
  background: linear-gradient(to right, #0052d9, #4d8bf5);
  border-radius: 6px;
  transition: width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.riasec-bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #f8fafc;
  padding: 22px;
  border-radius: 16px;
  border: 1px solid #eef2f6;
}

.r-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 13px;
  font-weight: 600;
  color: #222;
}

.r-val {
  font-weight: 700;
  color: #1e293b;
}

:deep(.el-progress-bar__outer) {
  background-color: #e5e5e5;
  border-radius: 6px;
  height: 10px !important;
}

:deep(.el-progress-bar__inner) {
  border-radius: 6px;
}

.result-footer {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
}

:deep(.result-footer .el-button) {
  padding: 11px 24px;
  border-radius: 12px;
  font-weight: 600;
}

:deep(.result-footer .el-button--primary) {
  background: #0052d9;
  border-color: #0052d9;
}

:deep(.result-footer .el-button--primary:hover) {
  background: #003bb3;
  border-color: #003bb3;
}

/* 看板 */
.dashboard-wrapper {
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.dashboard-card {
  margin-bottom: 24px;
  border-radius: 6px;
  transition: box-shadow 0.3s ease;
}

.dashboard-card:hover {
  box-shadow: 0 6px 18px rgba(10, 15, 26, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
  padding-bottom: 14px;
  border-bottom: 1px solid #eef2f6;
}

.card-header h3 {
  font-size: 15px;
  color: #0a0f1a;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.1px;
}

.card-header h3 .el-icon {
  color: #0052d9;
  font-size: 16px;
}

.chart-legend {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #777;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  display: inline-block;
  margin-right: 4px;
}

.legend-dot.phq { background: #0052d9; }
.legend-dot.gad { background: #c3cad4; }

.radar-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.radar-svg {
  width: 100%;
  height: 100%;
}

.radar-bg-poly {
  fill: none;
  stroke: #eee;
  stroke-width: 1;
  stroke-dasharray: 4;
}

.radar-axis {
  stroke: #eee;
  stroke-width: 1;
}

.radar-avg-poly {
  fill: rgba(153, 153, 153, 0.08);
  stroke: #bbb;
  stroke-width: 1.5;
  stroke-dasharray: 4 3;
  stroke-linejoin: round;
}

.radar-data-poly {
  fill: rgba(0, 82, 217, 0.15);
  stroke: #0052d9;
  stroke-width: 2.5;
  stroke-linejoin: round;
}

.radar-label {
  font-size: 11px;
  fill: #888;
  font-weight: 600;
  text-anchor: middle;
}

.radar-legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #888;
}

.legend-item .dot.self {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background: #0052d9;
}

.legend-item .dot.avg {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background: transparent;
  border: 1px dashed #999;
}

/* AI 卡片 */
.ai-summary-card {
  background: #fff;
  border: 1px solid #eef2f6;
  position: relative;
  overflow: hidden;
}

.ai-summary-card::after {
  content: 'AI';
  position: absolute;
  top: -16px;
  right: -8px;
  font-size: 7rem;
  font-weight: 900;
  color: rgba(17, 17, 17, 0.03);
  pointer-events: none;
}

.ai-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.ai-icon {
  width: 36px;
  height: 36px;
  background: #0a0f1a;
  color: #fff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
}

.ai-header h3 {
  margin: 0;
  color: #0a0f1a;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.1px;
}

.ai-insight-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.i-title {
  font-size: 13px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.i-title::before {
  content: '';
  width: 3px;
  height: 12px;
  background: #0052d9;
  border-radius: 2px;
}

.insight-item.insight-strength .i-title::before { background: #10b981; }
.insight-item.insight-risk .i-title::before { background: #f59e0b; }
.insight-item.insight-suggestion .i-title::before { background: #7c3aed; }

.insight-item p {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.ai-empty p {
  font-size: 13px;
  color: #999;
  line-height: 1.6;
  margin: 0;
}

/* 趋势图 */
.trend-chart-container {
  display: flex;
  height: 220px;
  gap: 16px;
  padding: 16px 8px;
}

.y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #aaa;
  font-size: 11px;
  width: 20px;
  font-weight: 600;
}

.chart-area {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  border-bottom: 1px solid #eef2f6;
  padding-bottom: 28px;
  position: relative;
}

.trend-bar-group {
  display: flex;
  gap: 5px;
  align-items: flex-end;
  position: relative;
}

.bar {
  width: 12px;
  border-radius: 2px 2px 0 0;
  transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.bar.phq { background: #0052d9; }
.bar.gad { background: #c3cad4; }

.bar-date {
  position: absolute;
  bottom: -22px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  color: #888;
  white-space: nowrap;
  font-weight: 500;
}

.chart-empty {
  width: 100%;
  text-align: center;
  color: #aaa;
  font-size: 13px;
  align-self: center;
}

/* 历史表格 */
.history-table-wrapper {
  margin-top: 4px;
}

:deep(.el-table) {
  border-radius: 12px;
  overflow: hidden;
  --el-table-header-bg-color: #f8fafc;
  --el-table-tr-bg-color: transparent;
  --el-table-border-color: #eef2f6;
}

:deep(.el-table th.el-table__cell) {
  font-weight: 700;
  color: #1e293b;
  font-size: 13px;
}

:deep(.el-table .el-tag) {
  font-weight: 600;
  border-radius: 6px;
  padding: 2px 8px;
  font-size: 12px;
}

.history-empty {
  text-align: center;
  color: #aaa;
  font-size: 13px;
  padding: 32px 0;
}

/* ============ 成长看板增强样式 ============ */

/* KPI 摘要栏 · 编辑式数据条 */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  margin-bottom: 24px;
  background: #fff;
  border: 1px solid #eef2f6;
  border-radius: 6px;
  overflow: hidden;
}

.kpi-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: transparent;
  border: none;
  border-left: 1px solid #eef2f6;
  border-radius: 0;
  padding: 22px 24px;
  transition: background 0.25s ease;
}

.kpi-card:first-child {
  border-left: none;
}

.kpi-card:hover {
  background: #fafbfc;
}

.kpi-icon {
  width: 38px;
  height: 38px;
  border-radius: 8px;
  background: #f8fafc;
  color: #0052d9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  flex-shrink: 0;
}

.kpi-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.kpi-value {
  font-size: 30px;
  font-weight: 800;
  color: #0a0f1a;
  line-height: 1;
  letter-spacing: -1px;
  font-variant-numeric: tabular-nums;
}

.kpi-label {
  font-size: 11px;
  color: #9ca3af;
  font-weight: 600;
  letter-spacing: 2px;
}

/* 月度目标横幅 · 编辑式 */
.goal-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  background: #fff;
  border: 1px solid #eef2f6;
  border-radius: 6px;
  padding: 22px 28px;
  color: inherit;
  margin-bottom: 24px;
  position: relative;
}

.goal-banner::before {
  content: '';
  position: absolute;
  left: 0;
  top: 18px;
  bottom: 18px;
  width: 2px;
  background: #0052d9;
}

.goal-info {
  position: relative;
  z-index: 1;
}

.goal-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 3px;
  color: #0a0f1a;
  margin-bottom: 8px;
}

.goal-title .el-icon {
  color: #0052d9;
  font-size: 15px;
}

.goal-desc {
  font-size: 13px;
  color: #6b7280;
}

.goal-progress-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 1;
  min-width: 240px;
}

.goal-progress-bar {
  flex: 1;
  height: 4px;
  background: #eef2f6;
  border-radius: 2px;
  overflow: hidden;
}

.goal-progress-fill {
  height: 100%;
  background: #0052d9;
  border-radius: 2px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.goal-percent {
  font-size: 26px;
  font-weight: 800;
  color: #0a0f1a;
  min-width: 58px;
  text-align: right;
  letter-spacing: -0.5px;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

/* 环形图 */
.donut-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 12px 8px;
  min-height: 300px;
}

.donut-svg {
  width: 180px;
  height: 180px;
  flex-shrink: 0;
}

.donut-center-val {
  font-size: 26px;
  font-weight: 800;
  fill: #1e293b;
}

.donut-center-label {
  font-size: 11px;
  fill: #999;
  font-weight: 600;
}

.donut-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
}

.donut-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.donut-legend-item .legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  flex-shrink: 0;
}

.donut-legend-item .legend-name {
  color: #1e293b;
  font-weight: 600;
}

.donut-legend-item .legend-val {
  color: #6b7280;
  margin-left: auto;
  font-weight: 500;
}

.chart-empty-state {
  padding: 40px 0;
  display: flex;
  justify-content: center;
}

/* 趋势图增强 */
.trend-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.range-tabs {
  display: flex;
  gap: 16px;
  background: transparent;
  border-radius: 0;
  padding: 0;
}

.range-tabs span {
  padding: 4px 2px;
  font-size: 12px;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 0;
  border-bottom: 1.5px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
  font-weight: 500;
}

.range-tabs span:hover {
  color: #0a0f1a;
  border-bottom-color: #d0d5dd;
}

.range-tabs span.active {
  background: transparent;
  color: #0a0f1a;
  font-weight: 700;
  border-bottom-color: #0052d9;
  box-shadow: none;
}

.avg-line {
  position: absolute;
  left: 0;
  right: 0;
  border-top: 1px dashed #f59e0b;
  pointer-events: none;
  z-index: 1;
}

.avg-label {
  position: absolute;
  right: 4px;
  top: -15px;
  font-size: 10px;
  color: #b45309;
  font-weight: 700;
  background: transparent;
  padding: 0;
  border-radius: 0;
  white-space: nowrap;
  letter-spacing: 0.5px;
}

/* 进步对比 · 编辑式数据行 */
.comparison-list {
  display: flex;
  flex-direction: column;
}

.comparison-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 4px;
  background: transparent;
  border: none;
  border-bottom: 1px solid #eef2f6;
  border-radius: 0;
  transition: background 0.2s ease;
}

.comparison-item:first-child {
  border-top: 1px solid #eef2f6;
}

.comparison-item:hover {
  background: #fafbfc;
  border-color: #eef2f6;
  transform: none;
  box-shadow: none;
}

.cmp-info {
  flex: 1;
  min-width: 0;
}

.cmp-name {
  font-size: 14px;
  font-weight: 700;
  color: #0a0f1a;
  margin-bottom: 3px;
  letter-spacing: -0.1px;
}

.cmp-date {
  font-size: 12px;
  color: #9ca3af;
  font-variant-numeric: tabular-nums;
}

.cmp-scores {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cmp-prev {
  font-size: 15px;
  font-weight: 600;
  color: #c3cad4;
  font-variant-numeric: tabular-nums;
}

.cmp-arrow {
  font-size: 14px;
  color: #c3cad4;
}

.cmp-arrow.up { color: #059669; }
.cmp-arrow.down { color: #dc2626; }

.cmp-curr {
  font-size: 20px;
  font-weight: 800;
  color: #0a0f1a;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.5px;
}

.cmp-diff {
  font-size: 13px;
  font-weight: 700;
  padding: 0;
  border-radius: 0;
  font-variant-numeric: tabular-nums;
}

.cmp-diff.good {
  color: #059669;
  background: transparent;
}

.cmp-diff.bad {
  color: #dc2626;
  background: transparent;
}

.cmp-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 0;
  border-radius: 0;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 1px;
}

.cmp-tag::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 1px;
  background: currentColor;
}

.cmp-tag.good {
  color: #059669;
  background: transparent;
}

.cmp-tag.bad {
  color: #dc2626;
  background: transparent;
}

.cmp-tag.stable {
  color: #6b7280;
  background: transparent;
}

/* 智能推荐 */
.recommend-list {
  display: flex;
  flex-direction: column;
}

.recommend-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 15px 4px;
  background: transparent;
  border: none;
  border-bottom: 1px solid #eef2f6;
  border-radius: 0;
  cursor: pointer;
  transition: background 0.2s ease;
}

.recommend-item:first-child {
  border-top: 1px solid #eef2f6;
}

.recommend-item:hover {
  background: #fafbfc;
  border-color: #eef2f6;
  transform: none;
  box-shadow: none;
}

.rec-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: #f8fafc;
  color: #0052d9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
  transition: all 0.25s ease;
}

.recommend-item:hover .rec-icon {
  background: #0052d9;
  color: #fff;
}

.rec-info {
  flex: 1;
  min-width: 0;
}

.rec-name {
  font-size: 14px;
  font-weight: 700;
  color: #0a0f1a;
  margin-bottom: 3px;
  letter-spacing: -0.1px;
  transition: color 0.2s ease;
}

.recommend-item:hover .rec-name {
  color: #0052d9;
}

.rec-reason {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.5;
}

.rec-arrow {
  color: #0052d9;
  font-size: 16px;
  transition: transform 0.3s ease;
}

.recommend-item:hover .rec-arrow {
  transform: translateX(4px);
}

/* 历史足迹增强 */
.history-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

:deep(.history-filter) {
  width: 160px;
}

:deep(.history-filter .el-input__wrapper) {
  border-radius: 8px;
  background: #f8fafc;
  box-shadow: none !important;
  border: 1px solid #eee;
}

:deep(.history-filter .el-input__wrapper:hover) {
  border-color: #0052d9 !important;
}

/* ============ 侧边栏导航布局 · 杂志目录式 ============ */
.dashboard-layout {
  display: flex;
  gap: 28px;
  align-items: flex-start;
}

.dashboard-sidebar {
  width: 208px;
  flex-shrink: 0;
  position: sticky;
  top: 16px;
  background: #fff;
  border: 1px solid #eef2f6;
  border-radius: 6px;
  padding: 14px 0 8px;
  display: flex;
  flex-direction: column;
  gap: 0;
  box-shadow: none;
  counter-reset: dashnav;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px 12px 16px;
  border-radius: 0;
  border-left: 2px solid transparent;
  cursor: pointer;
  font-size: 13.5px;
  color: #6b7280;
  font-weight: 500;
  counter-increment: dashnav;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
  user-select: none;
}

.nav-item::before {
  content: counter(dashnav, decimal-leading-zero);
  font-size: 11px;
  font-weight: 600;
  color: #c3cad4;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.5px;
  min-width: 20px;
  flex-shrink: 0;
  transition: color 0.2s ease;
}

.nav-item .el-icon {
  display: none;
}

.nav-item:hover {
  background: #fafbfc;
  color: #0a0f1a;
}

.nav-item.active {
  background: transparent;
  color: #0a0f1a;
  font-weight: 700;
  border-left-color: #0052d9;
  box-shadow: none;
}

.nav-item.active::before {
  color: #0052d9;
  font-weight: 700;
}

.dashboard-content {
  flex: 1;
  min-width: 0;
}

.content-section {
  animation: fadeInSection 0.35s ease;
}

@keyframes fadeInSection {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 快速入口 · 编辑式索引行 */
.quick-entry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 0 28px;
}

.quick-entry-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  padding: 15px 4px;
  background: transparent;
  border: none;
  border-bottom: 1px solid #eef2f6;
  border-radius: 0;
  cursor: pointer;
  transition: color 0.2s ease;
  text-align: left;
}

.quick-entry-item::after {
  content: '→';
  margin-left: auto;
  font-size: 14px;
  color: #0052d9;
  opacity: 0;
  transform: translateX(-6px);
  transition: all 0.25s ease;
}

.quick-entry-item:hover {
  background: transparent;
  border-color: #eef2f6;
  transform: none;
  box-shadow: none;
}

.quick-entry-item:hover::after {
  opacity: 1;
  transform: translateX(0);
}

.quick-entry-icon {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #f8fafc;
  color: #0052d9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
  transition: all 0.25s ease;
}

.quick-entry-item:hover .quick-entry-icon {
  background: #0052d9;
  color: #fff;
}

.quick-entry-item span {
  font-size: 13px;
  font-weight: 600;
  color: #1e293b;
  transition: color 0.2s ease;
}

.quick-entry-item:hover span {
  color: #0052d9;
}

/* AI 洞察 2x2 网格 · 编辑式分栏 */
.ai-insight-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px 32px;
}

.ai-insight-grid .insight-item {
  background: transparent;
  border: none;
  border-top: 1px solid #eef2f6;
  border-radius: 0;
  padding: 16px 2px 0;
  transition: border-color 0.25s ease;
}

.ai-insight-grid .insight-item:hover {
  border-color: #eef2f6;
  background: transparent;
  box-shadow: none;
}

/* 大尺寸图表容器 */
.radar-large {
  height: 420px !important;
}

.radar-large .radar-svg {
  max-width: 380px;
}

.trend-large {
  height: 320px !important;
}

.donut-large {
  min-height: 380px !important;
  flex-direction: row !important;
  align-items: center;
  justify-content: center;
  gap: 40px;
  padding: 24px 16px;
}

.donut-svg-large {
  width: 240px !important;
  height: 240px !important;
}

/* 成长看板响应式 */
@media (max-width: 1200px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .kpi-card { border-left: none; border-top: 1px solid #eef2f6; }
  .kpi-card:nth-child(-n+2) { border-top: none; }
  .kpi-card:nth-child(even) { border-left: 1px solid #eef2f6; }
  .ai-insight-grid { grid-template-columns: 1fr; }
  .donut-large { flex-direction: column !important; gap: 20px; }
}

@media (max-width: 900px) {
  .dashboard-layout { flex-direction: column; }
  .dashboard-sidebar {
    width: 100%;
    position: relative;
    top: 0;
    flex-direction: row;
    overflow-x: auto;
    padding: 4px;
    gap: 2px;
  }
  .nav-item {
    flex-shrink: 0;
    padding: 9px 14px;
    white-space: nowrap;
    border-left: none;
    border-bottom: 2px solid transparent;
  }
  .nav-item::before { display: none; }
  .nav-item.active { border-bottom-color: #0052d9; }
  .quick-entry-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .kpi-grid { grid-template-columns: 1fr; }
  .kpi-card { border-left: none !important; border-top: 1px solid #eef2f6; }
  .kpi-card:first-child { border-top: none; }
  .goal-banner { flex-direction: column; align-items: flex-start; gap: 16px; }
  .goal-progress-wrap { width: 100%; min-width: 0; }
  .trend-controls { flex-direction: column; align-items: flex-start; gap: 8px; }
  .comparison-item { flex-wrap: wrap; }
  .history-actions { flex-direction: column; align-items: flex-end; }
  .radar-large { height: 320px !important; }
  .trend-large { height: 260px !important; }
  .donut-large { min-height: 300px !important; }
  .donut-svg-large { width: 180px !important; height: 180px !important; }
}

@media (max-width: 768px) {
  .assessment-page { padding: 16px 14px 48px; }
  .intro-container { flex-direction: column; align-items: flex-start; gap: 32px; }
  .intro-mark::before { display: none; }
  .insight-grid { grid-template-columns: 1fr; }
  .intro-details { grid-template-columns: 1fr; }
  .result-summary-card { flex-direction: column; gap: 20px; text-align: center; }
  :deep(.main-tabs .el-tabs__item) { font-size: 14px; padding: 0 14px 12px 0; }
  .intro-content, .result-content { padding: 24px 20px; }
}

/* ============ 「我的」页面样式 ============ */
.mine-wrapper {
  display: flex;
  flex-direction: column;
  gap: 36px;
  padding-top: 8px;
}

/* 模块封面 · 编辑式（与心理咨询共用语言） */
.module-cover {
  padding: 8px 0 32px;
  border-bottom: 1px solid #eef2f6;
  position: relative;
}
.module-cover .cover-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
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
}
.module-cover .cover-title {
  font-size: clamp(36px, 5vw, 60px);
  font-weight: 800;
  color: #0a0f1a;
  margin: 0 0 12px 0;
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
  margin: 0 0 20px 0;
  line-height: 1.7;
  max-width: 640px;
}
.module-cover .cover-line {
  height: 1px;
  background: linear-gradient(to right, #0052d9 0, #0052d9 56px, #eef2f6 56px, #eef2f6 100%);
}

/* 个人信息 · 编辑式横向数据栏 */
.profile-editorial {
  padding: 28px 0 24px;
  border-bottom: 1px solid #eef2f6;
}
.profile-stats {
  display: flex;
  align-items: stretch;
  gap: 0;
  flex-wrap: wrap;
}
.profile-stat {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 32px;
  flex: 1;
  min-width: 120px;
}
.profile-stat:first-child { padding-left: 0; }
.profile-stat.level .ps-num { color: #0052d9; }
.ps-num {
  font-size: clamp(28px, 3.4vw, 40px);
  font-weight: 800;
  color: #0a0f1a;
  line-height: 1;
  letter-spacing: -1px;
  font-variant-numeric: tabular-nums;
}
.ps-label {
  font-size: 11px;
  color: #9ca3af;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}
.profile-divider {
  width: 1px;
  background: #eef2f6;
  align-self: stretch;
}

.profile-meta-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
  font-size: 13px;
  color: #6b7280;
}
.pm-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  letter-spacing: 0.2px;
}
.pm-item .el-icon { font-size: 13px; color: #9ca3af; }
.pm-sep { color: #d1d5db; }

.level-bar-wrap {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 14px;
}
.level-bar-track {
  flex: 1;
  height: 4px;
  background: #f1f5f9;
  border-radius: 0;
  overflow: hidden;
}
.level-bar-fill {
  height: 100%;
  background: linear-gradient(to right, #0052d9, #1890ff);
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}
.level-bar-pct {
  font-size: 12px;
  color: #0052d9;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.5px;
}

/* 区块通用 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  padding: 0 4px;
}

.section-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.2px;
}

.section-header h3 .el-icon {
  color: #0052d9;
}

.badges-count {
  font-size: 13px;
  color: #6b7280;
  font-weight: 600;
}

/* 时间轴 */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  padding-left: 8px;
}

.timeline-item {
  display: flex;
  gap: 18px;
  position: relative;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 24px;
  bottom: -16px;
  width: 2px;
  background: #eef2f6;
}

.timeline-item:last-child::before {
  display: none;
}

.timeline-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 3px solid #fff;
  flex-shrink: 0;
  margin-top: 18px;
  z-index: 1;
  box-shadow: 0 0 0 2px #eef2f6;
}

.timeline-dot.dot-success { background: #059669; box-shadow: 0 0 0 2px #d1fae5; }
.timeline-dot.dot-info { background: #0052d9; box-shadow: 0 0 0 2px #dbeafe; }
.timeline-dot.dot-warning { background: #d97706; box-shadow: 0 0 0 2px #fef3c7; }
.timeline-dot.dot-danger { background: #ef4444; box-shadow: 0 0 0 2px #fee2e2; }
.timeline-dot.dot-primary { background: #7c3aed; box-shadow: 0 0 0 2px #ede9fe; }

.timeline-card {
  flex: 1;
  background: #fff;
  border: 1px solid #eef2f6;
  border-radius: 14px;
  padding: 18px 22px;
  transition: all 0.3s ease;
}

.timeline-card:hover {
  border-color: #d0e7ff;
  box-shadow: 0 6px 18px -6px rgba(0, 82, 217, 0.1);
  transform: translateX(4px);
}

.timeline-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.timeline-title {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}

.timeline-date {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9ca3af;
  font-weight: 500;
}

.timeline-body {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}

.timeline-score {
  font-size: 13px;
  font-weight: 700;
  color: #0052d9;
}

.timeline-result-title {
  font-size: 13px;
  color: #6b7280;
}

.timeline-actions {
  display: flex;
  gap: 10px;
}

:deep(.timeline-actions .el-button) {
  padding: 7px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

/* 空状态 */
.empty-state {
  background: #fff;
  border: 1px solid #eef2f6;
  border-radius: 16px;
  padding: 48px 24px;
}

/* 勋章 */
.badges-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.badge-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #fff;
  border: 1px solid #eef2f6;
  border-radius: 14px;
  padding: 18px 20px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.badge-card.unlocked {
  border-color: #d0e7ff;
  background: linear-gradient(135deg, #fff 0%, #f0f7ff 100%);
}

.badge-card.unlocked:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px -8px rgba(0, 82, 217, 0.2);
}

.badge-card.locked {
  opacity: 0.55;
  background: #f8fafc;
}

.badge-card.locked .badge-icon {
  filter: grayscale(1);
}

.badge-icon {
  font-size: 32px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #eef2f6;
}

.badge-card.unlocked .badge-icon {
  border-color: #d0e7ff;
}

.badge-info {
  flex: 1;
  min-width: 0;
}

.badge-name {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 3px;
}

.badge-desc {
  font-size: 12px;
  color: #6b7280;
  line-height: 1.4;
}

/* 「我的」页面响应式 */
@media (max-width: 900px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .badges-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .profile-card { flex-direction: column; text-align: center; padding: 24px 20px; }
  .profile-info { text-align: center; }
  .profile-meta { justify-content: center; }
  .profile-level { padding-left: 0; border-left: none; border-top: 1px solid rgba(255,255,255,0.2); padding-top: 20px; width: 100%; }
  .level-progress { width: 100%; max-width: 200px; }
  .badges-grid { grid-template-columns: 1fr; }
}
</style>
