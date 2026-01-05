<script setup lang="ts">
// 首页 SEO
useSeoMeta({
  title: '首页',
  description: '科技未来 - 领先的数字化转型解决方案提供商，用创新科技驱动企业未来发展',
  ogTitle: '科技未来 - 引领数字化转型',
  ogDescription: '领先的数字化转型解决方案提供商',
  ogImage: '/og-image.jpg'
})

// 服务列表
const services = [
  {
    icon: '🚀',
    title: '数字化转型',
    desc: '全方位企业数字化升级方案，助力业务流程优化与创新'
  },
  {
    icon: '☁️',
    title: '云端解决方案',
    desc: '弹性可扩展的云基础设施，保障业务稳定高效运行'
  },
  {
    icon: '🤖',
    title: 'AI 智能应用',
    desc: '深度学习与机器学习技术，赋能智能化业务决策'
  },
  {
    icon: '🔒',
    title: '安全防护',
    desc: '企业级安全解决方案，全面保护数据与业务安全'
  }
]

// 数据统计
const stats = [
  { value: '500+', label: '服务企业' },
  { value: '99.9%', label: '服务可用率' },
  { value: '50+', label: '行业覆盖' },
  { value: '24/7', label: '技术支持' }
]

// 客户评价
const testimonials = [
  {
    content: '科技未来的数字化解决方案帮助我们实现了业务流程的全面升级，效率提升了 300%。',
    author: '张经理',
    company: '某知名制造企业',
    avatar: '👤'
  },
  {
    content: '专业的技术团队和7x24小时的支持服务，让我们的系统运行稳定无忧。',
    author: '李总监',
    company: '某金融科技公司',
    avatar: '👤'
  },
  {
    content: 'AI 智能应用为我们带来了前所未有的数据洞察能力，决策更加精准高效。',
    author: '王总',
    company: '某电商平台',
    avatar: '👤'
  }
]
</script>

<template>
  <div class="home">
    <!-- Hero 区域 -->
    <section class="hero section section--hero">
      <div class="hero__container container">
        <div class="hero__content">
          <span class="badge hero__badge">🚀 新一代技术平台</span>
          <h1 class="hero__title">
            用科技
            <span class="text-gradient">驱动未来</span>
          </h1>
          <p class="hero__desc">
            我们提供领先的数字化转型解决方案，帮助企业在数字时代保持竞争优势。
            从云端架构到 AI 应用，全方位赋能您的业务增长。
          </p>
          <div class="hero__actions">
            <NuxtLink to="/contact" class="btn btn--primary btn--lg">
              开始咨询
              <span>→</span>
            </NuxtLink>
            <NuxtLink to="/services" class="btn btn--outline btn--lg">
              了解服务
            </NuxtLink>
          </div>
        </div>
        
        <div class="hero__visual">
          <div class="hero__visual-inner">
            <div class="hero__visual-shape hero__visual-shape--1"></div>
            <div class="hero__visual-shape hero__visual-shape--2"></div>
            <div class="hero__visual-shape hero__visual-shape--3"></div>
            <div class="hero__visual-code">
              <pre><code>&lt;future&gt;
  innovation.enable()
  transform.start()
