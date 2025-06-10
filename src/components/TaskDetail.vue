<template>
  <div class="task-detail-container">
    <!-- 返回按钮 -->
    <button @click="goBack" class="back-button">
      <span>&larr;</span> 返回
    </button>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>正在加载任务详情...</p>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <button @click="fetchTaskDetail" class="retry-button">重试</button>
    </div>

    <!-- 任务详情 -->
    <div v-if="task && !loading" class="task-detail">
      <div class="task-header">
        <h1>{{ task.title }}</h1>
        <div class="task-status" :class="statusClass">
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

      <div class="description-section">
        <h2>任务描述</h2>
        <div class="description-content">
          {{ task.description }}
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons" v-if="task.status === 'PENDING'">
        <button @click="acceptTask(taskId)" class="action-button">接受任务</button>
        <button v-if="(currentUser.roles.includes('ROLE_MODERATOR') ||
                      currentUser.roles.includes('ROLE_ADMIN')) &&
                      currentUser.id === task.owner.id"
                @click="toggleUpdateForm()" class="action-button">更新任务</button>
        <button v-if="(currentUser.roles.includes('ROLE_MODERATOR') ||
                      currentUser.roles.includes('ROLE_ADMIN')) &&
                      currentUser.id === task.owner.id"
                @click="confirmCompletion(taskId)" class="action-button">确认任务完成</button>
      </div>
      <!-- 更新任务表单 -->
      <div v-if="updateSuccessMessage" class="success-message">{{ updateSuccessMessage }}</div>
      <div v-if="showUpdateForm" class="update-task-form">
        <h2>更新任务</h2>
        <form @submit.prevent="updateTask(taskId)">
          <div class="form-group">
            <label for="taskTitle">标题:</label>
            <input type="text" id="taskTitle" v-model="updatedTask.title" required />
          </div>
          <div class="form-group">
            <label for="taskDescription">描述:</label>
            <textarea id="taskDescription" v-model="updatedTask.description" required></textarea>
          </div>
          <div class="form-group">
            <label for="taskStatus">状态:</label>
            <select id="taskStatus" v-model="updatedTask.status" required>
              <option value="PENDING">开放中</option>
              <option value="COMPLETED">结束（无完成者）</option>
              <option value="CANCELLED">已取消</option>
            </select>
          </div>
          <button type="submit" class="submit-button">提交更新</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import TaskService from '@/services/TaskService';

