<script setup lang="ts">
useSeoMeta({
  title: '联系我们',
  description: '与我们取得联系，获取专业的技术咨询服务'
})

const formData = reactive({
  name: '',
  email: '',
  company: '',
  phone: '',
  service: '',
  message: ''
})

const services = [
  '企业数字化转型',
  '云端解决方案',
  '数据分析平台',
  'AI 智能应用',
  '安全防护体系',
  '技术咨询服务',
  '其他'
]

const isSubmitting = ref(false)
const isSubmitted = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  
  // 模拟提交
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  isSubmitting.value = false
  isSubmitted.value = true
}

const contactInfo = [
  { icon: '📍', label: '地址', value: '北京市朝阳区科技园区A座1001' },
  { icon: '📞', label: '电话', value: '+86 400-888-8888' },
  { icon: '✉️', label: '邮箱', value: 'contact@techfuture.com' },
  { icon: '⏰', label: '工作时间', value: '周一至周五 9:00-18:00' }
]
</script>

<template>
  <div class="contact-page">
    <!-- Hero -->
    <section class="contact-hero section section--hero">
      <div class="contact-hero__container container">
        <span class="badge">联系我们</span>
        <h1 class="contact-hero__title">
          让我们
          <span class="text-gradient">开始对话</span>
        </h1>
        <p class="contact-hero__desc">
          无论您有任何问题或需求，我们都期待与您交流
        </p>
      </div>
    </section>
    
    <!-- 联系表单 -->
    <section class="contact-main section">
      <div class="contact-main__container container">
        <div class="contact-main__grid">
          <!-- 表单 -->
          <div class="contact-form card">
            <Transition name="fade" mode="out-in">
              <div v-if="!isSubmitted" key="form">
                <h2 class="contact-form__title">发送消息</h2>
                <form @submit.prevent="handleSubmit" class="contact-form__form">
                  <div class="contact-form__row">
                    <div class="form-group">
                      <label for="name">姓名 *</label>
                      <input 
                        id="name"
                        v-model="formData.name" 
                        type="text" 
                        placeholder="请输入您的姓名"
                        required
                      />
                    </div>
                    <div class="form-group">
                      <label for="email">邮箱 *</label>
                      <input 
                        id="email"
                        v-model="formData.email" 
                        type="email" 
                        placeholder="请输入您的邮箱"
                        required
                      />
                    </div>
                  </div>
                  
                  <div class="contact-form__row">
                    <div class="form-group">
                      <label for="company">公司名称</label>
                      <input 
                        id="company"
                        v-model="formData.company" 
                        type="text" 
                        placeholder="请输入公司名称"
                      />
                    </div>
                    <div class="form-group">
                      <label for="phone">联系电话</label>
                      <input 
                        id="phone"
                        v-model="formData.phone" 
                        type="tel" 
                        placeholder="请输入联系电话"
                      />
                    </div>
                  </div>
                  
                  <div class="form-group">
                    <label for="service">感兴趣的服务</label>
                    <select id="service" v-model="formData.service">
                      <option value="">请选择服务类型</option>
                      <option v-for="service in services" :key="service" :value="service">
                        {{ service }}
                      </option>
                    </select>
                  </div>
                  
                  <div class="form-group">
                    <label for="message">留言内容 *</label>
                    <textarea 
                      id="message"
                      v-model="formData.message"
                      rows="5"
                      placeholder="请描述您的需求或问题..."
                      required
                    ></textarea>
                  </div>
                  
                  <button type="submit" class="btn btn--primary btn--lg" :disabled="isSubmitting">
                    {{ isSubmitting ? '提交中...' : '发送消息' }}
                  </button>
                </form>
              </div>
              
              <div v-else key="success" class="contact-form__success">
                <span class="contact-form__success-icon">✓</span>
                <h2>消息已发送</h2>
                <p>感谢您的留言，我们会尽快与您联系！</p>
                <button class="btn btn--outline" @click="isSubmitted = false">
                  发送新消息
                </button>
              </div>
            </Transition>
          </div>
          
          <!-- 联系信息 -->
          <div class="contact-info">
            <h2 class="contact-info__title">联系方式</h2>
            <div class="contact-info__list">
              <div v-for="info in contactInfo" :key="info.label" class="contact-info__item">
                <span class="contact-info__icon">{{ info.icon }}</span>
                <div>
                  <span class="contact-info__label">{{ info.label }}</span>
                  <span class="contact-info__value">{{ info.value }}</span>
                </div>
              </div>
            </div>
            
            <div class="contact-info__map">
              <div class="contact-info__map-placeholder">
                🗺️ 地图加载中...
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:map';

.contact-hero {
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

.contact-main {
  &__grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: spacing('8');
    
    @include respond-below('lg') {
      grid-template-columns: 1fr;
    }
  }
}

.contact-form {
  &__title {
    font-size: font-size('2xl');
    margin-bottom: spacing('6');
  }
  
  &__row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: spacing('4');
    
    @include mobile-only {
      grid-template-columns: 1fr;
    }
  }
  
  &__success {
    text-align: center;
    padding: spacing('8');
  }
  
  &__success-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    font-size: 2.5rem;
    color: #{color('dark')};
    background: linear-gradient(135deg, color('primary'), color('accent'));
    border-radius: 50%;
    margin-bottom: spacing('6');
  }
  
  &__success h2 {
    margin-bottom: spacing('3');
  }
  
  &__success p {
    color: var(--color-text-secondary);
    margin-bottom: spacing('6');
  }
}

.form-group {
  margin-bottom: spacing('4');
  
  label {
    display: block;
    font-size: font-size('sm');
    font-weight: map.get($font-weights, 'medium');
    color: var(--color-text-primary);
    margin-bottom: spacing('2');
  }
  
  input,
  select,
  textarea {
    width: 100%;
    padding: spacing('3') spacing('4');
    font-size: font-size('base');
    color: var(--color-text-primary);
    background: var(--color-bg-muted);
    border: 1px solid var(--color-border);
    border-radius: map.get($radius, 'lg');
    @include transition(all);
    
    &::placeholder {
      color: var(--color-text-muted);
    }
    
    &:hover {
      border-color: rgba(255, 255, 255, 0.2);
    }
    
    &:focus {
      border-color: var(--color-primary);
      box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
    }
  }
  
  select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
  }
  
  textarea {
    resize: vertical;
    min-height: 120px;
  }
}

.contact-info {
  &__title {
    font-size: font-size('2xl');
    margin-bottom: spacing('6');
  }
  
  &__list {
    @include flex(column, flex-start, stretch);
    gap: spacing('4');
    margin-bottom: spacing('8');
  }
  
  &__item {
    @include flex(row, flex-start, flex-start);
    gap: spacing('4');
  }
  
  &__icon {
    @include flex-center;
    width: 48px;
    height: 48px;
    font-size: 1.25rem;
    background: rgba(0, 212, 255, 0.1);
    border-radius: map.get($radius, 'lg');
    flex-shrink: 0;
  }
  
  &__label {
    display: block;
    font-size: font-size('sm');
    color: var(--color-text-muted);
    margin-bottom: spacing('1');
  }
  
  &__value {
    display: block;
    font-weight: map.get($font-weights, 'medium');
    color: var(--color-text-primary);
  }
  
  &__map {
    border-radius: map.get($radius, 'xl');
    overflow: hidden;
    background: var(--color-bg-muted);
  }
  
  &__map-placeholder {
    @include flex-center;
    height: 200px;
    font-size: 1.5rem;
    color: var(--color-text-muted);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 300ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

