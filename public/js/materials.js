// Material management

document.getElementById('addMaterialBtn')?.addEventListener('click', () => {
  const materialName = prompt('Введите название материала:');
  if (materialName) {
    const category = prompt('Категория (wood/laminate/plastic):');
    const cost = prompt('Стоимость за единицу (₽):');
    
    const newMaterial = {
      name: materialName,
      category: category || 'wood',
      cost_per_unit: parseInt(cost) || 0,
      texture: prompt('Тип текстуры:') || 'матовый',
      description: prompt('Описание:') || ''
    };

    console.log('New material:', newMaterial);
    showNotification('✅ Материал добавлен');
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
