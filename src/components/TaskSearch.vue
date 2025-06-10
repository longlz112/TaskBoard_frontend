<!-- components/TaskSearch.vue -->
<template>
  <div class="task-search">
    <!-- 搜索头部 -->
    <div class="search-header">
      <div class="search-info">
        <h2>任务搜索</h2>
        <p v-if="searchQuery" class="search-query">
          搜索关键词: "{{ searchQuery }}"
        </p>
      </div>

      <!-- 搜索框 -->
      <div class="search-box">
        <input
            v-model="inputQuery"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="请输入搜索关键词..."
            class="search-input"
        />
        <button @click="handleSearch" class="search-btn">
          搜索
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>正在搜索...</p>
    </div>

    <!-- 搜索结果 -->
    <div v-else-if="searchResults.length > 0" class="search-results">
      <!-- 结果统计 -->
      <div class="results-info">
        <p>
          找到 {{ pagination.totalElements }} 个结果，
          第 {{ pagination.number + 1 }} 页，共 {{ pagination.totalPages }} 页
        </p>
      </div>

      <!-- 任务列表 -->
      <div class="task-list">
        <div
            v-for="task in searchResults"
            :key="task.id"
            class="task-item"
            @click="viewTaskDetail(task)"
        >
          <div class="task-header">
            <h3 class="task-title">{{ task.title }}</h3>
            <span :class="['status-badge', getStatusClass(task.status)]">
              {{ getStatusText(task.status) }}
            </span>
          </div>

          <p class="task-description">{{ truncateDescription(task.description) }}</p>

          <div class="task-meta">
            <span class="task-owner">发布者: {{ task.ownerUsername }}</span>
            <span class="task-date">发布时间: {{ task.publishDate }}</span>
            <span class="task-id">ID: {{ task.taskId }}</span>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <button
            @click="goToPage(pagination.number - 1)"
            :disabled="pagination.number === 0"
            class="page-btn"
        >
          上一页
        </button>

        <div class="page-numbers">
          <button
              v-for="page in getPageNumbers()"
              :key="page"
              @click="goToPage(page - 1)"
              :class="['page-number', { active: page - 1 === pagination.number }]"
          >
            {{ page }}
          </button>
        </div>

        <button
            @click="goToPage(pagination.number + 1)"
            :disabled="pagination.number >= pagination.totalPages - 1"
            class="page-btn"
        >
          下一页
        </button>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!loading && hasSearched" class="empty-state">
      <div class="empty-icon">🔍</div>
      <h3>未找到相关任务</h3>
      <p>尝试使用其他关键词搜索</p>
    </div>

    <!-- 初始状态 -->
    <div v-else class="initial-state">
      <div class="search-icon">🔍</div>
      <h3>开始搜索任务</h3>
      <p>在上方输入关键词来搜索任务</p>
    </div>
  </div>
</template>

<script>
import TaskService from '@/services/TaskService'

