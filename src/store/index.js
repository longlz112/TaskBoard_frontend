// store/index.js
//暂时无用
import { createStore } from 'vuex';
import AuthService from "@/services/AuthService"; // 引入 AuthService

const store = createStore({
    state: {
        isAuthenticated: false,
        user: null,
    },
    mutations: {
        setAuthenticated(state, status) {
            state.isAuthenticated = status;
        },
        setUser(state, user) {
            state.user = user;
        }
    },
    actions: {
        login({ commit }, userData) {
            return AuthService.login(userData.username, userData.password).then(response => {
                if (response.token) {
                    localStorage.setItem('user', JSON.stringify(response));
                    commit('setAuthenticated', true);
                    commit('setUser', response);
                }
                return response;
            });
        },
        logout({ commit }) {
            AuthService.logout();
            localStorage.removeItem('user');
            commit('setAuthenticated', false);
            commit('setUser', null);
        },
        checkAuth({ commit }) {
            const user = JSON.parse(localStorage.getItem('user'));
            commit('setAuthenticated', !!user);
            commit('setUser', user);
        }
    }
});

export default store;
