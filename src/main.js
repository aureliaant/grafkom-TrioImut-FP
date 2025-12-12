import * as THREE from 'three';
import { createLobbyScene } from './scenes/lobby.js';
import { createKutaiScene } from './scenes/kutai.js';
import { createTarumanegaraScene } from './scenes/tarumanegara.js';
import { createKalinggaScene } from './scenes/kalingga.js';
import { createSriwijayaScene } from './scenes/sriwijaya.js';
import { createMataramScene } from './scenes/mataram.js';
import { createSailendraScene } from './scenes/sailendra.js';
import { createKediriScene } from './scenes/kediri.js';
import { createMajapahitScene } from './scenes/majapahit.js';
import { getKingdomData } from './data/kingdoms.js';
import { collectItem, getCollectiblesStats, getKingdomCollectibles, isCollected } from './utils/collectibles.js';

// State Management
const APP_STATE = {
    LOBBY: 'lobby',
    KUTAI: 'kutai',
    TARUMANEGARA: 'tarumanegara',
    KALINGGA: 'kalingga',
    SRIWIJAYA: 'sriwijaya',
    MATARAM: 'mataram',
    SAILENDRA: 'sailendra',
    KEDIRI: 'kediri',
    MAJAPAHIT: 'majapahit'
};

let currentState = APP_STATE.LOBBY;
let scene, camera, renderer;
let raycaster, mouse;
let player, playerVelocity;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let interactiveObjects = [];
let hoveredObject = null;
let currentKingdom = null;
let quizAnswered = false;

// Camera settings for 3rd person (GTA style)
let cameraDistance = 6;
let cameraHeight = 3;
let cameraAngleHorizontal = 0; // Horizontal orbit angle
let cameraAngleVertical = 0.3; // Vertical angle (slightly above)
const PLAYER_SPEED = 0.05; // Slower movement
const CAMERA_ROTATION_SPEED = 0.003;

// Shift Lock (Roblox style)
let shiftLockEnabled = false;
let shiftLockIcon = null;

// Initialize
init();
animate();

function init() {
    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 0, 50);

    // Camera (3rd Person)
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Create Player (simple capsule for now)
    createPlayer();

    // Raycaster for interaction
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2(0, 0); // Center of screen

    // Keyboard & Mouse controls
    setupControls();

    // Load initial scene
    loadScene(APP_STATE.LOBBY);

    // UI Events
    setupUI();

    // Window resize
    window.addEventListener('resize', onWindowResize);

    // Hide loading
    document.getElementById('loading').classList.add('hidden');
}

