<template>
  <div class="dashboard">
    <!-- Header with profile and actions -->
    <header class="header">
      <div class="profile">
        <img src="https://placekitten.com/100/100" alt="Profile" class="profile-image">
      </div>
      <div class="actions">
        <!-- Logout button -->
        <button class="action-button" @click="handleLogout" title="Logout">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <!-- Update selected tasks button -->
        <button class="action-button" @click="handleUpdateTasks" title="Update selected tasks">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon">
            <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <!-- Add new task button -->
        <button class="action-button" @click="showAddTaskModal = true" title="Add new task">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon">
            <path d="M12 4v16m8-8H4" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <!-- Delete selected tasks button -->
        <button class="action-button" @click="handleDeleteTasks" title="Delete selected tasks">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon">
            <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- Main content -->
    <main class="main-content">
      <!-- Ongoing tasks section -->
      <section class="task-section">
        <h2 class="section-title">Ongoing tasks</h2>
        <div class="task-list">
          <div v-for="task in ongoingTasks" :key="task.id" class="task-item">
            <div class="task-controls">
              <!-- Selection button -->
              <button 
                class="select-button"
                :class="{ 'selected': task.selected }"
                @click="toggleTaskSelection(task)"
                title="Select task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="select-icon">
                  <path d="M9 3h6m-6 0L3 3v18l6-2m0-16l6 18l6-2V3l-6 0m-6 0v16" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <!-- Completion checkbox -->
              <label class="checkbox-container">
                <input 
                  type="checkbox" 
                  :checked="task.completed"
                  @change="toggleTaskStatus(task)"
                >
                <span class="checkmark"></span>
              </label>
            </div>
            <span class="task-text" :class="{ 'selected': task.selected }">{{ task.text }}</span>
          </div>
        </div>
      </section>

      <!-- Completed tasks section -->
      <section class="task-section">
        <h2 class="section-title">Completed tasks</h2>
        <div class="task-list">
          <div v-for="task in completedTasks" :key="task.id" class="task-item completed">
            <div class="task-controls">
              <!-- Selection button -->
              <button 
                class="select-button"
                :class="{ 'selected': task.selected }"
                @click="toggleTaskSelection(task)"
                title="Select task"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="select-icon">
                  <path d="M9 3h6m-6 0L3 3v18l6-2m0-16l6 18l6-2V3l-6 0m-6 0v16" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <!-- Completion checkbox -->
              <label class="checkbox-container">
                <input 
                  type="checkbox" 
                  :checked="task.completed"
                  @change="toggleTaskStatus(task)"
                >
                <span class="checkmark"></span>
              </label>
            </div>
            <span class="task-text" :class="{ 'selected': task.selected }">{{ task.text }}</span>
          </div>
        </div>
      </section>
    </main>

    <!-- Add Task Modal -->
    <div v-if="showAddTaskModal" class="modal-overlay">
      <div class="modal">
        <h3>Add New Task</h3>
        <input 
          v-model="newTaskText" 
          placeholder="Enter task description"
          class="form-input"
          @keyup.enter="addTask"
        >
        <div class="modal-buttons">
          <button class="cancel-button" @click="showAddTaskModal = false">Cancel</button>
          <button class="add-button" @click="addTask">Add Task</button>
        </div>
      </div>
    </div>

    <!-- Update Task Modal -->
    <div v-if="showUpdateModal" class="modal-overlay">
      <div class="modal">
        <h3>Update Task</h3>
        <input 
          v-model="updateTaskText" 
          placeholder="Enter new task description"
          class="form-input"
          @keyup.enter="confirmUpdateTasks"
        >
        <div class="modal-buttons">
          <button class="cancel-button" @click="showUpdateModal = false">Cancel</button>
          <button class="add-button" @click="confirmUpdateTasks">Update</button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal">
        <h3>Delete Tasks</h3>
        <p class="modal-message">Are you sure you want to delete the selected tasks?</p>
        <div class="modal-buttons">
          <button class="cancel-button" @click="showDeleteModal = false">Cancel</button>
          <button class="delete-button" @click="confirmDeleteTasks">Delete</button>
        </div>
      </div>
    </div>

    <!-- Notification Modal -->
    <div v-if="showNotificationModal" class="modal-overlay">
      <div class="modal notification-modal">
        <h3>{{ notificationTitle }}</h3>
        <p class="modal-message">{{ notificationMessage }}</p>
        <div class="modal-buttons">
          <button class="add-button" @click="showNotificationModal = false">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      ongoingTasks: [
        { id: 1, text: 'Design a Minimalist Logo', completed: false, selected: false },
        { id: 2, text: 'Debug a JavaScript Function', completed: false, selected: false },
        { id: 3, text: 'Write a Blog Post', completed: false, selected: false },
        { id: 4, text: 'Try a New Recipe', completed: false, selected: false },
        { id: 5, text: 'Organize Your Digital Files', completed: false, selected: false },
        { id: 6, text: 'Update Your Resume', completed: false, selected: false },
        { id: 7, text: 'Read a Tech Article', completed: false, selected: false },
        { id: 8, text: 'Sketch a UI Wireframe', completed: false, selected: false }
      ],
      completedTasks: [],
      showAddTaskModal: false,
      showUpdateModal: false,
      showDeleteModal: false,
      showNotificationModal: false,
      newTaskText: '',
      updateTaskText: '',
      nextTaskId: 9,
      notificationTitle: '',
      notificationMessage: ''
    }
  },
  methods: {
    toggleTaskSelection(task) {
      task.selected = !task.selected;
    },
    toggleTaskStatus(task) {
      task.completed = !task.completed;
      
      // Remove task from its current list
      this.ongoingTasks = this.ongoingTasks.filter(t => t.id !== task.id);
      this.completedTasks = this.completedTasks.filter(t => t.id !== task.id);

      // Add task to appropriate list
      if (task.completed) {
        this.completedTasks.push(task);
      } else {
        this.ongoingTasks.push(task);
      }

      // Sort tasks by ID to maintain order
      this.ongoingTasks.sort((a, b) => a.id - b.id);
      this.completedTasks.sort((a, b) => a.id - b.id);
    },
    addTask() {
      if (!this.newTaskText.trim()) return;
      
      const newTask = {
        id: this.nextTaskId++,
        text: this.newTaskText.trim(),
        completed: false,
        selected: false
      };
      
      this.ongoingTasks.push(newTask);
      this.newTaskText = '';
      this.showAddTaskModal = false;
    },
    handleLogout() {
      // Emit event to parent component to handle logout
      this.$emit('logout');
    },
    handleUpdateTasks() {
      const selectedTasks = [...this.ongoingTasks, ...this.completedTasks].filter(task => task.selected);
      if (selectedTasks.length === 0) {
        this.showNotification('No Tasks Selected', 'Please select tasks to update');
        return;
      }
      this.updateTaskText = selectedTasks[0].text;
      this.showUpdateModal = true;
    },
    confirmUpdateTasks() {
      if (!this.updateTaskText.trim()) return;
      
      // Update all selected tasks
      this.ongoingTasks = this.ongoingTasks.map(task => {
        if (task.selected) {
          return { ...task, text: this.updateTaskText, selected: false };
        }
        return task;
      });
      
      this.completedTasks = this.completedTasks.map(task => {
        if (task.selected) {
          return { ...task, text: this.updateTaskText, selected: false };
        }
        return task;
      });
      
      this.updateTaskText = '';
      this.showUpdateModal = false;
    },
    handleDeleteTasks() {
      const selectedTasks = [...this.ongoingTasks, ...this.completedTasks].filter(task => task.selected);
      if (selectedTasks.length === 0) {
        this.showNotification('No Tasks Selected', 'Please select tasks to delete');
        return;
      }
      this.showDeleteModal = true;
    },
    confirmDeleteTasks() {
      // Remove selected tasks from both lists
      this.ongoingTasks = this.ongoingTasks.filter(task => !task.selected);
      this.completedTasks = this.completedTasks.filter(task => !task.selected);
      this.showDeleteModal = false;
    },
    showNotification(title, message) {
      this.notificationTitle = title;
      this.notificationMessage = message;
      this.showNotificationModal = true;
    }
  }
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background-color: #E8EBF4;
  padding: 20px;
}

