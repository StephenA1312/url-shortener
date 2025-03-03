import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || ''
  }),

  actions: {
    async login(username, password) {
      try {
        const response = await axios.post('http://localhost:8081/api/auth/login', {
          username,
          password
        });

        if (response.data) {
          this.token = response.data;
          this.user = { username };
          localStorage.setItem('token', response.data);
          return true;
        } else {
          throw new Error('Login failed');
        }
      } catch (error) {
        this.user = null;
        this.token = '';
        localStorage.removeItem('token');
        throw error;
      }
    },

    logout() {
      this.user = null;
      this.token = '';
      localStorage.removeItem('token');
    }
  }
});