&lt;/future&gt;</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 统计数据 -->
    <section class="stats">
      <div class="stats__container container">
        <div class="stats__grid">
          <div v-for="stat in stats" :key="stat.label" class="stats__item">
            <span class="stats__value">{{ stat.value }}</span>
            <span class="stats__label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 服务介绍 -->
    <section class="services section">
      <div class="services__container container">
        <div class="services__header">
          <span class="badge">核心服务</span>
          <h2 class="services__title">全方位数字化解决方案</h2>
          <p class="services__subtitle">
            覆盖企业数字化转型的全生命周期，从战略规划到落地实施
          </p>
        </div>
        
        <div class="services__grid">
          <article v-for="service in services" :key="service.title" class="service-card card">
            <span class="service-card__icon">{{ service.icon }}</span>
            <h3 class="service-card__title">{{ service.title }}</h3>
            <p class="service-card__desc">{{ service.desc }}</p>
            <NuxtLink to="/services" class="service-card__link">
              了解更多 <span>→</span>
            </NuxtLink>
          </article>
        </div>
      </div>
    </section>
    
    <!-- 客户评价 -->
    <section class="testimonials section">
      <div class="testimonials__container container">
        <div class="testimonials__header">
          <span class="badge">客户评价</span>
          <h2 class="testimonials__title">他们的成功故事</h2>
        </div>
        
        <div class="testimonials__grid">
          <article 
            v-for="(testimonial, index) in testimonials" 
            :key="index" 
            class="testimonial-card card card--glass"
          >
            <p class="testimonial-card__content">"{{ testimonial.content }}"</p>
            <div class="testimonial-card__author">
              <span class="testimonial-card__avatar">{{ testimonial.avatar }}</span>
              <div>
                <p class="testimonial-card__name">{{ testimonial.author }}</p>
                <p class="testimonial-card__company">{{ testimonial.company }}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
    
    <!-- CTA 区域 -->
    <section class="cta section">
      <div class="cta__container container">
        <div class="cta__card">
          <div class="cta__content">
            <h2 class="cta__title">准备好开启数字化转型了吗？</h2>
            <p class="cta__desc">
              与我们的专家团队交流，获取定制化的解决方案建议
            </p>
          </div>
          <div class="cta__actions">
            <NuxtLink to="/contact" class="btn btn--primary btn--lg">
              立即咨询
            </NuxtLink>
            <NuxtLink to="/about" class="btn btn--ghost btn--lg">
              了解我们
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:map';

