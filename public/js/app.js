// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
  setupMenuNavigation();
  loadDashboard();
  setupModals();
});

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

function renderMaterials(materials) {
  const grid = document.getElementById('materialsGrid');
  if (!grid) return;
  
  grid.innerHTML = '';
  materials.forEach(material => {
    const card = document.createElement('div');
    card.className = 'material-card';
    card.innerHTML = `
      <h3>${material.name}</h3>
      <p>Категория: ${material.category}</p>
      <p>Цена: ${material.cost_per_unit} ₽</p>
      <p>Текстура: ${material.texture}</p>
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
      <p>Тип: ${item.type}</p>
      <p>Цена: ${item.cost} ₽</p>
      <p>Наличие: ${item.stock} шт</p>
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

  document.getElementById('taskForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const task = {
      title: formData.get('title'),
      description: formData.get('description'),
      assigned_to: formData.get('assigned_to'),
      priority: formData.get('priority'),
      due_date: formData.get('due_date')
    };
    
    const res = await API.tasks.create(task);
    if (res.success) {
      modal.classList.remove('active');
      overlay.classList.remove('active');
      e.target.reset();
      loadDashboard();
      showNotification('✅ Задача создана');
    }
  });

  overlay?.addEventListener('click', () => {
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