.header {
  background: white;
  border-radius: 15px;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.profile-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.actions {
  display: flex;
  gap: 15px;
}

.action-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  color: #9C5D8D;
  transition: background-color 0.2s;
}

.action-button:hover {
  background-color: #f5f5f5;
}

.icon {
  width: 24px;
  height: 24px;
}

.main-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.task-section {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-family: 'Impact', sans-serif;
  font-size: 28px;
  margin-bottom: 20px;
  color: #333;
  text-transform: none;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.task-item {
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.task-item:hover {
  background-color: rgba(156, 93, 141, 0.05);
}

.task-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 12px;
}

.select-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #9C5D8D;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.select-button:hover {
  background-color: rgba(156, 93, 141, 0.1);
}

.select-button.selected {
  background-color: #9C5D8D;
  color: white;
}

.select-icon {
  width: 16px;
  height: 16px;
}

.task-text {
  flex: 1;
  padding: 4px 8px;
  transition: background-color 0.2s;
}

.task-text.selected {
  background-color: rgba(156, 93, 141, 0.1);
  border-radius: 4px;
}

.completed .task-text {
  font-style: italic;
  color: #666;
}

@media (max-width: 768px) {
  .main-content {
    grid-template-columns: 1fr;
  }
}

/* Add new styles for modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 15px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal h3 {
  margin-bottom: 15px;
  font-size: 20px;
  color: #333;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 15px;
  outline: none;
}

.form-input:focus {
  border-color: #9C5D8D;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-button, .add-button {
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.cancel-button {
  background: none;
  border: 1px solid #ddd;
}

.add-button {
  background: #9C5D8D;
  color: white;
  border: none;
}

.add-button:hover {
  background: #8a4c7c;
}

.cancel-button:hover {
  background: #f5f5f5;
}

.selected {
  background-color: rgba(156, 93, 141, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
}

.task-text {
  padding: 4px 8px;
}

.notification-modal {
  max-width: 400px;
}

.modal-message {
  margin-bottom: 20px;
  color: #666;
  line-height: 1.5;
}

.delete-button {
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  background: #dc3545;
  color: white;
  border: none;
}

.delete-button:hover {
  background: #c82333;
}
</style>
  