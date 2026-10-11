// Task management

document.getElementById('addMaterialBtn')?.addEventListener('click', () => {
  alert('Откройте форму создания материала');
});

// Drag and drop for kanban
document.addEventListener('dragstart', (e) => {
  if (e.target.classList.contains('task-card')) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('taskId', e.target.dataset.id);
  }
});

document.addEventListener('dragover', (e) => {
  if (e.target.closest('.task-list')) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }
});

document.addEventListener('drop', (e) => {
  const taskList = e.target.closest('.task-list');
  if (taskList) {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const newStatus = taskList.closest('.task-column').dataset.status;
    console.log('Task moved:', taskId, 'to status:', newStatus);
    showNotification(`✅ Задача переведена в ${newStatus}`);
  }
});

function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #22a779;
    color: white;
    padding: 16px 20px;
    border-radius: 10px;
    z-index: 2000;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  setTimeout(() => notification.remove(), 2500);
}
