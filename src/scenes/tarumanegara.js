import * as THREE from 'three';
import { createArtifact, createCoin } from '../utils/artifacts.js';
import { createStandardExitPortal, addKingdomCollectibles } from '../utils/sceneHelpers.js';

export function createTarumanegaraScene(scene) {
    const objects = [];

    // Tarumanegara - Ancient West Java with irrigation
    const ambientLight = new THREE.AmbientLight(0xffffdd, 0.6);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffddaa, 1.2);
    sunLight.position.set(20, 30, 10);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Rice field floor - bright green
    const groundGeometry = new THREE.PlaneGeometry(50, 50, 20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x6B8E23,
        roughness: 0.85
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Irrigation canals (Purnawarman's achievement)
    const waterMaterial = new THREE.MeshStandardMaterial({
        color: 0x4682B4,
        roughness: 0.2,
        metalness: 0.6
    });

    // Straight canals in grid pattern
    for (let i = -2; i <= 2; i++) {
        const canal = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 50),
            waterMaterial
        );
        canal.rotation.x = -Math.PI / 2;
        canal.position.set(i * 8, 0.05, 0);
        scene.add(canal);
    }

    // Stone inscription monument (Prasasti Ciaruteun)
    const stone = createInscriptionStone();
    stone.position.set(0, 0, -8);
    scene.add(stone);

    // Ancient temple ruins
    const temple = createSimpleTemple();
    temple.position.set(-10, 0, -15);
    scene.add(temple);

    const temple2 = createSimpleTemple();
    temple2.position.set(10, 0, -15);
    scene.add(temple2);

    // Rice field workers (simple representations)
    for (let i = 0; i < 6; i++) {
        const worker = createWorkerStatue();
        worker.position.set(
            -15 + Math.random() * 10,
            0,
            5 + Math.random() * 10
        );
        scene.add(worker);
    }

    // Palm trees
    createPalmTrees(scene);

    // Interactive Artifacts
    const footprint = createArtifact(
        'inscription',
        0xFFD700,
        'Prasasti Telapak Kaki Purnawarman',
        'Prasasti dengan ukiran telapak kaki gajah dan kaki Raja Purnawarman. Menandakan kekuasaan raja yang setara dengan Dewa Wisnu.',
        '/images/artifacts/prasasti-telapak-kaki-purnawarman.jpeg'
    );
    footprint.position.set(-8, 1, 8);
    scene.add(footprint);
    objects.push(footprint);

    const elephantStatue = createArtifact(
        'statue',
        0xA0826D,
        'Arca Gajah Airawata',
        'Patung gajah suci kendaraan Raja Purnawarman, melambangkan kekuatan dan kemakmuran kerajaan Tarumanegara.',
        '/images/artifacts/arca-gajah.jpeg'
    );
    elephantStatue.position.set(8, 1.5, -8);
    scene.add(elephantStatue);
    objects.push(elephantStatue);

    // Add collectibles
    const coin1 = createCoin(0xFFD700);
    coin1.position.set(-10, 1, -8);
    coin1.userData.collectibleId = 'tarumanegara_coin1';
    scene.add(coin1);
    objects.push(coin1);

    const coin2 = createCoin(0xFFD700);
    coin2.position.set(10, 1, 8);
    coin2.userData.collectibleId = 'tarumanegara_coin2';
    scene.add(coin2);
    objects.push(coin2);

    const coin3 = createCoin(0xFFD700);
    coin3.position.set(-8, 1, 12);
    coin3.userData.collectibleId = 'tarumanegara_coin3';
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

    scene.fog = new THREE.Fog(0xB0E0E6, 20, 60);
    scene.background = new THREE.Color(0xB0E0E6);

    return { objects };
}

function createInscriptionStone() {
    const group = new THREE.Group();

    const stone = new THREE.Mesh(
        new THREE.BoxGeometry(3, 4, 1),
        new THREE.MeshStandardMaterial({ 
            color: 0x696969,
            roughness: 0.95
        })
    );
    stone.position.y = 2;
    stone.castShadow = true;
    group.add(stone);

    // Elephant footprint symbol (famous from Purnawarman)
    const footprint = new THREE.Mesh(
        new THREE.CircleGeometry(0.4, 6),
        new THREE.MeshStandardMaterial({ 
            color: 0x8B4513,
            roughness: 0.8
        })
    );
    footprint.rotation.y = Math.PI / 2;
    footprint.position.set(0.5, 2, 0);
    group.add(footprint);

    return group;
}

function createSimpleTemple() {
    const group = new THREE.Group();

    const base = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.5, 3),
        new THREE.MeshStandardMaterial({ color: 0x8B7355, roughness: 0.9 })
    );
    base.position.y = 0.25;
    base.castShadow = true;
    group.add(base);

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 3, 2.5),
        new THREE.MeshStandardMaterial({ color: 0xA0826D, roughness: 0.85 })
    );
    body.position.y = 2;
    body.castShadow = true;
    group.add(body);

    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(2, 2, 4),
        new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.9 })
    );
    roof.position.y = 4.5;
    roof.rotation.y = Math.PI / 4;
    group.add(roof);

    return group;
}

function createWorkerStatue() {
    const group = new THREE.Group();

    const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 1, 6),
        new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.8 })
    );
    body.position.y = 0.5;
    group.add(body);

    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 6, 6),
        new THREE.MeshStandardMaterial({ color: 0xD2691E, roughness: 0.9 })
    );
    head.position.y = 1.2;
    group.add(head);

    return group;
}

function createPalmTrees(scene) {
    const positions = [
        [18, 0, -18], [18, 0, 18],
        [-18, 0, -18], [-18, 0, 18],
        [15, 0, 0], [-15, 0, 0]
    ];

    positions.forEach(pos => {
        const tree = new THREE.Group();

        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.4, 8, 8),
            new THREE.MeshStandardMaterial({ color: 0x8B6914, roughness: 0.9 })
        );
        trunk.position.y = 4;
        trunk.castShadow = true;
        tree.add(trunk);

        // Palm leaves
        for (let i = 0; i < 6; i++) {
            const leaf = new THREE.Mesh(
                new THREE.BoxGeometry(0.3, 3, 0.1),
                new THREE.MeshStandardMaterial({ color: 0x228B22, roughness: 0.7 })
            );
            const angle = (i / 6) * Math.PI * 2;
            leaf.position.set(
                Math.cos(angle) * 1,
                8,
                Math.sin(angle) * 1
            );
            leaf.rotation.z = Math.PI / 3;
            leaf.rotation.y = angle;
            tree.add(leaf);
        }

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
