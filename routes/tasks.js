const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const tasks = [
  {
    id: 1,
    title: 'Сборка фасадов кухни',
    description: 'Сборка всех фасадных элементов для проекта "Лайм"',
    status: 'in_progress',
    assigned_to: 'Иван Петров',
    assigned_by: 'Директор',
    due_date: '2026-10-15',
    priority: 'high',
    project: 'Кухня Лайм',
    progress: 65
  },
  {
    id: 2,
    title: 'Раскрой ЛДСП',
    description: 'Раскрой листов по чертежам проекта',
    status: 'new',
    assigned_to: 'Мария Сидорова',
    assigned_by: 'Директор',
    due_date: '2026-10-16',
    priority: 'medium',
    project: 'Кухня Лайм',
    progress: 0
  },
  {
    id: 3,
    title: 'Сверление фурнитуры',
    description: 'Сверление отверстий под петли и ручки',
    status: 'done',
    assigned_to: 'Алексей Кузнецов',
    assigned_by: 'Директор',
    due_date: '2026-10-12',
    priority: 'high',
    project: 'Гардероб Сканди',
    progress: 100
  },
  {
    id: 4,
    title: 'Проверка качества',
    description: 'Качественная проверка всех элементов',
    status: 'in_progress',
    assigned_to: 'Елена Турова',
    assigned_by: 'Директор',
    due_date: '2026-10-17',
    priority: 'high',
    project: 'Кухня Лайм',
    progress: 45
  }
];

router.get('/', authMiddleware, (req, res) => {
  res.json({
    success: true,
    data: tasks
  });
});

router.post('/', authMiddleware, (req, res) => {
  const newTask = {
    id: Date.now(),
    ...req.body,
    status: req.body.status || 'new',
    progress: 0
  };
  tasks.unshift(newTask);
  res.status(201).json({ success: true, data: newTask });
});

router.put('/:id/status', authMiddleware, (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ message: 'Task not found' });
  
  task.status = req.body.status;
  if (req.body.progress !== undefined) task.progress = req.body.progress;
  
  res.json({ success: true, data: task });
});

router.get('/:id', authMiddleware, (req, res) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json({ success: true, data: task });
});

module.exports = router;