function createPlayer() {
    player = new THREE.Group();
    
    // Materials
    const skinMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFFDBAC,
        roughness: 0.8
    });
    const shirtMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x4169E1,
        roughness: 0.7,
        metalness: 0.3
    });
    const pantsMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2C3E50,
        roughness: 0.8
    });
    const shoesMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x1C1C1C,
        roughness: 0.9
    });

    // Head
    const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 16, 16),
        skinMaterial
    );
    head.position.y = 1.5;
    head.castShadow = true;
    player.add(head);

    // Eyes
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const leftEye = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 8, 8),
        eyeMaterial
    );
    leftEye.position.set(-0.08, 1.55, 0.2);
    player.add(leftEye);
    
    const rightEye = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 8, 8),
        eyeMaterial
    );
    rightEye.position.set(0.08, 1.55, 0.2);
    player.add(rightEye);

    // Torso
    const torso = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.7, 0.3),
        shirtMaterial
    );
    torso.position.y = 0.85;
    torso.castShadow = true;
    player.add(torso);

    // Arms (will be animated)
    const armGeometry = new THREE.BoxGeometry(0.15, 0.6, 0.15);
    
    const leftArm = new THREE.Group();
    const leftArmMesh = new THREE.Mesh(armGeometry, shirtMaterial);
    leftArmMesh.position.y = -0.3;
    leftArmMesh.castShadow = true;
    leftArm.add(leftArmMesh);
    leftArm.position.set(-0.325, 1.05, 0);
    player.add(leftArm);
    player.userData.leftArm = leftArm;

    const rightArm = new THREE.Group();
    const rightArmMesh = new THREE.Mesh(armGeometry, shirtMaterial);
    rightArmMesh.position.y = -0.3;
    rightArmMesh.castShadow = true;
    rightArm.add(rightArmMesh);
    rightArm.position.set(0.325, 1.05, 0);
    player.add(rightArm);
    player.userData.rightArm = rightArm;

    // Legs (will be animated)
    const legGeometry = new THREE.BoxGeometry(0.2, 0.6, 0.2);
    
    const leftLeg = new THREE.Group();
    const leftLegMesh = new THREE.Mesh(legGeometry, pantsMaterial);
    leftLegMesh.position.y = -0.3;
    leftLegMesh.castShadow = true;
    leftLeg.add(leftLegMesh);
    leftLeg.position.set(-0.15, 0.5, 0);
    player.add(leftLeg);
    player.userData.leftLeg = leftLeg;

    const rightLeg = new THREE.Group();
    const rightLegMesh = new THREE.Mesh(legGeometry, pantsMaterial);
    rightLegMesh.position.y = -0.3;
    rightLegMesh.castShadow = true;
    rightLeg.add(rightLegMesh);
    rightLeg.position.set(0.15, 0.5, 0);
    player.add(rightLeg);
    player.userData.rightLeg = rightLeg;

    // Shoes
    const leftShoe = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.1, 0.3),
        shoesMaterial
    );
    leftShoe.position.set(-0.15, 0.05, 0.05);
    leftShoe.castShadow = true;
    player.add(leftShoe);

    const rightShoe = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.1, 0.3),
        shoesMaterial
    );
    rightShoe.position.set(0.15, 0.05, 0.05);
    rightShoe.castShadow = true;
    player.add(rightShoe);

    // Direction indicator crown
    const crown = new THREE.Mesh(
        new THREE.ConeGeometry(0.15, 0.2, 6),
        new THREE.MeshStandardMaterial({ 
            color: 0xFFD700,
            emissive: 0xFFD700,
            emissiveIntensity: 0.3
        })
    );
    crown.position.y = 1.85;
    crown.castShadow = true;
    player.add(crown);

    // Animation state
    player.userData.walkCycle = 0;
    player.userData.isWalking = false;

    player.position.set(0, 0, 5);
    playerVelocity = new THREE.Vector3();
    
    scene.add(player);
}

function setupControls() {
    const onKeyDown = (event) => {
        switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
                moveForward = true;
                break;
            case 'KeyS':
            case 'ArrowDown':
                moveBackward = true;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                moveLeft = true;
                break;
            case 'KeyD':
            case 'ArrowRight':
                moveRight = true;
                break;
            case 'KeyE':
            case 'Space':
                if (hoveredObject && hoveredObject.userData.type === 'door') {
                    enterDoor(hoveredObject.userData.destination);
                }
                break;
        }
    };

    const onKeyUp = (event) => {
        switch (event.code) {
            case 'KeyW':
            case 'ArrowUp':
                moveForward = false;
                break;
            case 'KeyS':
            case 'ArrowDown':
                moveBackward = false;
                break;
            case 'KeyA':
            case 'ArrowLeft':
                moveLeft = false;
                break;
            case 'KeyD':
            case 'ArrowRight':
                moveRight = false;
                break;
        }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // Mouse controls for camera orbit (GTA style)
    let previousMouseX = window.innerWidth / 2;
    let previousMouseY = window.innerHeight / 2;
    let isMouseMoving = false;

    document.addEventListener('mousemove', (event) => {
        const deltaX = event.clientX - previousMouseX;
        const deltaY = event.clientY - previousMouseY;
        
        // Only update camera if mouse actually moved (prevent drift)
        if (Math.abs(deltaX) > 0.1 || Math.abs(deltaY) > 0.1) {
            // Rotate camera around player
            cameraAngleHorizontal -= deltaX * CAMERA_ROTATION_SPEED;
            cameraAngleVertical -= deltaY * CAMERA_ROTATION_SPEED;
            
            // Clamp vertical angle (prevent looking too far up/down)
            cameraAngleVertical = Math.max(-Math.PI / 6, Math.min(Math.PI / 3, cameraAngleVertical));
        }
        
        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
    });

    // Click for interaction
    document.addEventListener('click', () => {
        if (hoveredObject) {
            console.log('Clicked object userData:', hoveredObject.userData);
            if (hoveredObject.userData.type === 'door') {
                console.log('Door clicked, destination:', hoveredObject.userData.destination);
                enterDoor(hoveredObject.userData.destination);
            } else if (hoveredObject.userData.type === 'artifact') {
                showArtifactInfo(hoveredObject.userData);
            } else if (hoveredObject.userData.type === 'collectible') {
                collectObjective(hoveredObject);
            }
        }
    });
}

