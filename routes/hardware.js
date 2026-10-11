const express = require('express');
const router = express.Router();

const hardware = [
  { id: 1, name: 'Петли Blum', type: 'hinge', cost: 1500, stock: 42 },
  { id: 2, name: 'Направляющие Hettich', type: 'rail', cost: 2200, stock: 30 },
  { id: 3, name: 'Ручки (хром)', type: 'handle', cost: 800, stock: 60 },
  { id: 4, name: 'Ручки (дерево)', type: 'handle', cost: 1200, stock: 45 },
  { id: 5, name: 'Крепежная система', type: 'mount', cost: 1100, stock: 50 },
  { id: 6, name: 'Демпферы', type: 'damper', cost: 650, stock: 80 }
];

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: hardware
  });
});

router.post('/', (req, res) => {
  const item = {
    id: Date.now(),
    ...req.body
  };
  hardware.push(item);
  res.status(201).json({ success: true, data: item });
});

module.exports = router;
