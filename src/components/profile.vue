<!-- src/components/Profile.vue -->
<template>
  <div class="profile">
    <h2>用户资料</h2>
    <div v-if="user">
      <p><strong>用户名:</strong> {{ user.username }}</p>
      <p><strong>邮箱:</strong> {{ user.email }}</p>
    </div>

    <!-- 创建任务区域 -->
    <div v-if="user.roles.includes('ROLE_MODERATOR') || user.roles.includes('ROLE_ADMIN')" class="create-task-section">
      <h3>创建新任务</h3>
      <div class="create-task-form">
        <div class="form-group">
          <label for="taskTitle">任务标题:</label>
          <input
              id="taskTitle"
              v-model="newTask.title"
              type="text"
              placeholder="请输入任务标题"
              class="form-input"
              :disabled="creating"
          />
        </div>
        <div class="form-group">
          <label for="taskDescription">任务描述:</label>
          <textarea
              id="taskDescription"
              v-model="newTask.description"
              placeholder="请输入任务描述"
              class="form-textarea"
              rows="4"
              :disabled="creating"
          ></textarea>
        </div>
        <div class="form-actions">
          <button
              @click="createTask"
              :disabled="!canCreateTask || creating"
              class="create-button"
          >
            {{ creating ? '创建中...' : '创建任务' }}
          </button>
          <button
              @click="clearForm"
              :disabled="creating"
              class="clear-button"
          >
            清空
          </button>
        </div>
        <div v-if="createMessage" :class="['message', createMessage.type]">
          {{ createMessage.text }}
        </div>
      </div>
    </div>

    <!-- 任务展示区域 -->
    <div class="user-tasks">
      <h3>我的任务记录</h3>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="responseinfo.totalElements === 0" class="no-tasks">
        您还没有接取任何任务
      </div>
      <div v-else class="task-list">
        <div v-for="task in tasks" :key="task.id" class="task-card">
          <h4>{{ task.task.title }}</h4>
          <p><div class="task-actions">
            <button
                @click="viewTaskDetails(task.task.id)"
                class="view-details-button"
            >
              查看详情
            </button>
          </div></p>
          <div class="task-meta">
            <span>状态: {{ task.task.status }}</span>
            <span>接取时间: {{ formatDate(task.acceptedAt) }}</span>
            <span v-if="task.completedAt">完成时间: {{ formatDate(task.completedAt) }}</span>
          </div>
        </div>
      </div>

      <!-- 分页控件 -->
      <div class="pagination" v-if="responseinfo.totalElements > 0">
        <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 0">
          上一页
        </button>
        <span>第 {{ currentPage + 1 }} 页 / 共 {{ totalPages }} 页</span>
        <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage >= totalPages - 1">
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import TaskService from '../services/TaskService';
import { format } from 'date-fns';

export default {
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user')) || {},
      editMode: false,
      errorMessage: '',
      responseinfo:[],
      tasks: [],
      loading: false,
      currentPage: 0,
      pageSize: 5,
      totalPages: 0,
      totalElements: 0,
      // 创建任务相关数据
      newTask: {
        title: '',
        description: ''
      },
      creating: false,
      createMessage: null
    };
  },
  computed: {
    canCreateTask() {
      return this.newTask.title.trim() && this.newTask.description.trim();
    }
  },
  mounted() {
    this.fetchUserTasks();
  },
  methods: {
    // 创建任务
    async createTask() {
      if (!this.canCreateTask) {
        this.showMessage('请填写完整的任务信息', 'error');
        return;
      }

      this.creating = true;
      this.createMessage = null;

      try {
        const taskData = {
          title: this.newTask.title.trim(),
          description: this.newTask.description.trim()
        };

        const response = await TaskService.createTask(taskData);

        if (response.data) {
          this.showMessage('任务创建成功！', 'success');
          this.clearForm();
          // 可以选择刷新任务列表或者跳转到任务详情页
          // this.fetchUserTasks(); // 如果创建的任务会出现在用户任务列表中

          // 或者跳转到新创建的任务详情页
          setTimeout(() => {
            this.$router.push(`/tasks/${response.data.id}`);
          }, 1500);
        }
      } catch (error) {
        console.error('创建任务失败:', error);
        const errorMsg = error.response?.data?.message || error.message || '创建任务失败';
        this.showMessage(`创建失败: ${errorMsg}`, 'error');
      } finally {
        this.creating = false;
      }
    },

    // 清空表单
    clearForm() {
      this.newTask = {
        title: '',
        description: ''
      };
      this.createMessage = null;
    },

    // 显示消息
    showMessage(text, type = 'info') {
      this.createMessage = { text, type };
      // 3秒后自动清除消息
      setTimeout(() => {
        this.createMessage = null;
      }, 3000);
    },

    async fetchUserTasks(page = this.currentPage, size = this.pageSize) {
      this.loading = true;
      try {
        const response = await TaskService.getMyTaskAcceptances(page, size);
        this.responseinfo = response.data;
        this.tasks = response.data.content;
        this.totalPages = response.data.totalPages;
        this.totalElements = response.data.totalElements;
        this.currentPage = response.data.page;
      } catch (error) {
        console.error('获取任务失败:', error);
        this.errorMessage = '获取任务失败: ' + (error.response?.data?.message || error.message);
      } finally {
        this.loading = false;
      }
    },

    viewTaskDetails(taskId) {
      this.$router.push(`/tasks/${taskId}`);
    },

    changePage(newPage) {
      if (newPage >= 0 && newPage < this.totalPages) {
        this.currentPage = newPage;
        this.fetchUserTasks(newPage);
      }
    },

    formatDate(dateString) {
      return format(new Date(dateString), 'yyyy-MM-dd HH:mm');
    }
  }
};
</script>

<style scoped>
/* 基础样式 */
.profile {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

/* 创建任务区域样式 */
.create-task-section {
  margin-top: 30px;
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
}

.create-task-section h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
}

.create-task-form {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-input:disabled, .form-textarea:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.create-button, .clear-button {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.create-button {
  background-color: #28a745;
  color: white;
}

.create-button:hover:not(:disabled) {
  background-color: #218838;
}

.create-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.clear-button {
  background-color: #6c757d;
  color: white;
}

.clear-button:hover:not(:disabled) {
  background-color: #5a6268;
}

.clear-button:disabled {
  background-color: #adb5bd;
  cursor: not-allowed;
}

/* 消息样式 */
.message {
  margin-top: 15px;
  padding: 12px;
  border-radius: 4px;
  font-size: 14px;
}

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.message.info {
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

/* 任务区域样式 */
.user-tasks {
  margin-top: 30px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.task-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 15px;
}

.task-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.task-card h4 {
  margin-top: 0;
  color: #333;
}

.task-meta {
  margin-top: 10px;
  font-size: 0.9em;
  color: #666;
  display: flex;
  flex-direction: column;
}

.task-actions {
  display: flex;
  justify-content: flex-start;
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
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

.pagination button {
  padding: 5px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.loading, .no-tasks {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>
