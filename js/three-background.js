// 3D Background with Three.js - City/Terrain Visualization
(function() {
    const canvas = document.getElementById('bg-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Camera position
    camera.position.z = 30;
    camera.position.y = 10;
    
    // Create city-like structures
    const buildings = [];
    const buildingGeometry = new THREE.BoxGeometry(1, 1, 1);
    const buildingMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x2563eb,
        transparent: true,
        opacity: 0.7,
        wireframe: false
    });
    
    // Create grid of buildings (digital twin city concept)
    for (let x = -20; x < 20; x += 3) {
        for (let z = -20; z < 20; z += 3) {
            const height = Math.random() * 5 + 2;
            const building = new THREE.Mesh(buildingGeometry, buildingMaterial.clone());
            building.scale.set(1.5, height, 1.5);
            building.position.set(x, height / 2, z);
            buildings.push(building);
            scene.add(building);
        }
    }
    
    // Add terrain grid
    const gridHelper = new THREE.GridHelper(50, 50, 0x3b82f6, 0x3b82f6);
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);
    
    // Add particles for atmosphere
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.6
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Animation
    let scrollY = 0;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });
    
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate scene based on scroll
        scene.rotation.y = scrollY * 0.0005;
        
        // Animate buildings
        buildings.forEach((building, index) => {
            building.rotation.y += 0.001;
            building.position.y = Math.sin(Date.now() * 0.001 + index) * 0.1 + building.scale.y / 2;
        });
        
        // Animate particles
        particlesMesh.rotation.y += 0.0005;
        particlesMesh.rotation.x += 0.0002;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();
