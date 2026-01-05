<script setup lang="ts">
useSeoMeta({
  title: '案例展示',
  description: '查看我们的成功案例，了解我们如何帮助企业实现数字化转型'
})

const cases = [
  {
    id: 1,
    title: '某大型制造企业数字化转型',
    category: '制造业',
    image: '🏭',
    desc: '为某知名制造企业提供全面的数字化转型方案，实现生产效率提升 40%',
    tags: ['数字化转型', '智能制造', 'IoT'],
    results: ['效率提升 40%', '成本降低 25%', '产能增加 30%']
  },
  {
    id: 2,
    title: '金融科技平台云架构升级',
    category: '金融科技',
    image: '💳',
    desc: '帮助某金融科技公司完成云原生架构迁移，系统稳定性达到 99.99%',
    tags: ['云架构', '微服务', '高可用'],
    results: ['可用性 99.99%', '响应时间 <100ms', '并发能力 10x']
  },
  {
    id: 3,
    title: '电商平台 AI 推荐系统',
    category: '电商零售',
    image: '🛒',
    desc: '为头部电商平台打造智能推荐引擎，转化率提升 60%',
    tags: ['AI', '推荐系统', '机器学习'],
    results: ['转化率 +60%', 'GMV +45%', '用户粘性 +35%']
  },
  {
    id: 4,
    title: '医疗健康数据平台',
    category: '医疗健康',
    image: '🏥',
    desc: '构建符合医疗合规的数据分析平台，助力精准医疗决策',
    tags: ['数据分析', '合规安全', '医疗AI'],
    results: ['诊断准确率 +25%', '数据处理 5x', '合规率 100%']
  },
  {
    id: 5,
    title: '物流供应链智能优化',
    category: '物流运输',
    image: '🚚',
    desc: '利用 AI 算法优化配送路线，降低物流成本 30%',
    tags: ['AI优化', '路径规划', '供应链'],
    results: ['成本降低 30%', '时效提升 40%', '准时率 98%']
  },
  {
    id: 6,
    title: '教育科技在线平台',
    category: '教育科技',
    image: '📚',
    desc: '打造支持百万级并发的在线教育平台',
    tags: ['在线教育', '高并发', '实时互动'],
    results: ['并发 100万+', '延迟 <50ms', '满意度 95%']
  }
]

const categories = ['全部', '制造业', '金融科技', '电商零售', '医疗健康', '物流运输', '教育科技']
const selectedCategory = ref('全部')

const filteredCases = computed(() => {
  if (selectedCategory.value === '全部') return cases
  return cases.filter(c => c.category === selectedCategory.value)
})
</script>

<template>
  <div class="cases-page">
    <!-- Hero -->
    <section class="cases-hero section section--hero">
      <div class="cases-hero__container container">
        <span class="badge">成功案例</span>
        <h1 class="cases-hero__title">
          见证客户的
          <span class="text-gradient">成功故事</span>
        </h1>
        <p class="cases-hero__desc">
          我们与众多行业领先企业合作，帮助他们实现数字化转型目标
        </p>
      </div>
    </section>
    
    <!-- 筛选 -->
    <section class="cases-filter">
      <div class="cases-filter__container container">
        <div class="cases-filter__tabs">
          <button 
            v-for="category in categories" 
            :key="category"
            class="cases-filter__tab"
            :class="{ 'cases-filter__tab--active': selectedCategory === category }"
            @click="selectedCategory = category"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </section>
    
    <!-- 案例列表 -->
    <section class="cases-grid section">
      <div class="cases-grid__container container">
        <TransitionGroup name="list" tag="div" class="cases-grid__list">
          <article v-for="caseItem in filteredCases" :key="caseItem.id" class="case-card card">
            <div class="case-card__image">
              <span>{{ caseItem.image }}</span>
            </div>
            <div class="case-card__content">
              <span class="case-card__category">{{ caseItem.category }}</span>
              <h3 class="case-card__title">{{ caseItem.title }}</h3>
              <p class="case-card__desc">{{ caseItem.desc }}</p>
              <div class="case-card__tags">
                <span v-for="tag in caseItem.tags" :key="tag" class="case-card__tag">
                  {{ tag }}
                </span>
              </div>
              <div class="case-card__results">
                <span v-for="result in caseItem.results" :key="result" class="case-card__result">
                  ✓ {{ result }}
                </span>
              </div>
            </div>
          </article>
        </TransitionGroup>
      </div>
    </section>
    
    <!-- CTA -->
    <section class="cases-cta section">
      <div class="cases-cta__container container">
        <div class="cases-cta__card card card--glass">
          <h2>想要成为下一个成功案例？</h2>
          <p>与我们的专家团队交流，开启您的数字化转型之旅</p>
          <NuxtLink to="/contact" class="btn btn--primary btn--lg">
            立即咨询
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:map';

