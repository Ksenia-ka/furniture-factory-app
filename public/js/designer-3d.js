let scene, camera, renderer, furnitureGroup;
const designerState = {
  width: 2800,
  height: 2500,
  depth: 600,
  material: 'mdf',
  color: 0xd6eedf
};

function initDesigner3D() {
  const canvas = document.getElementById('canvas3d');
  if (!canvas) return;

  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf8faf9);
  scene.fog = new THREE.Fog(0xf8faf9, 10000, 50000);

  // Camera
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);
  camera.position.set(2000, 1500, 2500);
  camera.lookAt(0, 1000, 0);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowShadowMap;
  canvas.appendChild(renderer.domElement);

  // Controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true;
  controls.autoRotateSpeed = 2;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(2000, 3000, 2000);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.left = -3000;
  directionalLight.shadow.camera.right = 3000;
  directionalLight.shadow.camera.top = 3000;
  directionalLight.shadow.camera.bottom = -3000;
  directionalLight.shadow.camera.far = 10000;
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0xffffff, 0.5);
  pointLight.position.set(-2000, 2000, -2000);
  scene.add(pointLight);

  // Floor
  const floorGeometry = new THREE.PlaneGeometry(6000, 6000);
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0xfaebe6,
    roughness: 0.8,
    metalness: 0
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.receiveShadow = true;
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -50;
  scene.add(floor);

  // Furniture group
  furnitureGroup = new THREE.Group();
  scene.add(furnitureGroup);

  // Create initial kitchen
  createKitchen();

  // Event listeners
  document.getElementById('widthInput').addEventListener('change', (e) => {
    designerState.width = parseInt(e.target.value);
    updateFurniture();
  });

  document.getElementById('heightInput').addEventListener('change', (e) => {
    designerState.height = parseInt(e.target.value);
    updateFurniture();
  });

  document.getElementById('depthInput').addEventListener('change', (e) => {
    designerState.depth = parseInt(e.target.value);
    updateFurniture();
  });

  document.getElementById('colorPicker').addEventListener('change', (e) => {
    designerState.color = parseInt(e.target.value.replace('#', '0x'), 16);
    updateFurniture();
  });

  // Save button
  document.getElementById('saveDesignBtn').addEventListener('click', saveDesign);
  document.getElementById('resetViewBtn').addEventListener('click', () => {
    camera.position.set(2000, 1500, 2500);
    camera.lookAt(0, 1000, 0);
  });

  // Material chips
  loadMaterialChips();
  loadHardwareList();
  loadTemplates();

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Handle window resize
  window.addEventListener('resize', () => {
    const newWidth = canvas.clientWidth;
    const newHeight = canvas.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });
}

function createKitchen() {
  furnitureGroup.clear();

  const scale = 1; // mm to units
  const w = designerState.width * scale / 1000;
  const h = designerState.height * scale / 1000;
  const d = designerState.depth * scale / 1000;

  const color = new THREE.Color(designerState.color);
  const material = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.3,
    metalness: 0.1
  });

  // Bottom cabinet (wide)
  const wideCabinet = new THREE.Mesh(
    new THREE.BoxGeometry(w * 0.35, h * 0.4, d),
    material
  );
  wideCabinet.position.set(-w * 0.25, h * 0.2, 0);
  wideCabinet.castShadow = true;
  wideCabinet.receiveShadow = true;
  furnitureGroup.add(wideCabinet);

  // Middle cabinet
  const middleCabinet = new THREE.Mesh(
    new THREE.BoxGeometry(w * 0.28, h * 0.5, d),
    material
  );
  middleCabinet.position.set(0, h * 0.25, 0);
  middleCabinet.castShadow = true;
  middleCabinet.receiveShadow = true;
  furnitureGroup.add(middleCabinet);

  // Tall cabinet
  const tallCabinet = new THREE.Mesh(
    new THREE.BoxGeometry(w * 0.22, h * 0.9, d),
    material
  );
  tallCabinet.position.set(w * 0.25, h * 0.45, 0);
  tallCabinet.castShadow = true;
  tallCabinet.receiveShadow = true;
  furnitureGroup.add(tallCabinet);

  // Countertop
  const countertop = new THREE.Mesh(
    new THREE.BoxGeometry(w * 0.9, h * 0.08, d * 1.1),
    new THREE.MeshStandardMaterial({
      color: 0xd9be8e,
      roughness: 0.4,
      metalness: 0.2
    })
  );
  countertop.position.set(0, h * 0.38, d * 0.05);
  countertop.castShadow = true;
  countertop.receiveShadow = true;
  furnitureGroup.add(countertop);

  // Backsplash
  const backsplash = new THREE.Mesh(
    new THREE.BoxGeometry(w * 0.9, h * 0.25, 0.05),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.5,
      metalness: 0
    })
  );
  backsplash.position.set(0, h * 0.55, d * 0.5);
  backsplash.castShadow = true;
  furnitureGroup.add(backsplash);
}

