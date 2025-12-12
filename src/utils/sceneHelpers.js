// Quick add collectibles and artifacts to all kingdom scenes
import * as THREE from 'three';
import { createArtifact, createCoin } from './artifacts.js';

// Function to add standard collectibles to any kingdom
export function addKingdomCollectibles(scene, objects, kingdomId, positions) {
    const coins = [
        { id: `${kingdomId}_coin1`, pos: positions[0] || [-5, 1, -10] },
        { id: `${kingdomId}_coin2`, pos: positions[1] || [12, 1, 5] },
        { id: `${kingdomId}_coin3`, pos: positions[2] || [-12, 1, -5] }
    ];
    
    coins.forEach(coinData => {
        const coin = createCoin(0xFFD700);
        coin.position.set(coinData.pos[0], coinData.pos[1], coinData.pos[2]);
        coin.userData.collectibleId = coinData.id;
        scene.add(coin);
        objects.push(coin);
    });
}

// Create standard exit portal for all kingdoms
export function createStandardExitPortal(scene, objects, position = [0, 1.5, 20]) {
    const group = new THREE.Group();

    const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0x4169E1,
        emissive: 0x1E3A8A,
        roughness: 0.3,
        metalness: 0.7
    });

    const frameLeft = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 3, 0.3),
        frameMaterial
    );
    frameLeft.position.x = -1.2;
    frameLeft.castShadow = true;
    group.add(frameLeft);

    const frameRight = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 3, 0.3),
        frameMaterial
    );
    frameRight.position.x = 1.2;
    frameRight.castShadow = true;
    group.add(frameRight);

    const frameTop = new THREE.Mesh(
        new THREE.BoxGeometry(2.7, 0.3, 0.3),
        frameMaterial
    );
    frameTop.position.y = 1.35;
    frameTop.castShadow = true;
    group.add(frameTop);

    const portal = new THREE.Mesh(
        new THREE.PlaneGeometry(2.4, 2.7),
        new THREE.MeshBasicMaterial({
            color: 0x6495ED,
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide
        })
    );
    group.add(portal);

    group.position.set(position[0], position[1], position[2]);
    group.userData = {
        type: 'door',
        destination: 'lobby',
        info: '🚪 Kembali ke Lobby'
    };
    
    scene.add(group);
    objects.push(group);
    
    return group;
}
