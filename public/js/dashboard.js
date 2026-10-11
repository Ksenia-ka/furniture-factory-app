// Navigation
document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('click', () => {
    const section = item.getAttribute('data-section');
    showSection(section);
  });
});

function showSection(sectionName) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  
  // Show selected section
  const section = document.getElementById(sectionName + 'Section');
  if (section) {
    section.classList.add('active');
  }

  // Update menu
  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-section') === sectionName) {
      item.classList.add('active');
    }
  });

  // Scroll to top
  window.scrollTo(0, 0);
}

// Load data on page load
window.addEventListener('load', async () => {
  loadDashboard();
});

async function loadDashboard() {
  try {
    // Load tasks
    const tasksResponse = await API.tasks.getAll();
    if (tasksResponse && tasksResponse.data) {
      renderTasks(tasksResponse.data);
      updateStats(tasksResponse.data);
    }

    // Load materials
    const materialsResponse = await API.materials.getAll();
    if (materialsResponse && materialsResponse.data) {
      renderMaterials(materialsResponse.data);
    }

    // Load hardware
    const hardwareResponse = await API.hardware.getAll();
    if (hardwareResponse && hardwareResponse.data) {
      renderHardware(hardwareResponse.data);
    }
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

function renderTasks(tasks) {
  const tbody = document.getElementById('taskTableBody');
  tbody.innerHTML = '';

  tasks.slice(0, 5).forEach(task => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${task.title}</td>
      <td>${task.assigned_to}</td>
      <td><span class="status ${getStatusClass(task.status)}">${getStatusText(task.status)}</span></td>
      <td>${formatDate(task.due_date)}</td>
    `;
    tbody.appendChild(row);
  });

  // Also populate task lists for kanban view
  const newTasksList = document.getElementById('newTasksList');
  const inProgressList = document.getElementById('inProgressTasksList');
  const doneTasksList = document.getElementById('doneTasksList');

  if (newTasksList) {
    newTasksList.innerHTML = '';
    inProgressList.innerHTML = '';
    doneTasksList.innerHTML = '';

    tasks.forEach(task => {
      const card = createTaskCard(task);
      if (task.status === 'new') newTasksList.appendChild(card);
      else if (task.status === 'in_progress') inProgressList.appendChild(card);
      else if (task.status === 'done') doneTasksList.appendChild(card);
    });
  }
}

function createTaskCard(task) {
  const card = document.createElement('div');
  card.className = 'task-card';
  card.innerHTML = `
    <div class="task-card-title">${task.title}</div>
    <div class="task-card-meta">
      <span>${task.assigned_to}</span>
      <span class="task-priority ${task.priority}">${getPriorityText(task.priority)}</span>
    </div>
  `;
  return card;
}

function renderMaterials(materials) {
  const grid = document.getElementById('materialsGrid');
  if (!grid) return;
  
  grid.innerHTML = '';
  materials.forEach(material => {
    const card = document.createElement('div');
    card.className = 'material-card';
    card.innerHTML = `
      <div class="card-header">
        <h3>${material.name}</h3>
        <span class="card-badge">${material.category}</span>
      </div>
      <p class="card-description">${material.description || 'Стройматериал для мебели'}</p>
      <div class="card-specs">
        <div class="spec-item">
          <div class="spec-label">Стоимость</div>
          <div class="spec-value">${material.cost_per_unit} ₽</div>
        </div>
        <div class="spec-item">
          <div class="spec-label">Текстура</div>
          <div class="spec-value">${material.texture}</div>
        </div>
      </div>
      <div class="card-actions">
        <button>📋 Использовать</button>
        <button>✏️ Редактировать</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderHardware(hardware) {
  const grid = document.getElementById('hardwareGrid');
  if (!grid) return;
  
  grid.innerHTML = '';
  hardware.forEach(item => {
    const card = document.createElement('div');
    card.className = 'hardware-card';
    const stockColor = item.stock > 20 ? '#22a779' : item.stock > 5 ? '#f4b265' : '#ef5a5a';
    card.innerHTML = `
      <div class="card-header">
        <h3>${item.name}</h3>
        <span class="card-badge">${item.type}</span>
      </div>
      <p class="card-description">${item.description || 'Фурнитура для мебели'}</p>
      <div class="card-specs">
        <div class="spec-item">
          <div class="spec-label">Цена</div>
          <div class="spec-value">${item.cost} ₽</div>
        </div>
        <div class="spec-item">
          <div class="spec-label" style="color: ${stockColor}">Наличие</div>
          <div class="spec-value" style="color: ${stockColor}">${item.stock} шт</div>
        </div>
      </div>
      <div class="card-actions">
        <button>🛒 Заказать</button>
        <button>📊 Подробно</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function updateStats(tasks) {
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter(t => t.status === 'in_progress').length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const overdueTasks = tasks.filter(t => new Date(t.due_date) < new Date()).length;

  document.getElementById('stat-projects').textContent = '24';
  document.getElementById('stat-active').textContent = activeTasks;
  document.getElementById('stat-tasks').textContent = totalTasks;
  document.getElementById('stat-overdue').textContent = overdueTasks;
}

function getStatusClass(status) {
  const map = {
    'new': 'pending',
    'in_progress': 'in-progress',
    'done': 'done'
  };
  return map[status] || 'review';
}

function getStatusText(status) {
  const map = {
    'new': '📋 Новая',
    'in_progress': '🔄 В работе',
    'done': '✅ Готово'
  };
  return map[status] || 'Проверка';
}

function getPriorityText(priority) {
  const map = {
    'low': 'Низкий',
    'medium': 'Средний',
    'high': '⚠️ Высокий'
  };
  return map[priority] || priority;
}

function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU');
}

// Modal handling
const taskModal = document.getElementById('taskModal');
const modalOverlay = document.getElementById('modalOverlay');

document.getElementById('newTaskBtn')?.addEventListener('click', () => {
  openModal(taskModal);
});

document.getElementById('createTaskBtn')?.addEventListener('click', () => {
  openModal(taskModal);
});

document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
  btn.addEventListener('click', (e) => {
    closeModal(e.closest('.modal'));
  });
});

modalOverlay?.addEventListener('click', () => {
  document.querySelectorAll('.modal.active').forEach(closeModal);
});

function openModal(modal) {
  if (modal) {
    modal.classList.add('active');
    modalOverlay.classList.add('active');
  }
}

function closeModal(modal) {
  if (modal) {
    modal.classList.remove('active');
    if (!document.querySelector('.modal.active')) {
      modalOverlay.classList.remove('active');
    }
  }
}

// Task form submit
document.getElementById('taskForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const taskData = {
    title: formData.get('title'),
    description: formData.get('description'),
    assigned_to: formData.get('assigned_to'),
    priority: formData.get('priority'),
    due_date: formData.get('due_date'),
    status: 'new'
  };

  try {
    const response = await API.tasks.create(taskData);
    if (response.success) {
      closeModal(taskModal);
      e.target.reset();
      loadDashboard();
      showNotification('✅ Задача создана успешно');
    }
  } catch (error) {
    showNotification('❌ Ошибка при создании задачи');
  }
});

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #22a779, #138763);
    color: white;
    padding: 16px 20px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(34, 167, 121, 0.2);
    z-index: 2000;
    animation: slideIn 0.3s ease;
  `;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 2500);
}
