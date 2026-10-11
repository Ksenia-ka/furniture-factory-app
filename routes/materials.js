const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

const materials = [
  { id: 1, name: 'МДФ', category: 'wood', cost_per_unit: 1200, texture: 'матовый', description: 'Высокопрочный МДФ для фасадов' },
  { id: 2, name: 'ЛДСП', category: 'laminate', cost_per_unit: 900, texture: 'глянец', description: 'Ламинированная ДСП светлого тона' },
  { id: 3, name: 'Дерево (Сосна)', category: 'wood', cost_per_unit: 1800, texture: 'натуральный', description: 'Цельная древесина сосны' },
  { id: 4, name: 'Дерево (Дуб)', category: 'wood', cost_per_unit: 2500, texture: 'натуральный', description: 'Цельная древесина дуба' },
  { id: 5, name: 'Пластик (ABS)', category: 'plastic', cost_per_unit: 700, texture: 'матовый', description: 'Износостойкий АБС пластик' }
];

router.get('/', authMiddleware, (req, res) => {
  res.json({
    success: true,
    data: materials
  });
});

router.post('/', authMiddleware, (req, res) => {
  const { name, category, cost_per_unit, texture, description } = req.body;

  const newMaterial = {
    id: Date.now(),
    name,
    category,
    cost_per_unit,
    texture,
    description
  };

  materials.push(newMaterial);

  res.status(201).json({
    success: true,
    data: newMaterial
  });
});

router.get('/:id', authMiddleware, (req, res) => {
  const material = materials.find(m => m.id === parseInt(req.params.id));
  if (!material) return res.status(404).json({ message: 'Material not found' });
  res.json({ success: true, data: material });
});

module.exports = router;
