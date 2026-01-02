<script setup lang="ts">
const currentYear = new Date().getFullYear()

const footerLinks = {
  product: {
    title: '产品服务',
    links: [
      { name: '企业解决方案', path: '/services#enterprise' },
      { name: '云端服务', path: '/services#cloud' },
      { name: '数据分析', path: '/services#analytics' },
      { name: 'AI 智能', path: '/services#ai' }
    ]
  },
  company: {
    title: '关于公司',
    links: [
      { name: '关于我们', path: '/about' },
      { name: '团队介绍', path: '/about#team' },
      { name: '加入我们', path: '#' },
      { name: '新闻动态', path: '#' }
    ]
  },
  support: {
    title: '支持帮助',
    links: [
      { name: '帮助中心', path: '#' },
      { name: '文档中心', path: '#' },
      { name: '社区论坛', path: '#' },
      { name: '联系我们', path: '/contact' }
    ]
  },
  legal: {
    title: '法律条款',
    links: [
      { name: '隐私政策', path: '#' },
      { name: '服务条款', path: '#' },
      { name: 'Cookie 政策', path: '#' }
    ]
  }
}

const socialLinks = [
  { name: '微信', icon: '💬', url: '#wechat' },
  { name: '微博', icon: '📢', url: '#weibo' },
  { name: 'GitHub', icon: '💻', url: 'https://github.com' },
  { name: '邮箱', icon: '✉️', url: 'mailto:contact@example.com' }
]
</script>

<template>
  <footer class="footer">
    <div class="footer__container container">
      <!-- 顶部区域 -->
      <div class="footer__top">
        <!-- 品牌区域 -->
        <div class="footer__brand">
          <NuxtLink to="/" class="footer__logo">
            <span class="footer__logo-icon">◆</span>
            <span class="footer__logo-text">科技未来</span>
          </NuxtLink>
          <p class="footer__desc">
            致力于为企业提供领先的数字化转型解决方案，<br class="desktop-only">
            用科技驱动未来发展。
          </p>
          <div class="footer__social">
            <a
              v-for="social in socialLinks"
              :key="social.name"
              :href="social.url"
              class="footer__social-link"
              :title="social.name"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ social.icon }}
            </a>
          </div>
        </div>
        
        <!-- 链接区域 -->
        <div class="footer__links">
          <div
            v-for="(section, key) in footerLinks"
            :key="key"
            class="footer__link-group"
          >
            <h4 class="footer__link-title">{{ section.title }}</h4>
            <ul class="footer__link-list">
              <li v-for="link in section.links" :key="link.path">
                <NuxtLink :to="link.path" class="footer__link">
                  {{ link.name }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <!-- 分隔线 -->
      <div class="footer__divider"></div>
      
      <!-- 底部区域 -->
      <div class="footer__bottom">
        <p class="footer__copyright">
          © {{ currentYear }} 科技未来. 保留所有权利.
        </p>
        <p class="footer__icp">
          京ICP备XXXXXXXX号-1
        </p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@use 'sass:map';

.footer {
  margin-top: auto;
  background: var(--color-dark-soft);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  
  &__container {
    padding-block: spacing('12');
    
    @include mobile-only {
      padding-block: spacing('8');
    }
  }
  
  &__top {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: spacing('12');
    
    @include respond-below('lg') {
      grid-template-columns: 1fr;
      gap: spacing('8');
    }
  }
  
  // 品牌区域
  &__brand {
    max-width: 320px;
    
    @include respond-below('lg') {
      max-width: none;
    }
  }
  
  &__logo {
    @include flex(row, flex-start, center);
    gap: spacing('2');
    font-size: font-size('xl');
    font-weight: map.get($font-weights, 'bold');
    color: var(--color-text-primary);
    text-decoration: none;
    margin-bottom: spacing('4');
  }
  
  &__logo-icon {
    @include gradient-text(linear-gradient(135deg, color('primary') 0%, color('accent') 100%));
  }
  
  &__logo-text {
    @include gradient-text(linear-gradient(135deg, color('primary') 0%, color('accent') 100%));
  }
  
  &__desc {
    color: var(--color-text-secondary);
    font-size: font-size('sm');
    line-height: 1.7;
    margin-bottom: spacing('6');
  }
  
  &__social {
    @include flex(row, flex-start, center);
    gap: spacing('3');
  }
  
  &__social-link {
    @include flex-center;
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: map.get($radius, 'lg');
    text-decoration: none;
    @include transition(all);
    
    &:hover {
      background: rgba(0, 212, 255, 0.2);
      transform: translateY(-2px);
    }
  }
  
  // 链接区域
  &__links {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: spacing('6');
    
    @include respond-below('md') {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @include mobile-only {
      grid-template-columns: 1fr 1fr;
      gap: spacing('6') spacing('4');
    }
  }
  
  &__link-group {
    min-width: 0;
  }
  
  &__link-title {
    font-size: font-size('sm');
    font-weight: map.get($font-weights, 'semibold');
    color: var(--color-text-primary);
    margin-bottom: spacing('4');
  }
  
  &__link-list {
    @include flex(column, flex-start, stretch);
    gap: spacing('3');
  }
  
  &__link {
    font-size: font-size('sm');
    color: var(--color-text-secondary);
    text-decoration: none;
    @include transition(color);
    
    &:hover {
      color: var(--color-primary);
    }
  }
  
  // 分隔线
  &__divider {
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1) 50%,
      transparent
    );
    margin-block: spacing('8');
  }
  
  // 底部区域
  &__bottom {
    @include flex-between;
    gap: spacing('4');
    
    @include mobile-only {
      flex-direction: column;
      text-align: center;
    }
  }
  
  &__copyright,
  &__icp {
    font-size: font-size('sm');
    color: var(--color-text-muted);
    margin: 0;
  }
}
</style>