export default {
  name: 'TaskDetail',
  data() {
    return {
      taskId: null,
      task: null,
      loading: false,
      error: null,
      showUpdateForm: false, // 控制更新表单的显示
      updatedTask: {
        title: '',
        description: '',
        status: ''
      },
      updateSuccessMessage: '' ,// 存储更新成功的提示信息
      currentUser: null
    };
  },
  created() {
    // 获取路由参数中的任务ID
    this.taskId = this.$route.params.id;

    // 获取当前登录用户
    const userJson = localStorage.getItem('user');
    if (userJson) {
      this.currentUser = JSON.parse(userJson);
    }

    // 获取任务详情
    this.fetchTaskDetail();
  },
  methods: {
    async fetchTaskDetail() {
      if (!this.taskId) {
        this.error = '任务ID不存在';
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await TaskService.getTaskById(this.taskId);
        this.task = response.data;
      } catch (err) {
        console.error('获取任务详情失败:', err);
        this.error = err.response?.data?.message || '获取任务详情失败，请稍后再试';
      } finally {
        this.loading = false;
      }
    },

    formatDate(dateString) {
      if (!dateString) return '未设置';

      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
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

    goBack() {
      this.$router.go(-1);
    },

    async acceptTask(id) {
      // 添加确认对话框
      if (!confirm('确定要接受这个任务吗？')) {
        return; // 用户取消操作
      }

      // 添加加载状态
      this.loading = true;

      try {
        await TaskService.acceptTask(id);

        // 成功时的处理
        await this.fetchTaskDetail(); // 刷新任务详情以获取最新状态

        // 显示成功消息
        this.updateSuccessMessage = '任务接受成功！';

        // 3秒后清除成功消息
        setTimeout(() => {
          this.updateSuccessMessage = '';
        }, 3000);

      } catch (error) {
        console.error('接受任务失败:', error);

        // 处理各种错误情况
        let errorMessage = '接受任务失败，请稍后再试';

        if (error.response) {
          const { status, data } = error.response;

          if (status === 400) {
            // 处理400错误，可能是任务状态不允许接受等
            errorMessage = data.message || '无法接受此任务，请检查任务状态';
          } else if (status === 404) {
            errorMessage = '任务不存在或已被删除';
          } else if (status === 403) {
            errorMessage = '没有权限接受此任务';
          } else if (status === 409) {
            errorMessage = '任务已被其他用户接受';
          } else if (status >= 500) {
            errorMessage = '服务器错误，请稍后再试';
          } else {
            // 其他HTTP错误
            errorMessage = data.message || `操作失败 (${status})`;
          }
        } else if (error.request) {
          // 网络错误
          errorMessage = '网络连接失败，请检查网络连接';
        }

        // 显示错误消息
        this.error = errorMessage;

        // 5秒后清除错误消息
        setTimeout(() => {
          this.error = null;
        }, 5000);

      } finally {
        this.loading = false;
      }
    },

    toggleUpdateForm() {
      this.showUpdateForm = !this.showUpdateForm;
      if (this.showUpdateForm) {
        // 初始化表单数据
        this.updatedTask.title = this.task.title;
        this.updatedTask.description = this.task.description;
        this.updatedTask.status = this.task.status;
      }
    },


    async updateTask(id) {
      const taskData = {
        title: this.updatedTask.title,
        description: this.updatedTask.description,
        status: this.updatedTask.status
      };
      try {
        const response = await TaskService.updateTask(id, taskData);
        // 更新成功后处理返回的数据
        if (response.status === 200) {
          this.task = response.data; // 更新当前任务数据
          this.updateSuccessMessage = '任务更新成功！'; // 设置成功提示信息
          this.showUpdateForm = false; // 隐藏表单
        }
      } catch (error) {
        console.error('更新任务失败:', error);
      }
    },

    async confirmCompletion(taskId) {
      const completerId = prompt("请输入完成者的ID:");
      if (!completerId) {
        return; // 用户取消输入
      }

      // 添加加载状态
      this.loading = true;

      try {
        await TaskService.confirmTaskCompletion(taskId, completerId);

        // 成功时的处理
        await this.fetchTaskDetail();
        this.showUpdateForm = false;

        // 显示成功消息
        this.updateSuccessMessage = '任务完成确认成功！';

        // 3秒后清除成功消息
        setTimeout(() => {
          this.updateSuccessMessage = '';
        }, 3000);

      } catch (error) {
        console.error('确认任务完成失败:', error);

        // 处理400错误和其他错误
        let errorMessage = '确认任务完成失败，请稍后再试';

        if (error.response) {
          const { status, data } = error.response;

          if (status === 400) {
            // 处理400错误，使用服务器返回的message
            errorMessage = data.message || '请求参数有误，请检查完成者ID是否正确';
          } else if (status === 404) {
            errorMessage = '任务或用户不存在';
          } else if (status === 403) {
            errorMessage = '没有权限执行此操作';
          } else if (status >= 500) {
            errorMessage = '服务器错误，请稍后再试';
          } else {
            // 其他HTTP错误
            errorMessage = data.message || `操作失败 (${status})`;
          }
        } else if (error.request) {
          // 网络错误
          errorMessage = '网络连接失败，请检查网络连接';
        }

        // 显示错误消息
        this.error = errorMessage;

        // 5秒后清除错误消息
        setTimeout(() => {
          this.error = null;
        }, 5000);

      } finally {
        this.loading = false;
      }
    }

  },
  computed: {
    statusClass() {
      if (!this.task) return '';

      const statusClassMap = {
        'PENDING': 'status-open',
        'COMPLETED': 'status-completed',
        'CANCELLED': 'status-cancelled'
      };

      return statusClassMap[this.task.status] || '';
    }
  }
}
</script>

<style scoped>
.task-detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.back-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #2196f3;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 20px;
}

.back-button span {
  margin-right: 5px;
  font-size: 20px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 40px 0;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid #3498db;
  width: 40px;
  height: 40px;
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

.task-detail {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 25px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

.task-header h1 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.task-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 14px;
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 14px;
  color: #757575;
  margin-bottom: 5px;
}

h2 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}
.action-buttons {
  margin-top: 20px;
}

.action-button {
  margin-right: 10px;
  padding: 10px 15px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.action-button:hover {
  background-color: #1976d2;
}

.update-task-form {
  margin-top: 20px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
textarea,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #45a049;
}

.success-message {
  margin-top: 10px;
  color: #4caf50;
  font-weight: bold;
}

</style>
