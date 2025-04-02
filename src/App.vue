<template>
  <Login v-if="currentView === 'login'" @switch-view="switchView" @login-success="handleLoginSuccess" />
  <Signup v-else-if="currentView === 'signup'" @switch-view="switchView" @signup-success="handleSignupSuccess" />
  <Dashboard v-else-if="isAuthenticated" :user="user" @logout="handleLogout" />
</template>

<script>
import Login from './components/Login.vue'
import Signup from './components/Signup.vue'
import Dashboard from './components/Dashboard.vue'

export default {
  name: 'App',
  components: {
    Login,
    Signup,
    Dashboard
  },
  data() {
    return {
      currentView: 'login',
      isAuthenticated: false,
      user: null
    }
  },
  methods: {
    switchView(view) {
      this.currentView = view
    },
    handleLoginSuccess(userData) {
      this.user = userData.user
      this.isAuthenticated = true
      this.currentView = 'dashboard'
    },
    handleSignupSuccess(userData) {
      this.user = userData.user
      this.isAuthenticated = true
      this.currentView = 'dashboard'
    },
    handleLogout() {
      this.isAuthenticated = false
      this.user = null
      this.currentView = 'login'
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

body {
  background-color: #f5f5f5;
}
</style>