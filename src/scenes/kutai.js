import * as THREE from 'three';
import { createArtifact, createCoin } from '../utils/artifacts.js';

export function createKutaiScene(scene) {
    const objects = [];

    // Kutai - Kalimantan jungle setting with river
    const ambientLight = new THREE.AmbientLight(0xffffcc, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffee88, 1.0);
    sunLight.position.set(15, 25, 15);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Jungle floor - brownish green
    const groundGeometry = new THREE.PlaneGeometry(50, 50, 20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x4a6741,
        roughness: 0.95
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Yupa Pillars (famous Kutai artifacts)
    const yupaMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B7355,
        roughness: 0.9
    });

    for (let i = 0; i < 7; i++) {
        const yupa = new THREE.Mesh(
            new THREE.CylinderGeometry(0.4, 0.5, 3, 8),
            yupaMaterial
        );
        const angle = (i / 7) * Math.PI * 2;
        const radius = 6;
        yupa.position.set(
            Math.cos(angle) * radius,
            1.5,
            Math.sin(angle) * radius
        );
        yupa.castShadow = true;
        scene.add(yupa);

        // Stone top
        const top = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 0.3, 0.8),
            yupaMaterial
        );
        top.position.set(
            Math.cos(angle) * radius,
            3.2,
            Math.sin(angle) * radius
        );
        scene.add(top);
    }

    // Central platform
    const platform = new THREE.Mesh(
        new THREE.CylinderGeometry(5, 5.5, 0.5, 8),
        new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.9 })
    );
    platform.position.y = 0.25;
    scene.add(platform);

    // River (blue plane)
    const river = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 50),
        new THREE.MeshStandardMaterial({ 
            color: 0x4682B4,
            roughness: 0.3,
            metalness: 0.5
        })
    );
    river.rotation.x = -Math.PI / 2;
    river.position.set(15, 0.05, 0);
    scene.add(river);

    // Jungle trees
    createJungleTrees(scene);

    // Interactive Artifacts
    const yupaPrasasti = createArtifact(
        'inscription',
        0xFFD700,
        'Prasasti Yupa',
        'Tujuh prasasti batu peninggalan Kerajaan Kutai yang berisi tulisan Sansekerta. Prasasti ini menceritakan tentang Raja Mulawarman dan upacara keagamaan Hindu.',
        '/images/artifacts/Prasasti-Yupa02.jpg'
    );
    yupaPrasasti.position.set(-8, 1, 3);
    scene.add(yupaPrasasti);
    objects.push(yupaPrasasti);

    const kutaiStatue = createArtifact(
        'statue',
        0xCD853F,
        'Arca Raja Mulawarman',
        'Patung Raja Mulawarman, raja terbesar Kerajaan Kutai yang terkenal dermawan. Ia memberikan 20.000 ekor sapi kepada para brahmana.',
        '/images/artifacts/patung-raja-mulawarman.jpeg'
    );
    kutaiStatue.position.set(8, 1.5, -3);
    scene.add(kutaiStatue);
    objects.push(kutaiStatue);

    const kutaiTreasure = createArtifact(
        'treasure',
        0xFFD700,
        'Harta Karun Kutai',
        'Peti berisi perhiasan emas dan artefak kerajaan Kutai. Kerajaan ini sangat makmur dari perdagangan hasil hutan dan sungai.',
        '/images/artifacts/peti-emas-kutai.jpg'
    );
    kutaiTreasure.position.set(0, 0.5, -8);
    scene.add(kutaiTreasure);
    objects.push(kutaiTreasure);

    // Collectible Coins
    const coin1 = createCoin(0xFFD700);
    coin1.position.set(-5, 1, -10);
    coin1.userData.collectibleId = 'kutai_coin1';
    scene.add(coin1);
    objects.push(coin1);

    const coin2 = createCoin(0xFFD700);
    coin2.position.set(12, 1, 5);
    coin2.userData.collectibleId = 'kutai_coin2';
    scene.add(coin2);
    objects.push(coin2);

    const coin3 = createCoin(0xFFD700);
    coin3.position.set(-12, 1, -5);
    coin3.userData.collectibleId = 'kutai_coin3';
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

    scene.fog = new THREE.Fog(0x87CEEB, 20, 55);
    scene.background = new THREE.Color(0x87CEEB);

    return { objects };
}

function createJungleTrees(scene) {
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4a3728 });
    const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x1e5128 });

    const positions = [
        [-15, 0, -15], [-12, 0, -20], [-18, 0, -10],
        [8, 0, -15], [10, 0, -20], [12, 0, -10],
        [-15, 0, 15], [-12, 0, 20], [-18, 0, 10],
        [8, 0, 15], [10, 0, 20], [12, 0, 10]
    ];

    positions.forEach(pos => {
        const tree = new THREE.Group();
        
        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.5, 0.6, 6, 8),
            trunkMaterial
        );
        trunk.position.y = 3;
        trunk.castShadow = true;
        tree.add(trunk);

        const leaves = new THREE.Mesh(
            new THREE.SphereGeometry(2.5, 8, 8),
            leavesMaterial
        );
        leaves.position.y = 7;
        leaves.castShadow = true;
        tree.add(leaves);

        tree.position.set(pos[0], pos[1], pos[2]);
        scene.add(tree);
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