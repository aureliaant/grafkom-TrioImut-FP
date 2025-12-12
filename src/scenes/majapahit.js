import * as THREE from 'three';
import { createArtifact, createCoin } from '../utils/artifacts.js';

export function createMajapahitScene(scene) {
    const objects = [];

    // Ambient light - warm afternoon sun
    const ambientLight = new THREE.AmbientLight(0xffddaa, 0.6);
    scene.add(ambientLight);

    // Directional light - sunset atmosphere
    const sunLight = new THREE.DirectionalLight(0xff9944, 1.2);
    sunLight.position.set(20, 30, 10);
    sunLight.castShadow = true;
    sunLight.shadow.camera.left = -30;
    sunLight.shadow.camera.right = 30;
    sunLight.shadow.camera.top = 30;
    sunLight.shadow.camera.bottom = -30;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    // Ground - traditional courtyard
    const groundGeometry = new THREE.PlaneGeometry(50, 50, 20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8B7355,
        roughness: 0.9,
        metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Add texture variation to ground
    const groundVertices = groundGeometry.attributes.position;
    for (let i = 0; i < groundVertices.count; i++) {
        const y = Math.random() * 0.2;
        groundVertices.setY(i, y);
    }
    groundGeometry.computeVertexNormals();

    // Main Temple Gate (Gapura Candi Bentar)
    const temple = createTempleGate();
    temple.position.set(0, 0, -15);
    scene.add(temple);
    objects.push(temple);

    // Side temples (smaller)
    const sideTempleLeft = createSmallTemple();
    sideTempleLeft.position.set(-12, 0, -10);
    sideTempleLeft.rotation.y = Math.PI / 4;
    scene.add(sideTempleLeft);

    const sideTempleRight = createSmallTemple();
    sideTempleRight.position.set(12, 0, -10);
    sideTempleRight.rotation.y = -Math.PI / 4;
    scene.add(sideTempleRight);

    // Traditional pots/vessels
    for (let i = 0; i < 6; i++) {
        const pot = createTraditionalPot();
        const angle = (i / 6) * Math.PI * 2;
        const radius = 8;
        pot.position.set(
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius - 5
        );
        scene.add(pot);
    }

    // Boundary walls
    createBoundaryWalls(scene);

    // Trees (simple representation)
    createTrees(scene);

    // Interactive Artifacts
    const gapuraModel = createArtifact(
        'pillar',
        0x8B0000,
        'Gapura Bentar',
        'Gerbang candi khas Majapahit yang terbagi dua, melambangkan gunung yang terbelah sebagai pintu menuju kesucian.',
        '/images/artifacts/gapura bentar.jpg'
    );
    gapuraModel.position.set(0, 1, -12);
    scene.add(gapuraModel);
    objects.push(gapuraModel);

    const gajahmadaStatue = createArtifact(
        'statue',
        0xCD853F,
        'Arca Gajah Mada',
        'Patung Mahapatih agung Majapahit yang terkenal dengan Sumpah Palapa untuk menyatukan Nusantara.',
        '/images/artifacts/arca gajah mada.jpg'
    );
    gajahmadaStatue.position.set(-10, 1.5, 5);
    scene.add(gajahmadaStatue);
    objects.push(gajahmadaStatue);

    const keris = createArtifact(
        'treasure',
        0xFFD700,
        'Keris Pusaka Majapahit',
        'Keris pusaka warisan Majapahit yang dipercaya memiliki kekuatan spiritual dan melambangkan kejayaan kerajaan.',
        '/images/artifacts/keris majapahit.jpeg'
    );
    keris.position.set(10, 1, -5);
    scene.add(keris);
    objects.push(keris);

    // Collectibles
    const coin1 = createCoin(0xFFD700);
    coin1.position.set(-8, 1, -10);
    coin1.userData.collectibleId = 'majapahit_coin1';
    scene.add(coin1);
    objects.push(coin1);

    const coin2 = createCoin(0xFFD700);
    coin2.position.set(12, 1, 8);
    coin2.userData.collectibleId = 'majapahit_coin2';
    scene.add(coin2);
    objects.push(coin2);

    const coin3 = createCoin(0xFFD700);
    coin3.position.set(-10, 1, 12);
    coin3.userData.collectibleId = 'majapahit_coin3';
    scene.add(coin3);
    objects.push(coin3);

    // Exit portal (back to lobby)
    const exitPortal = createExitPortal();
    exitPortal.position.set(0, 1.5, 20);
    exitPortal.userData = {
        type: 'door',
        destination: 'lobby',
        info: '🚪 Tekan E untuk kembali ke Lobby'
    };
    scene.add(exitPortal);
    objects.push(exitPortal);

    // Atmosphere
    scene.fog = new THREE.Fog(0xffaa77, 20, 60);
    scene.background = new THREE.Color(0xffaa77);

    return { objects };
}

function createTempleGate() {
    const group = new THREE.Group();

    // Brick material
    const brickMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        roughness: 0.9,
        metalness: 0.0
    });

    // Left tower
    const leftTower = new THREE.Mesh(
        new THREE.BoxGeometry(3, 8, 2),
        brickMaterial
    );
    leftTower.position.set(-2.5, 4, 0);
    leftTower.castShadow = true;
    leftTower.receiveShadow = true;
    group.add(leftTower);

    // Right tower
    const rightTower = new THREE.Mesh(
        new THREE.BoxGeometry(3, 8, 2),
        brickMaterial
    );
    rightTower.position.set(2.5, 4, 0);
    rightTower.castShadow = true;
    rightTower.receiveShadow = true;
    group.add(rightTower);

    // Decorative tops
    const topMaterial = new THREE.MeshStandardMaterial({
        color: 0xDAA520,
        roughness: 0.5,
        metalness: 0.3
    });

    const leftTop = new THREE.Mesh(
        new THREE.ConeGeometry(1.8, 2, 4),
        topMaterial
    );
    leftTop.position.set(-2.5, 9, 0);
    leftTop.rotation.y = Math.PI / 4;
    group.add(leftTop);

    const rightTop = new THREE.Mesh(
        new THREE.ConeGeometry(1.8, 2, 4),
        topMaterial
    );
    rightTop.position.set(2.5, 9, 0);
    rightTop.rotation.y = Math.PI / 4;
    group.add(rightTop);

    // Base platform
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(8, 0.5, 3),
        brickMaterial
    );
    base.position.y = 0.25;
    base.receiveShadow = true;
    group.add(base);

    // Steps
    for (let i = 0; i < 3; i++) {
        const step = new THREE.Mesh(
            new THREE.BoxGeometry(8, 0.2, 1),
            brickMaterial
        );
        step.position.set(0, i * 0.2, 2 + i * 0.3);
        step.receiveShadow = true;
        group.add(step);
    }

    group.userData.info = '🏛️ Gapura Candi Bentar - Gerbang khas arsitektur Jawa';

    return group;
}

