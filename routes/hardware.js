const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const hardware = [
  { id: 1, name: 'Петли Blum', type: 'hinge', cost: 1500, stock: 42, description: 'Премиум петли Blum для шкафов' },
  { id: 2, name: 'Направляющие Hettich', type: 'rail', cost: 2200, stock: 30, description: 'Выдвижные направляющие' },
  { id: 3, name: 'Ручки (хром)', type: 'handle', cost: 800, stock: 60, description: 'Современные хромированные ручки' },
  { id: 4, name: 'Ручки (дерево)', type: 'handle', cost: 1200, stock: 45, description: 'Деревянные ручки премиум класса' },
  { id: 5, name: 'Крепежная система', type: 'mount', cost: 1100, stock: 50, description: 'Универсальное крепление' },
  { id: 6, name: 'Демпферы', type: 'damper', cost: 650, stock: 80, description: 'Мягкое закрывание дверей' }
];

router.get('/', authMiddleware, (req, res) => {
  res.json({
    success: true,
    data: hardware
  });
});

router.post('/', authMiddleware, (req, res) => {
  const item = {
    id: Date.now(),
    ...req.body
  };
  hardware.push(item);
  res.status(201).json({ success: true, data: item });
});

router.get('/:id', authMiddleware, (req, res) => {
  const item = hardware.find(h => h.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: 'Hardware not found' });
  res.json({ success: true, data: item });
});

module.exports = router;
