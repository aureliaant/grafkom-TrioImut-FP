import * as THREE from 'three';
import { createArtifact, createCoin } from '../utils/artifacts.js';

export function createSriwijayaScene(scene) {
    const objects = [];

    // Sriwijaya - Maritime kingdom with harbor
    const ambientLight = new THREE.AmbientLight(0xaaddff, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffaa, 1.3);
    sunLight.position.set(25, 35, 15);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Ocean/harbor ground - blue water
    const waterGeometry = new THREE.PlaneGeometry(60, 60, 30, 30);
    const waterMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1E90FF,
        roughness: 0.2,
        metalness: 0.7
    });
    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.receiveShadow = true;
    scene.add(water);

    // Animate water
    const waterVertices = waterGeometry.attributes.position;
    for (let i = 0; i < waterVertices.count; i++) {
        waterVertices.setZ(i, Math.sin(i * 0.5) * 0.1);
    }
    waterGeometry.computeVertexNormals();

    // Main dock/pier
    const dockMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B7355,
        roughness: 0.9
    });

    const mainDock = new THREE.Mesh(
        new THREE.BoxGeometry(20, 0.5, 4),
        dockMaterial
    );
    mainDock.position.set(0, 0.5, 0);
    mainDock.castShadow = true;
    scene.add(mainDock);

    // Side docks
    for (let i = -1; i <= 1; i++) {
        if (i === 0) continue;
        const sideDock = new THREE.Mesh(
            new THREE.BoxGeometry(3, 0.5, 15),
            dockMaterial
        );
        sideDock.position.set(i * 8, 0.5, 5);
        sideDock.castShadow = true;
        scene.add(sideDock);
    }

    // Trading ships
    for (let i = 0; i < 4; i++) {
        const ship = createTradingShip();
        ship.position.set(
            -10 + i * 7,
            0.3,
            8 + (i % 2) * 5
        );
        ship.rotation.y = Math.PI / 6 * (i % 2 === 0 ? 1 : -1);
        scene.add(ship);
    }

    // Buddhist stupa (Sriwijaya was Buddhist center)
    const stupa = createBuddhistStupa();
    stupa.position.set(0, 0.5, -10);
    scene.add(stupa);

    // Warehouses
    for (let i = -1; i <= 1; i++) {
        const warehouse = createWarehouse();
        warehouse.position.set(i * 7, 0.5, -5);
        scene.add(warehouse);
    }

    // Merchant statues
    for (let i = 0; i < 6; i++) {
        const merchant = createMerchant();
        merchant.position.set(
            -8 + i * 3,
            0.5,
            -1
        );
        scene.add(merchant);
    }

    // Interactive Artifacts
    const shipModel = createArtifact(
        'treasure',
        0x8B4513,
        'Model Kapal Dagang Sriwijaya',
        'Miniatur kapal dagang besar yang digunakan Sriwijaya untuk menguasai jalur perdagangan maritim Nusantara dan Asia Tenggara.',
        '/images/artifacts/kapal dagang sriwijaya.jpeg'
    );
    shipModel.position.set(-10, 1, 5);
    scene.add(shipModel);
    objects.push(shipModel);

    const inscription = createArtifact(
        'inscription',
        0xFFD700,
        'Prasasti Kedukan Bukit',
        'Prasasti tertua Sriwijaya (683 M) yang menceritakan perjalanan Raja Dapunta Hyang dalam menaklukkan wilayah.',
        '/images/artifacts/prasasti kedukan bukit.jpeg'
    );
    inscription.position.set(10, 1, -8);
    scene.add(inscription);
    objects.push(inscription);

    // Collectibles
    const coin1 = createCoin(0xFFD700);
    coin1.position.set(-12, 1, -8);
    coin1.userData.collectibleId = 'sriwijaya_coin1';
    scene.add(coin1);
    objects.push(coin1);

    const coin2 = createCoin(0xFFD700);
    coin2.position.set(12, 1, 10);
    coin2.userData.collectibleId = 'sriwijaya_coin2';
    scene.add(coin2);
    objects.push(coin2);

    const coin3 = createCoin(0xFFD700);
    coin3.position.set(-8, 1, 12);
    coin3.userData.collectibleId = 'sriwijaya_coin3';
    scene.add(coin3);
    objects.push(coin3);

    // Exit portal
    const exitPortal = createExitPortal();
    exitPortal.position.set(0, 2, 20);
    exitPortal.userData = {
        type: 'door',
        destination: 'lobby',
        info: '🚪 Kembali ke Lobby'
    };
    scene.add(exitPortal);
    objects.push(exitPortal);

    scene.fog = new THREE.Fog(0x87CEEB, 25, 70);
    scene.background = new THREE.Color(0x87CEEB);

    return { objects };
}

