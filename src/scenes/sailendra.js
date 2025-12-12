import * as THREE from 'three';
import { createArtifact, createCoin } from '../utils/artifacts.js';

export function createSailendraScene(scene) {
    const objects = [];

    // Sailendra - Buddhist Borobudur builders
    const ambientLight = new THREE.AmbientLight(0xffe8d1, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffd699, 1.3);
    sunLight.position.set(20, 35, 10);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Temple ground - ancient stone
    const groundGeometry = new THREE.PlaneGeometry(55, 55, 20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xC8B590,
        roughness: 0.95
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Borobudur-inspired stupa pyramid
    const borobudur = createBorobudurPyramid();
    borobudur.position.set(0, 0, -10);
    scene.add(borobudur);

    // Buddha statues around
    for (let i = 0; i < 10; i++) {
        const buddha = createBuddhaStatue();
        const angle = (i / 10) * Math.PI * 2;
        const radius = 14;
        buddha.position.set(
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
        );
        buddha.rotation.y = -angle + Math.PI;
        scene.add(buddha);
    }

    // Bell-shaped stupas (perforated)
    for (let i = 0; i < 8; i++) {
        const stupa = createBellStupa();
        const angle = (i / 8) * Math.PI * 2;
        const radius = 10;
        stupa.position.set(
            Math.cos(angle) * radius,
            0,
            -10 + Math.sin(angle) * radius
        );
        scene.add(stupa);
    }

    // Stone reliefs panels
    createReliefPanels(scene);

    // Interactive Artifacts
    const borobudurModel = createArtifact(
        'treasure',
        0xFFD700,
        'Miniatur Borobudur',
        'Candi Buddha terbesar di dunia yang dibangun wangsa Sailendra. Memiliki 504 arca Buddha dan 2672 panel relief.'
    );
    borobudurModel.position.set(0, 1, -12);
    scene.add(borobudurModel);
    objects.push(borobudurModel);

    const buddhaStatue = createArtifact(
        'statue',
        0xFFA500,
        'Arca Buddha Dhyani',
        'Patung Buddha dalam posisi meditasi yang melambangkan pencapaian nirwana dan pencerahan spiritual.'
    );
    buddhaStatue.position.set(-10, 1.5, 5);
    scene.add(buddhaStatue);
    objects.push(buddhaStatue);

    // Collectibles
    const coin1 = createCoin(0xFFD700);
    coin1.position.set(-8, 1, -10);
    coin1.userData.collectibleId = 'sailendra_coin1';
    scene.add(coin1);
    objects.push(coin1);

    const coin2 = createCoin(0xFFD700);
    coin2.position.set(12, 1, 8);
    coin2.userData.collectibleId = 'sailendra_coin2';
    scene.add(coin2);
    objects.push(coin2);

    const coin3 = createCoin(0xFFD700);
    coin3.position.set(-10, 1, 12);
    coin3.userData.collectibleId = 'sailendra_coin3';
    scene.add(coin3);
    objects.push(coin3);

    // Exit portal
    const exitPortal = createExitPortal();
    exitPortal.position.set(0, 1.5, 20);
    exitPortal.userData = {
        type: 'door',
        destination: 'lobby',
        info: '🚪 Kembali ke Lobby'
    };
    scene.add(exitPortal);
    objects.push(exitPortal);

    scene.fog = new THREE.Fog(0xF5E6D3, 22, 65);
    scene.background = new THREE.Color(0xF5E6D3);

    return { objects };
}

function createBorobudurPyramid() {
    const group = new THREE.Group();
    const stoneMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B7355,
        roughness: 0.95
    });

    // 5 levels pyramid
    for (let i = 0; i < 5; i++) {
        const size = 10 - i * 1.8;
        const height = 1.5;
        
        const level = new THREE.Mesh(
            new THREE.BoxGeometry(size, height, size),
            stoneMaterial
        );
        level.position.y = i * height + height / 2;
        level.castShadow = true;
        level.receiveShadow = true;
        group.add(level);

        // Relief decorations on each level
        const reliefCount = 8;
        for (let j = 0; j < reliefCount; j++) {
            const angle = (j / reliefCount) * Math.PI * 2;
            const reliefRadius = size / 2;
            
            const relief = new THREE.Mesh(
                new THREE.BoxGeometry(0.8, 0.8, 0.15),
                new THREE.MeshStandardMaterial({ color: 0xA0826D, roughness: 0.9 })
            );
            relief.position.set(
                Math.cos(angle) * reliefRadius,
                i * height + height / 2,
                Math.sin(angle) * reliefRadius
            );
            
            if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
                relief.position.x = Math.sign(Math.cos(angle)) * reliefRadius;
                relief.rotation.y = Math.sign(Math.cos(angle)) > 0 ? Math.PI / 2 : -Math.PI / 2;
            } else {
                relief.position.z = Math.sign(Math.sin(angle)) * reliefRadius;
                relief.rotation.y = Math.sign(Math.sin(angle)) > 0 ? 0 : Math.PI;
            }
            
            group.add(relief);
        }
    }

    // Top stupa
    const mainStupa = new THREE.Mesh(
        new THREE.ConeGeometry(2, 3, 16),
        new THREE.MeshStandardMaterial({ 
            color: 0xFFD700,
            roughness: 0.4,
            metalness: 0.8
        })
    );
    mainStupa.position.y = 10;
    mainStupa.castShadow = true;
    group.add(mainStupa);

    return group;
}