function updateFurniture() {
  createKitchen();
}

function loadMaterialChips() {
  const materialsData = [
    { id: 1, name: 'МДФ', value: 'mdf', color: '#d6eedf' },
    { id: 2, name: 'ЛДСП', value: 'ldsp', color: '#dfe7f1' },
    { id: 3, name: 'Дерево', value: 'wood', color: '#edd1b3' },
    { id: 4, name: 'Пластик', value: 'plastic', color: '#dfeef4' }
  ];

  const container = document.getElementById('materialChips');
  container.innerHTML = '';

  materialsData.forEach(mat => {
    const chip = document.createElement('button');
    chip.className = 'chip' + (designerState.material === mat.value ? ' active' : '');
    chip.textContent = mat.name;
    chip.addEventListener('click', () => {
      designerState.material = mat.value;
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      // Update color
      document.getElementById('colorPicker').value = mat.color;
      designerState.color = parseInt(mat.color.replace('#', '0x'), 16);
      updateFurniture();
    });
    container.appendChild(chip);
  });
}

function loadHardwareList() {
  const hardwareData = [
    { id: 1, name: 'Петли Blum', quantity: 2 },
    { id: 2, name: 'Направляющие', quantity: 4 },
    { id: 3, name: 'Ручки', quantity: 8 },
    { id: 4, name: 'Демпферы', quantity: 2 }
  ];

  const container = document.getElementById('hardwareList');
  container.innerHTML = '';

  hardwareData.forEach(hw => {
    const item = document.createElement('div');
    item.className = 'hardware-item';
    item.innerHTML = `
      <span>${hw.name}</span>
      <strong>${hw.quantity} шт</strong>
    `;
    container.appendChild(item);
  });
}

function loadTemplates() {
  const templates = [
    { id: 1, name: '🍳 Кухня L-образная', preset: 'kitchen-l' },
    { id: 2, name: '📏 Кухня прямая', preset: 'kitchen-straight' },
    { id: 3, name: '⬜ Шкаф встроенный', preset: 'wardrobe' },
    { id: 4, name: '🛏️ Спальня', preset: 'bedroom' }
  ];

  const container = document.getElementById('templateGrid');
  container.innerHTML = '';

  templates.forEach(tmpl => {
    const item = document.createElement('button');
    item.className = 'template-item';
    item.textContent = tmpl.name;
    item.addEventListener('click', () => {
      console.log('Template:', tmpl.preset);
      showNotification(`Загружен шаблон: ${tmpl.name}`);
    });
    container.appendChild(item);
  });
}

function saveDesign() {
  const design = {
    width: designerState.width,
    height: designerState.height,
    depth: designerState.depth,
    material: designerState.material,
    color: designerState.color,
    timestamp: new Date().toISOString()
  };

  console.log('Design saved:', design);
  showNotification('✅ Проект сохранён успешно');

  // Save to localStorage
  localStorage.setItem('lastDesign', JSON.stringify(design));
}

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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDesigner3D);
} else {
  initDesigner3D();
}