function createSmallTemple() {
    const group = new THREE.Group();

    const material = new THREE.MeshStandardMaterial({
        color: 0x654321,
        roughness: 0.9
    });

    // Base
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.5, 3),
        material
    );
    base.position.y = 0.25;
    base.castShadow = true;
    group.add(base);

    // Body
    const body = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 4, 2.5),
        material
    );
    body.position.y = 2.5;
    body.castShadow = true;
    group.add(body);

    // Roof
    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(2, 2, 4),
        new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.8 })
    );
    roof.position.y = 5.5;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);

    return group;
}

function createTraditionalPot() {
    const group = new THREE.Group();

    const potMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        roughness: 0.7,
        metalness: 0.1
    });

    // Pot body using LatheGeometry for realistic shape
    const points = [];
    for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        const radius = 0.3 + Math.sin(t * Math.PI) * 0.4;
        points.push(new THREE.Vector2(radius, t * 1.5));
    }

    const potGeometry = new THREE.LatheGeometry(points, 16);
    const pot = new THREE.Mesh(potGeometry, potMaterial);
    pot.castShadow = true;
    pot.receiveShadow = true;
    group.add(pot);

    return group;
}

function createBoundaryWalls(scene) {
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x654321,
        roughness: 0.95
    });

    // Back wall
    const backWall = new THREE.Mesh(
        new THREE.BoxGeometry(50, 4, 1),
        wallMaterial
    );
    backWall.position.set(0, 2, -25);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left wall
    const leftWall = new THREE.Mesh(
        new THREE.BoxGeometry(1, 4, 50),
        wallMaterial
    );
    leftWall.position.set(-25, 2, 0);
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(
        new THREE.BoxGeometry(1, 4, 50),
        wallMaterial
    );
    rightWall.position.set(25, 2, 0);
    rightWall.receiveShadow = true;
    scene.add(rightWall);
}

function createTrees(scene) {
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4a2511 });
    const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x2d5016 });

    const positions = [
        [-15, 0, -20], [15, 0, -20],
        [-20, 0, -5], [20, 0, -5],
        [-18, 0, 10], [18, 0, 10]
    ];

    positions.forEach(pos => {
        const tree = new THREE.Group();

        // Trunk
        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.4, 4, 8),
            trunkMaterial
        );
        trunk.position.y = 2;
        trunk.castShadow = true;
        tree.add(trunk);

        // Leaves
        const leaves = new THREE.Mesh(
            new THREE.SphereGeometry(2, 8, 8),
            leavesMaterial
        );
        leaves.position.y = 5;
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