function createBuddhaStatue() {
    const group = new THREE.Group();

    // Base
    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 1, 0.5, 8),
        new THREE.MeshStandardMaterial({ color: 0x696969, roughness: 0.9 })
    );
    base.position.y = 0.25;
    base.castShadow = true;
    group.add(base);

    // Body (meditation pose - simplified)
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 1.2, 0.6),
        new THREE.MeshStandardMaterial({ color: 0x8B7355, roughness: 0.9 })
    );
    body.position.y = 1.1;
    body.castShadow = true;
    group.add(body);

    // Head
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.3, 12, 12),
        new THREE.MeshStandardMaterial({ color: 0xA0826D, roughness: 0.85 })
    );
    head.position.y = 1.9;
    head.castShadow = true;
    group.add(head);

    // Hair bun (ushnisha)
    const bun = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.9 })
    );
    bun.position.y = 2.2;
    group.add(bun);

    return group;
}

function createBellStupa() {
    const group = new THREE.Group();

    // Base
    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(1, 1.2, 0.4, 16),
        new THREE.MeshStandardMaterial({ color: 0x8B7355, roughness: 0.95 })
    );
    base.position.y = 0.2;
    base.castShadow = true;
    group.add(base);

    // Bell body (perforated dome)
    const bellGeometry = new THREE.SphereGeometry(0.8, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.5);
    const bellMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xA0826D,
        roughness: 0.9
    });
    const bell = new THREE.Mesh(bellGeometry, bellMaterial);
    bell.position.y = 0.4;
    bell.castShadow = true;
    group.add(bell);

    // Small Buddha inside (visible through perforation - symbolic)
    const innerBuddha = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 8, 8),
        new THREE.MeshStandardMaterial({ 
            color: 0xFFD700,
            roughness: 0.6,
            metalness: 0.4
        })
    );
    innerBuddha.position.y = 0.6;
    group.add(innerBuddha);

    // Top ornament
    const top = new THREE.Mesh(
        new THREE.ConeGeometry(0.3, 0.5, 8),
        new THREE.MeshStandardMaterial({ color: 0xDAA520, roughness: 0.7 })
    );
    top.position.y = 1.5;
    group.add(top);

    return group;
}

function createReliefPanels(scene) {
    const positions = [
        [-18, 0, -5], [-18, 0, 5],
        [18, 0, -5], [18, 0, 5],
        [0, 0, -22]
        // Removed [0, 0, 22] to avoid blocking exit portal
    ];

    positions.forEach((pos, idx) => {
        const panel = new THREE.Mesh(
            new THREE.BoxGeometry(4, 3, 0.3),
            new THREE.MeshStandardMaterial({ color: 0x8B7355, roughness: 0.95 })
        );
        panel.position.set(pos[0], 1.5, pos[2]);
        panel.castShadow = true;
        
        // Rotate to face center
        if (Math.abs(pos[0]) > Math.abs(pos[2])) {
            panel.rotation.y = pos[0] > 0 ? -Math.PI / 2 : Math.PI / 2;
        }
        
        scene.add(panel);
    });
}

function createExitPortal() {
    const group = new THREE.Group();
    const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0x4169E1,
        emissive: 0x1E3A8A,
        roughness: 0.3,
        metalness: 0.7
    });

    const frameLeft = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3, 0.3), frameMaterial);
    frameLeft.position.x = -1.2;
    group.add(frameLeft);

    const frameRight = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3, 0.3), frameMaterial);
    frameRight.position.x = 1.2;
    group.add(frameRight);

    const frameTop = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.3, 0.3), frameMaterial);
    frameTop.position.y = 1.35;
    group.add(frameTop);

    const portal = new THREE.Mesh(
        new THREE.PlaneGeometry(2.4, 2.7),
        new THREE.MeshBasicMaterial({ color: 0x6495ED, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
    );
    group.add(portal);

    return group;
}