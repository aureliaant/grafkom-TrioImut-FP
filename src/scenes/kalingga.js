import * as THREE from 'three';
import { createArtifact, createCoin } from '../utils/artifacts.js';

export function createKalinggaScene(scene) {
    const objects = [];

    // Kalingga - Ratu Shima's just kingdom
    const ambientLight = new THREE.AmbientLight(0xffe6f0, 0.7);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffccee, 1.1);
    sunLight.position.set(18, 28, 12);
    sunLight.castShadow = true;
    scene.add(sunLight);

    // Royal courtyard floor - purple tint (royal color)
    const groundGeometry = new THREE.PlaneGeometry(50, 50, 20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x9370DB,
        roughness: 0.9
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Justice Scale Monument (symbol of Ratu Shima's justice)
    const justiceMonument = createJusticeScale();
    justiceMonument.position.set(0, 0, -10);
    scene.add(justiceMonument);

    // Royal throne platform
    const throne = createThrone();
    throne.position.set(0, 0, -15);
    scene.add(throne);

    // Law pillars around courtyard
    const pillarMaterial = new THREE.MeshStandardMaterial({
        color: 0xDDA0DD,
        roughness: 0.7,
        metalness: 0.3
    });

    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 12;
        
        const pillar = new THREE.Mesh(
            new THREE.CylinderGeometry(0.4, 0.5, 5, 8),
            pillarMaterial
        );
        pillar.position.set(
            Math.cos(angle) * radius,
            2.5,
            Math.sin(angle) * radius
        );
        pillar.castShadow = true;
        scene.add(pillar);

        // Golden cap
        const cap = new THREE.Mesh(
            new THREE.ConeGeometry(0.6, 0.8, 8),
            new THREE.MeshStandardMaterial({ 
                color: 0xFFD700,
                roughness: 0.3,
                metalness: 0.9
            })
        );
        cap.position.set(
            Math.cos(angle) * radius,
            5.4,
            Math.sin(angle) * radius
        );
        scene.add(cap);
    }

    // Garden elements
    createGarden(scene);

    // Interactive Artifacts
    const scaleStatue = createArtifact(
        'statue',
        0xFFD700,
        'Timbangan Keadilan Ratu Shima',
        'Patung timbangan keadilan yang melambangkan hukum adil Ratu Shima. Pencuri akan dipotong tangannya tanpa pandang bulu.',
        '/images/artifacts/ratu-sima.png'
    );
    scaleStatue.position.set(0, 1.5, -8);
    scene.add(scaleStatue);
    objects.push(scaleStatue);

    const inscription = createArtifact(
        'inscription',
        0xCD853F,
        'Prasasti Tuk Mas',
        'Prasasti peninggalan Kerajaan Kalingga yang menceritakan tentang sistem pemerintahan yang sangat jujur dan adil.',
        '/images/artifacts/prasasti-tuk-mas.png'
    );
    inscription.position.set(-10, 1, 5);
    scene.add(inscription);
    objects.push(inscription);

    // Collectibles
    const coin1 = createCoin(0xFFD700);
    coin1.position.set(-8, 1, -10);
    coin1.userData.collectibleId = 'kalingga_coin1';
    scene.add(coin1);
    objects.push(coin1);

    const coin2 = createCoin(0xFFD700);
    coin2.position.set(10, 1, 8);
    coin2.userData.collectibleId = 'kalingga_coin2';
    scene.add(coin2);
    objects.push(coin2);

    const coin3 = createCoin(0xFFD700);
    coin3.position.set(-12, 1, -5);
    coin3.userData.collectibleId = 'kalingga_coin3';
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

    scene.fog = new THREE.Fog(0xE6E6FA, 20, 55);
    scene.background = new THREE.Color(0xE6E6FA);

    return { objects };
}

function createJusticeScale() {
    const group = new THREE.Group();

    // Base pedestal
    const base = new THREE.Mesh(
        new THREE.CylinderGeometry(1.5, 2, 1, 8),
        new THREE.MeshStandardMaterial({ color: 0x8B008B, roughness: 0.8 })
    );
    base.position.y = 0.5;
    base.castShadow = true;
    group.add(base);

    // Central pole
    const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 4, 8),
        new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.4, metalness: 0.8 })
    );
    pole.position.y = 3;
    pole.castShadow = true;
    group.add(pole);

    // Crossbeam
    const beam = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.2, 0.2),
        new THREE.MeshStandardMaterial({ color: 0xFFD700, roughness: 0.4, metalness: 0.8 })
    );
    beam.position.y = 5;
    group.add(beam);

    // Scale plates
    const plateMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xC0C0C0,
        roughness: 0.3,
        metalness: 0.9
    });

    const leftPlate = new THREE.Mesh(
        new THREE.CylinderGeometry(0.6, 0.6, 0.1, 16),
        plateMaterial
    );
    leftPlate.position.set(-1.3, 4.5, 0);
    group.add(leftPlate);

    const rightPlate = new THREE.Mesh(
        new THREE.CylinderGeometry(0.6, 0.6, 0.1, 16),
        plateMaterial
    );
    rightPlate.position.set(1.3, 4.5, 0);
    group.add(rightPlate);

    return group;
}

function createThrone() {
    const group = new THREE.Group();

    // Platform
    const platform = new THREE.Mesh(
        new THREE.BoxGeometry(4, 0.8, 4),
        new THREE.MeshStandardMaterial({ color: 0x9932CC, roughness: 0.8 })
    );
    platform.position.y = 0.4;
    platform.castShadow = true;
    group.add(platform);

    // Throne seat
    const seat = new THREE.Mesh(
        new THREE.BoxGeometry(2, 0.5, 2),
        new THREE.MeshStandardMaterial({ color: 0xDA70D6, roughness: 0.6 })
    );
    seat.position.y = 1.15;
    seat.castShadow = true;
    group.add(seat);

    // Backrest
    const backrest = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2.5, 0.3),
        new THREE.MeshStandardMaterial({ color: 0xBA55D3, roughness: 0.6 })
    );
    backrest.position.set(0, 2.15, -0.85);
    backrest.castShadow = true;
    group.add(backrest);

    // Crown decoration on top
    const crown = new THREE.Mesh(
        new THREE.ConeGeometry(0.8, 1, 8),
        new THREE.MeshStandardMaterial({ 
            color: 0xFFD700,
            roughness: 0.3,
            metalness: 0.9
        })
    );
    crown.position.set(0, 3.9, -0.85);
    group.add(crown);

    return group;
}

function createGarden(scene) {
    // Flower beds
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 8;
        
        const flowerBed = new THREE.Mesh(
            new THREE.CylinderGeometry(0.8, 0.8, 0.3, 8),
            new THREE.MeshStandardMaterial({ color: 0xFF69B4, roughness: 0.8 })
        );
        flowerBed.position.set(
            Math.cos(angle) * radius,
            0.15,
            Math.sin(angle) * radius
        );
        scene.add(flowerBed);

        // Flower
        const flower = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 8, 8),
            new THREE.MeshStandardMaterial({ 
                color: [0xFF1493, 0xFFB6C1, 0xFFC0CB][i % 3],
                roughness: 0.6
            })
        );
        flower.position.set(
            Math.cos(angle) * radius,
            0.5,
            Math.sin(angle) * radius
        );
        scene.add(flower);
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
