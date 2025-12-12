import * as THREE from 'three';
import { createArtifact, createCoin } from '../utils/artifacts.js';

export function createMataramScene(scene) {
    const objects = [];

    // Mataram Kuno - Hindu temple builders (Prambanan)
    const ambientLight = new THREE.AmbientLight(0xffd4aa, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffaa66, 1.4);
    sunLight.position.set(22, 32, 8);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Temple courtyard - sandy stone
    const groundGeometry = new THREE.PlaneGeometry(50, 50, 20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xD2B48C,
        roughness: 0.95
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Main Prambanan-style temple complex
    const mainTemple = createPrambananTemple();
    mainTemple.position.set(0, 0, -12);
    scene.add(mainTemple);

    // Side temples (Trimurti - Brahma, Vishnu, Shiva)
    const leftTemple = createSmallPrambananTemple();
    leftTemple.position.set(-8, 0, -12);
    scene.add(leftTemple);

    const rightTemple = createSmallPrambananTemple();
    rightTemple.position.set(8, 0, -12);
    scene.add(rightTemple);

    // Stone carvings/reliefs
    for (let i = 0; i < 8; i++) {
        const relief = createStoneRelief();
        const angle = (i / 8) * Math.PI * 2;
        const radius = 15;
        relief.position.set(
            Math.cos(angle) * radius,
            1,
            Math.sin(angle) * radius
        );
        relief.rotation.y = -angle;
        scene.add(relief);
    }

    // Sacred statues
    createHinduStatues(scene);

    // Interactive Artifacts
    const durgaStatue = createArtifact(
        'statue',
        0xFFD700,
        'Arca Durga Mahisasuramardini',
        'Patung Dewi Durga yang membunuh raksasa kerbau, masterpiece seni Mataram Kuno yang ada di Candi Prambanan.',
        '/images/artifacts/arca durga.png'
    );
    durgaStatue.position.set(-8, 1.5, 5);
    scene.add(durgaStatue);
    objects.push(durgaStatue);

    const temple = createArtifact(
        'pillar',
        0xFF6347,
        'Miniatur Candi Prambanan',
        'Kompleks candi Hindu terbesar di Indonesia yang dibangun pada abad ke-9, dedikasi untuk Trimurti: Brahma, Wisnu, dan Siwa.',
        '/images/artifacts/candi prambanan.jpg'
    );
    temple.position.set(8, 1, -5);
    scene.add(temple);
    objects.push(temple);

    // Collectibles
    const coin1 = createCoin(0xFFD700);
    coin1.position.set(-10, 1, -8);
    coin1.userData.collectibleId = 'mataram_coin1';
    scene.add(coin1);
    objects.push(coin1);

    const coin2 = createCoin(0xFFD700);
    coin2.position.set(12, 1, 8);
    coin2.userData.collectibleId = 'mataram_coin2';
    scene.add(coin2);
    objects.push(coin2);

    const coin3 = createCoin(0xFFD700);
    coin3.position.set(-8, 1, 12);
    coin3.userData.collectibleId = 'mataram_coin3';
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

    scene.fog = new THREE.Fog(0xFFE4B5, 20, 60);
    scene.background = new THREE.Color(0xFFE4B5);

    return { objects };
}

function createPrambananTemple() {
    const group = new THREE.Group();
    const stoneMaterial = new THREE.MeshStandardMaterial({
        color: 0x696969,
        roughness: 0.95
    });

    // Base platform (3 levels)
    for (let i = 0; i < 3; i++) {
        const platform = new THREE.Mesh(
            new THREE.BoxGeometry(8 - i * 1, 0.5, 8 - i * 1),
            stoneMaterial
        );
        platform.position.y = i * 0.5 + 0.25;
        platform.castShadow = true;
        platform.receiveShadow = true;
        group.add(platform);
    }

    // Main body - square base
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(4, 6, 4),
        stoneMaterial
    );
    body.position.y = 4.5;
    body.castShadow = true;
    group.add(body);

    // Spire levels (decreasing size)
    for (let i = 0; i < 5; i++) {
        const spireLevel = new THREE.Mesh(
            new THREE.BoxGeometry(3 - i * 0.5, 0.8, 3 - i * 0.5),
            stoneMaterial
        );
        spireLevel.position.y = 8 + i * 0.9;
        spireLevel.castShadow = true;
        group.add(spireLevel);
    }

    // Top ornament
    const top = new THREE.Mesh(
        new THREE.ConeGeometry(0.8, 1.5, 4),
        new THREE.MeshStandardMaterial({ 
            color: 0xFFD700,
            roughness: 0.4,
            metalness: 0.8
        })
    );
    top.position.y = 13;
    top.rotation.y = Math.PI / 4;
    group.add(top);

    return group;
}