function setupUI() {
    // Close Kingdom Info
    document.getElementById('close-info').addEventListener('click', () => {
        document.getElementById('kingdom-info').classList.remove('show');
    });

    // Start Quiz
    document.getElementById('start-quiz').addEventListener('click', () => {
        document.getElementById('kingdom-info').classList.remove('show');
        if (currentKingdom) {
            showQuiz(currentKingdom);
        }
    });

    // Close Quiz
    document.getElementById('close-quiz').addEventListener('click', () => {
        document.getElementById('quiz-panel').classList.remove('show');
    });

    // Close Artifact Panel
    document.getElementById('close-artifact').addEventListener('click', () => {
        document.getElementById('artifact-panel').classList.remove('show');
    });
    
    // Initialize collectibles HUD
    updateCollectiblesHUD();
}

function loadScene(state) {
    console.log('loadScene called with state:', state, 'APP_STATE.LOBBY:', APP_STATE.LOBBY);
    // Clear current scene (except player)
    clearScene();

    currentState = state;
    quizAnswered = false;

    if (state === APP_STATE.LOBBY) {
        console.log('Loading lobby scene...');
        const { objects } = createLobbyScene(scene);
        interactiveObjects = objects;
        player.position.set(0, 0, 5);
        currentKingdom = null;
    } else if (state === APP_STATE.KUTAI) {
        const { objects } = createKutaiScene(scene);
        interactiveObjects = objects;
        player.position.set(0, 0, 10);
        currentKingdom = getKingdomData('kutai');
        showKingdomInfo(currentKingdom);
    } else if (state === APP_STATE.TARUMANEGARA) {
        const { objects } = createTarumanegaraScene(scene);
        interactiveObjects = objects;
        player.position.set(0, 0, 10);
        currentKingdom = getKingdomData('tarumanegara');
        showKingdomInfo(currentKingdom);
    } else if (state === APP_STATE.KALINGGA) {
        const { objects } = createKalinggaScene(scene);
        interactiveObjects = objects;
        player.position.set(0, 0, 10);
        currentKingdom = getKingdomData('kalingga');
        showKingdomInfo(currentKingdom);
    } else if (state === APP_STATE.SRIWIJAYA) {
        const { objects } = createSriwijayaScene(scene);
        interactiveObjects = objects;
        player.position.set(0, 0, 12);
        currentKingdom = getKingdomData('sriwijaya');
        showKingdomInfo(currentKingdom);
    } else if (state === APP_STATE.MATARAM) {
        const { objects } = createMataramScene(scene);
        interactiveObjects = objects;
        player.position.set(0, 0, 12);
        currentKingdom = getKingdomData('mataram');
        showKingdomInfo(currentKingdom);
    } else if (state === APP_STATE.SAILENDRA) {
        const { objects } = createSailendraScene(scene);
        interactiveObjects = objects;
        player.position.set(0, 0, 14);
        currentKingdom = getKingdomData('sailendra');
        showKingdomInfo(currentKingdom);
    } else if (state === APP_STATE.KEDIRI) {
        const { objects } = createKediriScene(scene);
        interactiveObjects = objects;
        player.position.set(0, 0, 10);
        currentKingdom = getKingdomData('kediri');
        showKingdomInfo(currentKingdom);
    } else if (state === APP_STATE.MAJAPAHIT) {
        const { objects } = createMajapahitScene(scene);
        interactiveObjects = objects;
        player.position.set(0, 0, 10);
        currentKingdom = getKingdomData('majapahit');
        showKingdomInfo(currentKingdom);
    }

    // Add player back to scene
    if (!scene.children.includes(player)) {
        scene.add(player);
    }
    
    // Update collectibles HUD for new scene
    updateCollectiblesHUD();
    
    // Remove collected items from scene
    removeCollectedItems();
}

