<!-- src/components/navbar.vue -->
<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Logo -->
      <div class="navbar-brand">
        <router-link to="/" class="brand-link" @click="closeMobileMenu">
          <span class="brand-text">任务管理系统</span>
        </router-link>
      </div>

      <!-- 移动端菜单按钮 -->
      <button
          class="mobile-menu-btn"
          @click="toggleMobileMenu"
          :class="{ active: isMobileMenuOpen }"
          aria-label="Toggle menu"
          aria-expanded="false"
      >
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>

      <!-- 桌面端导航菜单 -->
      <div class="navbar-menu desktop-menu">
        <div class="navbar-nav">
          <!-- 未登录状态的导航 -->
          <template v-if="!isLogin">
            <router-link to="/" class="nav-link">首页</router-link>
            <router-link to="/login" class="nav-link login-btn">登录</router-link>
            <router-link to="/signup" class="nav-link signup-btn">注册</router-link>
          </template>

          <!-- 已登录状态的导航 -->
          <template v-else>
            <router-link to="/tasks" class="nav-link">任务列表</router-link>
            <router-link to="/search" class="nav-link">搜索</router-link>

            <!-- 用户菜单下拉 -->
            <div class="user-menu" ref="userMenu">
              <button
                  class="user-menu-btn"
                  @click="toggleUserMenu"
                  :class="{ active: isUserMenuOpen }"
                  aria-expanded="false"
              >
                <span class="user-avatar">{{ userInitial }}</span>
                <span class="user-name">{{ userName }}</span>
                <svg class="dropdown-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>

              <div class="user-dropdown" :class="{ active: isUserMenuOpen }">
                <router-link to="/profile" class="dropdown-item" @click="closeUserMenu">
                  <svg class="dropdown-icon-left" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                  个人资料
                </router-link>
                <hr class="dropdown-divider">
                <button class="dropdown-item logout-btn" @click="handleLogout">
                  <svg class="dropdown-icon-left" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
                  </svg>
                  退出登录
                </button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 移动端覆盖层 -->
    <div
        class="mobile-overlay"
        :class="{ active: isMobileMenuOpen }"
        @click="closeMobileMenu"
    ></div>

    <!-- 移动端滑出菜单 -->
    <div class="mobile-menu" :class="{ active: isMobileMenuOpen }">
      <div class="mobile-menu-content">
        <!-- 移动端用户信息 -->
        <div v-if="isLogin" class="mobile-user-info">
          <div class="mobile-user-avatar">{{ userInitial }}</div>
          <div class="mobile-user-details">
            <div class="mobile-user-name">{{ userName }}</div>
            <div class="mobile-user-email">{{ user?.email || '' }}</div>
          </div>
        </div>

        <!-- 移动端导航链接 -->
        <div class="mobile-nav-section">
          <template v-if="!isLogin">
            <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">
              <svg class="mobile-nav-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              首页
            </router-link>
            <router-link to="/login" class="mobile-nav-link" @click="closeMobileMenu">
              <svg class="mobile-nav-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              登录
            </router-link>
            <router-link to="/signup" class="mobile-nav-link signup" @click="closeMobileMenu">
              <svg class="mobile-nav-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
              注册
            </router-link>
          </template>

          <template v-else>
            <router-link to="/tasks" class="mobile-nav-link" @click="closeMobileMenu">
              <svg class="mobile-nav-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
              </svg>
              任务列表
            </router-link>
            <router-link to="/search" class="mobile-nav-link" @click="closeMobileMenu">
              <svg class="mobile-nav-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
              </svg>
              搜索
            </router-link>
            <router-link to="/profile" class="mobile-nav-link" @click="closeMobileMenu">
              <svg class="mobile-nav-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
              </svg>
              个人资料
            </router-link>
          </template>
        </div>

        <!-- 移动端退出按钮 -->
        <div v-if="isLogin" class="mobile-logout-section">
          <button class="mobile-logout-btn" @click="handleLogout">
            <svg class="mobile-nav-icon" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
            </svg>
            退出登录
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import AuthService from '../services/AuthService';

