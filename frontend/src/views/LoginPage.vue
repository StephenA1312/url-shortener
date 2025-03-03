<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-box">
        <div class="logo">
          <img src="https://cdn-icons-png.flaticon.com/512/6681/6681204.png" alt="Logo" />
        </div>
        <h1>Welcome Back</h1>
        <p class="subtitle">Please sign in to continue</p>
        <form @submit.prevent="login" class="login-form">
          <div class="form-group">
            <input 
              v-model="username" 
              placeholder=" "
              type="text"
              id="username"
              required
            />
            <label for="username">Username</label>
          </div>
          <div class="form-group">
            <input 
              v-model="password" 
              placeholder=" "
              type="password"
              id="password"
              required
            />
            <label for="password">Password</label>
          </div>
          <button type="submit" class="sign-in-button">
            <span>Sign In</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const username = ref('');
    const password = ref('');
    const authStore = useAuthStore();
    const router = useRouter();

    async function login() {
      console.log('Login attempt with:', { username: username.value, password: password.value });
      try {
        await authStore.login(username.value, password.value);
        console.log('Login successful, redirecting to dashboard');
        router.push('/dashboard');
      } catch (error) {
        console.error('Login failed:', error);
        alert('Invalid credentials');
      }
    }

    return {
      username,
      password,
      login
    };
  }
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, rgba(0, 82, 204, 0.95), rgba(0, 41, 102, 0.97)),
              url('https://img.freepik.com/free-vector/abstract-technology-particle-background_52683-25766.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
}

.login-container {
  width: 100%;
  max-width: 450px;
  margin: 20px;
  perspective: 1000px;
}

.login-box {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 40px;
  box-sizing: border-box;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transform-style: preserve-3d;
  transition: transform 0.3s ease;
}

.login-box:hover {
  transform: translateY(-5px);
}

.logo {
  text-align: center;
  margin-bottom: 20px;
}

.logo img {
  width: 60px;
  height: 60px;
  filter: brightness(0) invert(1);
  opacity: 0.9;
}

h1 {
  color: white;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
  text-align: center;
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin-bottom: 30px;
  font-size: 16px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  position: relative;
}

input {
  width: 100%;
  height: 54px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 20px 20px 0;
  box-sizing: border-box;
  color: white;
  font-size: 16px;
  outline: none;
  transition: all 0.3s ease;
}

input:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1);
}

label {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.7);
  font-size: 16px;
  transition: all 0.3s ease;
  pointer-events: none;
}

input:focus + label,
input:not(:placeholder-shown) + label {
  top: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
}

.sign-in-button {
  margin-top: 10px;
  height: 54px;
  background: #0052CC;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  overflow: hidden;
  position: relative;
}

.sign-in-button:hover {
  background: #0747A6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 82, 204, 0.3);
}

.sign-in-button:active {
  transform: translateY(0);
}

.sign-in-button svg {
  transition: transform 0.3s ease;
}

.sign-in-button:hover svg {
  transform: translateX(5px);
}

@media (max-width: 480px) {
  .login-box {
    padding: 30px 20px;
  }
  
  .login-container {
    margin: 0 15px;
  }
}
</style>
