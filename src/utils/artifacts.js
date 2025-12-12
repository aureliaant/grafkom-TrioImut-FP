import * as THREE from 'three';

// Create interactive artifact with floating animation
export function createArtifact(type, color, title, description, imageUrl = null) {
    const group = new THREE.Group();
    
    let mesh;
    
    switch(type) {
        case 'statue':
            mesh = createStatue(color);
            break;
        case 'inscription':
            mesh = createInscription(color);
            break;
        case 'treasure':
            mesh = createTreasure(color);
            break;
        case 'pillar':
            mesh = createPillar(color);
            break;
        default:
            mesh = createStatue(color);
    }
    
    group.add(mesh);
    
    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(1.2, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.2
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.scale.set(1, 1.5, 1);
    group.add(glow);
    
    // User data for interaction
    group.userData = {
        type: 'artifact',
        artifactType: type,
        title: title,
        description: description,
        imageUrl: imageUrl,
        info: `🔍 Klik untuk info: ${title}`,
        isAnimated: true,
        baseY: 0,
        glowMesh: glow
    };
    
    return group;
}

function createStatue(color) {
    const group = new THREE.Group();
    
    // Base pedestal
    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.6, 0.3, 6),
        new THREE.MeshStandardMaterial({ color: 0x8B7355, roughness: 0.9 })
    );
    base.position.y = 0.15;
    base.castShadow = true;
    group.add(base);
    
    // Statue body
    const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.35, 1.2, 8),
        new THREE.MeshStandardMaterial({ color: color, roughness: 0.6, metalness: 0.3 })
    );
    body.position.y = 0.9;
    body.castShadow = true;
    group.add(body);
    
    // Head
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 12, 12),
        new THREE.MeshStandardMaterial({ color: color, roughness: 0.6, metalness: 0.3 })
    );
    head.position.y = 1.7;
    head.castShadow = true;
    group.add(head);
    
    return group;
}

function createInscription(color) {
    const group = new THREE.Group();
    
    // Stone slab
    const slab = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.8, 0.3),
        new THREE.MeshStandardMaterial({ 
            color: 0x696969,
            roughness: 0.95
        })
    );
    slab.position.y = 0.9;
    slab.castShadow = true;
    group.add(slab);
    
    // Decorative border
    const border = new THREE.Mesh(
        new THREE.BoxGeometry(1.3, 1.9, 0.25),
        new THREE.MeshStandardMaterial({ 
            color: color,
            roughness: 0.4,
            metalness: 0.6
        })
    );
    border.position.set(0, 0.9, -0.02);
    group.add(border);
    
    // Ancient text lines (decorative)
    for (let i = 0; i < 5; i++) {
        const line = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.05, 0.05),
            new THREE.MeshStandardMaterial({ color: 0xFFD700 })
        );
        line.position.set(0, 0.3 + i * 0.25, 0.16);
        group.add(line);
    }
    
    return group;
}

function createTreasure(color) {
    const group = new THREE.Group();
    
    // Chest
    const chest = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.6, 0.6),
        new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.8 })
    );
    chest.position.y = 0.3;
    chest.castShadow = true;
    group.add(chest);
    
    // Lid
    const lid = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 0.2, 0.65),
        new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.8 })
    );
    lid.position.y = 0.7;
    lid.rotation.x = -0.5; // Open slightly
    lid.castShadow = true;
    group.add(lid);
    
    // Gold glow from inside
    const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 12, 12),
        new THREE.MeshStandardMaterial({ 
            color: color,
            emissive: color,
            emissiveIntensity: 0.8
        })
    );
    glow.position.y = 0.5;
    group.add(glow);
    
    return group;
}

function createPillar(color) {
    const group = new THREE.Group();
    
    // Pillar
    const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.35, 2.5, 8),
        new THREE.MeshStandardMaterial({ 
            color: 0x8B7355,
            roughness: 0.9
        })
    );
    pillar.position.y = 1.25;
    pillar.castShadow = true;
    group.add(pillar);
    
    // Top ornament
    const top = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 12, 12),
        new THREE.MeshStandardMaterial({ 
            color: color,
            roughness: 0.4,
            metalness: 0.7,
            emissive: color,
            emissiveIntensity: 0.3
        })
    );
    top.position.y = 2.7;
    top.castShadow = true;
    group.add(top);
    
    return group;
}

// Create collectible coin
export function createCoin(color = 0xFFD700) {
    const group = new THREE.Group();
    
    const coin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16),
        new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.9,
            roughness: 0.2,
            emissive: color,
            emissiveIntensity: 0.3
        })
    );
    coin.rotation.x = Math.PI / 2;
    coin.castShadow = true;
    group.add(coin);
    
    // Glow effect
    const glow = new THREE.Mesh(
        new THREE.SphereGeometry(0.5, 12, 12),
        new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.3
        })
    );
    group.add(glow);
    
    group.userData = {
        type: 'collectible',
        isAnimated: true,
        rotationSpeed: 0.02,
        baseY: 0,
        glowMesh: glow
    };
    
    return group;
}
