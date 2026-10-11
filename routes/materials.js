const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const materials = [
  { id: 1, name: 'МДФ', category: 'wood', cost_per_unit: 1200, texture: 'матовый' },
  { id: 2, name: 'ЛДСП', category: 'laminate', cost_per_unit: 900, texture: 'глянец' },
  { id: 3, name: 'Дерево (Сосна)', category: 'wood', cost_per_unit: 1800, texture: 'натуральный' },
  { id: 4, name: 'Пластик (ABS)', category: 'plastic', cost_per_unit: 700, texture: 'матовый' }
];

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: materials
  });
});

router.post('/', authMiddleware, (req, res) => {
  const newMaterial = {
    id: Date.now(),
    ...req.body
  };
  materials.push(newMaterial);
  res.status(201).json({ success: true, data: newMaterial });
});

module.exports = router;