function createSmallPrambananTemple() {
    const group = new THREE.Group();
    const stoneMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0.93
    });

    // Base
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(4, 0.8, 4),
        stoneMaterial
    );
    base.position.y = 0.4;
    base.castShadow = true;
    group.add(base);

    // Body
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(3, 4, 3),
        stoneMaterial
    );
    body.position.y = 3;
    body.castShadow = true;
    group.add(body);

    // Spire
    for (let i = 0; i < 3; i++) {
        const spire = new THREE.Mesh(
            new THREE.BoxGeometry(2.5 - i * 0.6, 0.6, 2.5 - i * 0.6),
            stoneMaterial
        );
        spire.position.y = 5.5 + i * 0.7;
        spire.castShadow = true;
        group.add(spire);
    }

    // Top
    const top = new THREE.Mesh(
        new THREE.ConeGeometry(0.6, 1, 4),
        new THREE.MeshStandardMaterial({ color: 0xDAA520, roughness: 0.5, metalness: 0.7 })
    );
    top.position.y = 7.8;
    top.rotation.y = Math.PI / 4;
    group.add(top);

    return group;
}

function createStoneRelief() {
    const group = new THREE.Group();

    const wall = new THREE.Mesh(
        new THREE.BoxGeometry(3, 2.5, 0.3),
        new THREE.MeshStandardMaterial({ color: 0xA0826D, roughness: 0.95 })
    );
    wall.castShadow = true;
    group.add(wall);

    // Relief carving (simplified)
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 2; j++) {
            const carving = new THREE.Mesh(
                new THREE.BoxGeometry(0.6, 0.6, 0.1),
                new THREE.MeshStandardMaterial({ color: 0x8B7355, roughness: 0.9 })
            );
            carving.position.set(-1 + i, -0.8 + j * 1, 0.2);
            group.add(carving);
        }
    }

    return group;
}

function createHinduStatues(scene) {
    const positions = [
        [-10, 0, -8], [10, 0, -8],
        [-12, 0, 0], [12, 0, 0],
        [-10, 0, 8], [10, 0, 8]
    ];

    positions.forEach(pos => {
        const statue = new THREE.Group();

        // Pedestal
        const pedestal = new THREE.Mesh(
            new THREE.CylinderGeometry(0.6, 0.8, 1, 8),
            new THREE.MeshStandardMaterial({ color: 0x696969, roughness: 0.9 })
        );
        pedestal.position.y = 0.5;
        pedestal.castShadow = true;
        statue.add(pedestal);

        // Statue body
        const body = new THREE.Mesh(
            new THREE.CylinderGeometry(0.4, 0.5, 2, 8),
            new THREE.MeshStandardMaterial({ color: 0x8B7355, roughness: 0.85 })
        );
        body.position.y = 2;
        body.castShadow = true;
        statue.add(body);

        // Head
        const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.35, 8, 8),
            new THREE.MeshStandardMaterial({ color: 0xA0826D, roughness: 0.9 })
        );
        head.position.y = 3.2;
        statue.add(head);

        statue.position.set(pos[0], pos[1], pos[2]);
        scene.add(statue);
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