function clearScene() {
    const objectsToRemove = [];
    scene.children.forEach(child => {
        if (child !== player) {
            objectsToRemove.push(child);
        }
    });

    objectsToRemove.forEach(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach(mat => mat.dispose());
            } else {
                object.material.dispose();
            }
        }
        scene.remove(object);
    });

    interactiveObjects = [];
    hoveredObject = null;
}

function toggleShiftLock() {
    shiftLockEnabled = !shiftLockEnabled;
    
    // Update UI indicator
    const indicator = document.getElementById('shift-lock-indicator');
    if (shiftLockEnabled) {
        indicator.classList.add('active');
        indicator.textContent = '🔒 Shift Lock: ON';
        
        // Lock cursor style
        document.body.style.cursor = 'crosshair';
    } else {
        indicator.classList.remove('active');
        indicator.textContent = '🔓 Shift Lock: OFF (Press Shift)';
        
        // Restore cursor
        document.body.style.cursor = 'default';
    }
}

function enterDoor(destination) {
    console.log('Entering door with destination:', destination);
    const overlay = document.getElementById('transition-overlay');
    
    // Fade to black
    overlay.classList.add('active');
    
    setTimeout(() => {
        console.log('Loading scene:', destination);
        loadScene(destination);
        
        // Fade from black
        setTimeout(() => {
            overlay.classList.remove('active');
        }, 100);
    }, 800);
}

function showKingdomInfo(kingdomData) {
    if (!kingdomData) return;

    document.getElementById('kingdom-name').textContent = kingdomData.name;
    document.getElementById('kingdom-period').textContent = `📅 ${kingdomData.period}`;
    document.getElementById('kingdom-location').textContent = `📍 ${kingdomData.location}`;
    document.getElementById('kingdom-description').textContent = kingdomData.description;
    document.getElementById('kingdom-funfact').textContent = kingdomData.funFact;
    
    document.getElementById('kingdom-info').classList.add('show');
}

function showQuiz(kingdomData) {
    if (!kingdomData || !kingdomData.quiz) return;

    const quiz = kingdomData.quiz;
    quizAnswered = false;

    document.getElementById('quiz-question').textContent = quiz.question;
    
    const optionsContainer = document.getElementById('quiz-options');
    optionsContainer.innerHTML = '';

    quiz.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
        optionDiv.onclick = () => checkAnswer(index, quiz.correct, quiz.explanation);
        optionsContainer.appendChild(optionDiv);
    });

    document.getElementById('quiz-explanation').classList.remove('show');
    document.getElementById('close-quiz').style.display = 'none';
    document.getElementById('quiz-panel').classList.add('show');
}

function checkAnswer(selectedIndex, correctIndex, explanation) {
    if (quizAnswered) return;
    quizAnswered = true;

    const options = document.querySelectorAll('#quiz-options .option');
    
    options.forEach((option, index) => {
        option.style.pointerEvents = 'none';
        if (index === correctIndex) {
            option.classList.add('correct');
        } else if (index === selectedIndex) {
            option.classList.add('wrong');
        }
    });

    const explanationDiv = document.getElementById('quiz-explanation');
    explanationDiv.textContent = explanation;
    explanationDiv.classList.add('show');

    document.getElementById('close-quiz').style.display = 'block';
}

function showArtifactInfo(artifactData) {
    document.getElementById('artifact-title').textContent = artifactData.title;
    document.getElementById('artifact-description').textContent = artifactData.description;
    document.getElementById('artifact-panel').classList.add('show');
}