export default {
  name: 'Navbar',
  data() {
    return {
      isMobileMenuOpen: false,
      isUserMenuOpen: false,
      user: null
    };
  },
  computed: {
    isLogin() {
      return this.user !== null;
    },
    userName() {
      return this.user?.name || this.user?.email?.split('@')[0] || '用户';
    },
    userInitial() {
      return this.userName.charAt(0).toUpperCase();
    }
  },
  mounted() {
    this.loadUserData();
    // 点击外部关闭下拉菜单
    document.addEventListener('click', this.handleClickOutside);
    // 监听窗口大小变化，关闭移动菜单
    window.addEventListener('resize', this.handleResize);
    // 阻止移动端菜单滚动穿透
    document.addEventListener('touchmove', this.preventScrollThrough, { passive: false });
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('touchmove', this.preventScrollThrough);
  },
  watch: {
    // 监听路由变化，关闭菜单
    '$route'() {
      this.closeMobileMenu();
      this.closeUserMenu();
    },
    // 监听移动菜单状态，控制页面滚动
    isMobileMenuOpen(isOpen) {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  },
  methods: {
    loadUserData() {
      try {
        const userData = localStorage.getItem('user');
        this.user = userData ? JSON.parse(userData) : null;
      } catch (error) {
        console.error('解析用户数据失败:', error);
        this.user = null;
        localStorage.removeItem('user');
      }
    },

    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
      // 更新 aria-expanded 属性
      const btn = this.$el.querySelector('.mobile-menu-btn');
      if (btn) {
        btn.setAttribute('aria-expanded', this.isMobileMenuOpen.toString());
      }
    },

    closeMobileMenu() {
      this.isMobileMenuOpen = false;
      const btn = this.$el.querySelector('.mobile-menu-btn');
      if (btn) {
        btn.setAttribute('aria-expanded', 'false');
      }
    },

    toggleUserMenu() {
      this.isUserMenuOpen = !this.isUserMenuOpen;
      const btn = this.$el.querySelector('.user-menu-btn');
      if (btn) {
        btn.setAttribute('aria-expanded', this.isUserMenuOpen.toString());
      }
    },

    closeUserMenu() {
      this.isUserMenuOpen = false;
      const btn = this.$el.querySelector('.user-menu-btn');
      if (btn) {
        btn.setAttribute('aria-expanded', 'false');
      }
    },

    handleClickOutside(event) {
      // 关闭用户菜单
      if (this.$refs.userMenu && !this.$refs.userMenu.contains(event.target)) {
        this.closeUserMenu();
      }

      // 如果点击的不是移动菜单按钮和移动菜单内容，则关闭移动菜单
      const mobileMenuBtn = this.$el.querySelector('.mobile-menu-btn');
      const mobileMenu = this.$el.querySelector('.mobile-menu');
      if (this.isMobileMenuOpen &&
          !mobileMenuBtn.contains(event.target) &&
          !mobileMenu.contains(event.target)) {
        this.closeMobileMenu();
      }
    },

    handleResize() {
      if (window.innerWidth > 768) {
        this.closeMobileMenu();
      }
    },

    preventScrollThrough(event) {
      if (this.isMobileMenuOpen) {
        event.preventDefault();
      }
    },

    async handleLogout() {
      try {
        await AuthService.logout();
        this.user = null;
        this.closeUserMenu();
        this.closeMobileMenu();

        // 如果当前在需要登录的页面，则重定向到首页
        const protectedRoutes = ['/tasks', '/search', '/profile'];
        if (protectedRoutes.includes(this.$route.path)) {
          await this.$router.push('/');
        }

        // 显示退出成功提示
        this.$toast?.success?.('已成功退出登录');
      } catch (error) {
        console.error('退出登录失败:', error);
        this.$toast?.error?.('退出登录失败，请重试');
      }
    }
  }
};
</script>

<style scoped>
.navbar {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
}

/* 品牌样式 */
.navbar-brand {
  flex-shrink: 0;
}

.brand-link {
  text-decoration: none;
  color: #1f2937;
  font-weight: 700;
  font-size: 1.5rem;
  transition: color 0.2s;
}

.brand-link:hover {
  color: #3b82f6;
}

