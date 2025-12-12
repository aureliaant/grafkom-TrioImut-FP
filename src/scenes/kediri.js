import * as THREE from 'three';
import { createArtifact, createCoin } from '../utils/artifacts.js';

export function createKediriScene(scene) {
    const objects = [];

    // Kediri - Prosperous agricultural kingdom
    const ambientLight = new THREE.AmbientLight(0xe6ffe6, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffaa, 1.2);
    sunLight.position.set(18, 30, 12);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Fertile farmland - bright green
    const groundGeometry = new THREE.PlaneGeometry(50, 50, 20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x7CFC00,
        roughness: 0.9
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Raja Jayabaya's palace
    const palace = createKediriPalace();
    palace.position.set(0, 0, -12);
    scene.add(palace);

    // Library/manuscript storage (literary kingdom)
    const library = createLibrary();
    library.position.set(-10, 0, -10);
    scene.add(library);

    const library2 = createLibrary();
    library2.position.set(10, 0, -10);
    scene.add(library2);

    // Spice gardens (rich in spices)
    createSpiceGardens(scene);

    // Book/manuscript monuments
    for (let i = 0; i < 6; i++) {
        const monument = createManuscriptMonument();
        const angle = (i / 6) * Math.PI * 2;
        const radius = 13;
        monument.position.set(
            Math.cos(angle) * radius,
            0,
            Math.sin(angle) * radius
        );
        monument.rotation.y = -angle;
        scene.add(monument);
    }

    // Prosperity symbols (golden harvest)
    createHarvestSymbols(scene);

    // Interactive Artifacts
    const manuscript = createArtifact(
        'inscription',
        0xFFD700,
        'Kitab Bharatayuddha',
        'Karya sastra klasik karya Mpu Sedah dan Mpu Panuluh yang menceritakan perang Bharata dari Mahabharata.',
        '/images/artifacts/kitab-barathayudha.jpg'
    );
    manuscript.position.set(-8, 1, 5);
    scene.add(manuscript);
    objects.push(manuscript);

    const spiceChest = createArtifact(
        'treasure',
        0x8B4513,
        'Peti Rempah-Rempah',
        'Kediri terkenal sebagai penghasil rempah-rempah berkualitas tinggi yang diperdagangkan hingga ke negeri Tiongkok.',
        '/images/artifacts/peti-rempah-rempah-kediri.webp'
    );
    spiceChest.position.set(10, 1, -8);
    scene.add(spiceChest);
    objects.push(spiceChest);

    // Collectibles
    const coin1 = createCoin(0xFFD700);
    coin1.position.set(-10, 1, -8);
    coin1.userData.collectibleId = 'kediri_coin1';
    scene.add(coin1);
    objects.push(coin1);

    const coin2 = createCoin(0xFFD700);
    coin2.position.set(12, 1, 10);
    coin2.userData.collectibleId = 'kediri_coin2';
    scene.add(coin2);
    objects.push(coin2);

    const coin3 = createCoin(0xFFD700);
    coin3.position.set(-8, 1, 12);
    coin3.userData.collectibleId = 'kediri_coin3';
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

    scene.fog = new THREE.Fog(0xF0FFF0, 20, 60);
    scene.background = new THREE.Color(0xF0FFF0);

    return { objects };
}

function createKediriPalace() {
    const group = new THREE.Group();

    // Main platform
    const platform = new THREE.Mesh(
        new THREE.BoxGeometry(10, 0.8, 8),
        new THREE.MeshStandardMaterial({ color: 0x8B7355, roughness: 0.9 })
    );
    platform.position.y = 0.4;
    platform.castShadow = true;
    group.add(platform);

    // Palace building
    const building = new THREE.Mesh(
        new THREE.BoxGeometry(8, 5, 6),
        new THREE.MeshStandardMaterial({ color: 0xDAA520, roughness: 0.7 })
    );
    building.position.y = 3.3;
    building.castShadow = true;
    group.add(building);

    // Roof (joglo style - simplified)
    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(5, 2, 4),
        new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.9 })
    );
    roof.position.y = 6.8;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    group.add(roof);

    // Golden crown ornament
    const crown = new THREE.Mesh(
        new THREE.ConeGeometry(1, 1.5, 8),
        new THREE.MeshStandardMaterial({ 
            color: 0xFFD700,
            roughness: 0.3,
            metalness: 0.9
        })
    );
    crown.position.y = 8.5;
    group.add(crown);

    // Front pillars
    for (let i = -1; i <= 1; i++) {
        const pillar = new THREE.Mesh(
            new THREE.CylinderGeometry(0.3, 0.3, 4, 8),
            new THREE.MeshStandardMaterial({ color: 0xCD853F, roughness: 0.8 })
        );
        pillar.position.set(i * 2.5, 2.8, 3.5);
        pillar.castShadow = true;
        group.add(pillar);
    }

    return group;
}

