// src/services/AuthService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

class AuthService {
    login(username, password) {
        return axios
            .post(API_URL + 'signin', {
                username,
                password
            })
            .then(response => {
                if (response.data.token) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                    console.log(response.data);
                }
                return response.data;
            });
    }

    register(username, email, password, roles) {
        return axios.post(API_URL + 'signup', {
            username,
            email,
            password,
            role: roles
        });
    }
    updateProfile(user) {
        return axios.put(API_URL + 'update', user, {
            headers: {
                'Authorization': 'Bearer ' + user.token // 假设你需要在请求头中添加 token
            }
        });
    }
    logout() {
        localStorage.removeItem('user');
        // 如果需要，可以在这里调用后端注销 API
        // return axios.post(API_URL + 'logout');
        // 如果后端需要处理登出请求，可以在这里发送请求
        return Promise.resolve(); // 这里返回一个 resolved 的 Promise
    }
}

export default new AuthService();