function createTradingShip() {
    const group = new THREE.Group();

    const shipMaterial = new THREE.MeshStandardMaterial({
        color: 0x654321,
        roughness: 0.8
    });

    // Hull
    const hull = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.8, 1.5),
        shipMaterial
    );
    hull.castShadow = true;
    group.add(hull);

    // Deck
    const deck = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.2, 1.3),
        new THREE.MeshStandardMaterial({ color: 0x8B7355, roughness: 0.9 })
    );
    deck.position.y = 0.5;
    group.add(deck);

    // Mast
    const mast = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 3, 8),
        new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.9 })
    );
    mast.position.y = 2;
    group.add(mast);

    // Sail
    const sail = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 2),
        new THREE.MeshStandardMaterial({ 
            color: 0xF5DEB3,
            side: THREE.DoubleSide,
            roughness: 0.8
        })
    );
    sail.position.set(0, 2, 0.3);
    group.add(sail);

    return group;
}

function createBuddhistStupa() {
    const group = new THREE.Group();

    // Base platform
    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(3, 3.5, 1, 8),
        new THREE.MeshStandardMaterial({ color: 0xD2B48C, roughness: 0.9 })
    );
    base.position.y = 0.5;
    base.castShadow = true;
    group.add(base);

    // Dome
    const dome = new THREE.Mesh(
        new THREE.SphereGeometry(2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: 0xC4A777, roughness: 0.85 })
    );
    dome.position.y = 1;
    dome.castShadow = true;
    group.add(dome);

    // Spire
    const spire = new THREE.Mesh(
        new THREE.ConeGeometry(0.5, 3, 8),
        new THREE.MeshStandardMaterial({ 
            color: 0xFFD700,
            roughness: 0.4,
            metalness: 0.8
        })
    );
    spire.position.y = 4;
    group.add(spire);

    return group;
}

function createWarehouse() {
    const group = new THREE.Group();

    const warehouse = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 2.5, 3),
        new THREE.MeshStandardMaterial({ color: 0x8B6914, roughness: 0.9 })
    );
    warehouse.position.y = 1.25;
    warehouse.castShadow = true;
    group.add(warehouse);

    // Roof
    const roof = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.5, 3.5),
        new THREE.MeshStandardMaterial({ color: 0x654321, roughness: 0.95 })
    );
    roof.position.y = 2.75;
    roof.castShadow = true;
    group.add(roof);

    return group;
}

function createMerchant() {
    const group = new THREE.Group();

    const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.25, 1.2, 8),
        new THREE.MeshStandardMaterial({ color: 0xFF6347, roughness: 0.8 })
    );
    body.position.y = 0.6;
    group.add(body);

    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 8, 8),
        new THREE.MeshStandardMaterial({ color: 0xD2691E, roughness: 0.9 })
    );
    head.position.y = 1.4;
    group.add(head);

    // Cargo box
    const box = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.3, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.9 })
    );
    box.position.set(0.3, 0.5, 0);
    group.add(box);

    return group;
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