function createLibrary() {
    const group = new THREE.Group();

    const building = new THREE.Mesh(
        new THREE.BoxGeometry(3, 3, 3),
        new THREE.MeshStandardMaterial({ color: 0x8B6914, roughness: 0.85 })
    );
    building.position.y = 1.5;
    building.castShadow = true;
    group.add(building);

    // Roof
    const roof = new THREE.Mesh(
        new THREE.ConeGeometry(2.5, 1.5, 4),
        new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.9 })
    );
    roof.position.y = 3.75;
    roof.rotation.y = Math.PI / 4;
    group.add(roof);

    // Book shelves (visible through window - symbolic)
    for (let i = 0; i < 3; i++) {
        const shelf = new THREE.Mesh(
            new THREE.BoxGeometry(0.3, 2, 2),
            new THREE.MeshStandardMaterial({ color: 0xA0522D, roughness: 0.9 })
        );
        shelf.position.set(1.6, 1.5, -0.8 + i * 0.8);
        group.add(shelf);
    }

    return group;
}

function createManuscriptMonument() {
    const group = new THREE.Group();

    // Stone tablet/book shape
    const tablet = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 2, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x696969, roughness: 0.95 })
    );
    tablet.position.y = 1.5;
    tablet.castShadow = true;
    group.add(tablet);

    // Decorative border
    const border = new THREE.Mesh(
        new THREE.BoxGeometry(1.7, 2.2, 0.1),
        new THREE.MeshStandardMaterial({ 
            color: 0xFFD700,
            roughness: 0.4,
            metalness: 0.8
        })
    );
    border.position.set(0, 1.5, 0.2);
    group.add(border);

    // Base
    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 1, 0.5, 8),
        new THREE.MeshStandardMaterial({ color: 0x8B7355, roughness: 0.9 })
    );
    base.position.y = 0.25;
    base.castShadow = true;
    group.add(base);

    return group;
}

function createSpiceGardens(scene) {
    const colors = [
        0xFF6347, // Red pepper
        0xFFD700, // Turmeric
        0x8B4513, // Cinnamon
        0x228B22, // Green herbs
        0xFFA500  // Nutmeg
    ];

    for (let i = 0; i < 20; i++) {
        const garden = new THREE.Group();

        const plot = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 0.2, 1.5),
            new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.95 })
        );
        plot.position.y = 0.1;
        garden.add(plot);

        // Plants
        for (let j = 0; j < 4; j++) {
            const plant = new THREE.Mesh(
                new THREE.SphereGeometry(0.15, 6, 6),
                new THREE.MeshStandardMaterial({ 
                    color: colors[i % colors.length],
                    roughness: 0.7
                })
            );
            plant.position.set(
                -0.4 + (j % 2) * 0.8,
                0.3,
                -0.4 + Math.floor(j / 2) * 0.8
            );
            garden.add(plant);
        }

        garden.position.set(
            -15 + (i % 5) * 7,
            0,
            5 + Math.floor(i / 5) * 4
        );
        scene.add(garden);
    }
}

function createHarvestSymbols(scene) {
    // Golden rice bundles
    for (let i = 0; i < 8; i++) {
        const bundle = new THREE.Group();

        const stem = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 1.5, 6),
            new THREE.MeshStandardMaterial({ color: 0xDAA520, roughness: 0.8 })
        );
        stem.position.y = 0.75;
        bundle.add(stem);

        const grains = new THREE.Mesh(
            new THREE.SphereGeometry(0.25, 8, 8),
            new THREE.MeshStandardMaterial({ 
                color: 0xFFD700,
                roughness: 0.6
            })
        );
        grains.position.y = 1.6;
        bundle.add(grains);

        const angle = (i / 8) * Math.PI * 2;
        bundle.position.set(
            Math.cos(angle) * 8,
            0,
            Math.sin(angle) * 8
        );
        scene.add(bundle);
    }
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
