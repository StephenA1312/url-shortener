<template>
  <div class="dashboard-wrapper">
    <nav class="dashboard-nav">
      <div class="nav-content">
        <div class="logo">
          <img src="https://cdn-icons-png.flaticon.com/512/6681/6681204.png" alt="Logo" />
          <span>URL Shortener</span>
        </div>
        <button @click="logout" class="logout-button">
          <span>Logout</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </nav>

    <main class="dashboard-content">
      <div class="url-shortener-card">
        <h1>Shorten Your URL</h1>
        <p class="subtitle">Paste your long URL below to create a shortened version</p>
        
        <form @submit.prevent="shortenUrl" class="url-form">
          <div class="input-group">
            <input 
              v-model="longUrl" 
              type="url" 
              placeholder="Enter your long URL here"
              required
            />
            <button type="submit" class="shorten-button">
              Shorten URL
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M13.5 10.5L21 3"></path>
                <path d="M16 3h5v5"></path>
                <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"></path>
              </svg>
            </button>
          </div>
        </form>

        <div v-if="shortenedUrl" class="result-card">
          <div class="result-header">
            <span>Your shortened URL:</span>
          </div>
          <div class="shortened-url">
            <input type="text" :value="shortenedUrl" readonly ref="urlInput" />
            <button @click="copyToClipboard" class="copy-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const longUrl = ref('');
    const shortenedUrl = ref('');
    const urlInput = ref(null);

    async function shortenUrl() {
      try {
        const response = await axios.post('http://localhost:8081/api/url/shorten', {
          url: longUrl.value
        });
        shortenedUrl.value = response.data;
      } catch (error) {
        console.error('Error shortening URL:', error);
        alert('Failed to shorten URL. Please try again.');
      }
    }

    async function copyToClipboard() {
      try {
        await navigator.clipboard.writeText(shortenedUrl.value);
        alert('URL copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }

    function logout() {
      authStore.logout();
      router.push('/login');
    }

    return {
      longUrl,
      shortenedUrl,
      urlInput,
      shortenUrl,
      copyToClipboard,
      logout
    };
  }
};
</script>

<style scoped>
.dashboard-wrapper {
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, rgba(0, 82, 204, 0.95), rgba(0, 41, 102, 0.97)),
              url('https://img.freepik.com/free-vector/abstract-technology-particle-background_52683-25766.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.dashboard-nav {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo img {
  width: 32px;
  height: 32px;
  filter: brightness(0) invert(1);
}

.logo span {
  color: white;
  font-size: 20px;
  font-weight: 600;
}

.user-section,
.user-info,
.welcome-text,
.username {
  display: none;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.dashboard-content {
  max-width: 800px;
  margin: 100px auto 40px;
  padding: 0 20px;
}

.url-shortener-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  color: white;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 4px;
  text-align: center;
}

.subtitle {
  color: rgba(255, 255, 255, 0.7);
  text-align: center;
  margin-bottom: 24px;
  font-size: 14px;
}

.url-form {
  margin-bottom: 30px;
}

.input-group {
  display: flex;
  gap: 12px;
}

input {
  flex: 1;
  height: 54px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 0 20px;
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

.shorten-button {
  height: 54px;
  background: #0052CC;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.shorten-button:hover {
  background: #0747A6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 82, 204, 0.3);
}

.result-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
}

.result-header {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-bottom: 12px;
}

.shortened-url {
  display: flex;
  gap: 12px;
}

.shortened-url input {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  height: 48px;
  margin: 0;
}

.copy-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.copy-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

@media (max-width: 640px) {
  .dashboard-content {
    margin: 80px auto 20px;
  }

  .url-shortener-card {
    padding: 20px;
  }

  .input-group {
    flex-direction: column;
  }

  .shorten-button {
    width: 100%;
    justify-content: center;
  }

  .shortened-url {
    flex-direction: column;
  }

  .copy-button {
    height: 48px;
    justify-content: center;
  }

  .user-info {
    display: none;
  }
}
</style>