.cases-hero {
  text-align: center;
  
  &__container {
    max-width: 800px;
    margin-inline: auto;
  }
  
  &__title {
    font-size: font-size('5xl');
    margin-top: spacing('4');
    margin-bottom: spacing('6');
  }
  
  &__desc {
    font-size: font-size('lg');
    color: var(--color-text-secondary);
  }
}

.cases-filter {
  padding-block: spacing('4');
  
  &__tabs {
    @include flex(row, center, center, wrap);
    gap: spacing('2');
  }
  
  &__tab {
    padding: spacing('2') spacing('4');
    font-size: font-size('sm');
    font-weight: map.get($font-weights, 'medium');
    color: var(--color-text-secondary);
    background: transparent;
    border: 1px solid transparent;
    border-radius: map.get($radius, 'full');
    @include transition(all);
    
    &:hover {
      color: var(--color-text-primary);
      background: rgba(255, 255, 255, 0.05);
    }
    
    &--active {
      color: #{color('dark')};
      background: linear-gradient(135deg, color('primary'), color('accent'));
      border-color: transparent;
    }
  }
}

.cases-grid {
  &__list {
    @include grid-auto-fit(350px, spacing('6'));
  }
}

.case-card {
  overflow: hidden;
  
  &__image {
    @include flex-center;
    height: 160px;
    font-size: 4rem;
    background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
    margin: -#{spacing('6')};
    margin-bottom: spacing('4');
  }
  
  &__category {
    display: inline-block;
    padding: spacing('1') spacing('2');
    font-size: font-size('xs');
    color: var(--color-primary);
    background: rgba(0, 212, 255, 0.1);
    border-radius: map.get($radius, 'sm');
    margin-bottom: spacing('3');
  }
  
  &__title {
    font-size: font-size('lg');
    margin-bottom: spacing('3');
  }
  
  &__desc {
    font-size: font-size('sm');
    color: var(--color-text-secondary);
    margin-bottom: spacing('4');
  }
  
  &__tags {
    @include flex(row, flex-start, center, wrap);
    gap: spacing('2');
    margin-bottom: spacing('4');
  }
  
  &__tag {
    padding: spacing('1') spacing('2');
    font-size: font-size('xs');
    color: var(--color-text-muted);
    background: rgba(255, 255, 255, 0.05);
    border-radius: map.get($radius, 'sm');
  }
  
  &__results {
    @include flex(column, flex-start, stretch);
    gap: spacing('2');
    padding-top: spacing('4');
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  &__result {
    font-size: font-size('sm');
    color: color('success');
  }
}

.cases-cta {
  &__card {
    text-align: center;
    padding: spacing('12');
    
    h2 {
      margin-bottom: spacing('3');
    }
    
    p {
      color: var(--color-text-secondary);
      margin-bottom: spacing('6');
    }
  }
}

.list-enter-active,
.list-leave-active {
  transition: all 300ms ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>