function collectObjective(collectibleObject) {
    const collectibleId = collectibleObject.userData.collectibleId;
    if (!collectibleId) return;
    
    // Check if already collected
    if (isCollected(collectibleId)) {
        return;
    }
    
    // Mark as collected
    const item = collectItem(collectibleId);
    if (item) {
        // Remove from scene with animation
        collectibleObject.userData.collected = true;
        
        // Play collection animation
        const startScale = collectibleObject.scale.clone();
        const startY = collectibleObject.position.y;
        let animProgress = 0;
        
        const collectAnim = () => {
            animProgress += 0.05;
            if (animProgress < 1) {
                collectibleObject.scale.lerp(new THREE.Vector3(0, 0, 0), 0.1);
                collectibleObject.position.y = startY + animProgress * 2;
                collectibleObject.rotation.y += 0.2;
                requestAnimationFrame(collectAnim);
            } else {
                scene.remove(collectibleObject);
                // Remove from interactive objects
                const index = interactiveObjects.indexOf(collectibleObject);
                if (index > -1) {
                    interactiveObjects.splice(index, 1);
                }
            }
        };
        collectAnim();
        
        // Show notification
        const infoPanel = document.getElementById('info-panel');
        infoPanel.textContent = `✨ ${item.icon} ${item.name} ditemukan!`;
        infoPanel.classList.add('show');
        setTimeout(() => {
            infoPanel.classList.remove('show');
        }, 2000);
        
        // Update HUD
        updateCollectiblesHUD();
    }
}

function updateCollectiblesHUD() {
    const container = document.getElementById('collectibles-list');
    if (!container) return;
    
    const stats = getCollectiblesStats();
    
    let html = `<div class="collectible-item"><strong>${stats.found}/${stats.total} Terkumpul</strong></div>`;
    
    // Show current kingdom's collectibles if in a kingdom
    if (currentKingdom) {
        const kingdomCollectibles = getKingdomCollectibles(currentKingdom.id);
        kingdomCollectibles.forEach(item => {
            const cssClass = item.found ? 'collected' : 'not-collected';
            html += `<div class="collectible-item ${cssClass}">
                <span class="collectible-icon">${item.icon}</span>
                <span>${item.found ? '✓' : '○'} ${item.name}</span>
            </div>`;
        });
    }
    
    container.innerHTML = html;
}

function checkRaycast() {
    raycaster.setFromCamera(mouse, camera);
    
    const intersects = raycaster.intersectObjects(interactiveObjects, true);
    
    const infoPanel = document.getElementById('info-panel');
    
    if (intersects.length > 0) {
        const object = intersects[0].object;
        
        // Find the interactive parent by traversing up
        let interactiveParent = object;
        while (interactiveParent && !interactiveParent.userData.type) {
            if (!interactiveParent.parent || interactiveParent.parent.type === 'Scene') {
                break;
            }
            interactiveParent = interactiveParent.parent;
        }
        
        // If no type found, skip this object
        if (!interactiveParent.userData.type) {
            interactiveParent = null;
        }
        
        if (interactiveParent && hoveredObject !== interactiveParent) {
            // Reset previous
            if (hoveredObject) {
                hoveredObject.traverse((child) => {
                    if (child.material && child.material.emissive && child.userData.originalEmissive !== undefined) {
                        child.material.emissive.setHex(child.userData.originalEmissive);
                    }
                });
            }
            
            // Highlight new
            hoveredObject = interactiveParent;
            
            if (object.material && object.material.emissive) {
                object.userData.originalEmissive = object.material.emissive.getHex();
                object.material.emissive.setHex(0x444444);
            }
            
            if (interactiveParent.userData.info) {
                infoPanel.textContent = interactiveParent.userData.info;
                infoPanel.classList.add('show');
            }
        } else if (!interactiveParent && hoveredObject) {
            // Clear hover if no valid target found
            hoveredObject.traverse((child) => {
                if (child.material && child.material.emissive && child.userData.originalEmissive !== undefined) {
                    child.material.emissive.setHex(child.userData.originalEmissive);
                }
            });
            hoveredObject = null;
            infoPanel.classList.remove('show');
        }
    } else {
        if (hoveredObject) {
            hoveredObject.traverse((child) => {
                if (child.material && child.material.emissive && child.userData.originalEmissive !== undefined) {
                    child.material.emissive.setHex(child.userData.originalEmissive);
                }
            });
        }
        hoveredObject = null;
        infoPanel.classList.remove('show');
    }
}

