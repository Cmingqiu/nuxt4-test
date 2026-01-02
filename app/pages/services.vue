<script setup lang="ts">
useSeoMeta({
  title: '服务',
  description: '探索我们的数字化解决方案 - 企业转型、云服务、AI智能、安全防护'
});

const services = [
  {
    id: 'enterprise',
    icon: '🏢',
    title: '企业数字化转型',
    desc: '全面的企业级数字化解决方案，从战略规划到落地实施',
    features: ['业务流程优化', '系统集成升级', '数据资产管理', '组织变革咨询']
  },
  {
    id: 'cloud',
    icon: '☁️',
    title: '云端解决方案',
    desc: '弹性可扩展的云基础设施，保障业务稳定高效运行',
    features: ['混合云架构', '容器化部署', '自动化运维', '成本优化']
  },
  {
    id: 'analytics',
    icon: '📊',
    title: '数据分析平台',
    desc: '全方位数据采集、处理、分析与可视化解决方案',
    features: ['实时数据处理', '商业智能报表', '预测性分析', '数据治理']
  },
  {
    id: 'ai',
    icon: '🤖',
    title: 'AI 智能应用',
    desc: '深度学习与机器学习技术，赋能智能化业务决策',
    features: ['智能客服系统', '图像识别', '自然语言处理', '推荐系统']
  },
  {
    id: 'security',
    icon: '🔒',
    title: '安全防护体系',
    desc: '企业级安全解决方案，全面保护数据与业务安全',
    features: ['威胁检测', '身份认证', '数据加密', '合规审计']
  },
  {
    id: 'consulting',
    icon: '💼',
    title: '技术咨询服务',
    desc: '专业的技术顾问团队，提供战略级技术咨询',
    features: ['技术规划', '架构评估', '团队培训', '项目管理']
  }
];

const process = [
  { step: '01', title: '需求调研', desc: '深入了解业务需求与痛点' },
  { step: '02', title: '方案设计', desc: '制定定制化解决方案' },
  { step: '03', title: '开发实施', desc: '敏捷开发，快速迭代' },
  { step: '04', title: '上线交付', desc: '严格测试，平稳上线' },
  { step: '05', title: '持续运维', desc: '7x24 技术支持保障' }
];
</script>

<template>
  <div class="services-page">
    <!-- Hero -->
    <section class="services-hero section section--hero">
      <div class="services-hero__container container">
        <span class="badge">我们的服务</span>
        <h1 class="services-hero__title">
          <span class="text-gradient">全方位</span>
          数字化解决方案
        </h1>
        <p class="services-hero__desc">
          从战略规划到技术落地，我们提供端到端的数字化转型服务
        </p>
      </div>
    </section>

    <!-- 服务列表 -->
    <section class="services-list section">
      <div class="services-list__container container">
        <div class="services-list__grid">
          <article
            v-for="service in services"
            :key="service.id"
            :id="service.id"
            class="service-detail card">
            <div class="service-detail__header">
              <span class="service-detail__icon">{{ service.icon }}</span>
              <div>
                <h2 class="service-detail__title">{{ service.title }}</h2>
                <p class="service-detail__desc">{{ service.desc }}</p>
              </div>
            </div>
            <ul class="service-detail__features">
              <li v-for="feature in service.features" :key="feature">
                <span class="service-detail__check">✓</span>
                {{ feature }}
              </li>
            </ul>
            <NuxtLink to="/contact" class="btn btn--outline">
              咨询此服务
            </NuxtLink>
          </article>
        </div>
      </div>
    </section>

    <!-- 服务流程 -->
    <section class="process section">
      <div class="process__container container">
        <div class="process__header">
          <span class="badge">服务流程</span>
          <h2>我们的工作方式</h2>
        </div>
        <div class="process__grid">
          <div v-for="item in process" :key="item.step" class="process__item">
            <span class="process__step">{{ item.step }}</span>
            <h3 class="process__title">{{ item.title }}</h3>
            <p class="process__desc">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="services-cta section">
      <div class="services-cta__container container">
        <div class="services-cta__card card card--glass">
          <h2>找不到需要的服务？</h2>
          <p>联系我们，获取定制化解决方案</p>
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

.services-hero {
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

.services-list {
  &__grid {
    @include grid-auto-fit(400px, spacing('6'));

    @include mobile-only {
      grid-template-columns: 1fr;
    }
  }
}

.service-detail {
  &__header {
    @include flex(row, flex-start, flex-start);
    gap: spacing('4');
    margin-bottom: spacing('6');

    @include mobile-only {
      flex-direction: column;
    }
  }

  &__icon {
    flex-shrink: 0;
    @include flex-center;
    width: 60px;
    height: 60px;
    font-size: 2rem;
    background: rgba(0, 212, 255, 0.1);
    border-radius: map.get($radius, 'lg');
  }

  &__title {
    font-size: font-size('xl');
    margin-bottom: spacing('2');
  }

  &__desc {
    color: var(--color-text-secondary);
    margin: 0;
  }

  &__features {
    @include flex(column, flex-start, stretch);
    gap: spacing('3');
    margin-bottom: spacing('6');
  }

  &__features li {
    @include flex(row, flex-start, center);
    gap: spacing('3');
    font-size: font-size('sm');
    color: var(--color-text-secondary);
  }

  &__check {
    color: color('success');
    font-weight: map.get($font-weights, 'bold');
  }
}

.process {
  background: var(--color-dark-soft);

  &__header {
    text-align: center;
    margin-bottom: spacing('12');

    h2 {
      margin-top: spacing('4');
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: spacing('4');

    @include respond-below('lg') {
      grid-template-columns: repeat(3, 1fr);
    }

    @include mobile-only {
      grid-template-columns: 1fr;
    }
  }

  &__item {
    text-align: center;
    padding: spacing('6');

    @include mobile-only {
      @include flex(row, flex-start, center);
      gap: spacing('4');
      text-align: left;
    }
  }

  &__step {
    display: inline-block;
    font-size: font-size('3xl');
    font-weight: map.get($font-weights, 'bold');
    @include gradient-text(
      linear-gradient(135deg, color('primary') 0%, color('accent') 100%)
    );
    margin-bottom: spacing('4');

    @include mobile-only {
      flex-shrink: 0;
      margin-bottom: 0;
    }
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

.services-cta {
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
</style>