export default {
  name: 'TaskSearch',
  data() {
    return {
      searchQuery: '',
      inputQuery: '',
      searchResults: [],
      pagination: {
        size: 10,
        number: 0,
        totalElements: 0,
        totalPages: 0
      },
      loading: false,
      hasSearched: false
    }
  },

  created() {
    this.initializeFromRoute()
  },

  watch: {
    '$route'() {
      this.initializeFromRoute()
    }
  },

  methods: {
    // 从路由参数初始化搜索
    initializeFromRoute() {
      const { query, page = '0', size = '10' } = this.$route.query

      if (query) {
        this.searchQuery = query
        this.inputQuery = query
        this.pagination.size = parseInt(size)
        this.performSearch(query, parseInt(page), parseInt(size))
      }
    },

    // 执行搜索
    async performSearch(query, page = 0, size = 10) {
      if (!query.trim()) return

      this.loading = true
      this.hasSearched = true

      try {
        const response = await TaskService.searchTasks(query, page, size)
        const data = response.data

        this.searchResults = data.content || []
        this.pagination = data.page || {
          size: size,
          number: page,
          totalElements: 0,
          totalPages: 0
        }

        // 更新URL但不触发路由变化
        this.updateUrl(query, page, size)

      } catch (error) {
        console.error('搜索失败:', error)
        this.$message?.error?.('搜索失败，请稍后重试')
        this.searchResults = []
      } finally {
        this.loading = false
      }
    },

    // 处理搜索按钮点击
    handleSearch() {
      if (!this.inputQuery.trim()) return

      this.searchQuery = this.inputQuery.trim()
      this.performSearch(this.searchQuery, 0, this.pagination.size)
    },

    // 分页跳转
    goToPage(page) {
      if (page < 0 || page >= this.pagination.totalPages) return
      this.performSearch(this.searchQuery, page, this.pagination.size)
    },

    // 获取分页数字
    getPageNumbers() {
      const current = this.pagination.number + 1
      const total = this.pagination.totalPages
      const numbers = []

      // 显示当前页前后2页
      const start = Math.max(1, current - 2)
      const end = Math.min(total, current + 2)

      for (let i = start; i <= end; i++) {
        numbers.push(i)
      }

      return numbers
    },



    // 查看任务详情
    viewTaskDetail(task) {
      this.$router.push(`/tasks/${task.taskId}`)
    },

    // 限制描述长度
    truncateDescription(description) {
      if (!description) return '';
      return description.length > 20
          ? description.substring(0, 20) + '...'
          : description;
    },

    // 获取状态样式类
    getStatusClass(status) {
      const statusMap = {
        'COMPLETED': 'status-completed',
        'PENDING': 'status-pending',
        'CANCELLED': 'status-cancelled'
      }
      return statusMap[status] || 'status-default'
    },

    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        'COMPLETED': '已完成',
        'PENDING': '待处理',
        'CANCELLED': '已取消'
      }
      return statusMap[status] || status
    },

    // 更新URL
    updateUrl(query, page, size) {
      const newQuery = { query, page: page.toString(), size: size.toString() }

      // 避免重复导航
      if (JSON.stringify(this.$route.query) !== JSON.stringify(newQuery)) {
        this.$router.replace({
          path: this.$route.path,
          query: newQuery
        }).catch(() => {})
      }
    }
  }
}
</script>

<style scoped>
.task-search {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* 搜索头部 */
.search-header {
  margin-bottom: 30px;
}

.search-info h2 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 28px;
}

.search-query {
  color: #666;
  font-size: 16px;
  margin: 0 0 20px 0;
}

.search-box {
  display: flex;
  gap: 10px;
  max-width: 600px;
}

.search-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.search-btn {
  padding: 12px 24px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-btn:hover {
  background: #0056b3;
}

/* 加载状态 */
.loading {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 搜索结果 */
.results-info {
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.task-list {
  display: grid;
  gap: 20px;
  margin-bottom: 30px;
}

.task-item {
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.task-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border-color: #007bff;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.task-title {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.status-completed {
  background-color: #fff8e1;
  color: #ffa000;
}



.status-pending {
  background-color: #e8f5e9;
  color: #388e3c;
}

.status-cancelled {
  background-color: #fafafa;
  color: #757575;
}

.task-description {
  color: #666;
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.task-meta {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #888;
  flex-wrap: wrap;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid #dee2e6;
  background: white;
  color: #333;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-number {
  padding: 8px 12px;
  border: 1px solid #dee2e6;
  background: white;
  color: #333;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 40px;
}

.page-number:hover {
  background: #f8f9fa;
}

.page-number.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

/* 空状态和初始状态 */
.empty-state,
.initial-state {
  text-align: center;
  padding: 80px 20px;
  color: #666;
}

.empty-icon,
.search-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.empty-state h3,
.initial-state h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.empty-state p,
.initial-state p {
  margin: 0;
  color: #888;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .task-search {
    padding: 15px;
  }

  .search-box {
    flex-direction: column;
  }

  .task-header {
    flex-direction: column;
    gap: 10px;
  }

  .task-meta {
    flex-direction: column;
    gap: 8px;
  }

  .pagination {
    flex-wrap: wrap;
    gap: 8px;
  }

  .page-numbers {
    order: -1;
    width: 100%;
    justify-content: center;
  }
}
</style>