function updatePlayer() {
    // Get camera forward direction (projected on ground plane)
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0; // Project to ground
    cameraDirection.normalize();
    
    // Get camera right direction
    const cameraRight = new THREE.Vector3();
    cameraRight.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0));
    cameraRight.normalize();
    
    // Calculate movement direction based on camera orientation
    const moveDirection = new THREE.Vector3();
    
    if (moveForward) moveDirection.add(cameraDirection);
    if (moveBackward) moveDirection.sub(cameraDirection);
    if (moveLeft) moveDirection.sub(cameraRight);
    if (moveRight) moveDirection.add(cameraRight);
    
    // Apply movement
    if (moveDirection.length() > 0) {
        moveDirection.normalize();
        
        // Store old position for collision detection
        const oldPosition = player.position.clone();
        
        // Try to move
        player.position.add(moveDirection.multiplyScalar(PLAYER_SPEED));
        
        // Check collision with interactive objects
        if (checkCollision()) {
            // Collision detected, revert to old position
            player.position.copy(oldPosition);
        }
        
        // Rotate player to face movement direction (or camera direction if shift lock)
        if (shiftLockEnabled) {
            // Shift Lock: Always face camera direction
            const targetAngle = Math.atan2(cameraDirection.x, cameraDirection.z);
            player.rotation.y = targetAngle;
        } else {
            // Normal: Face movement direction
            const targetAngle = Math.atan2(moveDirection.x, moveDirection.z);
            player.rotation.y = targetAngle;
        }
        
        player.userData.isWalking = true;
    } else {
        // Even when not moving, if shift lock is on, face camera direction
        if (shiftLockEnabled) {
            const targetAngle = Math.atan2(cameraDirection.x, cameraDirection.z);
            player.rotation.y = targetAngle;
        }
        player.userData.isWalking = false;
    }
    
    // Animate walking
    animateWalking();
    
    // Keep player on ground
    player.position.y = 0;
    
    // Boundary checks (keep player in scene)
    const boundary = 20;
    player.position.x = Math.max(-boundary, Math.min(boundary, player.position.x));
    player.position.z = Math.max(-boundary, Math.min(boundary, player.position.z));
}

function updateCamera() {
    // Calculate camera position based on orbit angles (GTA style)
    const offsetX = cameraDistance * Math.sin(cameraAngleHorizontal) * Math.cos(cameraAngleVertical);
    const offsetY = cameraDistance * Math.sin(cameraAngleVertical) + cameraHeight;
    const offsetZ = cameraDistance * Math.cos(cameraAngleHorizontal) * Math.cos(cameraAngleVertical);
    
    const targetPosition = new THREE.Vector3(
        player.position.x + offsetX,
        player.position.y + offsetY,
        player.position.z + offsetZ
    );
    
    // Smooth camera movement
    camera.position.lerp(targetPosition, 0.1);
    
    // Look at player (slightly above ground)
    const lookAtPoint = player.position.clone();
    lookAtPoint.y += 1;
    camera.lookAt(lookAtPoint);
}

function animateWalking() {
    if (player.userData.isWalking) {
        // Increment walk cycle
        player.userData.walkCycle += 0.15;
        
        // Arm swing (opposite to legs)
        const armSwing = Math.sin(player.userData.walkCycle) * 0.5;
        if (player.userData.leftArm) {
            player.userData.leftArm.rotation.x = armSwing;
        }
        if (player.userData.rightArm) {
            player.userData.rightArm.rotation.x = -armSwing;
        }
        
        // Leg swing
        const legSwing = Math.sin(player.userData.walkCycle) * 0.6;
        if (player.userData.leftLeg) {
            player.userData.leftLeg.rotation.x = -legSwing;
        }
        if (player.userData.rightLeg) {
            player.userData.rightLeg.rotation.x = legSwing;
        }
        
        // Slight body bob
        const bob = Math.abs(Math.sin(player.userData.walkCycle * 2)) * 0.05;
        player.position.y = bob;
    } else {
        // Reset to idle pose smoothly
        if (player.userData.leftArm) {
            player.userData.leftArm.rotation.x *= 0.9;
        }
        if (player.userData.rightArm) {
            player.userData.rightArm.rotation.x *= 0.9;
        }
        if (player.userData.leftLeg) {
            player.userData.leftLeg.rotation.x *= 0.9;
        }
        if (player.userData.rightLeg) {
            player.userData.rightLeg.rotation.x *= 0.9;
        }
        
        // Reset position
        player.position.y = 0;
    }
}

