// src/services/TaskService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';
const TASK_URL = `${API_URL}/tasks`;
const SEARCH_URL = `${API_URL}/search`;

// 创建带认证的axios实例
const createAuthenticatedInstance = () => {
    const instance = axios.create();

    // 请求拦截器 - 添加认证头
    instance.interceptors.request.use(config => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });

    return instance;
};

const authenticatedAxios = createAuthenticatedInstance();

class TaskService {
    // 创建任务
    createTask(taskData) {
        return authenticatedAxios.post(`${TASK_URL}`, taskData);
    }

    // 获取所有任务
    getAllTasks() {
        return authenticatedAxios.get(`${TASK_URL}`);
    }

    // 分页获取任务
    getTasksPaged(page = 0, size = 24, sortBy = 'id', sortDir = 'asc') {
        return authenticatedAxios.get(`${TASK_URL}/paged`, {
            params: { page, size, sortBy, sortDir }
        });
    }

    // 获取任务详情
    getTaskById(id) {
        return authenticatedAxios.get(`${TASK_URL}/${id}`);
    }

    // 更新任务
    updateTask(id, taskData) {
        return authenticatedAxios.put(`${TASK_URL}/${id}`, taskData);
    }


    // 接受任务
    acceptTask(id) {
        return authenticatedAxios.post(`${TASK_URL}/${id}/accept`);
    }


    // 确认任务完成
    confirmTaskCompletion(taskId, completerId) {
        return authenticatedAxios.put(`${TASK_URL}/${taskId}/confirm-completion`, null, {
            params: { completerId }
        });
    }

    // 获取任务接取记录
    getTaskAcceptances(page = 0, size = 20, sortBy = 'id', sortDir = 'asc') {
        return authenticatedAxios.get(`${TASK_URL}/acceptances`, {
            params: { page, size, sortBy, sortDir }
        });
    }

    // 获取我的任务接取记录
    getMyTaskAcceptances(page = 0, size = 20, sortBy = 'acceptedAt', sortDir = 'desc') {
        return authenticatedAxios.get(`${TASK_URL}/my-acceptances`, {
            params: { page, size}
        });
    }

    // 搜索任务
    searchTasks(query, page = 0, size = 20) {
        return authenticatedAxios.get(`${SEARCH_URL}/tasks`, {
            params: { query, page, size }
        });
    }
}

export default new TaskService();