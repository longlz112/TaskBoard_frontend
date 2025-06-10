<!-- components/tasks.vue -->
<template>
  <div class="tasks-container">
    <h1>任务列表</h1>
    <div class="task-search">
        <!-- 搜索框 -->
        <div class="search-box">
          <input
              v-model="inputQuery"
              @keyup.enter="searchTasks"
              type="text"
              placeholder="请输入搜索关键词..."
              class="search-input"
          />
          <button @click="searchTasks" class="search-btn">
            搜索
          </button>
        </div>
      </div>


    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>加载任务中...</p>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="fetchTasks(currentPage)" class="retry-button">重试</button>
    </div>

    <!-- 任务列表 -->
    <div v-if="!loading && !error" class="tasks-list">
      <div v-if="tasks.length === 0" class="no-tasks">
        <p>没有找到任务</p>
      </div>

      <div v-for="task in tasks" :key="task.id" class="task-card">
        <div class="task-header">
          <h2>{{ task.title }}</h2>
          <div class="task-status" :class="getStatusClass(task.status)">
            {{ getStatusText(task.status) }}
          </div>
        </div>

        <div class="task-info">
          <div class="info-item">
            <span class="label">发布时间:</span>
            <span>{{ formatDate(task.publishDate) }}</span>
          </div>
          <div class="info-item">
            <span class="label">发布者:</span>
            <span>{{ task.owner?.username || '未知用户' }}</span>
          </div>
        </div>

        <div class="task-description">
          {{ truncateDescription(task.description) }}
        </div>

        <div class="task-actions">
          <button
              @click="viewTaskDetails(task.id)"
              class="view-details-button"
          >
            查看详情
          </button>
        </div>
      </div>
    </div>

    <!-- 分页控件 -->
    <div v-if="!loading && totalPages > 1" class="pagination">
      <button
          @click="fetchTasks(1)"
          :disabled="currentPage === 1"
          class="pagination-button"
      >
        &laquo;
      </button>

      <button
          @click="fetchTasks(currentPage - 1)"
          :disabled="currentPage === 1"
          class="pagination-button"
      >
        &lsaquo;
      </button>

      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>

      <button
          @click="fetchTasks(currentPage + 1)"
          :disabled="currentPage === totalPages || isLastPage"
          class="pagination-button"
      >
        &rsaquo;
      </button>

      <button
          @click="fetchTasks(totalPages)"
          :disabled="currentPage === totalPages || isLastPage"
          class="pagination-button"
      >
        &raquo;
      </button>
    </div>
  </div>
</template>

<script>
import TaskService from '@/services/TaskService';

export default {
  name: 'TasksList',
  data() {
    return {
      tasks: [],
      loading: false,
      error: null,
      inputQuery: '',
      currentPage: 1,
      pageSize: 24,
      totalItems: 0,
      totalPages: 0,
      isLastPage: false,
      searchQuery: '',
      statusFilter: '',
      searchTimeout: null
    };
  },
  created() {
    this.fetchTasks(1);
  },
  methods: {
    async fetchTasks(page) {
      this.loading = true;
      this.error = null;

      try {
        this.currentPage = page;

        const params = {
          page: this.currentPage - 1, // 后端页码从0开始
          size: this.pageSize,
        };

        // 移除空参数
        Object.keys(params).forEach(key => {
          if (!params[key] && params[key] !== 0) delete params[key];
        });

        const response = await TaskService.getTasksPaged(params.page, params.size);

        // 解析响应数据
        this.tasks = response.data.content || [];
        this.totalItems = response.data.totalElements || 0;
        this.totalPages = response.data.totalPages || 1;
        this.isLastPage = response.data.last || false;
        this.pageSize = response.data.size || 24;

        // 如果当前页大于总页数，且总页数大于0，则跳转到第一页
        if (this.currentPage > this.totalPages && this.totalPages > 0) {
          this.fetchTasks(1);
        }
      } catch (err) {
        console.error('获取任务列表失败:', err);
        this.error = err.response?.data?.message || '获取任务列表失败，请稍后再试';
      } finally {
        this.loading = false;
      }
    },

    viewTaskDetails(taskId) {
      this.$router.push(`/tasks/${taskId}`);
    },

    formatDate(dateString) {
      if (!dateString) return '未设置';

      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    getStatusText(status) {
      const statusMap = {
        'PENDING': '开放中',
        'COMPLETED': '已完成',
        'CANCELLED': '已取消'
      };
      return statusMap[status] || status;
    },

    getStatusClass(status) {
      const statusClassMap = {
        'PENDING': 'status-open',
        'COMPLETED': 'status-completed',
        'CANCELLED': 'status-cancelled'
      };
      return statusClassMap[status] || '';
    },

    truncateDescription(description) {
      if (!description) return '';
      return description.length > 20
          ? description.substring(0, 20) + '...'
          : description;
    },


    searchTasks() {
      // 跳转到搜索页面
      this.$router.push({
        path: '/search',
        query: {
          query: this.inputQuery,
          page: 0,
          size: 10
        }
      })

    }
  }
}
</script>

<style scoped>
.tasks-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.task-search {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 20px 20px 0px;
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


.search-box {
  display: flex;
  flex: 1;
}

.search-box input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
}


.filter-dropdown select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 40px 0;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background-color: #ffebee;
  color: #d32f2f;
  padding: 15px;
  border-radius: 4px;
  margin: 20px 0;
  text-align: center;
}

.retry-button {
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
}

.no-tasks {
  text-align: center;
  padding: 40px 0;
  color: #757575;
}

.tasks-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.task-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.task-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.task-header h2 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.task-status {
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.status-open {
  background-color: #e8f5e9;
  color: #388e3c;
}

.status-completed {
  background-color: #fff8e1;
  color: #ffa000;
}

.status-cancelled {
  background-color: #fafafa;
  color: #757575;
}

.task-info {
  margin-bottom: 15px;
  font-size: 14px;
}

.info-item {
  margin-bottom: 5px;
}

.label {
  color: #757575;
  margin-right: 5px;
}

.task-description {
  color: #555;
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 1.5;
}

.task-actions {
  display: flex;
  justify-content: flex-end;
}

.view-details-button {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.view-details-button:hover {
  background-color: #1976d2;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

.pagination-button {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  padding: 8px 12px;
  margin: 0 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.pagination-button:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.pagination-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.page-info {
  margin: 0 10px;
  font-size: 14px;
  color: #757575;
}
</style>