.brand-text {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 移动端菜单按钮 */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 2.5rem;
  height: 2.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1001;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.mobile-menu-btn:hover {
  background-color: #f3f4f6;
}

.hamburger-line {
  width: 100%;
  height: 2px;
  background: #374151;
  border-radius: 1px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-origin: center;
}

.mobile-menu-btn.active .hamburger-line:first-child {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-btn.active .hamburger-line:nth-child(2) {
  opacity: 0;
  transform: scale(0);
}

.mobile-menu-btn.active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* 桌面端导航菜单 */
.desktop-menu {
  display: flex;
  align-items: center;
}

.navbar-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #4b5563;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.2s;
  white-space: nowrap;
}

.nav-link:hover {
  color: #3b82f6;
  background-color: #f3f4f6;
}

.nav-link.router-link-active {
  color: #3b82f6;
  background-color: #eff6ff;
}

/* 登录/注册按钮样式 */
.login-btn {
  color: #3b82f6;
  border: 1px solid #3b82f6;
}

.login-btn:hover {
  background-color: #3b82f6;
  color: white;
}

.signup-btn {
  background-color: #3b82f6;
  color: white;
}

.signup-btn:hover {
  background-color: #2563eb;
}

/* 用户菜单 */
.user-menu {
  position: relative;
}

.user-menu-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.user-menu-btn:hover,
.user-menu-btn.active {
  background-color: #f3f4f6;
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-name {
  color: #374151;
  font-weight: 500;
  max-width: 8rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #6b7280;
  transition: transform 0.2s;
}

.user-menu-btn.active .dropdown-icon {
  transform: rotate(180deg);
}

/* 用户下拉菜单 */
.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 12rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-0.5rem);
  transition: all 0.2s;
  z-index: 50;
}

.user-dropdown.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #374151;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f9fafb;
}

.dropdown-icon-left {
  width: 1rem;
  height: 1rem;
  color: #6b7280;
}

.dropdown-divider {
  margin: 0.5rem 0;
  border: none;
  border-top: 1px solid #e5e7eb;
}

.logout-btn {
  color: #dc2626;
}

.logout-btn:hover {
  background-color: #fef2f2;
}

/* 移动端覆盖层 */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
}

.mobile-overlay.active {
  opacity: 1;
  visibility: visible;
}

/* 移动端滑出菜单 */
.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background: white;
  z-index: 1000;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow-y: auto;
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.1);
}

.mobile-menu.active {
  transform: translateX(0);
}

.mobile-menu-content {
  padding: 1rem;
  padding-top: 5rem; /* 避免与固定头部重叠 */
}

/* 移动端用户信息 */
.mobile-user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
}

.mobile-user-avatar {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
}

.mobile-user-details {
  flex: 1;
}

.mobile-user-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 1.125rem;
}

.mobile-user-email {
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* 移动端导航链接 */
.mobile-nav-section {
  margin-bottom: 2rem;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  color: #374151;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.2s;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.mobile-nav-link:hover {
  background-color: #f9fafb;
  color: #3b82f6;
}

.mobile-nav-link.router-link-active {
  background-color: #eff6ff;
  color: #3b82f6;
}

.mobile-nav-link.signup {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
}

.mobile-nav-link.signup:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.mobile-nav-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: currentColor;
}

/* 移动端退出按钮 */
.mobile-logout-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}

.mobile-logout-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem;
  background: transparent;
  border: none;
  color: #dc2626;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
  cursor: pointer;
  font-weight: 500;
}

.mobile-logout-btn:hover {
  background-color: #fef2f2;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
  }

  .desktop-menu {
    display: none;
  }
}

@media (max-width: 320px) {
  .mobile-menu {
    width: 100vw;
  }
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .navbar {
    background: #1f2937;
    border-bottom-color: #374151;
  }

  .brand-link {
    color: #f9fafb;
  }

  .mobile-menu-btn:hover {
    background-color: #374151;
  }

  .hamburger-line {
    background: #d1d5db;
  }

  .nav-link {
    color: #d1d5db;
  }

  .nav-link:hover {
    color: #60a5fa;
    background-color: #374151;
  }

  .nav-link.router-link-active {
    color: #60a5fa;
    background-color: #1e40af;
  }

  .user-menu-btn:hover,
  .user-menu-btn.active {
    background-color: #374151;
  }

  .user-name {
    color: #d1d5db;
  }

  .user-dropdown {
    background: #1f2937;
    border-color: #374151;
  }

  .dropdown-item {
    color: #d1d5db;
  }

  .dropdown-item:hover {
    background-color: #374151;
  }

  .dropdown-divider {
    border-top-color: #374151;
  }

  .mobile-menu {
    background: #1f2937;
  }

  .mobile-user-info {
    background: linear-gradient(135deg, #374151, #4b5563);
  }

  .mobile-user-name {
    color: #f9fafb;
  }

  .mobile-nav-link {
    color: #d1d5db;
  }

  .mobile-nav-link:hover {
    background-color: #374151;
    color: #60a5fa;
  }

  .mobile-nav-link.router-link-active {
    background-color: #1e40af;
    color: #60a5fa;
  }

  .mobile-logout-section {
    border-top-color: #374151;
  }

  .mobile-logout-btn:hover {
    background-color: #450a0a;
  }
}

/* 动画优化 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