function animate() {
    requestAnimationFrame(animate);

    updatePlayer();
    updateCamera();
    checkRaycast();
    
    // Animate particles if any exist
    animateParticles();

    renderer.render(scene, camera);
}

function animateParticles() {
    scene.traverse((object) => {
        if (object.userData.isAnimated && object.userData.velocities) {
            const positions = object.geometry.attributes.position.array;
            const velocities = object.userData.velocities;
            
            for (let i = 0; i < positions.length / 3; i++) {
                positions[i * 3] += velocities[i].x;
                positions[i * 3 + 1] += velocities[i].y;
                positions[i * 3 + 2] += velocities[i].z;
                
                // Reset if too high
                if (positions[i * 3 + 1] > 10) {
                    positions[i * 3 + 1] = 0;
                }
                
                // Wrap around boundaries
                if (Math.abs(positions[i * 3]) > 20) {
                    positions[i * 3] = (Math.random() - 0.5) * 40;
                }
                if (Math.abs(positions[i * 3 + 2]) > 20) {
                    positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
                }
            }
            
            object.geometry.attributes.position.needsUpdate = true;
        }
        
        // Animate artifacts and collectibles
        if (object.userData.isAnimated && object.userData.type === 'artifact') {
            object.position.y = object.userData.baseY + Math.sin(Date.now() * 0.001) * 0.3;
            if (object.userData.glowMesh) {
                object.userData.glowMesh.rotation.y += 0.01;
                object.userData.glowMesh.scale.set(
                    1 + Math.sin(Date.now() * 0.002) * 0.1,
                    1.5 + Math.sin(Date.now() * 0.002) * 0.1,
                    1 + Math.sin(Date.now() * 0.002) * 0.1
                );
            }
        }
        
        if (object.userData.isAnimated && object.userData.type === 'collectible' && !object.userData.collected) {
            object.position.y = object.userData.baseY + Math.sin(Date.now() * 0.003) * 0.2 + 1;
            object.rotation.y += object.userData.rotationSpeed || 0.02;
            if (object.userData.glowMesh) {
                object.userData.glowMesh.rotation.y -= 0.02;
            }
        }
    });
}

function removeCollectedItems() {
    // Remove already collected items from the scene
    interactiveObjects = interactiveObjects.filter(obj => {
        if (obj.userData.type === 'collectible' && obj.userData.collectibleId) {
            if (isCollected(obj.userData.collectibleId)) {
                scene.remove(obj);
                return false;
            }
        }
        return true;
    });
}

function checkCollision() {
    // Simple collision detection using bounding spheres
    const playerRadius = 0.5; // Player collision radius
    const collisionDistance = 1.2; // Reduced distance for better movement
    
    for (const object of interactiveObjects) {
        // Skip collectibles and doors - check both parent and all children
        let isDoorOrCollectible = false;
        
        // Check parent
        if (object.userData.type === 'collectible' || object.userData.type === 'door') {
            continue; // Skip this entire object
        }
        
        // Check if any child is a door (for Groups)
        object.traverse((child) => {
            if (child.userData.type === 'door') {
                isDoorOrCollectible = true;
            }
        });
        
        if (isDoorOrCollectible) {
            continue; // Skip if contains door parts
        }
        
        // Only check collision for artifacts
        if (object.userData.type === 'artifact') {
            // Check distance to object
            const distance = player.position.distanceTo(object.position);
            
            // If too close to an artifact, collision detected
            if (distance < collisionDistance) {
                return true;
            }
        }
    }
    
    // Check walls (circular boundary) - disabled to allow exit portal access
    // const wallRadius = 22;
    // const distanceFromCenter = Math.sqrt(
    //     player.position.x * player.position.x + 
    //     player.position.z * player.position.z
    // );
    
    // if (distanceFromCenter > wallRadius) {
    //     return true;
    // }
    
    return false;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
