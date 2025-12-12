import * as THREE from 'three';
import { getAllKingdoms } from '../data/kingdoms.js';

export function createLobbyScene(scene) {
    const objects = [];

    // Starry Sky Background
    createStarrySky(scene);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.5, 60);
    pointLight.position.set(0, 8, 0);
    pointLight.castShadow = true;
    scene.add(pointLight);

    // Floor - larger for 8 doors with marble texture
    const floorGeometry = new THREE.PlaneGeometry(40, 40);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        map: createMarbleTexture(),
        roughness: 0.3,
        metalness: 0.5,
        normalMap: createNormalMap()
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid pattern on floor
    const gridHelper = new THREE.GridHelper(40, 40, 0x444444, 0x222222);
    scene.add(gridHelper);

    // Walls - circular arrangement
    createCircularWalls(scene);

    // Ceiling
    const ceiling = new THREE.Mesh(
        new THREE.CircleGeometry(20, 32),
        new THREE.MeshStandardMaterial({ 
            color: 0x16213e,
            side: THREE.DoubleSide
        })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 10;
    scene.add(ceiling);

    // Central pedestal with text
    const pedestal = createCentralPedestal();
    scene.add(pedestal);

    // Create 8 Doors in circular arrangement
    const kingdoms = getAllKingdoms();
    const radius = 12;
    const angleStep = (Math.PI * 2) / 8;

    // Manual configuration for each kingdom door
    const doorConfigs = [
        { name: 'Kutai', angle: 0 * angleStep, rotation: 0 * angleStep - Math.PI / 2 }, // Index 0 - 90° kanan
        { name: 'Tarumanegara', angle: 1 * angleStep, rotation: 1 * angleStep + Math.PI }, // Index 1 - 180°
        { name: 'Kalingga', angle: 2 * angleStep, rotation: 2 * angleStep + Math.PI / 2 }, // Index 2 - 90° kiri
        { name: 'Sriwijaya', angle: 3 * angleStep, rotation: 3 * angleStep }, // Index 3 - Edit rotation value
        { name: 'Mataram', angle: 4 * angleStep, rotation: 4 * angleStep - Math.PI / 2 }, // Index 4 - 90° kanan
        { name: 'Sailendra', angle: 5 * angleStep, rotation: 5 * angleStep + Math.PI }, // Index 5 - 180°
        { name: 'Kediri', angle: 6 * angleStep, rotation: 6 * angleStep + Math.PI / 2 }, // Index 6 - 90° kiri
        { name: 'Majapahit', angle: 7 * angleStep, rotation: 7 * angleStep } // Index 7 - Edit rotation value
    ];

    kingdoms.forEach((kingdom, index) => {
        const config = doorConfigs[index];
        const x = Math.cos(config.angle) * radius;
        const z = Math.sin(config.angle) * radius;

        const door = createDoor(kingdom.color, kingdom.name);
        door.position.set(x, 1.5, z);
        // Manual rotation - edit the rotation value in doorConfigs above
        door.rotation.y = config.rotation;
        door.userData = {
            type: 'door',
            destination: kingdom.id,
            info: `🏛️ Tekan E untuk masuk ke ${kingdom.name} (${kingdom.period})`
        };
        scene.add(door);
        objects.push(door);

        // Add floating label above door
        const label = createFloatingLabel(kingdom.name, kingdom.period);
        label.position.set(x, 4, z);
        // Label uses same rotation as door
        label.rotation.y = config.rotation;
        scene.add(label);
    });

    // Atmospheric fog
    scene.fog = new THREE.Fog(0x0f0f1e, 15, 45);

    // Add some ambient particles/lights
    createAmbientLights(scene, radius);
    
    // Add floating particles
    const particles = createFloatingParticles();
    scene.add(particles);
    objects.push(particles);

    return { objects };
}

function createCircularWalls(scene) {
    const wallMaterial = new THREE.MeshStandardMaterial({ 
        map: createStoneTexture(),
        roughness: 0.7,
        metalness: 0.1,
        normalMap: createNormalMap()
    });

    // Circular wall
    const wallGeometry = new THREE.CylinderGeometry(19, 19, 10, 32, 1, true);
    const wall = new THREE.Mesh(wallGeometry, wallMaterial);
    wall.position.y = 5;
    wall.castShadow = true;
    wall.receiveShadow = true;
    scene.add(wall);
}

function createCentralPedestal() {
    const group = new THREE.Group();

    // Base
    const baseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFFD700,
        roughness: 0.3,
        metalness: 0.8
    });

    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 2, 0.5, 8),
        baseMaterial
    );
    base.position.y = 0.25;
    group.add(base);

    // Column
    const column = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 0.8, 3, 8),
        new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.8 })
    );
    column.position.y = 2;
    group.add(column);

    // Top
    const top = new THREE.Mesh(
        new THREE.CylinderGeometry(1.2, 0.8, 0.5, 8),
        baseMaterial
    );
    top.position.y = 3.75;
    group.add(top);

    // Title text (using canvas texture)
    const titleCanvas = document.createElement('canvas');
    const ctx = titleCanvas.getContext('2d');
    titleCanvas.width = 1024;
    titleCanvas.height = 512;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, titleCanvas.width, titleCanvas.height);

    ctx.font = 'Bold 80px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center';
    ctx.fillText('KERAJAAN', 512, 180);
    ctx.fillText('HINDU-BUDDHA', 512, 280);
    ctx.font = 'Bold 50px Arial';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('NUSANTARA', 512, 380);

    const titleTexture = new THREE.CanvasTexture(titleCanvas);
    const titleMaterial = new THREE.MeshBasicMaterial({ 
        map: titleTexture,
        transparent: true,
        side: THREE.DoubleSide
    });

    const titlePlane = new THREE.Mesh(
        new THREE.PlaneGeometry(6, 3),
        titleMaterial
    );
    titlePlane.position.y = 6;
    group.add(titlePlane);

    return group;
}

