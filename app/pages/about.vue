<script setup lang="ts">
useSeoMeta({
  title: '关于我们',
  description: '了解科技未来 - 我们的使命、愿景和团队'
})

const milestones = [
  { year: '2018', title: '公司成立', desc: '在北京正式成立，开启数字化转型之旅' },
  { year: '2019', title: '首个产品', desc: '发布首个企业级云解决方案' },
  { year: '2020', title: '快速扩张', desc: '服务客户突破 100 家，团队规模翻倍' },
  { year: '2021', title: 'AI 布局', desc: '推出 AI 智能分析平台' },
  { year: '2022', title: '行业领先', desc: '成为行业头部解决方案提供商' },
  { year: '2023', title: '全球化', desc: '业务拓展至亚太多个国家和地区' }
]

const team = [
  { name: '张伟', role: 'CEO & 创始人', avatar: '👨‍💼' },
  { name: '李明', role: 'CTO', avatar: '👨‍💻' },
  { name: '王芳', role: 'COO', avatar: '👩‍💼' },
  { name: '陈强', role: '产品总监', avatar: '👨‍🔬' }
]

const values = [
  { icon: '💡', title: '创新驱动', desc: '持续探索前沿技术，引领行业变革' },
  { icon: '🤝', title: '客户至上', desc: '以客户成功为核心，提供卓越服务' },
  { icon: '🎯', title: '结果导向', desc: '专注于创造可量化的业务价值' },
  { icon: '🌱', title: '持续成长', desc: '与客户、员工共同成长进步' }
]
</script>

