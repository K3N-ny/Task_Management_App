<template>
  <div class="auth-container">
    <div class="auth-box">
      <h1>Welcome Back</h1>
      <p class="subtitle">Please login to your account</p>
      
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            required 
            placeholder="Enter your username"
          >
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            placeholder="Enter your password"
          >
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="auth-button" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <p class="switch-text">
        Don't have an account? 
        <a href="#" @click.prevent="$emit('switch-view', 'signup')">Sign up</a>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      error: null,
      loading: false
    }
  },
  methods: {
    async handleLogin() {
      this.error = null
      this.loading = true

      try {
        const response = await axios.post('http://localhost:3000/api/users/login', {
          username: this.username,
          password: this.password
        })

        // Store the token in localStorage
        localStorage.setItem('token', response.data.token)
        
        // Emit success event with user data
        this.$emit('login-success', response.data)
      } catch (error) {
        this.error = error.response?.data?.error || 'An error occurred during login'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
}

.auth-box {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  color: #333;
  margin-bottom: 10px;
  text-align: center;
}

.subtitle {
  color: #666;
  text-align: center;
  margin-bottom: 30px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  color: #555;
  font-weight: 500;
}

input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #6b46c1;
}

.auth-button {
  background-color: #6b46c1;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.auth-button:hover {
  background-color: #553c9a;
}

.auth-button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.switch-text {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.switch-text a {
  color: #6b46c1;
  text-decoration: none;
  font-weight: 500;
}

.switch-text a:hover {
  text-decoration: underline;
}

.error-message {
  color: #e53e3e;
  background-color: #fff5f5;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  font-size: 14px;
}
</style>
  