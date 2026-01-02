// 响应式设备检测 composable
export const useResponsive = () => {
  const isMobile = ref(false);
  const isTablet = ref(false);
  const isDesktop = ref(true);
  const screenWidth = ref(0);

  const breakpoints = {
    mobile: 768,
    tablet: 992,
    desktop: 1200
  };

  const updateDevice = () => {
    if (!import.meta.client) return;

    screenWidth.value = window.innerWidth;
    isMobile.value = window.innerWidth < breakpoints.mobile;
    isTablet.value =
      window.innerWidth >= breakpoints.mobile &&
      window.innerWidth < breakpoints.tablet;
    isDesktop.value = window.innerWidth >= breakpoints.tablet;
  };

  onMounted(() => {
    updateDevice();
    window.addEventListener('resize', updateDevice, { passive: true });
  });

  onUnmounted(() => {
    if (import.meta.client) {
      window.removeEventListener('resize', updateDevice);
    }
  });

  return {
    isMobile: readonly(isMobile),
    isTablet: readonly(isTablet),
    isDesktop: readonly(isDesktop),
    screenWidth: readonly(screenWidth),
    breakpoints
  };
};

// 滚动方向检测
export const useScrollDirection = () => {
  const scrollY = ref(0);
  const scrollDirection = ref<'up' | 'down'>('up');
  const isScrolled = ref(false);

  let lastScrollY = 0;

  const handleScroll = () => {
    if (!import.meta.client) return;

    scrollY.value = window.scrollY;
    isScrolled.value = scrollY.value > 50;

    if (scrollY.value > lastScrollY) {
      scrollDirection.value = 'down';
    } else {
      scrollDirection.value = 'up';
    }

    lastScrollY = scrollY.value;
  };

  onMounted(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
  });

  onUnmounted(() => {
    if (import.meta.client) {
      window.removeEventListener('scroll', handleScroll);
    }
  });

  return {
    scrollY: readonly(scrollY),
    scrollDirection: readonly(scrollDirection),
    isScrolled: readonly(isScrolled)
  };
};