<template>
  <div class="about">
    <!-- Hero -->
    <section class="about-hero section section--hero">
      <div class="about-hero__container container">
        <span class="badge">关于我们</span>
        <h1 class="about-hero__title">
          用科技的力量
          <br>
          <span class="text-gradient">改变世界</span>
        </h1>
        <p class="about-hero__desc">
          我们是一群热爱技术、追求卓越的创新者，
          致力于为企业提供领先的数字化解决方案。
        </p>
      </div>
    </section>
    
    <!-- 使命愿景 -->
    <section class="mission section">
      <div class="mission__container container">
        <div class="mission__grid">
          <article class="mission__card">
            <h3 class="mission__card-title">我们的使命</h3>
            <p class="mission__card-desc">
              通过创新的技术解决方案，帮助每一家企业实现数字化转型，
              释放数据价值，提升运营效率，创造持续增长。
            </p>
          </article>
          <article class="mission__card">
            <h3 class="mission__card-title">我们的愿景</h3>
            <p class="mission__card-desc">
              成为全球最受信赖的企业数字化转型合作伙伴，
              以科技创新推动社会进步与产业升级。
            </p>
          </article>
        </div>
      </div>
    </section>
    
    <!-- 核心价值观 -->
    <section class="values section">
      <div class="values__container container">
        <div class="values__header">
          <span class="badge">核心价值观</span>
          <h2>驱动我们前进的力量</h2>
        </div>
        <div class="values__grid">
          <article v-for="value in values" :key="value.title" class="value-card card">
            <span class="value-card__icon">{{ value.icon }}</span>
            <h3 class="value-card__title">{{ value.title }}</h3>
            <p class="value-card__desc">{{ value.desc }}</p>
          </article>
        </div>
      </div>
    </section>
    
    <!-- 发展历程 -->
    <section class="timeline section">
      <div class="timeline__container container">
        <div class="timeline__header">
          <span class="badge">发展历程</span>
          <h2>一路走来</h2>
        </div>
        <div class="timeline__content">
          <div v-for="(milestone, index) in milestones" :key="milestone.year" class="timeline__item">
            <div class="timeline__marker">
              <span class="timeline__year">{{ milestone.year }}</span>
            </div>
            <div class="timeline__card card">
              <h3 class="timeline__title">{{ milestone.title }}</h3>
              <p class="timeline__desc">{{ milestone.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- 团队介绍 -->
    <section id="team" class="team section">
      <div class="team__container container">
        <div class="team__header">
          <span class="badge">核心团队</span>
          <h2>遇见我们的团队</h2>
          <p class="team__subtitle">来自顶尖科技公司的精英人才</p>
        </div>
        <div class="team__grid">
          <article v-for="member in team" :key="member.name" class="team-card card">
            <span class="team-card__avatar">{{ member.avatar }}</span>
            <h3 class="team-card__name">{{ member.name }}</h3>
            <p class="team-card__role">{{ member.role }}</p>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:map';

.about-hero {
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

.mission {
  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: spacing('6');
    
    @include mobile-only {
      grid-template-columns: 1fr;
    }
  }
  
  &__card {
    padding: spacing('8');
    background: linear-gradient(135deg, rgba(0, 212, 255, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: map.get($radius, 'xl');
  }
  
  &__card-title {
    font-size: font-size('xl');
    margin-bottom: spacing('4');
    @include gradient-text(linear-gradient(135deg, color('primary') 0%, color('accent') 100%));
  }
  
  &__card-desc {
    color: var(--color-text-secondary);
    line-height: 1.8;
    margin: 0;
  }
}

.values {
  &__header {
    text-align: center;
    margin-bottom: spacing('12');
    
    h2 {
      margin-top: spacing('4');
    }
  }
  
  &__grid {
    @include grid-auto-fit(240px, spacing('6'));
  }
}

.value-card {
  text-align: center;
  
  &__icon {
    display: block;
    font-size: 2.5rem;
    margin-bottom: spacing('4');
  }
  
  &__title {
    font-size: font-size('lg');
    margin-bottom: spacing('3');
  }
  
  &__desc {
    font-size: font-size('sm');
    color: var(--color-text-secondary);
    margin: 0;
  }
}

.timeline {
  &__header {
    text-align: center;
    margin-bottom: spacing('12');
    
    h2 {
      margin-top: spacing('4');
    }
  }
  
  &__content {
    position: relative;
    max-width: 700px;
    margin-inline: auto;
    
    &::before {
      content: '';
      position: absolute;
      left: 50px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: linear-gradient(180deg, color('primary'), color('accent'));
      
      @include mobile-only {
        left: 20px;
      }
    }
  }
  
  &__item {
    position: relative;
    padding-left: 120px;
    padding-bottom: spacing('8');
    
    @include mobile-only {
      padding-left: 60px;
    }
    
    &:last-child {
      padding-bottom: 0;
    }
  }
  
  &__marker {
    position: absolute;
    left: 0;
    top: 0;
    width: 100px;
    text-align: center;
    
    @include mobile-only {
      width: 40px;
    }
  }
  
  &__year {
    display: inline-block;
    padding: spacing('2') spacing('3');
    font-size: font-size('sm');
    font-weight: map.get($font-weights, 'bold');
    color: var(--color-dark);
    background: linear-gradient(135deg, color('primary'), color('accent'));
    border-radius: map.get($radius, 'full');
    
    @include mobile-only {
      padding: spacing('1') spacing('2');
      font-size: font-size('xs');
    }
  }
  
  &__card {
    padding: spacing('5');
  }
  
  &__title {
    font-size: font-size('lg');
    margin-bottom: spacing('2');
  }
  
  &__desc {
    font-size: font-size('sm');
    color: var(--color-text-secondary);
    margin: 0;
  }
}

.team {
  &__header {
    text-align: center;
    margin-bottom: spacing('12');
    
    h2 {
      margin-top: spacing('4');
      margin-bottom: spacing('3');
    }
  }
  
  &__subtitle {
    color: var(--color-text-secondary);
  }
  
  &__grid {
    @include grid-auto-fit(200px, spacing('6'));
    justify-content: center;
  }
}

.team-card {
  text-align: center;
  
  &__avatar {
    display: block;
    font-size: 4rem;
    margin-bottom: spacing('4');
  }
  
  &__name {
    font-size: font-size('lg');
    margin-bottom: spacing('2');
  }
  
  &__role {
    font-size: font-size('sm');
    color: var(--color-text-secondary);
    margin: 0;
  }
}
</style>

