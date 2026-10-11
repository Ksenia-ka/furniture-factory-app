document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById('appContainer');
  const token = localStorage.getItem('token');

  if (token) {
    showDashboard();
  } else {
    setupLandingPage();
  }

  setupMenuNavigation();
  loadDashboard();
  setupModals();
});

function setupLandingPage() {
  const startButtons = document.querySelectorAll('#startProjectBtn, #heroProjectBtn');
  startButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      await loginDemo();
    });
  });
}

async function loginDemo() {
  try {
    const response = await API.auth.login('admin@factory.com', '123456');
    if (response && response.success) {
      API.setToken(response.token);
      showDashboard();
      navigateToSection('dashboard');
      showNotification('Добро пожаловать в FactoryFlow');
      return;
    }
  } catch (error) {
    console.error('Demo login failed', error);
  }

  // Fallback if API is unavailable
  localStorage.setItem('token', 'demo-token');
  API.setToken('demo-token');
  showDashboard();
  navigateToSection('dashboard');
  showNotification('Демонстрационный режим активирован');
}

function showDashboard() {
  const appContainer = document.getElementById('appContainer');
  if (appContainer) {
    appContainer.style.display = 'flex';
  }

  const topNav = document.querySelector('.top-navbar');
  if (topNav) {
    topNav.style.display = 'none';
  }
}

function setupMenuNavigation() {
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
      const section = item.getAttribute('data-section');
      navigateToSection(section);
    });
  });
}

function navigateToSection(sectionName) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const section = document.getElementById(sectionName + 'Section');
  if (section) {
    section.classList.add('active');
  }

  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('data-section') === sectionName) {
      item.classList.add('active');
    }
  });
}

async function loadDashboard() {
  try {
    const tasksRes = await API.tasks.getAll();
    const materialsRes = await API.materials.getAll();
    const hardwareRes = await API.hardware.getAll();

    if (tasksRes.data) {
      renderTasks(tasksRes.data);
      updateStats(tasksRes.data);
      renderTasksKanban(tasksRes.data);
    }
    if (materialsRes.data) {
      renderMaterials(materialsRes.data);
    }
    if (hardwareRes.data) {
      renderHardware(hardwareRes.data);
    }
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

function renderTasks(tasks) {
  const tbody = document.getElementById('taskTableBody');
  if (!tbody) return;
  
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
}

function renderTasksKanban(tasks) {
  const newList = document.getElementById('newTasksList');
  const inProgressList = document.getElementById('inProgressTasksList');
  const doneList = document.getElementById('doneTasksList');
  
  if (!newList) return;
  
  newList.innerHTML = '';
  inProgressList.innerHTML = '';
  doneList.innerHTML = '';

  tasks.forEach(task => {
    const card = createTaskCard(task);
    if (task.status === 'new') newList.appendChild(card);
    else if (task.status === 'in_progress') inProgressList.appendChild(card);
    else if (task.status === 'done') doneList.appendChild(card);
  });
}

function createTaskCard(task) {
  const card = document.createElement('div');
  card.className = 'task-card';
  card.innerHTML = `
    <div class="task-card-title">${task.title}</div>
    <div class="task-card-meta">
      <span>${task.assigned_to}</span>
      <span>${getPriorityText(task.priority)}</span>
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
      <h3>${material.name}</h3>
      <p><strong>Категория:</strong> ${material.category}</p>
      <p><strong>Цена:</strong> ${material.cost_per_unit} ₽</p>
      <p><strong>Текстура:</strong> ${material.texture}</p>
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
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p><strong>Тип:</strong> ${item.type}</p>
      <p><strong>Цена:</strong> ${item.cost} ₽</p>
      <p><strong>Остаток:</strong> ${item.stock} шт</p>
    `;
    grid.appendChild(card);
  });
}

function updateStats(tasks) {
  document.getElementById('stat-projects').textContent = '24';
  document.getElementById('stat-active').textContent = tasks.filter(t => t.status === 'in_progress').length;
  document.getElementById('stat-tasks').textContent = tasks.length;
  document.getElementById('stat-overdue').textContent = '2';
}

function getStatusClass(status) {
  const map = {
    'new': 'pending',
    'in_progress': 'in-progress',
    'done': 'done'
  };
  return map[status] || 'pending';
}

function getStatusText(status) {
  const map = {
    'new': '📋 Новая',
    'in_progress': '🔄 В работе',
    'done': '✅ Готово'
  };
  return map[status] || status;
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

function setupModals() {
  const modal = document.getElementById('taskModal');
  const overlay = document.getElementById('modalOverlay');
  
  document.getElementById('newTaskBtn')?.addEventListener('click', () => {
    modal.classList.add('active');
    overlay.classList.add('active');
  });

  document.getElementById('createTaskBtn')?.addEventListener('click', () => {
    modal.classList.add('active');
    overlay.classList.add('active');
  });

  document.getElementById('taskForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const task = {
      title: formData.get('title'),
      description: formData.get('description'),
      assigned_to: formData.get('assigned_to'),
      priority: formData.get('priority'),
      due_date: formData.get('due_date'),
      status: 'new'
    };
    
    const res = await API.tasks.create(task);
    if (res.success) {
      modal.classList.remove('active');
      overlay.classList.remove('active');
      e.target.reset();
      loadDashboard();
      showNotification('✅ Задача создана успешно');
    }
  });

  overlay?.addEventListener('click', () => {
    modal.classList.remove('active');
    overlay.classList.remove('active');
  });

  document.querySelector('.modal-close')?.addEventListener('click', () => {
    modal.classList.remove('active');
    overlay.classList.remove('active');
  });
}

function showNotification(message) {
  const notif = document.createElement('div');
  notif.className = 'notification';
  notif.textContent = message;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 2500);
}