// ================================
// Hero 区域
// ================================
.hero {
  min-height: calc(100vh - var(--header-height));
  @include flex(column, center, center);
  
  &__container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: spacing('12');
    align-items: center;
    
    @include respond-below('lg') {
      grid-template-columns: 1fr;
      text-align: center;
    }
  }
  
  &__content {
    @include respond-below('lg') {
      order: 2;
    }
  }
  
  &__badge {
    margin-bottom: spacing('6');
  }
  
  &__title {
    font-size: font-size('5xl');
    font-weight: map.get($font-weights, 'bold');
    line-height: 1.1;
    margin-bottom: spacing('6');
    
    @include mobile-only {
      font-size: font-size('4xl');
    }
  }
  
  &__desc {
    font-size: font-size('lg');
    color: var(--color-text-secondary);
    max-width: 500px;
    margin-bottom: spacing('8');
    
    @include respond-below('lg') {
      margin-inline: auto;
    }
  }
  
  &__actions {
    @include flex(row, flex-start, center, wrap);
    gap: spacing('4');
    
    @include respond-below('lg') {
      justify-content: center;
    }
  }
  
  // 视觉元素
  &__visual {
    position: relative;
    aspect-ratio: 1;
    max-width: 500px;
    margin-inline: auto;
    
    @include respond-below('lg') {
      order: 1;
      max-width: 350px;
    }
  }
  
  &__visual-inner {
    position: relative;
    width: 100%;
    height: 100%;
    @include flex-center;
  }
  
  &__visual-shape {
    position: absolute;
    border-radius: 50%;
    
    &--1 {
      width: 100%;
      height: 100%;
      border: 2px solid rgba(0, 212, 255, 0.2);
      animation: pulse 4s ease-in-out infinite;
    }
    
    &--2 {
      width: 75%;
      height: 75%;
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
      animation: pulse 4s ease-in-out infinite 1s;
    }
    
    &--3 {
      width: 50%;
      height: 50%;
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%);
      animation: pulse 4s ease-in-out infinite 2s;
    }
  }
  
  &__visual-code {
    position: relative;
    z-index: 1;
    padding: spacing('6');
    background: var(--glass-bg);
    border: 1px solid var(--color-border-hover);
    border-radius: map.get($radius, 'lg');
    backdrop-filter: blur(10px);
    
    pre {
      margin: 0;
    }
    
    code {
      font-family: $font-family-mono;
      font-size: font-size('sm');
      color: var(--color-primary);
      line-height: 1.6;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
}

// ================================
// 统计数据
// ================================
.stats {
  padding-block: spacing('12');
  background: var(--color-bg-soft);
  border-block: 1px solid var(--color-border-light);
  
  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: spacing('6');
    
    @include respond-below('md') {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  &__item {
    text-align: center;
  }
  
  &__value {
    display: block;
    font-size: font-size('4xl');
    font-weight: map.get($font-weights, 'bold');
    @include gradient-text(linear-gradient(135deg, color('primary') 0%, color('accent') 100%));
    margin-bottom: spacing('2');
  }
  
  &__label {
    font-size: font-size('sm');
    color: var(--color-text-secondary);
  }
}

// ================================
// 服务介绍
// ================================
.services {
  &__header {
    text-align: center;
    margin-bottom: spacing('12');
  }
  
  &__title {
    margin-top: spacing('4');
    margin-bottom: spacing('4');
  }
  
  &__subtitle {
    font-size: font-size('lg');
    color: var(--color-text-secondary);
    max-width: 600px;
    margin-inline: auto;
  }
  
  &__grid {
    @include grid-auto-fit(280px, spacing('6'));
  }
}

.service-card {
  text-align: center;
  
  &__icon {
    display: block;
    font-size: 3rem;
    margin-bottom: spacing('4');
  }
  
  &__title {
    font-size: font-size('xl');
    margin-bottom: spacing('3');
  }
  
  &__desc {
    font-size: font-size('sm');
    color: var(--color-text-secondary);
    margin-bottom: spacing('4');
  }
  
  &__link {
    display: inline-flex;
    align-items: center;
    gap: spacing('2');
    font-size: font-size('sm');
    font-weight: map.get($font-weights, 'medium');
    color: var(--color-primary);
    
    span {
      @include transition(transform);
    }
    
    &:hover span {
      transform: translateX(4px);
    }
  }
}

// ================================
// 客户评价
// ================================
.testimonials {
  &__header {
    text-align: center;
    margin-bottom: spacing('12');
  }
  
  &__title {
    margin-top: spacing('4');
  }
  
  &__grid {
    @include grid-auto-fit(320px, spacing('6'));
  }
}

.testimonial-card {
  &__content {
    font-size: font-size('base');
    color: var(--color-text-secondary);
    line-height: 1.7;
    margin-bottom: spacing('6');
  }
  
  &__author {
    @include flex(row, flex-start, center);
    gap: spacing('3');
  }
  
  &__avatar {
    @include flex-center;
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
    background: rgba(0, 212, 255, 0.1);
    border-radius: 50%;
  }
  
  &__name {
    font-weight: map.get($font-weights, 'medium');
    color: var(--color-text-primary);
    margin-bottom: spacing('1');
  }
  
  &__company {
    font-size: font-size('sm');
    color: var(--color-text-muted);
    margin: 0;
  }
}

// ================================
// CTA 区域
// ================================
.cta {
  &__card {
    @include flex(row, space-between, center, wrap);
    gap: spacing('6');
    padding: spacing('10');
    background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%);
    border: 1px solid rgba(0, 212, 255, 0.2);
    border-radius: map.get($radius, '2xl');
    
    @include mobile-only {
      flex-direction: column;
      text-align: center;
      padding: spacing('8');
    }
  }
  
  &__title {
    font-size: font-size('2xl');
    margin-bottom: spacing('2');
  }
  
  &__desc {
    color: var(--color-text-secondary);
    margin: 0;
  }
  
  &__actions {
    @include flex(row, flex-end, center);
    gap: spacing('4');
    
    @include mobile-only {
      flex-direction: column;
      width: 100%;
      
      .btn {
        width: 100%;
      }
    }
  }
}
</style>