function createDoor(color, name) {
    const group = new THREE.Group();

    // Door frame
    const frameMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2c2c2c,
        roughness: 0.7,
        metalness: 0.4
    });

    const frameLeft = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 3.5, 0.5),
        frameMaterial
    );
    frameLeft.position.x = -1.1;
    frameLeft.castShadow = true;
    group.add(frameLeft);

    const frameRight = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 3.5, 0.5),
        frameMaterial
    );
    frameRight.position.x = 1.1;
    frameRight.castShadow = true;
    group.add(frameRight);

    const frameTop = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.2, 0.5),
        frameMaterial
    );
    frameTop.position.y = 1.65;
    frameTop.castShadow = true;
    group.add(frameTop);

    // Door panel with emissive glow
    const doorMaterial = new THREE.MeshStandardMaterial({ 
        color: color,
        roughness: 0.5,
        metalness: 0.2,
        emissive: color,
        emissiveIntensity: 0.2
    });

    const door = new THREE.Mesh(
        new THREE.BoxGeometry(2, 3, 0.3),
        doorMaterial
    );
    door.castShadow = true;
    group.add(door);

    // Decorative pattern
    for (let i = 0; i < 3; i++) {
        const decorGeometry = new THREE.BoxGeometry(0.15, 0.8, 0.05);
        const decorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xFFD700,
            roughness: 0.3,
            metalness: 0.9,
            emissive: 0xFFD700,
            emissiveIntensity: 0.5
        });
        
        const decor = new THREE.Mesh(decorGeometry, decorMaterial);
        decor.position.set(-0.6 + i * 0.6, 0, 0.2);
        group.add(decor);
    }

    return group;
}

function createFloatingLabel(name, period) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 256;

    // Gradient background
    const gradient = context.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.8)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Kingdom name
    context.font = 'Bold 48px Arial';
    context.fillStyle = '#FFD700';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(name, 256, 100);

    // Period
    context.font = 'Bold 32px Arial';
    context.fillStyle = '#FFFFFF';
    context.fillText(period, 256, 160);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({ 
        map: texture, 
        transparent: true,
        side: THREE.DoubleSide
    });

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(4, 2),
        material
    );

    return plane;
}

function createAmbientLights(scene, radius) {
    const colors = [0xFF6B6B, 0x4ECDC4, 0x45B7D1, 0xFFA07A, 0x98D8C8, 0xF7DC6F, 0xBB8FCE, 0x85C1E2];
    
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const light = new THREE.PointLight(colors[i], 0.5, 10);
        light.position.set(
            Math.cos(angle) * (radius - 2),
            2,
            Math.sin(angle) * (radius - 2)
        );
        light.castShadow = true;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        scene.add(light);
    }
}

function createStarrySky(scene) {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        // Random position in sphere
        const radius = 30 + Math.random() * 20;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
        
        // Random star colors (white to blue)
        const color = new THREE.Color();
        color.setHSL(0.6 + Math.random() * 0.1, 0.5, 0.7 + Math.random() * 0.3);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const starMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    
    // Dark blue/purple background
    scene.background = new THREE.Color(0x0a0a1a);
}

function createFloatingParticles() {
    const particleCount = 500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 40;
        positions[i * 3 + 1] = Math.random() * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
        
        velocities.push({
            x: (Math.random() - 0.5) * 0.02,
            y: Math.random() * 0.01 + 0.005,
            z: (Math.random() - 0.5) * 0.02
        });
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0xffd700,
        size: 0.1,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(geometry, material);
    particles.userData.velocities = velocities;
    particles.userData.isAnimated = true;
    
    return particles;
}

function createMarbleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Base color
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 512, 512);
    
    // Marble veins
    for (let i = 0; i < 30; i++) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
        ctx.lineWidth = Math.random() * 3 + 1;
        ctx.beginPath();
        ctx.moveTo(Math.random() * 512, Math.random() * 512);
        for (let j = 0; j < 5; j++) {
            ctx.lineTo(Math.random() * 512, Math.random() * 512);
        }
        ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
}

function createStoneTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    // Base stone color
    ctx.fillStyle = '#2a2a3e';
    ctx.fillRect(0, 0, 512, 512);
    
    // Stone texture noise
    for (let i = 0; i < 5000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const brightness = Math.random() * 50 + 20;
        ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness}, 0.3)`;
        ctx.fillRect(x, y, 2, 2);
    }
    
    // Brick lines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 2;
    for (let y = 0; y < 512; y += 64) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 1);
    return texture;
}

function createNormalMap() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#8080ff';
    ctx.fillRect(0, 0, 256, 256);
    
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        const size = Math.random() * 10 + 5;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, '#9090ff');
        gradient.addColorStop(1, '#7070ff');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
}

